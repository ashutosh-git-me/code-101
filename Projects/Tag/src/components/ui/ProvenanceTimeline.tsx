import React from 'react';
import { Fingerprint, AlertOctagon, Check, Box } from 'lucide-react';

export interface TimelineEntry {
    ID: string;
    Timestamp: string;
    Event_Type: string;
    Metadata: string | null;
    Verified_By: string;
    Hash: string;
    Previous_Hash: string;
    Nonce: string;
}

interface ProvenanceTimelineProps {
    timeline: TimelineEntry[];
    brokenEntryId: string | null;
    showTechnicalView: boolean;
}

export function ProvenanceTimeline({ timeline, brokenEntryId, showTechnicalView }: ProvenanceTimelineProps) {

    if (!timeline || timeline.length === 0) {
        return <div className="text-muted-foreground text-center py-8">No timeline events found.</div>;
    }

    // To draw the line correctly, track if we've hit the broken link
    let hasBroken = false;

    return (
        <div className="relative mt-8 pl-8 md:pl-0 max-w-3xl mx-auto">
            {/* Central Line for Desktop, Left Line for Mobile */}
            <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-px bg-border transform md:-translate-x-1/2 z-0" />

            <div className="space-y-12">
                {timeline.map((entry, index) => {
                    const isBrokenNode = brokenEntryId === entry.ID;
                    if (isBrokenNode) hasBroken = true;
                    // Nodes after a break should be visually distinct (greyed out or dangerous)
                    const isPostBreak = hasBroken && !isBrokenNode;

                    return (
                        <div key={entry.ID} className={`relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between w-full
              ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} animate-slide-up
            `} style={{ animationDelay: `${index * 100}ms` }}>

                            {/* Timeline Node */}
                            <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                                <div className={`w-10 h-10 rounded-full border-4 border-background flex items-center justify-center shadow-lg
                  ${isBrokenNode ? 'bg-red-500 shadow-red-500/50' :
                                        isPostBreak ? 'bg-muted border-muted-foreground' : 'bg-primary shadow-primary/30'}
                `}>
                                    {isBrokenNode ? (
                                        <AlertOctagon className="w-5 h-5 text-white" />
                                    ) : index === 0 ? (
                                        <Box className={`w-5 h-5 ${isPostBreak ? 'text-gray-400' : 'text-white'}`} />
                                    ) : (
                                        <Check className={`w-5 h-5 ${isPostBreak ? 'text-gray-400' : 'text-white'}`} />
                                    )}
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className={`w-full md:w-[45%] pl-8 md:pl-0 mt-4 md:mt-0`}>
                                <div className={`glass-panel p-5 rounded-2xl transition-all duration-300 ${isBrokenNode ? 'border-red-500/50 bg-red-950/20' :
                                        isPostBreak ? 'opacity-50 grayscale' : 'hover:border-primary/30'
                                    }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-mono font-medium tracking-wider uppercase px-2 py-1 rounded-md mb-2 inline-block ${isBrokenNode ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-gray-400'
                                            }`}>
                                            {new Date(entry.Timestamp).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </span>
                                        {isBrokenNode && (
                                            <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-1">
                                                <AlertOctagon className="w-3 h-3" /> Tampered
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-1">{entry.Event_Type}</h3>
                                    <p className="text-sm text-gray-400 flex items-center gap-1 mb-3">
                                        <Fingerprint className="w-4 h-4" /> By {entry.Verified_By}
                                    </p>

                                    {entry.Metadata && (
                                        <div className="bg-black/30 rounded-lg p-3 border border-white/5 mb-4">
                                            <p className="text-sm text-gray-300">{entry.Metadata}</p>
                                        </div>
                                    )}

                                    {/* Technical View Details */}
                                    {showTechnicalView && (
                                        <div className="mt-4 pt-4 border-t border-border/50 text-xs font-mono text-gray-500 space-y-2 overflow-hidden">
                                            <div>
                                                <span className="text-gray-400 block mb-0.5">Block Hash:</span>
                                                <div className="truncate bg-black/50 p-1.5 rounded text-gray-300">{entry.Hash}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block mb-0.5">Previous Hash:</span>
                                                <div className="truncate bg-black/50 p-1.5 rounded">{entry.Previous_Hash}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block mb-0.5">Nonce:</span>
                                                <div className="truncate bg-black/50 p-1.5 rounded">{entry.Nonce}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
