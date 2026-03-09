import { PrismaClient } from '@prisma/client';
import { ProvenanceEngine } from './src/lib/ProvenanceEngine';

const prisma = new PrismaClient();

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedAuraWatch() {
    console.log("==========================================");
    console.log("    SEEDING AURA LUXURY WATCH DATA        ");
    console.log("==========================================");

    try {
        const crypto = await import('crypto');

        // Target: W-99-ALPHA
        const productId = "W-99-ALPHA";

        // Wipe existing entry if we ran this script before
        await prisma.ledgerEntry.deleteMany({ where: { Product_ID: productId } });
        await prisma.product.deleteMany({ where: { ID: productId } });

        const name = "Aura Luxury Watch - Chronograph Edition";
        const serialNumber = `AURA-CHRONO-${Date.now()}`;
        const manufacturer = "Aura Timepieces Switzerland";
        const metadataObj = { Movement: "Automatic ETA", Material: "Titanium Grade 5", Sapphire: true };
        const metadataStr = JSON.stringify(metadataObj);

        console.log(`\n📦 1. Generating Origin Block for ${productId}...`);

        // 1. PRODUCT
        const product = await prisma.product.create({
            data: {
                ID: productId,
                Name: name,
                Serial_Number: serialNumber,
                Manufacturer: manufacturer,
                Metadata: metadataStr
            }
        });

        // 2. GENESIS BLOCK
        const genesisEvent = 'Manufactured';
        const previousHash = '0';
        const genesisTimestamp = new Date();
        const genesisNonce = crypto.randomBytes(16).toString('hex');

        const baseMetadataStr = `Manufacturer: ${manufacturer}`;
        const combinedMetadata = `${baseMetadataStr} | ProductMeta: ${metadataStr}`;

        const genesisHash = ProvenanceEngine.generateBlock(
            productId,
            genesisEvent,
            combinedMetadata,
            previousHash,
            genesisTimestamp,
            genesisNonce,
            "Aura Master Watchmaker"
        );

        await prisma.ledgerEntry.create({
            data: {
                Product_ID: productId,
                Timestamp: genesisTimestamp,
                Event_Type: genesisEvent,
                Metadata: combinedMetadata,
                Nonce: genesisNonce,
                Hash: genesisHash,
                Previous_Hash: previousHash,
                Verified_By: "Aura Master Watchmaker",
            }
        });

        console.log("   ✅ Origin Block Appended to Ledger.");

        // We delay slightly so timestamps advance logically.
        await delay(500);

        // 3. EVENT 2: Quality Passed
        console.log(`\n🔎 2. Entering 'Quality Passed' Event...`);
        const latestEntry1 = await prisma.ledgerEntry.findFirst({
            where: { Product_ID: productId },
            orderBy: { Timestamp: 'desc' }
        });

        const ev2Time = new Date();
        const ev2Nonce = crypto.randomBytes(16).toString('hex');
        const ev2Hash = ProvenanceEngine.generateBlock(
            productId,
            "Quality Passed",
            "Tested: Water Resistance (10ATM), Accuracy (+-2s/day)",
            latestEntry1!.Hash,
            ev2Time,
            ev2Nonce,
            "Aura QC Dept"
        );

        await prisma.ledgerEntry.create({
            data: {
                Product_ID: productId,
                Timestamp: ev2Time,
                Event_Type: "Quality Passed",
                Metadata: "Tested: Water Resistance (10ATM), Accuracy (+-2s/day)",
                Nonce: ev2Nonce,
                Hash: ev2Hash,
                Previous_Hash: latestEntry1!.Hash,
                Verified_By: "Aura QC Dept",
            }
        });
        console.log("   ✅ Quality Block Appended.");

        await delay(500);

        // 4. EVENT 3: Warehouse Arrival
        console.log(`\n🚚 3. Entering 'Warehouse Arrival' Event...`);
        const latestEntry2 = await prisma.ledgerEntry.findFirst({
            where: { Product_ID: productId },
            orderBy: { Timestamp: 'desc' }
        });

        const ev3Time = new Date();
        const ev3Nonce = crypto.randomBytes(16).toString('hex');
        const ev3Hash = ProvenanceEngine.generateBlock(
            productId,
            "Warehouse Arrival",
            "Location: Geneva Central Distro",
            latestEntry2!.Hash,
            ev3Time,
            ev3Nonce,
            "Receiving Officer"
        );

        await prisma.ledgerEntry.create({
            data: {
                Product_ID: productId,
                Timestamp: ev3Time,
                Event_Type: "Warehouse Arrival",
                Metadata: "Location: Geneva Central Distro",
                Nonce: ev3Nonce,
                Hash: ev3Hash,
                Previous_Hash: latestEntry2!.Hash,
                Verified_By: "Receiving Officer",
            }
        });
        console.log("   ✅ Warehouse Block Appended.");

        console.log(`\n🎉 Seed Data Complete. You can now scan TAG: '${productId}'`);

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seedAuraWatch();
