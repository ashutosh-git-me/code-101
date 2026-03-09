import { PrismaClient } from '@prisma/client';
import { ProvenanceEngine } from './src/lib/ProvenanceEngine';

const prisma = new PrismaClient();

async function runIntegrityTest() {
    console.log("==========================================");
    console.log("    OFF-CHAIN INTEGRITY TEST - NANOID     ");
    console.log("==========================================");

    try {
        // 1. Simulate API Registration (But do it directly via Prisma for the test)
        const nanoidModule = await import('nanoid');
        const productId = nanoidModule.nanoid(12);

        const name = "Organic Honey";
        const serialNumber = `HONEY-${Date.now()}`;
        const manufacturer = "BeeCorp";
        const metadataObj = { Origin: "New Zealand", Batch: "NZ-881" };
        const metadataStr = JSON.stringify(metadataObj);

        console.log(`\n1. Creating Product: ${name} (ID: ${productId})`);

        const product = await prisma.product.create({
            data: {
                ID: productId,
                Name: name,
                Serial_Number: serialNumber,
                Manufacturer: manufacturer,
                Metadata: metadataStr
            }
        });

        const eventType = 'Genesis';
        const previousHash = '0';
        const timestamp = new Date();
        const crypto = await import('crypto');
        const nonce = crypto.randomBytes(16).toString('hex');

        const baseMetadataStr = `Manufacturer: ${manufacturer}`;
        const combinedMetadata = `${baseMetadataStr} | ProductMeta: ${metadataStr}`;

        const hash = ProvenanceEngine.generateBlock(
            product.ID,
            eventType,
            combinedMetadata,
            previousHash,
            timestamp,
            nonce,
            manufacturer
        );

        await prisma.ledgerEntry.create({
            data: {
                Product_ID: product.ID,
                Timestamp: timestamp,
                Event_Type: eventType,
                Metadata: combinedMetadata,
                Nonce: nonce,
                Hash: hash,
                Previous_Hash: previousHash,
                Verified_By: manufacturer,
            }
        });

        console.log(" => Genesis Block Created and Secured.");

        // 2. Add an update event
        console.log("\n2. Adding a 'Quality Check' Ledger Event...");

        const latestEntry = await prisma.ledgerEntry.findFirst({
            where: { Product_ID: productId },
            orderBy: { Timestamp: 'desc' }
        });

        const updateEventType = "Quality Check Passed";
        const updateTimestamp = new Date();
        const updateNonce = crypto.randomBytes(16).toString('hex');
        const updateHash = ProvenanceEngine.generateBlock(
            productId,
            updateEventType,
            "Inspector: John Doe",
            latestEntry!.Hash,
            updateTimestamp,
            updateNonce,
            "Inspector_01"
        );

        await prisma.ledgerEntry.create({
            data: {
                Product_ID: productId,
                Timestamp: updateTimestamp,
                Event_Type: updateEventType,
                Metadata: "Inspector: John Doe",
                Nonce: updateNonce,
                Hash: updateHash,
                Previous_Hash: latestEntry!.Hash,
                Verified_By: "Inspector_01",
            }
        });

        console.log(" => Update Event Recorded.");

        // 3. Verify Pristine State
        let entries = await prisma.ledgerEntry.findMany({
            where: { Product_ID: productId },
            orderBy: { Timestamp: 'asc' }
        });
        let prodRecord = await prisma.product.findUnique({ where: { ID: productId } });

        let verifyResult = ProvenanceEngine.verifyChain(entries, prodRecord);
        console.log(`\n3. Verifying Pristine Ledger...`);
        console.log(` => isAuthentic: ${verifyResult.isAuthentic}`);

        if (!verifyResult.isAuthentic) {
            throw new Error("Pristine check failed unexpectedly!");
        }

        // 4. THE ATTACK: Modify Off-Chain Product Table Data
        console.log("\n4. TAMPERING WITH OFF-CHAIN DATA DIRECTLY...");
        console.log('Simulating a bad actor changing Origin from "New Zealand" to "Fake Origin" in the Product table.');

        const fakeMetadataStr = JSON.stringify({ Origin: "Fake Origin", Batch: "NZ-881" });
        await prisma.product.update({
            where: { ID: productId },
            data: { Metadata: fakeMetadataStr }
        });

        console.log(" => Product table altered.");

        // 5. Verify Tampered State
        console.log("\n5. Verifying Tampered Ledger...");
        prodRecord = await prisma.product.findUnique({ where: { ID: productId } });

        verifyResult = ProvenanceEngine.verifyChain(entries, prodRecord);
        console.log(` => isAuthentic: ${verifyResult.isAuthentic}`);

        if (!verifyResult.isAuthentic) {
            console.log(` => SUCCESS: System correctly caught the broken chain at entry ID: ${verifyResult.brokenEntryId}`);
            console.log("\n==========================================");
            console.log("    TEST PASSED COMPLETELY                ");
            console.log("==========================================");
            process.exit(0);
        } else {
            console.log(" => FAIL: System missed the tampering!");
            process.exit(1);
        }

    } catch (error) {
        console.error("Test execution failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

runIntegrityTest();
