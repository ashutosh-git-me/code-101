import React, { useState } from 'react';
import { PlayCircle, X } from 'lucide-react';

export default function VideoCarousel({ title, movies }) {
    const [activeVideo, setActiveVideo] = useState(null);

    // Filter movies that actually have a trailerUrl
    const trailerMovies = movies.filter(m => m.trailerUrl);

    if (trailerMovies.length === 0) return null;

    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between mb-6 px-4 flex-col sm:flex-row max-w-7xl mx-auto sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                    {title}
                </h2>
            </div>

            <div className="relative max-w-[100vw]">
                <div className="flex overflow-x-auto gap-6 pb-6 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory hide-scrollbar">
                    {trailerMovies.map(movie => (
                        <div
                            key={movie.id}
                            className="snap-start shrink-0 w-[80vw] sm:w-80 md:w-96 group cursor-pointer"
                            onClick={() => setActiveVideo(movie)}
                        >
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl mb-3 ring-1 ring-slate-700 group-hover:ring-red-500 transition-all">
                                <img
                                    src={`https://placehold.co/640x360/1e293b/ffffff?text=${encodeURIComponent(movie.title)}+Trailer`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                                    <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 shadow-black drop-shadow-2xl transition-all" />
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-slate-200 group-hover:text-red-400 transition-colors line-clamp-1">{movie.title}</h3>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">Official Trailer</p>
                        </div>
                    ))}
                </div>
            </div>

            {activeVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-slate-800 text-white border border-white/20 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <iframe
                            src={`${activeVideo.trailerUrl}?autoplay=1`}
                            title={`${activeVideo.title} Trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
