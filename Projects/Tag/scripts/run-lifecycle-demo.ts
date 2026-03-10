import { PrismaClient } from '@prisma/client';
import { generateHash, verifyChain, linkComponent, transferOwnership, postOracleEvent } from '../src/lib/provenance';

const prisma = new PrismaClient();

async function runDemo() {
    console.log('--- Bhopal EV Lifecycle Demo Starting ---');

    // Clean up existing data for a fresh run
    await prisma.ledgerEntry.deleteMany({});
    await prisma.component.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.brand.deleteMany({});

    // 1. Genesis: Brand creates 'EV-99' (₹15L).
    const brand = await prisma.brand.create({
        data: {
            id: 'brand_tata',
            name: 'Tata Motors',
            industry: 'Automotive',
            trustScore: 99.9,
        }
    });

    const product = await prisma.product.create({
        data: {
            id: 'EV-99',
            brandId: brand.id,
            category: 'Electric Vehicle',
            currentOwner: brand.id, // Brand is initial owner
            status: 'Manufactured',
        }
    });

    const t1 = new Date();
    const genesisHash = generateHash({
        eventType: 'MANUFACTURE',
        metadata: 'Vehicle manufactured',
        price: 1500000,
        ownerId: brand.id,
        prevHash: 'GENESIS',
        timestamp: t1
    });

    await prisma.ledgerEntry.create({
        data: {
            productId: product.id,
            eventType: 'MANUFACTURE',
            price: 1500000,
            ownerId: brand.id,
            metadata: 'Vehicle manufactured',
            hash: genesisHash,
            prevHash: 'GENESIS',
            timestamp: t1
        }
    });

    console.log(`\n1. [GENESIS] Created Vehicle: ${product.id} valued at ₹15,00,000. Owner: ${brand.name}`);

    // Create a component that isn't linked yet
    const battery = await prisma.component.create({
        data: {
            id: 'Batt-01',
            name: 'Lithium-Ion Battery',
            origin: 'Supplier B',
            batchHash: 'batch_batt_889'
        }
    });
    console.log(`   Created Component: ${battery.id}`);

    // 2. Component Link: Link 'Batt-01' to 'EV-99'
    await linkComponent(product.id, battery.id);
    console.log(`\n2. [LINK COMPONENT] Linked ${battery.id} to ${product.id}`);

    // 3. Transfer: Brand -> Dealer (₹16.5L)
    const dealerId = 'dealer_central_bhopal';
    await transferOwnership(product.id, brand.id, dealerId, 1650000);
    console.log(`\n3. [TRANSFER] Ownership transferred from Brand to Dealer (${dealerId}) for ₹16,50,000`);

    // 4. Sale: Dealer -> User (₹18L)
    // Add dealer as a brand to simulate authorized seller, or just skip brand check if we assume dealer is user.
    // In our logic, only currentOwner or Brand can transfer. Dealer is currentOwner now.
    const userId = 'user_ashutosh_123';
    await transferOwnership(product.id, dealerId, userId, 1800000);
    console.log(`\n4. [TRANSFER] Ownership transferred from Dealer to User (${userId}) for ₹18,00,000`);

    // 5. Accident: Oracle 'Bhopal_Police' posts a damage report
    try {
        await postOracleEvent(product.id, 'Bhopal_Police', 'ACCIDENT', 'Major front collision reported on VIP Road');
        console.log(`\n5. [ORACLE EVENT] Bhopal_Police reported an ACCIDENT`);
    } catch (e: any) {
        console.error(`\n5. [ORACLE EVENT FAILED]: ${e.message}`);
    }

    // 6. Audit: Output the full chain and confirm all hashes match
    console.log(`\n6. [AUDIT] Running verification script on ${product.id}...`);
    const isChainValid = await verifyChain(product.id);
    console.log(`   Verification Result: ${isChainValid ? 'VALID' : 'INVALID'}`);

    const allEntries = await prisma.ledgerEntry.findMany({
        where: { productId: product.id },
        orderBy: { timestamp: 'asc' }
    });

    console.log(`\n--- Ledger Blocks for ${product.id} ---`);
    allEntries.forEach((entry, index) => {
        console.log(`Block ${index + 1}:`);
        console.log(`  Event: ${entry.eventType}`);
        console.log(`  Owner: ${entry.ownerId}`);
        console.log(`  Price: ₹${entry.price}`);
        console.log(`  Meta:  ${entry.metadata}`);
        console.log(`  Hash:  ${entry.hash.substring(0, 16)}...`);
        console.log(`  Prev:  ${entry.prevHash.substring(0, 16)}...`);
        console.log('');
    });

    console.log('--- Bhopal EV Lifecycle Demo Complete ---');
}

runDemo()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
