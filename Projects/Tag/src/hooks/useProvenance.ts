import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

interface ProvenanceData {
    product: any;
    ledger: any[];
    isAuthentic: boolean;
    serverTime: string;
}

export function useProvenance(tagId: string) {
    const [data, setData] = useState<ProvenanceData | null>(null);
    const [isAuthentic, setIsAuthentic] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tamperedIndex, setTamperedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!tagId) return;

        const verifyProduct = async () => {
            setIsLoading(true);
            setError(null);
            setTamperedIndex(null);

            try {
                const response = await fetch(`/api/verify/${tagId}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to verify product.');
                }

                setData(result);

                // --- Client-Side "Zero Trust" Verification ---
                const entries = result.ledger;
                let chainValid = true;
                let tIndex = null;

                if (entries && entries.length > 0) {
                    for (let i = 1; i < entries.length; i++) {
                        const current = entries[i];
                        const previous = entries[i - 1];

                        if (current.prevHash !== previous.hash) {
                            chainValid = false;
                            tIndex = i;
                            break;
                        }

                        // Re-calculate hash
                        const hashData = {
                            metadata: current.metadata,
                            price: current.price,
                            ownerId: current.ownerId,
                            prevHash: current.prevHash,
                            timestamp: current.timestamp,
                        };

                        const salt = "TAG_SECURE_2026";
                        const stringifiedData = JSON.stringify(hashData) + salt;
                        const expectedHash = CryptoJS.SHA256(stringifiedData).toString();

                        if (current.hash !== expectedHash) {
                            chainValid = false;
                            tIndex = i;
                            break;
                        }
                    }
                }

                // Must pass both server check and client check
                if (result.isAuthentic && chainValid) {
                    setIsAuthentic(true);
                } else {
                    setIsAuthentic(false);
                    if (tIndex !== null) setTamperedIndex(tIndex);
                }

            } catch (err: any) {
                setError(err.message);
                setIsAuthentic(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyProduct();
    }, [tagId]);

    return { data, isAuthentic, error, isLoading, tamperedIndex };
}
