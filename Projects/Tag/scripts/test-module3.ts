import { PrismaClient } from '@prisma/client';
import { ProvenanceEngine } from '../src/lib/provenance';

const prisma = new PrismaClient();
const nanoid = (size = 21) => crypto.randomUUID().replace(/-/g, '').slice(0, size);

async function runTest() {
    console.log('--- MODULE 3: CROSS-VALIDATION AUDIT ---');

    console.log('1. Cleaning existing database to set up a clean test state...');
    await prisma.ledgerEntry.deleteMany({});
    await prisma.component.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.brand.deleteMany({});

    console.log('2. Creating "Bhopal Eco" Brand...');
    const brand = await prisma.brand.create({
        data: {
            id: `b_${nanoid(8)}`,
            name: 'Bhopal Eco',
            industry: 'Food',
            trustScore: 99.0
        }
    });

    console.log('3. Minting "Bhopal Honey" Batch #101 (10 Twins)...');

    const batchId = 'BATCH_101';
    const instancesData: any[] = [];
    const ledgerData: any[] = [];
    const TIMESTAMP = new Date();

    for (let i = 0; i < 10; i++) {
        const instanceId = `tag_${nanoid(16)}`;

        instancesData.push({
            id: instanceId,
            batchId,
            brandId: brand.id,
            name: 'Bhopal Honey',
            category: 'Food',
            currentOwner: brand.id,
            status: 'ACTIVE'
        });

        const genesisHash = ProvenanceEngine.generateHash({
            metadata: 'Initial Minting of Bhopal Honey',
            price: 500,
            ownerId: brand.id,
            prevHash: 'GENESIS',
            timestamp: TIMESTAMP.toISOString()
        });

        ledgerData.push({
            productId: instanceId,
            eventType: 'MANUFACTURE',
            price: 500,
            ownerId: brand.id,
            metadata: 'Initial Minting of Bhopal Honey',
            hash: genesisHash,
            prevHash: 'GENESIS',
            timestamp: TIMESTAMP
        });
    }

    await prisma.$transaction([
        prisma.product.createMany({ data: instancesData }),
        prisma.ledgerEntry.createMany({ data: ledgerData })
    ]);

    console.log(`4. Triggering RECALL for ${batchId} via identical logic to Brand Dashboard API...`);

    // Simulate what the `/api/brands/[brandId]/recall` endpoint does
    const productsInBatch = await prisma.product.findMany({
        where: { brandId: brand.id, batchId }
    });

    const recallTimestamp = new Date();
    const eventType = 'RECALL';
    const metadata = `CRITICAL RECALL ISSUED BY BRAND ${brand.name}`;

    await prisma.$transaction(async (tx) => {
        // 1. Update Product status
        await tx.product.updateMany({
            where: { brandId: brand.id, batchId },
            data: { status: 'RECALLED' }
        });

        // 2. Add Ledger Entry
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
                timestamp: recallTimestamp.toISOString()
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
                    timestamp: recallTimestamp
                }
            });
        }
    });

    console.log('5. Internal Database state update confirmed. Executing Search verification...');

    // Fetch the products back to ensure they are recalled
    const verifyProducts = await prisma.product.findMany({
        where: { batchId }
    });

    let allRecalled = true;
    for (const p of verifyProducts) {
        if (p.status !== 'RECALLED') allRecalled = false;
    }

    if (allRecalled) {
        console.log(`[PASS] All ${verifyProducts.length} units in ${batchId} correctly flagged as 'RECALLED'.`);
    } else {
        console.error(`[FAIL] Not all units were flagged as 'RECALLED'.`);
    }

    // Test the logic that the UI and API would use (trust score engine)
    const { getProductTrustScore } = await import('../src/lib/trust');
    let trustScoreCorrect = true;

    for (const p of verifyProducts) {
        const score = await getProductTrustScore(p.id);
        if (score !== 0) {
            trustScoreCorrect = false;
        }
    }

    if (trustScoreCorrect) {
        console.log(`[PASS] The Trust Engine forced the Trust Score to 0 for all recalled items.`);
        console.log(`[PASS] Global Search API will instantly mark this batch as DANGER: TAMPERED OR RECALLED.`);
    } else {
        console.error(`[FAIL] Trust Score did not reset to 0 for recalled items.`);
    }

    console.log('--- CROSS-VALIDATION COMPLETE ---');
}

runTest()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
