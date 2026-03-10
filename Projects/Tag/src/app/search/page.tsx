"use client";

import { useState, useEffect } from "react";
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (data.success) {
                    setResults(data.data);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce the search input
        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Helper function to render the appropriate Trust Badge
    const renderTrustBadge = (group: any) => {
        if (group.recalled || group.avgTrustScore === 0) {
            return (
                <span className="flex items-center text-red-500 font-bold bg-red-100 px-3 py-1 rounded-full text-sm">
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    DANGER: TAMPERED OR RECALLED
                </span>
            );
        }

        if (group.isExternal) {
            return (
                <span className="flex items-center text-blue-600 font-bold bg-blue-100 px-3 py-1 rounded-full text-sm">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    NEW TO TAG
                </span>
            );
        }

        if (group.avgTrustScore > 80) {
            return (
                <span className="flex items-center text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    VERIFIED ({group.avgTrustScore}/100)
                </span>
            );
        }

        return (
            <span className="flex items-center text-yellow-600 font-bold bg-yellow-100 px-3 py-1 rounded-full text-sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                LOW TRUST ({group.avgTrustScore}/100)
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-center text-slate-800">
                    Global Trust Search
                </h1>

                {/* Search Bar */}
                <div className="relative mb-12 shadow-xl rounded-2xl overflow-hidden bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <div className="flex items-center px-6 py-4">
                        <Search className="w-6 h-6 text-slate-400 mr-4" />
                        <input
                            type="text"
                            className="w-full text-xl outline-none placeholder-slate-400 font-medium"
                            placeholder="Search by Product Name, Brand, or Batch ID..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    {/* Progress bar loader */}
                    <div className={`h-1 bg-blue-500 transition-all duration-300 ease-in-out ${loading ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                </div>

                {/* Results Stream */}
                <div className="space-y-6">
                    {results.length === 0 && query && !loading && (
                        <div className="text-center text-slate-500 py-12 text-lg">
                            No verified records found for &quot;{query}&quot;.
                        </div>
                    )}

                    {results.map((group, index) => (
                        <div key={index} className={`bg-white rounded-2xl shadow-sm border ${group.isExternal ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200'} overflow-hidden transform transition hover:-translate-y-1 hover:shadow-md`}>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{group.name}</h2>
                                        <p className="text-slate-500 font-medium">{group.brand?.name} • ID: {group.groupKey}</p>
                                    </div>
                                    {renderTrustBadge(group)}
                                </div>

                                {group.isExternal ? (
                                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-4 bg-blue-100 rounded-xl border border-blue-200 gap-4">
                                        <div className="text-blue-800 text-sm font-medium">
                                            We found this UPC externally, but it has no cryptographic history on the Tag network yet.
                                        </div>
                                        <button
                                            onClick={() => router.push('/')}
                                            className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors"
                                        >
                                            Click to Onboard
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Category</p>
                                            <p className="font-semibold">{group.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Total Twins</p>
                                            <p className="font-semibold">{group.instances.length} Units</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Verified Twins</p>
                                            <p className="font-semibold text-green-600">{group.totalVerified} Authentic</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Tampered Twins</p>
                                            <p className={`font-semibold ${group.totalTampered > 0 ? 'text-red-600' : 'text-slate-900'}`}>{group.totalTampered} Breached</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
