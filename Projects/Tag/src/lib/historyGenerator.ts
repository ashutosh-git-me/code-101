// src/lib/historyGenerator.ts
import { PrismaClient } from '@prisma/client';
import { ProvenanceEngine } from './provenance';

const prisma = new PrismaClient();

// Helper to precisely backdate JavaScript dates
function getBackdatedTimestamp(monthsAgoMin: number, monthsAgoMax: number): Date {
    const now = new Date();
    const monthsAgo = Math.floor(Math.random() * (monthsAgoMax - monthsAgoMin + 1)) + monthsAgoMin;
    const daysOffset = Math.floor(Math.random() * 28); // Random salt of days
    const hoursOffset = Math.floor(Math.random() * 24); // Random offset for hours

    now.setMonth(now.getMonth() - monthsAgo);
    now.setDate(now.getDate() - daysOffset);
    now.setHours(now.getHours() - hoursOffset);
    return now;
}

export async function generateRealisticHistory(tagId: string, brandId: string) {
    console.log(`[GENERATING REALISTIC HISTORY] Minting backdated blocks for: ${tagId}`);

    // 1. GENESIS / MANUFACTURE (6 - 12 months ago)
    const genesisTime = getBackdatedTimestamp(6, 12);

    // Use price variation based on product if needed, defaulting for simulation
    const manufacturePrice = Math.floor(Math.random() * 50) + 10;

    const genesisHash = ProvenanceEngine.generateHash({
        metadata: 'Manufactured and Inspected',
        price: manufacturePrice,
        ownerId: brandId,
        prevHash: 'GENESIS',
        timestamp: genesisTime.toISOString()
    });

    await prisma.ledgerEntry.create({
        data: {
            productId: tagId,
            eventType: 'MANUFACTURE',
            price: manufacturePrice,
            ownerId: brandId,
            metadata: 'Manufactured and Inspected',
            hash: genesisHash,
            prevHash: 'GENESIS',
            timestamp: genesisTime
        }
    });

    // 2. WHOLESALE / TRANSIT (4 - 5 months ago)
    const wholesaleTime = getBackdatedTimestamp(4, 5);
    const wholesalePrice = manufacturePrice + Math.floor(Math.random() * 20); // Markup
    const wholesalerId = `DIST_GLOBAL_${Math.floor(Math.random() * 100)}`;

    const wholesaleHash = ProvenanceEngine.generateHash({
        metadata: 'Transferred to Global Distribution Hub',
        price: wholesalePrice,
        ownerId: wholesalerId,
        prevHash: genesisHash,
        timestamp: wholesaleTime.toISOString()
    });

    await prisma.ledgerEntry.create({
        data: {
            productId: tagId,
            eventType: 'TRANSFER',
            price: wholesalePrice,
            ownerId: wholesalerId,
            metadata: 'Transferred to Global Distribution Hub',
            hash: wholesaleHash,
            prevHash: genesisHash,
            timestamp: wholesaleTime
        }
    });

    // 3. RETAIL ARRIVAL (1 - 2 months ago)
    const retailTime = getBackdatedTimestamp(1, 2);
    const retailPrice = wholesalePrice + Math.floor(Math.random() * 30); // Final Retail Markup
    const retailId = `RETAIL_STORE_${Math.floor(Math.random() * 500)}`;

    const retailHash = ProvenanceEngine.generateHash({
        metadata: 'Arrived at Retail Front',
        price: retailPrice,
        ownerId: retailId,
        prevHash: wholesaleHash,
        timestamp: retailTime.toISOString()
    });

    await prisma.ledgerEntry.create({
        data: {
            productId: tagId,
            eventType: 'TRANSFER',
            price: retailPrice,
            ownerId: retailId,
            metadata: 'Arrived at Retail Front',
            hash: retailHash,
            prevHash: wholesaleHash,
            timestamp: retailTime
        }
    });

    // Update Product current owner structurally to reflect the chain end
    await prisma.product.update({
        where: { id: tagId },
        data: { currentOwner: retailId }
    });

    console.log(`[HISTORY ENGRAVED] 3 cryptographic blocks seeded natively.`);
    return true;
}
