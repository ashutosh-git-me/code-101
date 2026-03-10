"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Factory, ArrowRightLeft, ShieldAlert, Activity, Eye, EyeOff } from "lucide-react";

interface TimelineEvent {
    id: string;
    eventType: string;
    metadata: string;
    price: number | null;
    ownerId: string | null;
    timestamp: string;
    hash: string;
}

interface TraceTimelineProps {
    ledger: TimelineEvent[];
    tamperedIndex?: number | null;
}

export default function TraceTimeline({ ledger, tamperedIndex }: TraceTimelineProps) {
    const [visibleHashes, setVisibleHashes] = useState<Record<string, boolean>>({});

    const toggleHash = (id: string) => {
        setVisibleHashes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getIconForEvent = (eventType: string) => {
        switch (eventType) {
            case 'MANUFACTURE': return <Factory className="w-6 h-6 text-blue-500" />;
            case 'TRANSFER': return <ArrowRightLeft className="w-6 h-6 text-purple-500" />;
            case 'ACCIDENT':
            case 'RECALL': return <ShieldAlert className="w-6 h-6 text-red-500" />;
            default: return <Activity className="w-6 h-6 text-slate-500" />;
        }
    };

    if (!ledger || ledger.length === 0) return null;

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 px-4 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-blue-600" />
                Cryptographic Trace Timeline
            </h3>
            <div className="relative border-l-2 border-slate-200 ml-6 md:ml-8 space-y-8">
                {ledger.map((event, index) => {
                    const isTamperedNode = tamperedIndex !== null && tamperedIndex !== undefined && index >= tamperedIndex;

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.4 }}
                            className={`relative pl-8 md:pl-12 ${isTamperedNode ? 'opacity-60' : ''}`}
                        >
                            {/* Event Icon / Node */}
                            <div className={`absolute -left-3 md:-left-4 top-1 bg-white p-1 rounded-full border-2 ${isTamperedNode ? 'border-red-500' : 'border-slate-200'} shadow-sm z-10 flex items-center justify-center`}>
                                {isTamperedNode ? (
                                    <ShieldAlert className="w-4 h-4 text-red-500 absolute -bottom-1 -right-1 bg-white rounded-full z-20" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute -bottom-1 -right-1 bg-white rounded-full z-20" />
                                )}
                                {getIconForEvent(event.eventType)}
                            </div>

                            {/* Event Card */}
                            <div className={`bg-white p-5 rounded-2xl shadow-sm border ${isTamperedNode ? 'border-red-200 bg-red-50/20' : 'border-slate-100'} hover:shadow-md transition-shadow group`}>
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                    <h4 className={`text-lg font-bold tracking-tight transition-colors ${isTamperedNode ? 'text-red-700' : 'text-slate-800 group-hover:text-blue-600'}`}>
                                        {event.eventType} {index === tamperedIndex && " (BREACH)"}
                                    </h4>
                                    <span className="text-sm font-medium text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full mt-2 md:mt-0 w-fit">
                                        {new Date(event.timestamp).toLocaleString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                <p className="text-slate-600 mb-4">{event.metadata}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    {event.price !== null && (
                                        <div className="bg-slate-50 p-2 text-center rounded-lg border border-slate-100">
                                            <span className="text-slate-400 block text-[10px] font-bold tracking-wider mb-1 uppercase">Price</span>
                                            <span className="font-mono text-slate-700">₹{event.price.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {event.ownerId && (
                                        <div className={`p-2 rounded-lg border border-slate-100 ${event.price === null ? 'md:col-span-2' : ''} bg-blue-50/50`}>
                                            <span className="text-slate-400 block text-[10px] font-bold tracking-wider mb-1 uppercase">Owner</span>
                                            <span className="font-mono text-blue-700 truncate block" title={event.ownerId}>{event.ownerId}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase">Block Hash</span>
                                        <button
                                            onClick={() => toggleHash(event.id)}
                                            className="text-xs flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                                        >
                                            {visibleHashes[event.id] ? <><EyeOff className="w-3 h-3 mr-1" /> Hide Hash</> : <><Eye className="w-3 h-3 mr-1" /> View Hash</>}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {visibleHashes[event.id] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <span className="mt-2 font-mono text-xs text-slate-500 break-all bg-slate-50 p-2 rounded-md block border border-slate-200 shadow-inner">
                                                    {event.hash}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
