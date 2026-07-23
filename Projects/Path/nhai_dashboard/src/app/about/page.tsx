import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-300px] right-[-200px] w-[700px] h-[700px] bg-amber-500/5 blur-[250px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-500/5 blur-[200px] rounded-full pointer-events-none" />

      {/* Floating nav */}
      <nav className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm tracking-tighter text-white font-bold hover:text-amber-400 transition-colors">
            ← Back to Command Center
          </Link>
          <a
            href="/simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded transition-all duration-300 text-[10px] font-bold text-purple-400 uppercase tracking-wider"
          >
            📡 Try Simulator
          </a>
        </div>
      </nav>

      {/* Content */}
      <article className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Title Block */}
        <header className="mb-16">
          <div className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-amber-500/50" />
            Hackathon Prototype
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white leading-tight mb-4">
            NHAI Command Center:
            <br />
            <span className="text-amber-500">Decentralized Infrastructure Auditing</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            An API-first architecture that transforms existing dashcams into decentralized AI auditors, 
            enabling real-time national highway monitoring with zero hardware CAPEX.
          </p>
        </header>

        {/* Section 1: The Core Problem */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🚨</span>
            <h2 className="text-2xl font-bold tracking-tight text-white">The Core Problem</h2>
          </div>
          <div className="bg-gradient-to-br from-rose-950/20 to-rose-900/5 border border-rose-500/20 rounded-xl p-8">
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              India possesses the <strong className="text-white">second-largest road network in the world (6.3 million km)</strong>, 
              with National Highways carrying <strong className="text-white">40% of all traffic</strong>. Currently, auditing relies on 
              manual inspections and contractor reports, resulting in:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-black/30 rounded-lg p-4 border border-rose-500/10">
                <div className="text-rose-400 font-bold text-lg mb-1">High Latency</div>
                <div className="text-slate-500 text-xs">6-month manual audit cycles leave critical degradation undetected</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-rose-500/10">
                <div className="text-rose-400 font-bold text-lg mb-1">Dangerous Decay</div>
                <div className="text-slate-500 text-xs">Infrastructure degradation accelerates between inspection windows</div>
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-rose-500/10">
                <div className="text-rose-400 font-bold text-lg mb-1">Bottlenecks</div>
                <div className="text-slate-500 text-xs">Severe operational constraints from human-dependent reporting</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: The Solution */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💡</span>
            <h2 className="text-2xl font-bold tracking-tight text-white">The Solution: Smart Roads via Universal Edge Nodes</h2>
          </div>
          <div className="bg-gradient-to-br from-amber-950/20 to-amber-900/5 border border-amber-500/20 rounded-xl p-8">
            <p className="text-slate-300 text-sm leading-relaxed">
              Instead of deploying expensive proprietary hardware, we transform <strong className="text-white">existing commercial dashcams 
              into decentralized AI auditors</strong>. By utilizing an <strong className="text-amber-400">API-first architecture</strong>, 
              we achieve nationwide scalability with <strong className="text-white">zero hardware CAPEX</strong>.
            </p>
          </div>
        </section>

        {/* Section 3: The Lifecycle */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔄</span>
            <h2 className="text-2xl font-bold tracking-tight text-white">The Architectural Lifecycle</h2>
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold mb-6">
            Detect → Report → Resolve
          </div>

          <div className="flex flex-col gap-5">
            {/* Detect */}
            <div className="bg-gradient-to-r from-sky-950/30 to-sky-900/5 border border-sky-500/20 rounded-xl p-6 flex gap-5">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-xl">🔍</div>
              <div>
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <span className="text-sky-400 text-[10px] uppercase tracking-wider font-bold bg-sky-500/10 px-2 py-0.5 rounded">Phase 1</span>
                  Detect
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The Universal Edge Node (running <strong className="text-white">localized computer vision</strong>) autonomously detects 
                  infrastructure anomalies—from <strong className="text-white">potholes to degraded reflectors</strong> and live diversions.
                </p>
              </div>
            </div>

            {/* Report */}
            <div className="bg-gradient-to-r from-purple-950/30 to-purple-900/5 border border-purple-500/20 rounded-xl p-6 flex gap-5">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">👻</div>
              <div>
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <span className="text-purple-400 text-[10px] uppercase tracking-wider font-bold bg-purple-500/10 px-2 py-0.5 rounded">Phase 2</span>
                  Report — The Ghost Node Protocol
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  To guarantee driver privacy and overcome network limitations, we <strong className="text-white">strip all video data at the edge</strong>. 
                  The node transmits a strict, anonymous <strong className="text-purple-300">150-byte JSON payload</strong> containing only the geographic 
                  coordinate and the defect extent.
                </p>
                <div className="bg-black/40 rounded-lg px-4 py-2.5 border border-purple-500/20 inline-block">
                  <span className="text-purple-300 font-mono text-sm font-bold">100% Infrastructure Visibility, 0% Surveillance.</span>
                </div>
              </div>
            </div>

            {/* Resolve */}
            <div className="bg-gradient-to-r from-emerald-950/30 to-emerald-900/5 border border-emerald-500/20 rounded-xl p-6 flex gap-5">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">✅</div>
              <div>
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <span className="text-emerald-400 text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Phase 3</span>
                  Resolve — Closed-Loop Autonomy
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The Command Center opens live, <strong className="text-white">color-coded maintenance tickets</strong>. When a subsequent vehicle drives over 
                  the repaired segment, the AI detects the fix and pings a <strong className="text-emerald-300">&quot;VERIFIED_RESOLVED&quot;</strong> payload, 
                  automatically closing the ticket on the dashboard with <strong className="text-white">zero manual administrative work</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: By The Numbers */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📊</span>
            <h2 className="text-2xl font-bold tracking-tight text-white">By The Numbers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-1">&lt; 1 KB</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-2">Per Incident</div>
              <div className="text-xs text-slate-600">vs. megabytes for live video streams</div>
            </div>
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">Real-time</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-2">Update Frequency</div>
              <div className="text-xs text-slate-600">vs. 6-month manual audit cycles</div>
            </div>
            <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">₹0</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-2">Hardware Cost</div>
              <div className="text-xs text-slate-600">BYOD / existing fleet telematics</div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="border-t border-white/10 pt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs uppercase tracking-[0.15em] px-6 py-3 rounded-lg transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.2)]"
            >
              🗺️ Open Command Center
            </Link>
            <a
              href="/simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 font-bold text-xs uppercase tracking-[0.15em] px-6 py-3 rounded-lg transition-all duration-300"
            >
              📡 Try Simulator
            </a>
          </div>
          <div className="text-[9px] text-slate-700 font-mono tracking-wider mt-4">
            NATIONAL HIGHWAYS AUTHORITY OF INDIA · HACKATHON PROTOTYPE · NOC v2.0
          </div>
        </footer>
      </article>
    </div>
  );
}
