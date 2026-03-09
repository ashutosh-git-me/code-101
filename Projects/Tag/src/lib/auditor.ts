import { prisma } from './prisma';
import { ProvenanceEngine } from './ProvenanceEngine';

export interface BlockAudit {
    blockHeight: number;
    eventId: string;
    eventType: string;
    expectedHash: string;
    actualHash: string;
    expectedPrevHash: string;
    actualPrevHash: string;
    isValid: boolean;
    failReason: string | null;
}

export async function auditChain(productId: string): Promise<{ isSecure: boolean; blocks: BlockAudit[] }> {
    const product = await prisma.product.findUnique({ where: { ID: productId } });
    if (!product) {
        throw new Error(`Product ${productId} not found on the ledger.`);
    }

    const entries = await prisma.ledgerEntry.findMany({
        where: { Product_ID: productId },
        orderBy: { Timestamp: 'asc' }
    });

    const auditTrail: BlockAudit[] = [];
    let isSecure = true;

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        let isValid = true;
        let failReason = null;
        let expectedMetadata = (entry as any).Metadata;

        // Origin Block checks Product table Off-Chain integrity
        // In the newly seeded watch data, the Genesis event is called 'Manufactured'
        if ((entry.Event_Type === 'Genesis' || entry.Event_Type === 'Manufactured') && product.Metadata) {
            const baseStr = `Manufacturer: ${product.Manufacturer}`;
            const combinedStr = `${baseStr} | ProductMeta: ${product.Metadata}`;

            // Validate Off-Chain synchronization
            if ((entry as any).Metadata !== combinedStr) {
                isValid = false;
                failReason = "Off-Chain Product DB Tampering Detected";
            } else {
                expectedMetadata = combinedStr; // THIS WAS THE BUG: We weren't overriding expectedMetadata with combinedStr!
            }
        }

        const expectedHash = ProvenanceEngine.generateBlock(
            entry.Product_ID,
            entry.Event_Type,
            expectedMetadata, // Use what the entry *should* hash against
            entry.Previous_Hash,
            entry.Timestamp,
            (entry as any).Nonce,
            entry.Verified_By
        );

        if (entry.Hash !== expectedHash) {
            isValid = false;
            failReason = failReason || "Hash Mismatch (Data Tampered)";
        }

        // Link Verification
        let expectedPrevHash = '0';
        if (i > 0) {
            expectedPrevHash = entries[i - 1].Hash;
            if (entry.Previous_Hash !== expectedPrevHash) {
                isValid = false;
                failReason = failReason || "Broken Link (Previous Hash Mismatch)";
            }
        }

        if (!isValid) {
            isSecure = false;
        }

        auditTrail.push({
            blockHeight: i,
            eventId: entry.ID,
            eventType: entry.Event_Type,
            expectedHash: expectedHash.substring(0, 16) + '...',
            actualHash: entry.Hash.substring(0, 16) + '...',
            expectedPrevHash: expectedPrevHash.substring(0, 16) + '...',
            actualPrevHash: entry.Previous_Hash.substring(0, 16) + '...',
            isValid,
            failReason
        });
    }

    return { isSecure, blocks: auditTrail };
}
