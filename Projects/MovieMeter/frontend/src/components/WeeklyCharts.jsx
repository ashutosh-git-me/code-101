import React from 'react';
import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WeeklyCharts({ movies }) {
    if (!movies || movies.length === 0) return null;

    const topFive = movies.slice(0, 5);

    return (
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-xl h-full flex flex-col">
            <h2 className="text-xl font-black italic text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Weekly Charts
            </h2>
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col space-y-4 pr-2 pb-4">
                {topFive.map((movie, index) => (
                    <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="group flex items-center gap-4 hover:bg-slate-800/80 p-2 rounded-xl transition-all duration-300 ring-1 ring-transparent hover:ring-indigo-500/50"
                    >
                        {/* Number */}
                        <div className="w-8 text-center text-2xl font-black text-slate-700 group-hover:text-indigo-400 transition-colors">
                            {index + 1}
                        </div>

                        {/* Poster */}
                        <img
                            src={movie.posterUrl || movie.poster}
                            alt={movie.title}
                            className="w-12 h-16 object-cover rounded shadow-md group-hover:scale-105 transition-transform"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">
                                {movie.title}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-slate-400">
                                <Flame className="w-3.5 h-3.5 text-orange-500" />
                                {movie.hypeIndex || 50}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
