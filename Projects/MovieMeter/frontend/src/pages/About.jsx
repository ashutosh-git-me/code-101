import React from 'react';

export default function About() {
    return (
        <main className="w-full flex justify-center py-20 px-6 sm:px-12 bg-slate-900 min-h-screen">
            <article className="max-w-4xl w-full text-slate-300 space-y-16 animate-in slide-in-from-bottom-4 fade-in duration-700 mt-10">

                {/* HERO */}
                <header className="text-center space-y-6">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4 backdrop-blur-md">
                        Platform Methodology
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                        What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">MovieMeter?</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-slate-400 max-w-2xl mx-auto">
                        Solving the broken entertainment rating ecosystem.
                    </p>
                </header>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent my-10" />

                {/* SECTION 1 */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 font-black text-xl border border-rose-500/30">01</span>
                        <h2 className="text-3xl font-bold text-white">The Problem</h2>
                    </div>
                    <div className="pl-16 space-y-4 text-lg leading-relaxed shadow-inner p-8 bg-slate-800/20 rounded-3xl border border-slate-800">
                        <p>Modern movie ratings are fundamentally broken. We rely on fragmented, highly polarized systems that fail to reflect the true quality of a film.</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-400 marker:text-rose-500">
                            <li><strong>Review Bombing:</strong> Large, coordinated campaigns artificially tanking audience scores before a movie is even released.</li>
                            <li><strong>Small-Sample Bias:</strong> Independent movies sitting at a falsely inflated 100% on Rotten Tomatoes based on only 5 niche critic reviews.</li>
                            <li><strong>Critic vs Audience Polarization:</strong> The widening gap where critics adore an arthouse piece that audiences hate, and vice-versa.</li>
                        </ul>
                    </div>
                </section>

                {/* SECTION 2 */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 font-black text-xl border border-indigo-500/30">02</span>
                        <h2 className="text-3xl font-bold text-white">The Bayesian Quality Score (MQS)</h2>
                    </div>
                    <div className="pl-16 space-y-6 text-lg leading-relaxed shadow-inner p-8 bg-slate-800/20 rounded-3xl border border-slate-800">
                        <p>We do not just average numbers. MovieMeter utilizes a <strong>Bayesian Average</strong> to stabilize ratings. If a movie has very few votes, its score is heavily pulled toward the global mean. As the vote count grows, the movie earns its true independent score.</p>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex justify-center shadow-2xl">
                            <code className="text-xl md:text-2xl font-mono text-cyan-400">
                                MQS = (v / (v + m)) * S_base + (m / (v + m)) * C
                            </code>
                        </div>
                        <ul className="text-sm text-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500" /> <span className="font-mono text-white">v</span> = total votes for movie</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500" /> <span className="font-mono text-white">m</span> = minimum votes required</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500" /> <span className="font-mono text-white">S_base</span> = raw calculated score</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500" /> <span className="font-mono text-white">C</span> = mean score across dataset</li>
                        </ul>
                    </div>
                </section>

                {/* SECTION 3 */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-black text-xl border border-emerald-500/30">03</span>
                        <h2 className="text-3xl font-bold text-white">The Dynamic Outlier Penalty</h2>
                    </div>
                    <div className="pl-16 space-y-4 text-lg leading-relaxed shadow-inner p-8 bg-slate-800/20 rounded-3xl border border-slate-800">
                        <p>Our algorithm scrapes scores across <strong>IMDb, Rotten Tomatoes, Metacritic, Google Users, and TOI</strong>. We calculate the mathematical mean across these platforms.</p>
                        <p className="text-emerald-300 font-medium bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                            If any single platform's score deviates by more than <strong>±20 points</strong> from the median (e.g., a review-bombed 30% RT Audience score alongside an 80% critic/IMDb median), that specific platform's weight is dynamically halved in the final calculation.
                        </p>
                    </div>
                </section>

                {/* SECTION 4 */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-12 flex items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 font-black text-xl border border-orange-500/30">04</span>
                        <h2 className="text-3xl font-bold text-white">The Velocity Hype Index</h2>
                    </div>
                    <div className="pl-16 space-y-4 text-lg leading-relaxed shadow-inner p-8 bg-slate-800/20 rounded-3xl border border-slate-800">
                        <p>How do you quantify cultural momentum? A masterpiece from 1994 might have a perfect MQS, but nobody is actively talking about it. A new popcorn blockbuster might have a mediocre MQS, but it's dominating the cultural zeitgeist.</p>
                        <p>The <strong>Velocity Hype Index</strong> solves this by combining the recency of the release (decay function) with the logarithmic volume of total votes cast in the last 72 hours. This creates a real-time viral velocity metric entirely independent of critical consensus.</p>
                    </div>
                </section>

            </article>
        </main>
    );
}
