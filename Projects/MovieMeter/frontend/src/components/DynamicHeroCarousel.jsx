import React, { useState, useEffect } from 'react';
import { PlayCircle, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const getBgUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path; // It's a YouTube thumbnail
    return `https://image.tmdb.org/t/p/original${path}`; // It's a TMDB backdrop
};

export default function DynamicHeroCarousel({ items }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const [isHovered, setIsHovered] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const hoverTimeoutRef = React.useRef(null);

    // Auto-slide logic, pauses when the user is hovering
    useEffect(() => {
        if (!items || items.length <= 1 || isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [items?.length, isHovered]);

    if (!items || items.length === 0) return null;

    const movie = items[currentIndex];

    // Intentional hover delay (Wait 1.5s before setting strictly to Play)
    const handleMouseEnter = () => {
        setIsHovered(true);
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

        hoverTimeoutRef.current = setTimeout(() => {
            setIsVideoPlaying(true);
        }, 1500);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setIsVideoPlaying(false);
    };

    // Resets playback state immediately if slide index transitions natively
    useEffect(() => {
        setIsVideoPlaying(false);
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    }, [currentIndex]);

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate(`/movie/${movie?.id}`)}
            className="relative w-full h-full overflow-hidden bg-slate-950 rounded-[2rem] shadow-2xl ring-1 ring-slate-800 cursor-pointer"
        >
            {/* Background Image with Transition */}
            {items.map((m, idx) => (
                <div
                    key={m.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <div
                        style={{ backgroundImage: `url(${getBgUrl(m.backdropUrl || m.backdrop_path)})` }}
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear group-hover:scale-105"
                    ></div>

                    {/* Auto-playing Trailer (Only if Active and Delayed) */}
                    {idx === currentIndex && m.heroVideoKey && (
                        <div className={`absolute inset-0 bg-black transition-opacity duration-700 ease-in ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}>
                            {isVideoPlaying && (
                                <iframe
                                    src={`https://www.youtube.com/embed/${m.heroVideoKey}?autoplay=1&mute=0&controls=0&modestbranding=1&loop=1&playlist=${m.heroVideoKey}&playsinline=1`}
                                    className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover pointer-events-none transform scale-[1.35] md:scale-150"
                                    allow="autoplay; encrypted-media"
                                    title={`${m.title} Background Trailer`}
                                />
                            )}
                        </div>
                    )}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b13] via-[#0b0b13]/80 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b13] via-transparent to-transparent z-10 hidden md:block opacity-60"></div>
                </div>
            ))}

            {/* Content Overlay */}
            <div className={`absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 z-20 transition-all duration-700 ease-in-out ${isVideoPlaying ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-none'}`}>
                <div className="max-w-2xl text-left space-y-5 pointer-events-auto">
                    {/* Badge */}
                    <div className="flex items-center gap-3">
                        {movie.isCreatorContent ? (
                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest mb-3 inline-block shadow-md">
                                Top Critic • {movie.channelName}
                            </span>
                        ) : (
                            <>
                                <span className="flex items-center justify-center bg-emerald-500 text-white font-black px-3 py-1 rounded shadow-emerald-500/50 shadow-lg text-sm">
                                    MQS {Math.round(movie.mqs)}
                                </span>
                                {movie.streamingPlatform && (
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">
                                        {movie.streamingPlatform}
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {/* Massive Title */}
                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl">
                        {movie.title}
                    </h1>

                    {/* Plot Snippet */}
                    <p className="text-slate-300 text-base md:text-lg line-clamp-3 leading-relaxed drop-shadow-md">
                        {movie.plot}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            onClick={() => navigate(`/movie/${movie.id}`)}
                            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-full flex items-center gap-2 font-bold transition-all shadow-lg shadow-red-600/30 hover:shadow-red-500/50"
                        >
                            <PlayCircle className="w-5 h-5 fill-white text-red-600" />
                            WATCH TRAILER
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-slate-500 hover:bg-slate-400'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
