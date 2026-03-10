import { PrismaClient } from '@prisma/client';
import { ProvenanceEngine } from '../src/lib/provenance';

const prisma = new PrismaClient();
const nanoid = (size = 21) => crypto.randomUUID().replace(/-/g, '').slice(0, size);

async function seedTestTags() {
    console.log('--- UI INTEGRITY STRESS TEST SEEDING ---');

    console.log('1. Setting up Brand...');
    const brand = await prisma.brand.create({
        data: {
            id: `b_${nanoid(8)}`,
            name: 'Rolex-Clone Auth',
            industry: 'Luxury',
            trustScore: 100.0
        }
    });

    const TIMESTAMP = new Date();

    // =====================================
    // 1. THE VALID TAG
    // =====================================
    const validTagId = 'tag_VALID_123';
    console.log(`2. Minting VALID Tag: ${validTagId}`);

    await prisma.product.create({
        data: {
            id: validTagId,
            batchId: 'BATCH_VALID',
            brandId: brand.id,
            name: 'Rolex Submariner (Authentic)',
            category: 'Luxury',
            currentOwner: brand.id,
            status: 'ACTIVE'
        }
    });

    const validHash1 = ProvenanceEngine.generateHash({
        metadata: 'Manufactured by Rolex USA', price: 15000, ownerId: brand.id, prevHash: 'GENESIS', timestamp: TIMESTAMP.toISOString()
    });

    await prisma.ledgerEntry.create({
        data: { productId: validTagId, eventType: 'MANUFACTURE', price: 15000, ownerId: brand.id, metadata: 'Manufactured by Rolex USA', hash: validHash1, prevHash: 'GENESIS', timestamp: TIMESTAMP }
    });

    // =====================================
    // 2. THE TAMPERED TAG
    // =====================================
    const tamperedTagId = 'tag_TAMPERED_999';
    console.log(`3. Minting TAMPERED Tag: ${tamperedTagId}`);

    await prisma.product.create({
        data: {
            id: tamperedTagId,
            batchId: 'BATCH_TAMPERED',
            brandId: brand.id,
            name: 'Rolex Submariner (At Risk)',
            category: 'Luxury',
            currentOwner: brand.id,
            status: 'ACTIVE'
        }
    });

    const tampHash1 = ProvenanceEngine.generateHash({
        metadata: 'Manufactured by Rolex USA', price: 15000, ownerId: brand.id, prevHash: 'GENESIS', timestamp: TIMESTAMP.toISOString()
    });

    await prisma.ledgerEntry.create({
        data: { productId: tamperedTagId, eventType: 'MANUFACTURE', price: 15000, ownerId: brand.id, metadata: 'Manufactured by Rolex USA', hash: tampHash1, prevHash: 'GENESIS', timestamp: TIMESTAMP }
    });

    const tampHash2 = ProvenanceEngine.generateHash({
        metadata: 'Transferred to Dealer XYZ', price: 15500, ownerId: 'DEALER_XYZ', prevHash: tampHash1, timestamp: new Date(TIMESTAMP.getTime() + 1000).toISOString()
    });

    await prisma.ledgerEntry.create({
        data: { productId: tamperedTagId, eventType: 'TRANSFER', price: 15500, ownerId: 'DEALER_XYZ', metadata: 'Transferred to Dealer XYZ', hash: tampHash2, prevHash: tampHash1, timestamp: new Date(TIMESTAMP.getTime() + 1000) }
    });

    // Inject the Tamper! We write a block where the data doesn't match the hash.
    await prisma.ledgerEntry.create({
        data: {
            productId: tamperedTagId,
            eventType: 'TRANSFER',
            price: 500,             // Suspicious price drop!
            ownerId: 'SHADY_BUYER',
            metadata: 'Black Market Transfer',
            hash: 'INVALID_COUNTERFEIT_HASH_999999999',  // Forcing a break in the chain math
            prevHash: tampHash2,
            timestamp: new Date(TIMESTAMP.getTime() + 2000)
        }
    });

    console.log('\n--- SEEDING COMPLETE ---');
    console.log('To view the UI stress test, start your dev server (`npm run dev`) and visit:');
    console.log(`1. http://localhost:3000/verify/${validTagId} -> Should be GREEN/VERIFIED.`);
    console.log(`2. http://localhost:3000/verify/${tamperedTagId} -> Should be RED/TAMPERED.\n`);
}

seedTestTags()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
