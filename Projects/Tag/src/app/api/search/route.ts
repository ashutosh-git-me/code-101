import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getProductTrustScore } from '@/lib/trust';
import { fetchUpcDetails } from '@/lib/upcLookup';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';
        const category = searchParams.get('category') || '';
        const trustMin = parseFloat(searchParams.get('trust_min') || '0');

        const whereClause: any = {
            AND: []
        };

        if (query) {
            whereClause.AND.push({
                OR: [
                    { name: { contains: query } },
                    { brand: { name: { contains: query } } },
                    { batchId: { contains: query } }
                ]
            });
        }

        if (category) {
            whereClause.AND.push({ category: { equals: category } });
        }

        if (whereClause.AND.length === 0) {
            delete whereClause.AND;
        }

        // Fetch products matching the initial query and category
        const products = await prisma.product.findMany({
            where: whereClause,
            include: {
                brand: true,
            }
        });

        // ===============================
        // EXTERNAL UPC FALLBACK LOGIC
        // ===============================
        if (products.length === 0 && query && /^\d+$/.test(query)) {
            // It looks like a UPC/EAN and we don't have it locally.
            // Ping the UPC Lookup API dynamically.
            const upcData = await fetchUpcDetails(query);

            if (upcData.isValid && upcData.product) {
                // Return a special structured object telling the client this is a new external product
                return NextResponse.json({
                    success: true,
                    count: 1,
                    data: [{
                        isExternal: true, // Marker for UI
                        groupKey: upcData.product.upc,
                        name: upcData.product.title,
                        category: upcData.product.category,
                        brand: { name: upcData.product.brand },
                        avgTrustScore: "N/A - Tap to Onboard", // UI placeholder
                        instances: []
                    }]
                });
            }
        }
        // ===============================

        // Group by batchId (or name if batchId is null) to form "Twin Grouping"
        const groupedProducts = new Map<string, any>();

        for (const p of products) {
            const groupKey = p.batchId || p.name;

            if (!groupedProducts.has(groupKey)) {
                groupedProducts.set(groupKey, {
                    groupKey,
                    name: p.name,
                    category: p.category,
                    brand: {
                        name: p.brand.name,
                        industry: p.brand.industry,
                        trustScore: p.brand.trustScore,
                    },
                    instances: [],
                    totalVerified: 0,
                    totalTampered: 0,
                    recalled: p.status === 'RECALLED',
                    avgTrustScore: 0
                });
            }

            const group = groupedProducts.get(groupKey);

            // Calculate Trust Score for this specific NanoID instance
            const trustScore = await getProductTrustScore(p.id);

            if (trustScore > 0 && p.status !== 'RECALLED') {
                group.totalVerified += 1;
            } else {
                group.totalTampered += 1;
            }

            // We aggregate the scores to find an average for the group
            group.avgTrustScore += trustScore;

            group.instances.push({
                id: p.id,
                status: p.status,
                trustScore
            });
        }

        const results = Array.from(groupedProducts.values()).map(group => {
            // Finalize Average Trust Score for the group
            group.avgTrustScore = group.instances.length > 0
                ? Math.round(group.avgTrustScore / group.instances.length)
                : 0;

            return group;
        });

        // Filter out groups that don't meet the Trust Minimum
        const filteredResults = results.filter(group => group.avgTrustScore >= trustMin);

        // Sort by Average Trust Score descending
        filteredResults.sort((a, b) => b.avgTrustScore - a.avgTrustScore);

        return NextResponse.json({ success: true, count: filteredResults.length, data: filteredResults });

    } catch (error: any) {
        console.error('Search API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
