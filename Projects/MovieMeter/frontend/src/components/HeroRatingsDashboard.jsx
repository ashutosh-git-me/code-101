import React, { useState } from 'react';
import { Flame, Star, Video, Play, Globe, CheckCircle, PlayCircle, X, Bookmark, BookmarkCheck, AlertCircle, Calendar } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

export default function HeroRatingsDashboard({ movie, mediaType = 'movie' }) {
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [isPosterOpen, setIsPosterOpen] = useState(false);

    const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
    const { user } = useAuth();
    const [toast, setToast] = useState(false);

    const parsedId = parseInt(movie?.id, 10);
    const saved = movie ? isInWatchlist(parsedId) : false;

    const showToast = () => {
        setToast(true);
        setTimeout(() => setToast(false), 3000);
    };

    const toggleWatchlist = () => {
        if (!user) return showToast();
        if (saved) {
            removeFromWatchlist(parsedId);
        } else {
            addToWatchlist({ id: parsedId, mediaType });
        }
    };

    const getBadgeColor = (score) => {
        if (score >= 80) return 'bg-emerald-500 shadow-emerald-500/50';
        if (score >= 60) return 'bg-amber-500 shadow-amber-500/50';
        return 'bg-rose-500 shadow-rose-500/50';
    };

    if (!movie) return null;

    const { bms, imdb, rt } = movie.platformScores || {};
    const data = { vote_average: movie.tmdbScore };

    const today = new Date();
    const releaseObj = movie.releaseDate ? new Date(movie.releaseDate) : null;
    const isUnreleased = (releaseObj && releaseObj > today) ||
        ['Upcoming', 'Planned', 'In Production', 'Post Production'].includes(movie.status);

    return (
        <>
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center md:items-start shadow-2xl transition-all duration-300">
                <div
                    className="shrink-0 w-64 md:w-80 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl relative group cursor-pointer ring-1 ring-slate-700/50 hover:ring-indigo-500 transition-all duration-300"
                    onClick={() => setIsPosterOpen(true)}
                >
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                </div>

                <div className="flex-1 w-full space-y-6">
                    <div>
                        {movie.streamingPlatform && (
                            <a
                                href={movie.watchLink || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-bold uppercase tracking-widest ${movie.isBookMyShow
                                    ? 'text-rose-200 bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/40 shadow-rose-500/10'
                                    : 'text-indigo-200 bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/40 shadow-indigo-500/10'
                                    } rounded-full hover:text-white transition-all cursor-pointer shadow-lg hover:scale-105`}
                            >
                                {movie.providerLogo ? (
                                    <img src={movie.providerLogo} alt={movie.streamingPlatform} className="w-4 h-4 rounded-sm object-cover" />
                                ) : (
                                    <Play className={`w-3 h-3 ${movie.isBookMyShow ? 'fill-rose-200 group-hover:fill-white' : 'fill-indigo-200 group-hover:fill-white'}`} />
                                )}
                                {movie.streamingPlatform}
                            </a>
                        )}
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-2 leading-tight">{movie.title}</h2>

                        {/* Year, Runtime, Director */}
                        <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm font-medium mb-4">
                            <span>{movie.year || '2024'}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <span>{movie.runtime || '2h 0m'}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <span>{movie.director || 'Unknown'}</span>
                        </div>
                    </div>

                    {/* MQS Badge & Hype Index & Platform Logos */}
                    {isUnreleased ? (
                        <div className="pt-4">
                            <div className="inline-flex items-center gap-3 bg-indigo-500/20 border border-indigo-500/50 px-6 py-3 rounded-full text-indigo-300 font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                <Calendar className="w-5 h-5" />
                                Releasing {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Soon'}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center gap-6 md:gap-8 pt-4">
                            <div className={`flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-3xl shadow-xl transition-transform hover:scale-105 duration-300 ${getBadgeColor(movie.mqs)}`}>
                                <span className="text-4xl font-black text-white drop-shadow-md">{Math.round(movie.mqs)}</span>
                                <span className="text-[10px] font-bold text-white/90 uppercase tracking-[0.2em] mt-1">MQS</span>
                            </div>

                            <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-md px-5 py-4 rounded-3xl border border-slate-700/80 shadow-inner">
                                <Flame className="w-8 h-8 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse" />
                                <div>
                                    <div className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
                                        {movie.hypeIndex}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Hype Index</div>
                                </div>
                            </div>

                            <div className="ml-auto">
                                {mediaType === 'movie' ? (
                                    /* MOVIE BADGES: IMDb, Rotten Tomatoes, BookMyShow */
                                    <div className="flex flex-row flex-wrap items-center gap-4 mt-4">
                                        {/* BookMyShow Badge */}
                                        {bms && (
                                            <div className="flex items-center gap-2 bg-[#1c1c28] px-3 py-1.5 rounded-md border border-gray-700">
                                                <span className="text-[#f84464] font-black text-sm tracking-tight uppercase">BookMyShow</span>
                                                <span className="text-white text-sm font-bold">{bms}/10</span>
                                                <Star className="w-4 h-4 text-[#f84464] fill-[#f84464]" />
                                            </div>
                                        )}

                                        {/* IMDb Badge */}
                                        {imdb && (
                                            <div className="flex items-center gap-2 bg-[#1c1c28] px-3 py-1.5 rounded-md border border-gray-700">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="h-4" />
                                                <span className="text-white text-sm font-bold">{imdb}/10</span>
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            </div>
                                        )}

                                        {/* Rotten Tomatoes Badge */}
                                        {rt && (
                                            <div className="flex items-center gap-2 bg-[#1c1c28] px-3 py-1.5 rounded-md border border-gray-700">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="RT" className="h-5" />
                                                <span className="text-white text-sm font-bold">{rt}%</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* TV SHOW BADGES: IMDb, Rotten Tomatoes, TMDB */
                                    <div className="flex flex-row flex-wrap items-center gap-4 mt-4">
                                        {/* TMDB Badge (Replacing BMS for TV) */}
                                        {data.vote_average > 0 && (
                                            <div className="flex items-center gap-2 bg-[#1c1c28] px-3 py-1.5 rounded-md border border-gray-700">
                                                <span className="text-[#01b4e4] font-black text-sm tracking-tight">TMDB</span>
                                                <span className="text-white text-sm font-bold">{Math.round(data.vote_average * 10)}%</span>
                                                <Star className="w-4 h-4 text-[#01b4e4] fill-[#01b4e4]" />
                                            </div>
                                        )}

                                        {/* IMDb Badge */}
                                        {imdb && (
                                            <div className="flex items-center gap-2 bg-[#1c1c28] px-3 py-1.5 rounded-md border border-gray-700">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="h-4" />
                                                <span className="text-white text-sm font-bold">{imdb}/10</span>
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            </div>
                                        )}

                                        {/* Rotten Tomatoes Badge */}
                                        {rt && (
                                            <div className="flex items-center gap-2 bg-[#1c1c28] px-3 py-1.5 rounded-md border border-gray-700">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="RT" className="h-5" />
                                                <span className="text-white text-sm font-bold">{rt}%</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Plot */}
                    <p className="text-gray-200 mt-4 leading-relaxed max-w-3xl">
                        {movie.plot || 'Synopsis not available.'}
                    </p>

                    {/* Cast */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {movie.cast?.map((actor, idx) => (
                            <span key={idx} className="bg-slate-800 text-white px-4 py-1.5 rounded-full text-sm font-medium border border-slate-700">
                                {actor}
                            </span>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row flex-wrap gap-4 items-center pt-4 border-t border-slate-700/50 mt-6">
                        {movie.trailerUrl && (
                            <button
                                onClick={() => setIsTrailerOpen(true)}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-black uppercase tracking-wider transition-all shadow-lg shadow-red-600/20 group hover:-translate-y-0.5"
                            >
                                <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Play Trailer
                            </button>
                        )}

                        <button
                            onClick={toggleWatchlist}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-md group hover:-translate-y-0.5 ${saved
                                ? 'bg-indigo-500 hover:bg-indigo-600 text-white border border-indigo-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                                }`}
                        >
                            {saved ? (
                                <BookmarkCheck className="w-5 h-5 text-indigo-200" />
                            ) : (
                                <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            )}
                            {saved ? 'Saved' : 'Watchlist'}
                        </button>

                        <button
                            onClick={() => {
                                if (!user) return showToast();
                                // Logic for rating goes here
                            }}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-6 py-3 rounded-full font-bold transition-all border border-slate-700 shadow-md group hover:-translate-y-0.5"
                        >
                            <Star className="w-5 h-5 group-hover:text-yellow-400 group-hover:scale-110 transition-transform" />
                            Rate
                        </button>
                    </div>
                </div>
            </div>

            {/* Trailer Video Modal */}
            {isTrailerOpen && movie.trailerUrl && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                        <button
                            onClick={() => setIsTrailerOpen(false)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-slate-800 text-white border border-white/20 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <iframe
                            src={`${movie.trailerUrl}?autoplay=1`}
                            title={`${movie.title} Trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                        />
                    </div>
                </div>
            )}

            {/* High-Resolution Poster Modal */}
            {isPosterOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsPosterOpen(false)}>
                    <div className="relative max-w-2xl max-h-[90vh] py-4" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsPosterOpen(false)}
                            className="absolute -top-4 -right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:bg-red-600 text-white transition-colors shadow-xl border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img src={movie.poster} alt={movie.title} className="w-full h-full max-h-[85vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/10" />
                    </div>
                </div>
            )}

            {/* Auth Toast Notification */}
            {toast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-rose-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <AlertCircle className="w-5 h-5" />
                    Please sign in to use this feature.
                </div>
            )}
        </>
    );
}
