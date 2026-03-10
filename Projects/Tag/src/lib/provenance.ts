import CryptoJS from 'crypto-js';

export class ProvenanceEngine {
    static generateHash(data: {
        metadata: string;
        price: number | null;
        ownerId: string | null;
        prevHash: string;
        timestamp: string;
    }): string {
        const salt = "TAG_SECURE_2026"; // Internal salt for added security
        const stringifiedData = JSON.stringify(data) + salt;
        return CryptoJS.SHA256(stringifiedData).toString();
    }

    static async verifyChain(entries: any[]): Promise<boolean> {
        for (let i = 1; i < entries.length; i++) {
            const current = entries[i];
            const previous = entries[i - 1];

            // Check if the current block's prevHash matches the actual previous hash
            if (current.prevHash !== previous.hash) return false;

            // Re-calculate hash to ensure data hasn't been tampered with
            const expectedHash = this.generateHash({
                metadata: current.metadata,
                price: current.price,
                ownerId: current.ownerId,
                prevHash: current.prevHash,
                timestamp: current.timestamp.toISOString(),
            });

            if (current.hash !== expectedHash) return false;
        }
        return true;
    }
}
