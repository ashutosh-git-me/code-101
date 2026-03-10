"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, PackageSearch } from 'lucide-react';
import dynamic from 'next/dynamic';

const WebScanner = dynamic(() => import('@/components/Scanner'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <ShieldCheck className="w-24 h-24 text-blue-500 mb-8 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 pb-2">
          TAG Trust Engine
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-12 font-medium leading-relaxed">
          Cryptographic Provenance & Product Authentication.<br />
          <span className="text-slate-300">Zero-trust architecture for the modern supply chain.</span>
        </p>

        <div className="w-full max-w-3xl mb-16 relative z-10">
          <WebScanner />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative z-0">

          <Link href="/search" className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 transition-all p-8 rounded-3xl flex flex-col items-center text-center shadow-lg hover:shadow-blue-500/20">
            <div className="bg-blue-500/10 p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Search className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-slate-100">Global Scanner Interface</h2>
            <p className="text-slate-400 font-medium leading-relaxed">Search the transparent ledger by NanoID, Batch ID, or Product Name to verify authenticity instantly.</p>
          </Link>

          <div className="group bg-slate-800 border border-slate-700 p-8 rounded-3xl flex flex-col items-center text-center opacity-70 cursor-not-allowed">
            <div className="bg-purple-500/10 p-4 rounded-2xl mb-6">
              <PackageSearch className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-slate-100">Brand Analytics</h2>
            <p className="text-slate-400 font-medium leading-relaxed">Enterprise dashboard for tracking twin groups and executing global inventory recalls.</p>
            <p className="text-xs text-purple-400 font-bold mt-4 uppercase tracking-widest">Requires Brand Auth URL</p>
          </div>

        </div>
      </div>
    </div>
  );
}
