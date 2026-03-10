"use client";

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, PackageSearch, ShieldCheck, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

export default function BrandClient({ brand, stats, twinGroups }: { brand: any, stats: any, twinGroups: any[] }) {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [loadingRecall, setLoadingRecall] = useState<string | null>(null);

    const toggleGroup = (key: string) => {
        setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleRecall = async (batchId: string) => {
        if (!batchId) {
            alert("This group does not have a formal Batch ID. Cannot recall.");
            return;
        }
        if (!window.confirm(`Are you sure you want to RECALL ALL units in Batch ${batchId}? This action is irreversible.`)) return;

        setLoadingRecall(batchId);
        try {
            const res = await fetch(`/api/brands/${brand.id}/recall`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ batchId })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                window.location.reload(); // Quick refresh to update data
            } else {
                alert('Failed: ' + data.error);
            }
        } catch (err) {
            alert("An error occurred during recall operation.");
        } finally {
            setLoadingRecall(null);
        }
    };

    const pieData = [
        { name: 'Verified', value: stats.verifiedCount, color: '#10b981' }, // emerald-500
        { name: 'Tampered / Recalled', value: stats.tamperedCount, color: '#ef4444' } // red-500
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-8 pt-24">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{brand.name}</h1>
                        <p className="text-slate-500 font-medium">Industry: {brand.industry} | Global Trust Score: {brand.trustScore}/100</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold">
                        <PackageSearch className="w-5 h-5" />
                        <span>{stats.total} Units Tracked</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Inventory Health Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-1">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Global Inventory Health</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex justify-between text-sm font-medium">
                            <span className="text-emerald-600">{stats.verifiedCount} Verified</span>
                            <span className="text-red-500">{stats.tamperedCount} At Risk</span>
                        </div>
                    </div>

                    {/* Twin Grouping Table */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Product Twin Groups</h2>

                        <div className="space-y-4">
                            {twinGroups.map((group) => {
                                const key = group.batchId || group.name;
                                const isExpanded = expandedGroups[key];

                                return (
                                    <div key={key} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        {/* Group Header Row */}
                                        <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => toggleGroup(key)}>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-lg">{group.name}</span>
                                                <span className="text-xs text-slate-500 font-mono mt-1">BATCH: {group.batchId || 'N/A'}</span>
                                            </div>

                                            <div className="flex items-center space-x-6">
                                                <span className="text-sm font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                                                    {group.total} Twins
                                                </span>

                                                {group.recalled ? (
                                                    <span className="text-red-600 font-bold flex items-center bg-red-100 px-3 py-1 rounded-full text-sm">
                                                        <AlertCircle className="w-4 h-4 mr-2" /> RECALLED
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleRecall(group.batchId); }}
                                                        disabled={loadingRecall === group.batchId || !group.batchId}
                                                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                                                    >
                                                        {loadingRecall === group.batchId ? 'Processing...' : 'Recall Batch'}
                                                    </button>
                                                )}

                                                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                            </div>
                                        </div>

                                        {/* Expanded NanoIDs */}
                                        {isExpanded && (
                                            <div className="p-4 bg-white border-t border-slate-200 max-h-64 overflow-y-auto">
                                                <table className="w-full text-left text-sm">
                                                    <thead>
                                                        <tr className="text-slate-500 border-b border-slate-100">
                                                            <th className="pb-2 font-semibold">NanoID (The Twin)</th>
                                                            <th className="pb-2 font-semibold text-right">Cryptographic Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {group.instances.map((instance: any) => (
                                                            <tr key={instance.id} className="hover:bg-slate-50">
                                                                <td className="py-2 text-slate-700 font-mono">{instance.id}</td>
                                                                <td className="py-2 text-right">
                                                                    {instance.validChain && instance.status !== 'RECALLED' ? (
                                                                        <span className="inline-flex items-center text-emerald-600 font-medium whitespace-nowrap">
                                                                            <ShieldCheck className="w-4 h-4 mr-1" /> Verified Intact
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center text-red-500 font-medium whitespace-nowrap">
                                                                            <ShieldAlert className="w-4 h-4 mr-1" /> {instance.status === 'RECALLED' ? 'Recalled' : 'Tampered Chain'}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {twinGroups.length === 0 && (
                                <div className="text-center p-8 text-slate-500">No active product groups found for this brand.</div>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
