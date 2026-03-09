"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScanLine, Search, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ScanPage() {
    const [tagId, setTagId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleScanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tagId.trim()) return;

        setIsLoading(true);
        // Add a slight delay to simulate a real hardware scan processing time
        setTimeout(() => {
            router.push(`/verify/${tagId.trim()}`);
        }, 600);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Abstract Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md z-10 glass-panel rounded-3xl p-8 relative animate-slide-up border-white/10">

                {/* Header Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
                        <ScanLine className="w-8 h-8 text-primary" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Verify Product</h1>
                    <p className="text-muted-foreground text-sm">
                        Enter the Tag ID or Serial Number to view its immutable cryptographic history.
                    </p>
                </div>

                <form onSubmit={handleScanSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={tagId}
                            onChange={(e) => setTagId(e.target.value)}
                            className="block w-full pl-11 pr-4 py-4 bg-black/40 border border-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                            placeholder="e.g. 56b27a54-2609..."
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !tagId.trim()}
                        className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl text-md font-semibold text-white bg-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <ScanLine className="w-5 h-5 animate-pulse" /> Scanning...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Verify Authenticity <ArrowRight className="w-5 h-5" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border flex items-center justify-center text-xs text-gray-500 gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500/70" /> Secured by Blockchain Provenance
                </div>
            </div>
        </div>
    );
}
