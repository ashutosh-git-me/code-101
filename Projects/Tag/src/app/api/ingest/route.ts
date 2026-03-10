import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { fetchUpcDetails } from '@/lib/upcLookup';
import { ProvenanceEngine } from '@/lib/provenance';
import { generateRealisticHistory } from '@/lib/historyGenerator';

const prisma = new PrismaClient();
const nanoid = (size = 21) => crypto.randomUUID().replace(/-/g, '').slice(0, size);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { upc } = body;

        if (!upc) {
            return NextResponse.json({ error: 'UPC barcode is required.' }, { status: 400 });
        }

        console.log(`[INGEST] Processing Barcode/UPC: ${upc}`);

        // 1. Fetch Real Market Data
        const marketData = await fetchUpcDetails(upc);

        let productName = "Unknown Product";
        let brandName = "Unregistered Brand";
        let category = "General";

        if (marketData.isValid && marketData.product) {
            productName = marketData.product.title;
            brandName = marketData.product.brand || "Generic Maker";
            category = marketData.product.category || "General";
        } else {
            // If UPCitemdb fails (or it's an internal barcode), we fallback gracefully
            productName = `Scanned Item (${upc}...)`;
        }

        // 2. Resolve or Create the Brand dynamically
        // Ensure "Unregistered Brand" or the specifically found Brand has a UUID
        let brandId = 'brand_default_null';
        if (brandName) {
            const existingBrand = await prisma.brand.findFirst({
                where: { name: brandName }
            });

            if (existingBrand) {
                brandId = existingBrand.id;
            } else {
                const newBrand = await prisma.brand.create({
                    data: {
                        id: `b_${nanoid(8)}`,
                        name: brandName,
                        industry: category,
                        trustScore: 80.0 // Default trust 
                    }
                });
                brandId = newBrand.id;
            }
        }

        // 3. Mint the exact Physical Tag (Product Instance)
        const newTagId = `tag_${nanoid(12)}`;

        await prisma.product.create({
            data: {
                id: newTagId,
                brandId: brandId,
                name: productName,
                category: category,
                currentOwner: 'FACTORY_GENESIS',
                status: 'ACTIVE'
            }
        });

        // 4. Create the Backdated Realistic Blockchain History
        await generateRealisticHistory(newTagId, brandId);

        console.log(`[INGEST SUCCESS] Tag created: ${newTagId}`);

        return NextResponse.json({
            success: true,
            tagId: newTagId,
            productName: productName,
            isMarketSourced: marketData.isValid
        });

    } catch (error: any) {
        console.error('[INGEST ERROR]', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
