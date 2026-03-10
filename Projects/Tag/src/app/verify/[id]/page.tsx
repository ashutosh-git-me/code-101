"use client";

import React from "react";
import { useProvenance } from "@/hooks/useProvenance";
import StatusShield from "@/components/StatusShield";
import TraceTimeline from "@/components/TraceTimeline";
import { PackageSearch, QrCode } from "lucide-react";

export default function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = React.use(params) as { id: string };
    const { data, isAuthentic, isLoading, error, tamperedIndex } = useProvenance(unwrappedParams.id);

    if (isLoading) {
        return <StatusShield isAuthentic={null} isScanning={true} />;
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-200 text-center max-w-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
                    <p className="text-slate-600 font-medium">{error || "Product could not be found."}</p>
                </div>
            </div>
        );
    }

    const { product, ledger } = data;

    return (
        <div className="min-h-screen bg-slate-50 pb-24 text-slate-800">

            {/* Top Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-blue-600 font-bold">
                        <QrCode className="w-5 h-5" />
                        <span>TAG Scanner</span>
                    </div>
                    <div className="text-sm font-medium text-slate-500 font-mono">
                        ID: {unwrappedParams.id}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12">

                {/* Module 1: Status Shield */}
                <StatusShield
                    isScanning={false}
                    isAuthentic={isAuthentic}
                    tamperedIndex={tamperedIndex}
                    trustScore={product.brand?.trustScore}
                />

                {/* Module 2: Product Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 mb-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{product.name}</h1>
                            <p className="text-lg text-slate-500 font-medium mt-1">{product.brand?.name} • {product.category}</p>
                        </div>
                        <div className="mt-4 md:mt-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold flex items-center shadow-inner">
                            <PackageSearch className="w-5 h-5 mr-2" />
                            {product.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Owner</p>
                            <p className="font-mono text-slate-700 font-medium break-all">{product.currentOwner}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Brand Integrity Core</p>
                            {product.brand ? (
                                <p className="font-semibold text-slate-700">Verified Partner ({product.brand.industry})</p>
                            ) : (
                                <p className="text-slate-500 italic">Unregistered Manufacturer</p>
                            )}
                        </div>
                    </div>

                    {product.components?.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Linked Raw Components</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.components.map((c: any) => (
                                    <div key={c.id} className="border border-slate-200 rounded-lg p-3 flex justify-between items-center text-sm shadow-sm transition hover:shadow-md bg-white">
                                        <span className="font-bold text-slate-700">{c.name}</span>
                                        <span className="text-slate-500 font-mono text-xs bg-slate-100 px-2 py-1 rounded">{c.origin}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Module 3: Trace Timeline */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <TraceTimeline ledger={ledger} tamperedIndex={tamperedIndex} />
                </div>

            </div>
        </div>
    );
}
