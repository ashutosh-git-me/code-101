import React from 'react';
import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { Shield, Box, ChevronRight, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsDashboard() {
    const products = await prisma.product.findMany({
        orderBy: { ID: 'asc' }
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <Shield className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Active Tag Ledger
                        </h1>
                        <p className="text-slate-400 mt-1">Real-time immutable product directory</p>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.ID}
                        className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-800/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Box className="w-24 h-24" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                    {product.ID}
                                </span>
                                <span className="flex items-center text-xs text-emerald-400 font-medium">
                                    <Activity className="w-3 h-3 mr-1" />
                                    Secured
                                </span>
                            </div>

                            <h2 className="text-xl font-semibold text-white mb-2">{product.Name}</h2>

                            <div className="space-y-2 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Manufacturer</span>
                                    <span className="text-slate-300">{product.Manufacturer}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Serial No.</span>
                                    <span className="text-slate-300 font-mono">{product.Serial_Number}</span>
                                </div>
                            </div>

                            <Link
                                href={`/verify/${product.ID}`}
                                className="flex items-center justify-between w-full p-3 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl font-medium shadow-lg shadow-indigo-500/20"
                            >
                                View Timeline
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-500">
                        <Box className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No secured products found in the ledger.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
