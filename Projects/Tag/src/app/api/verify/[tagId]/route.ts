import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProvenanceEngine } from '@/lib/ProvenanceEngine';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ tagId: string }> }
) {
    const { tagId } = await params;

    if (!tagId) {
        return NextResponse.json({ error: 'Missing tagId' }, { status: 400 });
    }

    try {
        const productRecord = await prisma.product.findFirst({
            where: {
                OR: [{ ID: tagId }, { Serial_Number: tagId }]
            }
        });

        if (!productRecord) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const ledgerEntries = await prisma.ledgerEntry.findMany({
            where: { Product_ID: productRecord.ID },
            orderBy: { Timestamp: 'asc' },
        });

        if (ledgerEntries.length === 0) {
            return NextResponse.json({
                verified: true,
                message: 'No ledger entries found for this product.',
                isValid: true,
                product: productRecord
            });
        }

        let isChainValid = true;
        let brokenEntryId = null;

        for (let i = 0; i < ledgerEntries.length; i++) {
            const entry = ledgerEntries[i];

            const expectedHash = ProvenanceEngine.generateBlock(
                entry.Product_ID,
                entry.Event_Type,
                {}, // Default empty metadata as per schema
                entry.Previous_Hash
            );

            if (entry.Hash !== expectedHash) {
                isChainValid = false;
                brokenEntryId = entry.ID;
                break;
            }

            if (i > 0) {
                const previousEntry = ledgerEntries[i - 1];
                if (entry.Previous_Hash !== previousEntry.Hash) {
                    isChainValid = false;
                    brokenEntryId = entry.ID;
                    break;
                }
            } else {
                // First entry's Previous_Hash could be validated if we have a standard genesis hash
                // e.g., 'genesis'
            }
        }

        if (isChainValid) {
            return NextResponse.json({
                verified: true,
                isValid: true,
                message: 'Blockchain integrity verified. All hashes are cryptographically linked.',
                totalEntries: ledgerEntries.length,
                product: productRecord
            });
        } else {
            return NextResponse.json({
                verified: false,
                isValid: false,
                message: 'Blockchain integrity compromised at entry ID: ' + brokenEntryId,
                brokenEntryId: brokenEntryId,
                product: productRecord
            }, { status: 400 });
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
