'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

// Indian highway corridor anchors for realistic coordinate generation
const CORRIDORS = [
  { road_type: 'EXP', highway: 'Delhi-Mumbai Expressway', segment: 'Surat - Vadodara', base_lat: 21.1702, base_lng: 72.8311 },
  { road_type: 'NH',  highway: 'NH-44',                   segment: 'Agra - Gwalior',    base_lat: 27.1767, base_lng: 78.0081 },
  { road_type: 'SH',  highway: 'SH-15',                   segment: 'Bhopal - Sehore',   base_lat: 23.2599, base_lng: 77.4126 },
  { road_type: 'MDR', highway: 'MDR-101',                  segment: 'Indore Ring',        base_lat: 22.7196, base_lng: 75.8577 },
  { road_type: 'NH',  highway: 'NH-48',                   segment: 'Gurugram - Jaipur',  base_lat: 27.0238, base_lng: 76.3714 },
  { road_type: 'EXP', highway: 'Yamuna Expressway',       segment: 'Greater Noida - Agra', base_lat: 27.6031, base_lng: 77.6192 },
];

const ASSET_TYPES = [
  { type: 'pothole',          category: 'SURFACE_DEFECT', extentFn: () => `Cluster of ${1 + Math.floor(Math.random() * 4)}, ${20 + Math.floor(Math.random() * 40)}cm dia` },
  { type: 'hazard_sign',      category: 'DEGRADATION',    extentFn: () => `Visibility degraded to ${15 + Math.floor(Math.random() * 35)}%` },
  { type: 'pavement_marking', category: 'DEGRADATION',    extentFn: () => `Reflectivity: ${10 + Math.floor(Math.random() * 50)} / 150 mcd` },
  { type: 'debris',           category: 'OBSTRUCTION',    extentFn: () => `Volume: ${1 + Math.floor(Math.random() * 6)} cubic meters` },
  { type: 'guardrail',        category: 'STRUCTURAL',     extentFn: () => `${5 + Math.floor(Math.random() * 30)}m section compromised` },
];

type LogEntry = {
  id: number;
  timestamp: string;
  level: 'SUCCESS' | 'ERROR' | 'INFO' | 'RESOLVE';
  message: string;
};

export default function SimulatorPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastDefect, setLastDefect] = useState<{ lat: number; lng: number; event_id: string; highway: string } | null>(null);
  const [isFiringDefect, setIsFiringDefect] = useState(false);
  const [isFiringResolve, setIsFiringResolve] = useState(false);
  const logIdRef = useRef(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    const entry: LogEntry = {
      id: ++logIdRef.current,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      level,
      message,
    };
    setLogs((prev) => [entry, ...prev].slice(0, 50));
  }, []);

  const fireDefect = async () => {
    setIsFiringDefect(true);
    const corridor = CORRIDORS[Math.floor(Math.random() * CORRIDORS.length)];
    const asset = ASSET_TYPES[Math.floor(Math.random() * ASSET_TYPES.length)];
    const lat = +(corridor.base_lat + (Math.random() * 0.1 - 0.05)).toFixed(6);
    const lng = +(corridor.base_lng + (Math.random() * 0.1 - 0.05)).toFixed(6);
    const event_id = `SIM-${Date.now().toString(36).toUpperCase()}`;
    const severity = Math.random() > 0.4 ? 'CRITICAL' : 'MODERATE';

    const payload = {
      event_id,
      timestamp: new Date().toISOString(),
      location: { lat, lng, road_type: corridor.road_type, highway: corridor.highway, segment: corridor.segment, speed_kmh: 60 + Math.floor(Math.random() * 40) },
      asset: { type: asset.type, reflectivity_mcd: 0, baseline_mcd: 150 },
      incident: { category: asset.category, type: asset.type, severity, extent: asset.extentFn() },
      action_flag: 'ACTION_REQUIRED',
    };

    try {
      const res = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-edge-token': process.env.NEXT_PUBLIC_EDGE_TOKEN || '' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setLastDefect({ lat, lng, event_id, highway: corridor.highway });
        addLog('SUCCESS', `POST ${res.status}: ${severity} ${asset.type.replace(/_/g, ' ').toUpperCase()} injected at [${lat}, ${lng}] on ${corridor.highway}`);
      } else {
        addLog('ERROR', `POST ${res.status}: Server rejected payload — ${(await res.json()).error}`);
      }
    } catch (err) {
      addLog('ERROR', `Network failure: ${err}`);
    } finally {
      setIsFiringDefect(false);
    }
  };

  const fireResolve = async () => {
    if (!lastDefect) {
      addLog('INFO', 'No defect to resolve. Fire a defect first.');
      return;
    }

    setIsFiringResolve(true);
    const event_id = `FIX-${Date.now().toString(36).toUpperCase()}`;

    const payload = {
      event_id,
      timestamp: new Date().toISOString(),
      location: { lat: lastDefect.lat, lng: lastDefect.lng, road_type: 'NH', highway: lastDefect.highway, segment: 'Maintenance Crew', speed_kmh: 0 },
      asset: { type: 'maintenance_crew', reflectivity_mcd: 200, baseline_mcd: 150 },
      incident: { category: 'RESOLUTION', type: 'maintenance_crew', severity: 'RESOLVED', extent: 'Patch verified by field crew' },
      action_flag: 'HEALTHY',
    };

    try {
      const res = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-edge-token': process.env.NEXT_PUBLIC_EDGE_TOKEN || '' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        addLog('RESOLVE', `POST ${res.status}: Fix verified at [${lastDefect.lat}, ${lastDefect.lng}] — ${data.message || 'Ticket resolved'}`);
        setLastDefect(null);
      } else {
        addLog('ERROR', `POST ${res.status}: ${data.error}`);
      }
    } catch (err) {
      addLog('ERROR', `Network failure: ${err}`);
    } finally {
      setIsFiringResolve(false);
    }
  };

  const wipeAll = async () => {
    try {
      const res = await fetch('/api/telemetry', {
        method: 'DELETE',
        headers: { 'x-edge-token': process.env.NEXT_PUBLIC_EDGE_TOKEN || '' },
      });
      if (res.ok) {
        addLog('INFO', 'DELETE 200: All telemetry wiped from Command Center.');
        setLastDefect(null);
      }
    } catch (err) {
      addLog('ERROR', `Wipe failed: ${err}`);
    }
  };

  const levelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'SUCCESS': return 'text-amber-400';
      case 'ERROR':   return 'text-rose-400';
      case 'INFO':    return 'text-sky-400';
      case 'RESOLVE': return 'text-emerald-400';
    }
  };

  const levelBg = (level: LogEntry['level']) => {
    switch (level) {
      case 'SUCCESS': return 'bg-amber-500';
      case 'ERROR':   return 'bg-rose-500';
      case 'INFO':    return 'bg-sky-500';
      case 'RESOLVE': return 'bg-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col relative">
      {/* Floating Return to Map button */}
      <Link
        href="/login"
        className="fixed top-4 right-4 z-50 bg-amber-600 hover:bg-amber-500 text-black font-bold text-[10px] uppercase tracking-[0.15em] px-4 py-2.5 rounded-lg shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.5)] transition-all duration-300 flex items-center gap-2"
      >
        <span>🗺️</span> Return to Map
      </Link>

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-5 shrink-0">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl tracking-tighter text-white flex items-center gap-3">
            <span className="text-purple-400">📡</span>
            NHAI <span className="font-light text-slate-400">EDGE NODE SIMULATOR</span>
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] mt-1 font-semibold">
            Generative Telemetry Engine · Hackathon Demo Interface
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-5xl mx-auto w-full">

        {/* Left: Control Panels */}
        <div className="lg:w-[45%] flex flex-col gap-5 shrink-0">

          {/* Panel A: Anomaly Generator */}
          <div className="bg-gradient-to-br from-rose-950/30 to-rose-900/10 border border-rose-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-[10px] text-rose-400 font-bold uppercase tracking-[0.2em]">Panel A · Anomaly Generator</h2>
            </div>
            <p className="text-slate-500 text-xs mb-5 leading-relaxed">
              Injects a random infrastructure defect (pothole, sign damage, debris) at a realistic Indian highway coordinate into the Command Center.
            </p>
            <button
              onClick={fireDefect}
              disabled={isFiringDefect}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold text-xs uppercase tracking-[0.15em] py-4 rounded-lg transition-all duration-300 shadow-[0_4px_20px_rgba(225,29,72,0.2)] hover:shadow-[0_4px_30px_rgba(225,29,72,0.4)] disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isFiringDefect ? (
                <><span className="w-4 h-4 rounded-full border-2 border-rose-300 border-t-transparent animate-spin" /> Dispatching...</>
              ) : (
                <><span className="text-base">💥</span> Simulate Random Defect</>
              )}
            </button>
          </div>

          {/* Panel B: Auto-Resolver */}
          <div className={`bg-gradient-to-br border rounded-xl p-6 backdrop-blur-sm transition-all duration-500 ${
            lastDefect
              ? 'from-emerald-950/30 to-emerald-900/10 border-emerald-500/30'
              : 'from-slate-950/30 to-slate-900/10 border-white/10 opacity-60'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${lastDefect ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
              <h2 className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">Panel B · Auto-Resolver</h2>
            </div>
            <p className="text-slate-500 text-xs mb-3 leading-relaxed">
              Sends a maintenance-fix signal at the exact coordinate of the last defect, triggering the 50m geo-proximity auto-resolve engine.
            </p>
            {lastDefect ? (
              <div className="bg-black/40 rounded-lg px-3 py-2 mb-4 border border-emerald-500/20 font-mono text-[11px] text-emerald-300">
                Target: [{lastDefect.lat}, {lastDefect.lng}] on {lastDefect.highway}
              </div>
            ) : (
              <div className="bg-black/30 rounded-lg px-3 py-2 mb-4 border border-white/5 text-[11px] text-slate-600 italic">
                No active defect — fire one first ↑
              </div>
            )}
            <button
              onClick={fireResolve}
              disabled={!lastDefect || isFiringResolve}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold text-xs uppercase tracking-[0.15em] py-4 rounded-lg transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.4)] disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isFiringResolve ? (
                <><span className="w-4 h-4 rounded-full border-2 border-emerald-300 border-t-transparent animate-spin" /> Resolving...</>
              ) : (
                <><span className="text-base">✅</span> Simulate Maintenance Fix</>
              )}
            </button>
          </div>

          {/* Utility: Wipe */}
          <button
            onClick={wipeAll}
            className="w-full border border-white/10 hover:border-rose-500/40 text-slate-500 hover:text-rose-400 font-bold text-[10px] uppercase tracking-[0.15em] py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>🗑️</span> Wipe All Dashboard Data
          </button>
        </div>

        {/* Right: Terminal Output */}
        <div className="lg:flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Terminal Output
            </h2>
            <span className="text-[9px] text-slate-600 font-mono">{logs.length} entries</span>
          </div>
          <div
            ref={terminalRef}
            className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 overflow-y-auto font-mono text-xs min-h-[400px] max-h-[600px] shadow-inner"
          >
            {logs.length === 0 ? (
              <div className="text-slate-600 italic text-center py-12 flex flex-col items-center gap-3">
                <span className="text-2xl opacity-50">📡</span>
                <span>Awaiting simulation commands...</span>
                <span className="text-[10px] text-slate-700">Click &quot;Simulate Random Defect&quot; to begin</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed animate-in">
                    <span className="text-slate-600 shrink-0 tabular-nums">{log.timestamp}</span>
                    <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${levelBg(log.level)}/20 ${levelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-4 text-center shrink-0">
        <span className="text-[9px] text-slate-700 font-mono tracking-wider">
          NHAI EDGE NODE SIMULATOR · HACKATHON PROTOTYPE · NOC v2.0
        </span>
      </footer>
    </div>
  );
}
