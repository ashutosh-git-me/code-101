"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";

interface StatusShieldProps {
    isAuthentic: boolean | null;
    isScanning: boolean;
    tamperedIndex?: number | null;
    trustScore?: number;
}

export default function StatusShield({ isAuthentic, isScanning, tamperedIndex, trustScore }: StatusShieldProps) {
    if (isScanning) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                    <Loader2 className="w-24 h-24 text-blue-500 mb-4" />
                </motion.div>
                <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-xl font-semibold text-blue-600 tracking-widest uppercase"
                >
                    Scanning Cryptographic Ledger...
                </motion.p>
            </div>
        );
    }

    if (isAuthentic === null) {
        return null;
    }

    return (
        <div className={`flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg border-2 ${isAuthentic ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {isAuthentic ? (
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ShieldCheck className="w-24 h-24 text-green-500 mb-4 drop-shadow-md" />
                </motion.div>
            ) : (
                <ShieldAlert className="w-24 h-24 text-red-500 mb-4 drop-shadow-md" />
            )}
            <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-3xl font-bold uppercase tracking-wide ${isAuthentic ? 'text-green-700' : 'text-red-700'}`}
            >
                {isAuthentic ? "Chain Verified" : "Tamper Detected"}
            </motion.h2>

            {isAuthentic && trustScore !== undefined && (
                <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-2 text-green-800 text-lg font-bold"
                >
                    Trust Score: {trustScore}/100
                </motion.p>
            )}

            {!isAuthentic && (
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 flex flex-col items-center"
                >
                    <p className="text-red-600 text-center font-medium max-w-md">
                        This product failed cryptographic verification. The ledger has been tampered with or the sequence is invalid. Do not consume or purchase.
                    </p>
                    {tamperedIndex !== null && tamperedIndex !== undefined && (
                        <div className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-lg font-bold border border-red-300">
                            Breach detected at Block Index #{tamperedIndex}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
