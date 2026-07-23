'use client';
export default function IncidentFeed({ telemetryData }: { telemetryData: any[] }) {
  // Sort data: active tickets top, VERIFIED_RESOLVED at the bottom (by date if multiple)
  const sortedData = [...telemetryData].sort((a, b) => {
    const aResolved = a.action_flag === 'VERIFIED_RESOLVED';
    const bResolved = b.action_flag === 'VERIFIED_RESOLVED';
    if (aResolved && !bResolved) return 1;
    if (!aResolved && bResolved) return -1;
    return 0; // retain original newest-first order
  });

  return (
    <div className="h-full bg-[#030712] overflow-y-auto flex flex-col gap-3 p-4 custom-scrollbar">
      <h2 className="text-xl font-bold text-white flex items-center justify-between sticky top-0 bg-[#030712] z-10 py-3 border-b border-white/10 uppercase tracking-widest">
        <span>Action Tickets</span>
        <span className="text-[10px] font-bold bg-rose-500/10 text-rose-500 px-2.5 py-1 rounded-sm border border-rose-500/30 uppercase tracking-widest">Live Updates</span>
      </h2>
      
      {sortedData.length === 0 ? (
        <div className="text-slate-500 text-sm italic py-8 text-center border border-dashed border-white/10 rounded-lg">
          Waiting for Edge Node Telemetry...
        </div>
      ) : (
        sortedData.map((item, i) => {
          const type = item.asset?.type?.toLowerCase() || 'unknown';
          const isResolved = item.action_flag === 'VERIFIED_RESOLVED';
          const severity = item.incident?.severity?.toUpperCase() || 'LOW';
          
          let cardStyle = 'bg-gradient-to-br from-blue-950/40 to-blue-900/10 backdrop-blur-md border border-blue-900/40 shadow-[0_8px_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300';
          let highlightStyle = 'bg-blue-600 shadow-[0_0_10px_2px_rgba(59,130,246,0.6)] animate-none';
          let badgeStyle = 'bg-blue-900/50 text-blue-400 ring-1 ring-blue-500/20 shadow-inner';
          let dotStyle = 'bg-blue-500';

          if (isResolved) {
            cardStyle = 'bg-gradient-to-br from-emerald-950/30 to-emerald-900/10 backdrop-blur-md border border-emerald-500/30 shadow-[0_8px_30px_rgba(16,185,129,0.1)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300';
            highlightStyle = 'bg-emerald-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.6)]';
            badgeStyle = 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 shadow-inner';
            dotStyle = 'bg-emerald-500';
          } else if (severity === 'CRITICAL') {
            cardStyle = 'bg-gradient-to-br from-rose-950/40 to-rose-900/20 backdrop-blur-md border border-rose-500/40 shadow-[0_8px_30px_rgba(225,29,72,0.15)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300';
            highlightStyle = 'bg-rose-600 shadow-[0_0_10px_2px_rgba(244,63,94,0.6)] animate-pulse';
            badgeStyle = 'bg-rose-900/50 text-rose-400 ring-1 ring-rose-500/20 shadow-inner';
            dotStyle = 'bg-rose-500 animate-pulse';
          } else if (severity === 'MODERATE') {
            cardStyle = 'bg-gradient-to-br from-amber-950/30 to-amber-900/10 backdrop-blur-md border border-amber-500/30 shadow-[0_8px_30px_rgba(245,158,11,0.1)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300';
            highlightStyle = 'bg-amber-500 shadow-[0_0_10px_2px_rgba(245,158,11,0.6)]';
            badgeStyle = 'bg-amber-900/40 text-amber-400 border border-amber-500/20 shadow-inner';
            dotStyle = 'bg-amber-500 animate-pulse';
          }

          return (
            <div 
              key={item.event_id || i} 
              className={`p-4 rounded border flex flex-col gap-3 transition-all relative overflow-hidden shrink-0 ${cardStyle}`}
            >
              {<div className={`absolute top-0 left-0 w-1 h-full ${highlightStyle}`}></div>}
              
              <div className="flex justify-between items-start border-b border-white/5 pb-2">
                <span className="text-xs text-slate-400 font-mono tracking-wider flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dotStyle}`}></span>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour12: false })}
                </span>
                
                <span className={`text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-[0.2em] ${badgeStyle}`}>
                  {isResolved ? 'RESOLVED' : severity}
                </span>
              </div>
              
              <div className="pt-1">
                <div className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                  <span className="text-amber-500">[{item.location?.road_type || 'HWY'}]</span>
                  {item.location.highway || 'UNKNOWN'}
                </div>
                {item.location.segment && (
                  <div className="text-[11px] text-slate-500 -mt-0.5 mb-1.5 font-medium tracking-wide">
                    Seg: {item.location.segment}
                  </div>
                )}
                <div className="text-xs text-slate-400 font-medium leading-relaxed flex items-center justify-between">
                  <div>
                    {item.location.chainage && <div>Loc: <span className="text-slate-300">{item.location.chainage}</span></div>}
                    <div>Asset: <span className="text-slate-300 uppercase text-[10px]">{type.replace(/_/g, ' ')}</span></div>
                  </div>
                </div>
              </div>

              {item.incident?.extent && (
                <div className="bg-[#050505] p-3 mt-2 rounded border border-white/10 flex flex-col items-start gap-1">
                  <span className="text-slate-500 uppercase tracking-widest text-[9px]">Calculated Extent</span>
                  <span className="text-slate-200 font-mono text-sm leading-tight">{item.incident.extent}</span>
                </div>
              )}

              {isResolved && (
                <div className="bg-emerald-900/30 text-emerald-300 mt-2 p-2 rounded text-[10px] font-bold tracking-widest uppercase flex items-center justify-center border border-emerald-500/20 shadow-inner">
                  <span className="mr-2">✓</span> Fix Verified by Edge Node
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
