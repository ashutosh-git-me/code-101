import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bookmark, UserCircle, Menu, X, Loader2, BookOpen, LogOut } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import { searchMulti, getImageUrl } from '../services/tmdb';
import MegaMenu from './MegaMenu';

export default function Navbar() {
    const { watchlist } = useWatchlist();
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    // Mega Menu State
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced Search Effect
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const debounceTimer = setTimeout(() => {
            setIsSearching(true);
            searchMulti(searchQuery)
                .then(data => {
                    const filtered = data.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
                    setSearchResults(filtered.slice(0, 8));
                    setIsSearching(false);
                })
                .catch(err => {
                    console.error('Error during search:', err);
                    setIsSearching(false);
                });
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleResultClick = (id, mediaType) => {
        navigate(`/${mediaType}/${id}`);
        handleClearSearch();
    };

    return (
        <React.Fragment>
            <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-[60]">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 relative">

                    {/* LEFT: Logo */}
                    <Link to="/" className="shrink-0 flex items-center gap-2 group z-10" onClick={() => setIsMenuOpen(false)}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            <span className="text-xl font-black text-white">M</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight hidden sm:block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm group-hover:opacity-80 transition-opacity">
                            MovieMeter
                        </h1>
                    </Link>

                    {/* MIDDLE: Search Bar & Menu Button */}
                    <div className="flex-1 flex items-center max-w-2xl relative z-10">
                        <div className="flex-1 relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-200 text-sm rounded-full focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 block pl-12 pr-10 py-3 transition-all placeholder-slate-500 shadow-inner outline-none"
                                placeholder="Search movies, TV shows, actors..."
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}

                            {/* Search Results Dropdown */}
                            {searchQuery.trim() && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {isSearching ? (
                                        <div className="p-4 flex items-center justify-center text-slate-400">
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Searching...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <ul className="max-h-80 overflow-y-auto">
                                            {searchResults.map(movie => (
                                                <li key={movie.id}>
                                                    <button
                                                        onClick={() => handleResultClick(movie.id, movie.media_type)}
                                                        className="w-full text-left px-4 py-3 hover:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-700/50 last:border-0"
                                                    >
                                                        <img src={getImageUrl(movie.poster_path, 'w92') || 'https://placehold.co/92x138/1e293b/ffffff?text=No+Image'} alt={movie.title || movie.name} className="w-8 h-12 object-cover rounded shadow-lg" />
                                                        <div>
                                                            <div className="font-bold text-white text-sm line-clamp-1">{movie.title || movie.name}</div>
                                                            <div className="text-xs text-slate-400 mt-0.5">{(movie.release_date || movie.first_air_date) ? (movie.release_date || movie.first_air_date).split('-')[0] : 'N/A'} • MQS {Math.round((movie.vote_average || 0) * 10)}</div>
                                                        </div>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-4 text-center text-slate-400 text-sm">
                                            No movies found matching "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Menu Toggle Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 rounded-full py-3 font-bold transition-colors shadow-md border border-orange-500/50 ml-3"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            <span className="hidden sm:inline tracking-wide">Menu</span>
                        </button>
                    </div>

                    {/* RIGHT: Actions */}
                    <nav className="flex items-center gap-2 sm:gap-4 shrink-0 z-10">
                        <Link
                            to="/about"
                            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-white group"
                        >
                            <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-sm tracking-wide">Methodology</span>
                        </Link>

                        <button
                            onClick={() => navigate('/watchlist')}
                            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-white group relative"
                        >
                            <div className="relative">
                                <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                {watchlist.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900">
                                        {watchlist.length}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:block font-bold text-sm tracking-wide">Watchlist</span>
                        </button>

                        <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block"></div>

                        {user ? (
                            <div className="relative group/auth cursor-pointer">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-800 border border-slate-700 text-white shadow-sm">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs uppercase tracking-wider">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden sm:block font-bold text-sm tracking-wide px-1">{user.name}</span>
                                </div>

                                {/* Dropdown Menu */}
                                <div className="absolute top-10 right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover/auth:opacity-100 group-hover/auth:visible transition-all duration-200 z-50">
                                    <div className="p-3 border-b border-slate-700/50">
                                        <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                                        <p className="text-xs text-slate-400 mt-1">{user.role}</p>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 rounded-lg flex items-center gap-2 transition-colors font-semibold"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button onClick={login} className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hover:text-white group">
                                <UserCircle className="w-6 h-6 group-hover:scale-110 transition-transform text-indigo-400" />
                                <span className="hidden sm:block font-bold text-sm tracking-wide">Sign In</span>
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </React.Fragment>
    );
}
