import CryptoJS from 'crypto-js';

export interface BlockData {
  productId: string;
  status: string;
  metadata?: Record<string, any>;
  previousHash: string;
}

export class ProvenanceEngine {
  /**
   * Generates a SHA-256 hash cryptographically linking the product update to the previous one.
   * 
   * @param productId The ID of the product
   * @param status The status of the event or update
   * @param metadata Optional additional metadata
   * @param previousHash The hash of the previous ledger entry, or 'genesis' if first
   * @returns A SHA-256 string representing the block hash
   */
  static generateBlock(
    productId: string,
    status: string,
    metadata: string | null = null,
    previousHash: string,
    timestamp: Date | string,
    nonce: string,
    verifiedBy: string
  ): string {
    const payload = JSON.stringify({
      productId,
      status,
      metadata,
      previousHash,
      timestamp: typeof timestamp === 'string' ? timestamp : timestamp.toISOString(),
      nonce,
      verifiedBy,
    });

    return CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);
  }

  /**
   * Verifies the cryptographic integrity of an array of ledger entries.
   * The entries must be sorted chronologically ascending.
   * 
   * @param entries Array of sequential ledger entries for a product
   * @returns Object containing isAuthentic boolean and the optional broken entry ID
   */
  static verifyChain(entries: any[], product?: any): { isAuthentic: boolean; brokenEntryId: string | null } {
    if (!entries || entries.length === 0) {
      return { isAuthentic: true, brokenEntryId: null };
    }

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      let metadataToHash = entry.Metadata;

      // Ensure that if it's the Genesis block, the current Off-Chain Product Metadata
      // matches what was appended to the Genesis entry's metadata string during registration.
      // If the database Product table was tampered with, this validation fails instantly.
      if (entry.Event_Type === 'Genesis' && product?.Metadata) {
        const expectedMetadataStr = `Manufacturer: ${product.Manufacturer}`;
        const expectedCombined = `${expectedMetadataStr} | ProductMeta: ${product.Metadata}`;
        if (entry.Metadata !== expectedCombined) {
          return { isAuthentic: false, brokenEntryId: entry.ID };
        }
      }

      const expectedHash = this.generateBlock(
        entry.Product_ID,
        entry.Event_Type,
        metadataToHash,
        entry.Previous_Hash,
        entry.Timestamp,
        entry.Nonce,
        entry.Verified_By
      );

      if (entry.Hash !== expectedHash) {
        return { isAuthentic: false, brokenEntryId: entry.ID };
      }

      if (i > 0) {
        const previousEntry = entries[i - 1];
        if (entry.Previous_Hash !== previousEntry.Hash) {
          return { isAuthentic: false, brokenEntryId: entry.ID };
        }
      } else {
        // Option to explicitly check if first genesis block previousHash == 'genesis'
      }
    }

    return { isAuthentic: true, brokenEntryId: null };
  }
}
