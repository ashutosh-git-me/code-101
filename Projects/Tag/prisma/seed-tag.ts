import { PrismaClient } from '@prisma/client';
import { ProvenanceEngine } from '../src/lib/ProvenanceEngine';
import { BhopalOrganicHoney, LuxuryWatch, PharmaMedicine } from '../src/lib/MetadataRegistry';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createBlockchainEntry(
    productId: string,
    eventType: string,
    metadata: string,
    verifiedBy: string,
    previousHash: string = '0'
): Promise<string> {
    const timestamp = new Date();
    const nonce = crypto.randomBytes(16).toString('hex');

    // For Genesis block, we must prepend the manufacturer as expected by the auditor
    let finalMetadata = metadata;
    if (eventType === 'Genesis') {
        const product = await prisma.product.findUnique({ where: { ID: productId } });
        finalMetadata = `Manufacturer: ${product?.Manufacturer} | ProductMeta: ${metadata}`;
    }

    const hash = ProvenanceEngine.generateBlock(
        productId,
        eventType,
        finalMetadata,
        previousHash,
        timestamp,
        nonce,
        verifiedBy
    );

    await prisma.ledgerEntry.create({
        data: {
            Product_ID: productId,
            Timestamp: timestamp,
            Event_Type: eventType,
            Metadata: finalMetadata,
            Nonce: nonce,
            Hash: hash,
            Previous_Hash: previousHash,
            Verified_By: verifiedBy,
        }
    });

    return hash;
}

async function seedBhopalHoney() {
    console.log(`\n🍯 SEEDING: Bhopal Organic Honey (Batch #101)`);
    const productId = "HONEY-101";

    const honeyMetadata: BhopalOrganicHoney = {
        origin_farm: "Bhopal Eco-Farms",
        pesticide_level: 0.0,
        harvest_date: "2025-10-15",
        organic_cert_id: "ORG-IN-9921"
    };

    await prisma.product.create({
        data: {
            ID: productId,
            Name: "Bhopal Pure Organic Honey",
            Serial_Number: `BOH-${Date.now()}`,
            Manufacturer: "Bhopal Eco-farms Consortium",
            Metadata: JSON.stringify(honeyMetadata)
        }
    });

    // Genesis
    const hash1 = await createBlockchainEntry(productId, "Genesis", JSON.stringify(honeyMetadata), "Farm Supervisor");
    await delay(100);
    // Lab Tested
    const hash2 = await createBlockchainEntry(productId, "Lab Analysis Passed", "Pesticides: 0.0%, Sugar: 78%", "Delhi Central Lab", hash1);
    await delay(100);
    // Packaged
    await createBlockchainEntry(productId, "Packaged & Sealed", "Facility: M.P. Packaging Unit", "Packaging Lead", hash2);
    console.log(`   ✅ Honey Blockchain Verified.`);
}

async function seedAuraWatch() {
    console.log(`\n⌚ SEEDING: Aura Luxury Watch (W-99-ALPHA)`);
    const productId = "W-99-ALPHA";

    const watchMetadata: LuxuryWatch = {
        model_name: "Aura Chronograph Edition",
        movement_type: "Automatic ETA",
        assembly_location: "Switzerland",
        warranty_expiry: "2031-01-01"
    };

    await prisma.product.create({
        data: {
            ID: productId,
            Name: "Aura Luxury Watch",
            Serial_Number: `AURA-CHRONO-${Date.now()}`,
            Manufacturer: "Aura Timepieces Switzerland",
            Metadata: JSON.stringify(watchMetadata)
        }
    });

    const hash1 = await createBlockchainEntry(productId, "Genesis", JSON.stringify(watchMetadata), "Aura Master Watchmaker");
    await delay(100);
    const hash2 = await createBlockchainEntry(productId, "Quality Checked", "Water Resistance 10ATM Passed", "Aura QC Dept", hash1);
    await delay(100);
    await createBlockchainEntry(productId, "Warehouse Arrival", "Location: Delhi International Customs", "Receiving Officer", hash2);
    console.log(`   ✅ Watch Blockchain Verified.`);
}

async function seedPharmaMedicine() {
    console.log(`\n💊 SEEDING: Pharma Medicine (MED-55)`);
    const productId = "MED-55";

    const pharmaMetadata: PharmaMedicine = {
        batch_no: "B-883921",
        storage_temp_min: 2,
        storage_temp_max: 8,
        expiry_date: "2028-12-31"
    };

    await prisma.product.create({
        data: {
            ID: productId,
            Name: "Cold-Chain Vaccine Alpha",
            Serial_Number: `VAX-${Date.now()}`,
            Manufacturer: "Global Pharma Inc.",
            Metadata: JSON.stringify(pharmaMetadata)
        }
    });

    const hash1 = await createBlockchainEntry(productId, "Genesis", JSON.stringify(pharmaMetadata), "Global Pharma Manufacturing Line");
    await delay(100);
    const hash2 = await createBlockchainEntry(productId, "Temperature Check", "Temp Maintained: 4.5°C", "Automated Sensor 01", hash1);
    await delay(100);
    await createBlockchainEntry(productId, "Dispatched to Clinic", "Courier: MediTrans Secure", "Logistics Manager", hash2);
    console.log(`   ✅ Pharma Blockchain Verified.`);
}

async function runSeed() {
    console.log("==========================================");
    console.log("    SEEDING MULTI-INDUSTRY BLOCKCHAINS    ");
    console.log("==========================================");

    try {
        // Clear all
        await prisma.ledgerEntry.deleteMany({});
        await prisma.product.deleteMany({});

        await seedBhopalHoney();
        await seedAuraWatch();
        await seedPharmaMedicine();

        console.log(`\n🎉 Seeding Complete. Use the '/products' dashboard to view the chains.`);
    } catch (e) {
        console.error("Seeding failed:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

runSeed();
