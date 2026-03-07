import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function MovieRow({ title, movies, mediaType = 'movie' }) {
    if (!movies || movies.length === 0) return null;

    return (
        <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3 mb-6">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                {title}
            </h2>

            <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
                {movies.map(movie => (
                    <Link
                        to={`/${mediaType}/${movie.id}`}
                        key={movie.id}
                        className="snap-start shrink-0 w-40 sm:w-48 md:w-56 group relative rounded-2xl overflow-hidden aspect-[2/3] shadow-lg ring-1 ring-slate-800 hover:ring-indigo-500 transition-all duration-300"
                    >
                        <img
                            src={movie.posterUrl || movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                            <h3 className="font-bold text-white line-clamp-1">{movie.title}</h3>
                            <div className="flex items-center gap-2 text-indigo-300 text-sm mt-1 font-semibold">
                                <Star className="w-4 h-4 fill-indigo-400" />
                                {Math.round(movie.mqs)} MQS
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
