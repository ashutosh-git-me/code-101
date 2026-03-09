"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthenticityShield } from '@/components/ui/AuthenticityShield';
import { ProvenanceTimeline, TimelineEntry } from '@/components/ui/ProvenanceTimeline';
import { Shield, ArrowLeft, TerminalSquare, Loader2 } from 'lucide-react';

interface VerifyResponse {
    isAuthentic?: boolean;
    isValid?: boolean;
    verified?: boolean;
    message: string;
    totalBlocks?: number;
    brokenEntryId?: string | null;
    product: {
        ID: string;
        Name: string;
        Serial_Number: string;
        Manufacturer: string;
    };
    timeline?: TimelineEntry[];
}

export default function VerifyPage() {
    const { tagId } = useParams() as { tagId: string };
    const router = useRouter();

    const [data, setData] = useState<VerifyResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTechnical, setShowTechnical] = useState(false);

    useEffect(() => {
        async function verifyTag() {
            try {
                const res = await fetch('/api/tag/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: tagId })
                });

                const json = await res.json();

                if (!res.ok) {
                    // If the chain is broken, it might return 400 but still include data to render
                    if (json.isAuthentic === false || json.brokenEntryId) {
                        setData(json);
                    } else {
                        setError(json.error || json.message || 'Verification failed.');
                    }
                } else {
                    setData(json);
                }
            } catch (err: any) {
                setError(err.message || 'Network error occurred.');
            } finally {
                setLoading(false);
            }
        }

        if (tagId) {
            verifyTag();
        }
    }, [tagId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <h2 className="text-xl font-medium text-gray-300">Decrypting Ledger...</h2>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6">
                <div className="glass-panel p-8 rounded-3xl text-center max-w-md w-full border-red-500/30">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Tag Not Found</h2>
                    <p className="text-muted-foreground mb-8">{error || 'The requested Tag ID is invalid or does not exist on the ledger.'}</p>
                    <button
                        onClick={() => router.push('/scan')}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium text-white"
                    >
                        Return to Scanner
                    </button>
                </div>
            </div>
        );
    }

    // Handle differences in API response structures (isValid vs isAuthentic)
    const isAuthentic = data.isAuthentic === true || data.isValid === true || data.verified === true;
    const brokenEntryId = data.brokenEntryId || null;

    return (
        <div className="min-h-screen pb-24 selection:bg-primary/30">

            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
                <div className="max-w-4xl mx-auto flex justify-between items-center pointer-events-auto">
                    <button
                        onClick={() => router.push('/scan')}
                        className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 backdrop-blur-md transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setShowTechnical(!showTechnical)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md text-sm font-medium transition-all ${showTechnical
                                ? 'bg-primary/20 border-primary/50 text-primary'
                                : 'bg-black/50 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <TerminalSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Technical View</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 pt-24 space-y-12">
                {/* Title / Hero */}
                <div className="text-center space-y-4">
                    <AuthenticityShield
                        isAuthentic={isAuthentic}
                        productName={data.product.Name}
                        manufacturer={data.product.Manufacturer}
                    />
                </div>

                {/* Timeline Section */}
                <div className="pt-8">
                    <div className="mb-8 border-b border-border pb-4 flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Provenance Ledger</h2>
                            <p className="text-muted-foreground text-sm flex items-center gap-2">
                                Serial Number: <span className="font-mono text-gray-300">{data.product.Serial_Number}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">{data.timeline?.length || data.totalBlocks || 0}</p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Blocks</p>
                        </div>
                    </div>

                    <ProvenanceTimeline
                        timeline={data.timeline || []}
                        brokenEntryId={brokenEntryId}
                        showTechnicalView={showTechnical}
                    />
                </div>
            </main>
        </div>
    );
}
