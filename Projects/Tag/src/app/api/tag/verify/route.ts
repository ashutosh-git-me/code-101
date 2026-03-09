import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProvenanceEngine } from '@/lib/ProvenanceEngine';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json(
                { error: 'Missing required field: productId' },
                { status: 400 }
            );
        }

        const product = await prisma.product.findUnique({
            where: { ID: productId },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const ledgerEntries = await prisma.ledgerEntry.findMany({
            where: { Product_ID: productId },
            orderBy: { Timestamp: 'asc' }, // Must be chronological to verify chain
        });

        if (ledgerEntries.length === 0) {
            return NextResponse.json(
                {
                    isAuthentic: false,
                    message: 'No ledger history found. Product is unverified.',
                    product
                },
                { status: 400 }
            );
        }

        const verificationResult = ProvenanceEngine.verifyChain(ledgerEntries);

        if (verificationResult.isAuthentic) {
            return NextResponse.json({
                isAuthentic: true,
                message: 'Blockchain integrity verified. Product timeline is untampered.',
                totalBlocks: ledgerEntries.length,
                product,
                timeline: ledgerEntries
            });
        } else {
            return NextResponse.json(
                {
                    isAuthentic: false,
                    message: 'CRITICAL: Blockchain integrity compromised. Data tampering detected.',
                    brokenEntryId: verificationResult.brokenEntryId,
                    product,
                    timeline: ledgerEntries
                },
                { status: 400 }
            );
        }

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
