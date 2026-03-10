import { PrismaClient } from '@prisma/client';
import { ProvenanceEngine } from '@/lib/provenance';
import BrandClient from './BrandClient';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function BrandDashboard({ params }: { params: { brandId: string } }) {
    const brand = await prisma.brand.findUnique({
        where: { id: params.brandId }
    });

    if (!brand) {
        notFound();
    }

    // Fetch all products for this brand
    const products = await prisma.product.findMany({
        where: { brandId: params.brandId },
        include: { ledger: { orderBy: { timestamp: 'asc' } } }
    });

    // Calculate Health
    let verifiedCount = 0;
    let tamperedCount = 0;

    // Group by Batch / Name
    const twinGroups = new Map<string, any>();

    for (const p of products) {
        const isChainValid = await ProvenanceEngine.verifyChain(p.ledger);

        const isVerified = isChainValid && p.status !== 'RECALLED';
        if (isVerified) verifiedCount++;
        else tamperedCount++;

        const groupKey = p.batchId || p.name;
        if (!twinGroups.has(groupKey)) {
            twinGroups.set(groupKey, {
                batchId: p.batchId,
                name: p.name,
                total: 0,
                recalled: false,
                instances: []
            });
        }

        const group = twinGroups.get(groupKey);
        group.total++;
        if (p.status === 'RECALLED') group.recalled = true;
        group.instances.push({ id: p.id, status: p.status, validChain: isChainValid });
    }

    const groupsArray = Array.from(twinGroups.values());

    return (
        <BrandClient
            brand={brand}
            stats={{ verifiedCount, tamperedCount, total: products.length }}
            twinGroups={groupsArray}
        />
    );
}
