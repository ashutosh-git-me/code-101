'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import IncidentFeed from '@/components/IncidentFeed';

// Leaflet map component must be dynamically loaded with ssr disabled
const DashboardMap = dynamic(() => import('@/components/DashboardMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex flex-col items-center justify-center bg-[#020617] text-slate-500 animate-pulse border border-white/5 rounded-lg">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500/50 border-t-amber-500 animate-spin mb-4"></div>
    <div className="text-xs uppercase tracking-widest font-mono">Initializing Geospatial Engine...</div>
  </div>
});

const POLLING_INTERVAL_MS = 3000;

export default function Home() {
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Polling for live data every 3 seconds as required
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry', { cache: 'no-store' });
        const data = await res.json();
        if (data.data) {
          setTelemetry(data.data);
          setLastUpdated(new Date());
        }
      } catch (e) {
        console.error('Failed to fetch telemetry endpoint:', e);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full h-screen bg-[#050505] text-slate-200 font-sans overflow-hidden">
      
      {/* 70% MAP SECTION */}
      <main className="w-[70%] h-full flex flex-col p-4 md:p-6 gap-4 relative">
        <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-sky-500/5 blur-[150px] rounded-full pointer-events-none"></div>
        
        <header className="flex justify-between items-end pb-3 border-b border-white/10 relative z-10 shrink-0">
          <div>
             <h1 className="text-3xl tracking-tighter text-white flex items-center gap-3">
              NHAI <span className="font-light text-slate-400">COMMAND CENTER</span>
            </h1>
            <div className="text-slate-500 text-[10px] mt-1.5 uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
              <span className="w-1 h-1 bg-amber-500 rounded-full inline-block shadow-[0_0_5px_rgba(245,158,11,1)]"></span> 
              National Highway Infrastructure Telemetry
            </div>
          </div>
          <div className="flex items-center gap-3">
             <a
               href="/simulator"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 px-3 py-1.5 rounded transition-all duration-300 group"
             >
               <span className="text-xs group-hover:scale-110 transition-transform">📡</span>
               <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Edge Simulator</span>
             </a>
             <a
               href="/about"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 px-3 py-1.5 rounded transition-all duration-300 group"
             >
               <span className="text-xs group-hover:scale-110 transition-transform">📄</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">About</span>
             </a>
             <div className="flex flex-col items-end gap-1 ml-1">
               <div className="flex items-center gap-2 bg-[#0a0a0a] px-3 py-1.5 rounded border border-white/5 shadow-inner">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                 <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">Network Active</span>
               </div>
               {lastUpdated && (
                  <span className="text-[9px] text-slate-600 font-mono tracking-widest">
                     SYNCED: {lastUpdated.toLocaleTimeString([], { hour12: false })}
                  </span>
               )}
             </div>
          </div>
        </header>

        <section className="flex-1 min-h-0 relative rounded-lg ring-1 ring-white/5 shadow-2xl overflow-hidden bg-black z-10">
           <DashboardMap telemetryData={telemetry} />
        </section>
      </main>

      {/* 30% SIDEBAR SECTION */}
      <aside className="w-[30%] h-full bg-[#0a0a0a] flex flex-col shadow-[-10px_0_40px_-5px_rgba(0,0,0,0.8)] z-20 border-l border-white/5 relative shrink-0">
        <IncidentFeed telemetryData={telemetry} />
      </aside>
    </div>
  );
}
