'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        setError('Access denied. Invalid dispatcher credentials.');
      }
    } catch {
      setError('Network error. Command Center unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-amber-500/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-rose-500/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl tracking-tighter text-white mb-2">
            NHAI <span className="font-light text-slate-400">COMMAND CENTER</span>
          </h1>
          <div className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-semibold flex items-center justify-center gap-2">
            <span className="w-1 h-1 bg-amber-500 rounded-full inline-block shadow-[0_0_5px_rgba(245,158,11,1)]" />
            Secure Dispatcher Access
          </div>
        </div>

        {/* Demo Access Helper */}
        <div className="mb-5 bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-400 text-sm">🎯</span>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.15em]">Hackathon Demo Access</span>
          </div>
          <div className="flex items-center gap-3 bg-black/40 rounded-lg px-4 py-2.5 border border-purple-500/20">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0">Password:</span>
            <code className="text-purple-300 font-mono text-sm font-bold tracking-wide select-all">{process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'nhai-admin'}</code>
          </div>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-6">
            <label
              htmlFor="password-input"
              className="block text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-3"
            >
              Dispatcher Password
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access code"
              required
              autoFocus
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3.5 text-white text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300"
            />
          </div>

          {error && (
            <div className="mb-4 bg-rose-950/30 border border-rose-500/30 rounded-lg px-4 py-3 text-rose-400 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-black font-bold text-xs uppercase tracking-[0.2em] py-3.5 rounded-lg transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.3)] disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                Authenticating...
              </span>
            ) : (
              'Authenticate & Enter'
            )}
          </button>

          <div className="mt-6 text-center">
            <div className="text-[9px] text-slate-600 uppercase tracking-[0.2em]">
              Authorized NHAI Personnel Only
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-[9px] text-slate-700 font-mono tracking-wider">
          NATIONAL HIGHWAYS AUTHORITY OF INDIA · NOC v2.0
        </div>
      </div>
    </div>
  );
}
