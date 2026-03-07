import React from 'react';
import { Heart, Smile, Zap, Swords, Rocket, Ghost, Theater, Search, Video, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const genres = [
    { id: 'romance', label: 'Romance', icon: Heart, gradient: 'from-pink-500 to-rose-500' },
    { id: 'comedy', label: 'Comedy', icon: Smile, gradient: 'from-amber-400 to-orange-500' },
    { id: 'anime', label: 'Anime', icon: Zap, gradient: 'from-fuchsia-500 to-purple-600' },
    { id: 'action', label: 'Action', icon: Swords, gradient: 'from-red-500 to-orange-600' },
    { id: 'scifi', label: 'Sci-fi', icon: Rocket, gradient: 'from-blue-500 to-indigo-600' },
    { id: 'horror', label: 'Horror', icon: Ghost, gradient: 'from-slate-700 to-slate-900' },
    { id: 'drama', label: 'Drama', icon: Theater, gradient: 'from-teal-400 to-emerald-600' },
    { id: 'mystery', label: 'Mystery', icon: Search, gradient: 'from-purple-500 to-indigo-800' },
    { id: 'documentary', label: 'Docu', icon: Video, gradient: 'from-yellow-500 to-amber-700' },
    { id: 'thriller', label: 'Thriller', icon: Eye, gradient: 'from-red-700 to-rose-900' },
];

export default function GenreCarousel() {
    return (
        <section className="w-full py-8 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide">
                    {genres.map((genre) => {
                        const Icon = genre.icon;
                        return (
                            <Link
                                key={genre.id}
                                to={`/category/${genre.id}`}
                                className="snap-start shrink-0 group relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg p-0.5"
                            >
                                {/* Gradient Border via Wrapper */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}></div>

                                {/* Inner Card Content */}
                                <div className="absolute inset-[2px] bg-slate-900 rounded-[14px] flex flex-col items-center justify-center p-4 transition-transform group-hover:scale-[0.98]">
                                    <Icon className={`w-12 h-12 md:w-16 md:h-16 mb-2 text-transparent bg-clip-text bg-gradient-to-br ${genre.gradient} drop-shadow-md group-hover:scale-110 transition-transform`} strokeWidth={1.5} color="white" />
                                    <span className="text-sm font-bold text-slate-200 mt-1 uppercase tracking-wider">{genre.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
