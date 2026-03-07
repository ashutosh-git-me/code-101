import React, { useEffect, useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2, BookmarkX, Flame, Lock } from 'lucide-react';
import { fetchMovieDetails, fetchTVDetails, getImageUrl } from '../services/tmdb';

const mapTMDBToMovie = (m, mediaType = 'movie') => ({
    id: m.id,
    title: m.title || m.name,
    poster: getImageUrl(m.poster_path, 'w500'),
    backdrop: getImageUrl(m.backdrop_path, 'original'),
    plot: m.overview,
    mqs: m.vote_average ? (m.vote_average * 10) : 0,
    year: (m.release_date || m.first_air_date || '').substring(0, 4) || 'N/A',
    hypeIndex: m.popularity ? Math.min(m.popularity / 100, 100) : 50,
    mediaType: mediaType
});

export default function Watchlist() {
    const { watchlist, removeFromWatchlist } = useWatchlist();
    const { user, login } = useAuth();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (watchlist.length === 0) {
            setMovies([]);
            setLoading(false);
            return;
        }

        // Fetch all movies from watchlist objects via TMDB
        const fetchWatchlistMovies = async () => {
            try {
                const results = await Promise.all(
                    watchlist.map(item => {
                        // legacy fallback just in case old id integers are in storage
                        const id = typeof item === 'object' ? item.id : item;
                        const type = typeof item === 'object' ? item.mediaType : 'movie';
                        return type === 'tv' ? fetchTVDetails(id) : fetchMovieDetails(id);
                    })
                );
                // Filter out any failed requests (like 404s) and map to standard object with inferred mediaType
                const savedMovies = results.filter(res => !res.status_code).map(res => {
                    const originalItem = watchlist.find(w => (typeof w === 'object' ? w.id : w) === res.id);
                    const mediaType = typeof originalItem === 'object' ? originalItem.mediaType : 'movie';
                    return mapTMDBToMovie(res, mediaType);
                });
                setMovies(savedMovies);
            } catch (err) {
                console.error('Error fetching watchlist data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlistMovies();
    }, [watchlist]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh] flex items-center justify-center animate-in fade-in duration-500">
                <div className="flex flex-col items-center justify-center bg-slate-800/30 border border-slate-800 rounded-3xl p-16 text-center shadow-inner mt-10">
                    <Lock className="w-20 h-20 text-slate-600 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-300 mb-2">Sign In to View Your Watchlist</h3>
                    <p className="text-slate-500 mb-8 max-w-md">You must be logged in to create and view your personalized watchlist.</p>
                    <button onClick={login} className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/25 z-10">
                        Sign In
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh] animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Your Watchlist</h2>
                <span className="bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-500/30">
                    {watchlist.length} {watchlist.length === 1 ? 'Movie' : 'Movies'}
                </span>
            </div>

            {movies.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-slate-800/30 border border-slate-800 rounded-3xl p-16 text-center shadow-inner">
                    <BookmarkX className="w-20 h-20 text-slate-600 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-300 mb-2">Your watchlist is empty</h3>
                    <p className="text-slate-500 mb-8 max-w-md">Discover new films using the MovieMeter Engine and save them here to keep track of what you want to watch next.</p>
                    <Link to="/" className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/25 z-10">
                        Browse Trending Movies
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                    {movies.map(movie => (
                        <div key={movie.id} className="group relative">
                            <Link to={`/${movie.mediaType}/${movie.id}`} className="block relative rounded-2xl overflow-hidden shadow-xl aspect-[2/3] mb-4 border border-slate-700/50 hover:border-indigo-400 transition-colors">
                                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity"></div>
                            </Link>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeFromWatchlist(movie.id);
                                }}
                                className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:bg-red-500 hover:border-red-500 text-slate-300 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100 z-10"
                                title="Remove from Watchlist"
                            >
                                <BookmarkX className="w-5 h-5" />
                            </button>

                            <h4 className="font-bold text-lg text-slate-200 truncate group-hover:text-indigo-400 transition-colors">{movie.title}</h4>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
                                    {Math.round(movie.mqs)}
                                </span>
                                <span className="flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold border border-slate-700">
                                    <Flame className="w-3 h-3 text-orange-500" />
                                    {Math.round(movie.hypeIndex)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
