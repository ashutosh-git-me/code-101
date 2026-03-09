import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AuthenticityShieldProps {
    isAuthentic: boolean;
    productName: string;
    manufacturer: string;
}

export function AuthenticityShield({ isAuthentic, productName, manufacturer }: AuthenticityShieldProps) {
    return (
        <div className={`relative w-full overflow-hidden rounded-3xl p-8 transition-colors duration-500 ${isAuthentic ? 'bg-emerald-950/40 border border-emerald-900/50' : 'bg-red-950/40 border border-red-900/50'
            }`}>
            {/* Background Glows */}
            <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20 ${isAuthentic ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
            <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 ${isAuthentic ? 'bg-emerald-500' : 'bg-red-500'
                }`} />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">

                {/* Animated Icon Container */}
                <div className="relative flex items-center justify-center">
                    {/* Pulsing ring behind the shield */}
                    <div className={`absolute w-32 h-32 rounded-full animate-pulse-ring ${isAuthentic ? 'bg-emerald-500/30' : 'bg-red-500/30'
                        }`} />

                    <div className={`relative z-10 w-24 h-24 flex items-center justify-center rounded-2xl backdrop-blur-md shadow-2xl border ${isAuthentic
                            ? 'bg-emerald-950/80 border-emerald-500/30 shadow-emerald-900/50 text-emerald-400'
                            : 'bg-red-950/80 border-red-500/30 shadow-red-900/50 text-red-500'
                        }`}>
                        {isAuthentic ? (
                            <ShieldCheck className="w-12 h-12 pt-1" />
                        ) : (
                            <ShieldAlert className="w-12 h-12 pt-1" />
                        )}
                    </div>
                </div>

                {/* Status Text Text */}
                <div className="space-y-2">
                    <h2 className={`text-4xl font-extrabold tracking-tight ${isAuthentic ? 'text-emerald-400 text-glow-primary' : 'text-red-500 text-glow-destructive'
                        }`}>
                        {isAuthentic ? '100% AUTHENTIC' : 'COMPROMISED'}
                    </h2>
                    <div className="flex items-center justify-center space-x-2 text-lg text-muted-foreground">
                        {isAuthentic ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span>Cryptographically Verified</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <span>Integrity Check Failed</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Product Minimap Details */}
                <div className="w-full max-w-md bg-black/40 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Product Details</p>
                    <p className="text-xl font-medium text-white">{productName}</p>
                    <p className="text-sm text-gray-400 mt-1">Manufactured by <span className="text-gray-200">{manufacturer}</span></p>
                </div>
            </div>
        </div>
    );
}
