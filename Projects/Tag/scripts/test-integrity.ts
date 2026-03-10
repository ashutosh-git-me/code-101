import { PrismaClient } from '@prisma/client';
import { generateHash, verifyChain, linkComponent, transferOwnership, postOracleEvent } from '../src/lib/provenance';

const prisma = new PrismaClient();
const nanoid = (size = 21) => crypto.randomUUID().replace(/-/g, '').slice(0, size);

async function runTest() {
    console.log('--- CTO Audit: The Proof Starting ---');

    // Clean up existing data for a fresh run
    await prisma.ledgerEntry.deleteMany({});
    await prisma.component.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.brand.deleteMany({});

    // 1. Genesis
    const brand = await prisma.brand.create({
        data: { id: 'brand_bhopal', name: 'Bhopal Motors', industry: 'Automotive', trustScore: 99.9 }
    });

    const productId = `prod_${nanoid(10)}`;
    await prisma.product.create({
        data: {
            id: productId,
            brandId: brand.id,
            category: 'Electric Vehicle',
            currentOwner: brand.id,
            status: 'Manufactured'
        }
    });

    const t1 = new Date();
    const genesisHash = generateHash({
        eventType: 'MANUFACTURE', metadata: '{"notes": "Manufactured Bhopal EV"}',
        price: 1500000, ownerId: brand.id, prevHash: 'GENESIS', timestamp: t1
    });

    await prisma.ledgerEntry.create({
        data: {
            productId, eventType: 'MANUFACTURE', price: 1500000, ownerId: brand.id,
            metadata: '{"notes": "Manufactured Bhopal EV"}', hash: genesisHash,
            prevHash: 'GENESIS', timestamp: t1
        }
    });
    console.log(`[1] Genesis: Created Bhopal EV (${productId})`);

    // 2. Component Link
    const batteryId = `batt_${nanoid(10)}`;
    await prisma.component.create({
        data: { id: batteryId, name: 'Battery', origin: 'Supplier A', batchHash: 'batch_xyz' }
    });
    await linkComponent(productId, batteryId);
    console.log(`[2] Linked Component: ${batteryId}`);

    // 3. Transfer
    await transferOwnership(productId, brand.id, 'dealer_123', 1650000);
    console.log(`[3] Transferred to Dealer for 16,50,000 INR`);

    // 4. Sale
    await transferOwnership(productId, 'dealer_123', 'user_abc', 1800000);
    console.log(`[4] Sold to User for 18,00,000 INR`);

    // 5. Accident (Oracle)
    await postOracleEvent(productId, 'Bhopal_Police', 'ACCIDENT', '{"severity": "Minor"}');
    console.log(`[5] Oracle (Bhopal_Police) posted ACCIDENT`);

    // Verification Before Tamper
    const check1 = await verifyChain(productId);
    console.log(`\nChain Integrity (Before Tamper): ${check1.isValid ? 'VALID' : 'INVALID'}`);
    if (!check1.isValid) {
        console.error(`Error: ${check1.error}`);
    }

    // Tampering Setup
    const entries = await prisma.ledgerEntry.findMany({
        where: { productId, eventType: 'ACCIDENT' },
    });
    const accidentEntry = entries[0];

    // Tampering!
    console.log(`\n[!] TAMPERING DETECTED IN DATABASE MANUALLY: Changing Accident Severity to 'Severe'...`);
    await prisma.$executeRawUnsafe(`UPDATE LedgerEntry SET metadata = '{"severity": "Severe"}' WHERE id = '${accidentEntry.id}'`);

    // Verification After Tamper
    const check2 = await verifyChain(productId);
    if (!check2.isValid) {
        console.log(`\nChain Integrity (After Tamper): INVALID`);
        console.log(`CTO AUDIT PROOF: Security mechanism caught the tampered state!`);
        console.log(`-> Cause: ${check2.error}`);
        console.log(`-> Block Index Identified: ${check2.errorBlockIndex}`);
    } else {
        console.log(`Chain Integrity (After Tamper): VALID (This is a failure of the security mechanism!)`);
    }

    console.log('\n--- CTO Audit Complete ---');
}

runTest()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
