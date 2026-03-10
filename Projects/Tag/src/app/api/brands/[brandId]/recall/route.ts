import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ProvenanceEngine } from '@/lib/provenance';

const prisma = new PrismaClient();

export async function POST(
    request: NextRequest,
    { params }: { params: { brandId: string } }
) {
    try {
        const { batchId } = await request.json();
        const brandId = params.brandId;

        if (!batchId) {
            return NextResponse.json({ success: false, error: 'batchId is required' }, { status: 400 });
        }

        // Verify brand
        const brand = await prisma.brand.findUnique({ where: { id: brandId } });
        if (!brand) {
            return NextResponse.json({ success: false, error: 'Brand not found' }, { status: 404 });
        }

        // Find all products in the batch belonging to this brand
        const productsInBatch = await prisma.product.findMany({
            where: { brandId, batchId }
        });

        if (productsInBatch.length === 0) {
            return NextResponse.json({ success: false, error: 'No products found for this batch' }, { status: 404 });
        }

        const timestamp = new Date();
        const eventType = 'RECALL';
        const metadata = `CRITICAL RECALL ISSUED BY BRAND ${brand.name}`;

        // Update status and append to ledger
        await prisma.$transaction(async (tx) => {
            // 1. Update Product status
            await tx.product.updateMany({
                where: { brandId, batchId },
                data: { status: 'RECALLED' }
            });

            // 2. Add Ledger Entry for each product to log the recall on the "chain"
            for (const p of productsInBatch) {
                const lastEntry = await tx.ledgerEntry.findFirst({
                    where: { productId: p.id },
                    orderBy: { timestamp: 'desc' }
                });

                const prevHash = lastEntry ? lastEntry.hash : 'GENESIS';

                const hash = ProvenanceEngine.generateHash({
                    metadata,
                    price: null,
                    ownerId: p.currentOwner,
                    prevHash,
                    timestamp: timestamp.toISOString()
                });

                await tx.ledgerEntry.create({
                    data: {
                        productId: p.id,
                        eventType,
                        price: null,
                        ownerId: p.currentOwner,
                        metadata,
                        hash,
                        prevHash,
                        timestamp
                    }
                });
            }
        });

        return NextResponse.json({
            success: true,
            message: `Batch ${batchId} successfully recalled. ${productsInBatch.length} items flagged.`,
            recalledCount: productsInBatch.length
        });

    } catch (error: any) {
        console.error('Recall API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
