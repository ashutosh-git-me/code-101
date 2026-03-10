import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProvenanceEngine } from '@/lib/provenance';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const tagId = params.id;

    try {
        // 1. Fetch the Product and its entire Ledger (The Triple Chain)
        const product = await prisma.product.findUnique({
            where: { id: tagId },
            include: {
                ledger: { orderBy: { timestamp: 'asc' } },
                components: true,
                brand: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product Not Found" }, { status: 404 });
        }

        // 2. Server-Side Pre-Verification
        // We check it here first to give the UI a 'Hint', 
        // but the UI hook will re-verify it for 'Zero Trust'.
        const isAuthentic = await ProvenanceEngine.verifyChain(product.ledger);

        return NextResponse.json({
            product,
            ledger: product.ledger,
            isAuthentic,
            serverTime: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json({ error: "Internal Ledger Error" }, { status: 500 });
    }
}
