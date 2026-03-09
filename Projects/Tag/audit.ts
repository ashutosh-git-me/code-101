import { auditChain } from './src/lib/auditor';

async function runAuditor() {
    const args = process.argv.slice(2);
    const productId = args[0];

    if (!productId) {
        console.error("❌ Error: You must supply a Product NanoID.");
        console.log("Usage: npm run audit-tag <NanoID>");
        process.exit(1);
    }

    console.log(`\n======================================================`);
    console.log(`   TAG INTELLIGENCE - BLOCKCHAIN AUDITOR                `);
    console.log(`======================================================\n`);
    console.log(`Analyzing Immutable Ledger for Tag: ${productId}\n`);

    try {
        const report = await auditChain(productId);

        const displayData = report.blocks.map(b => ({
            "Block Height": b.blockHeight,
            "Event": b.eventType,
            "Status": b.isValid ? "✅ VALID" : "❌ CORRUPT",
            "Actual Hash": b.actualHash,
            "Expected Hash": b.expectedHash,
            "Integrity Issue": b.failReason || "None"
        }));

        console.table(displayData);

        if (report.isSecure) {
            console.log(`\n🛡️  AUDIT PASSED: The cryptographic chain is completely unbroken.\n`);
            process.exit(0);
        } else {
            console.log(`\n🚨 CRITICAL ALERT: Database tampering detected! Ledger is compromised.\n`);
            process.exit(1);
        }
    } catch (e: any) {
        console.error(`\n❌ Auditing Error: ${e.message}\n`);
        process.exit(1);
    }
}

runAuditor();
