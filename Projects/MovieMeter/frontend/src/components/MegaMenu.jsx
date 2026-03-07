import React from 'react';
import { Link } from 'react-router-dom';

export default function MegaMenu({ isOpen, onClose }) {
    if (!isOpen) return null;

    const menuData = [
        {
            title: "MOVIES",
            links: ["Top Box Office", "Release Calendar", "Top Pics", "In Theaters", "Showtimes & Tickets"]
        },
        {
            title: "TV-SHOWS",
            links: ["Top-Rated", "Where to Watch", "On Netflix", "On Prime Video", "On Disney+", "Upcoming Shows"]
        },
        {
            title: "AWARDS",
            links: ["Oscars", "STARmeter Awards", "Festival Central", "Emmys", "Golden Globes", "All Events"]
        },
        {
            title: "SHORTFILMS",
            links: ["Award Winning", "Top Youtube", "Psycho-Thrillers", "Sci-Fi Shorts", "Animated Shorts", "Staff Picks"]
        },
        {
            title: "UPCOMING",
            links: ["Upcoming Hollywood", "Pushpa 2: The Rule", "Events & Fests", "Trailers", "First Looks", "Release Radar"]
        },
        {
            title: "CATEGORIES",
            links: ["Action", "Comedy", "Crime", "Documentary", "Drama", "Family", "Horror", "Mystery", "Romance", "Scifi", "Thriller", "Bollywood"]
        }
    ];

    return (
        <div className="fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-red-950/90 backdrop-blur-md border-b border-slate-700/80 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-sm">
                    {menuData.map((col, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            <h3 className="text-white font-black tracking-[0.2em] uppercase text-xs mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                {col.title}
                            </h3>
                            <ul className="space-y-3">
                                {col.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link
                                            to={`/category/${link.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                            onClick={onClose}
                                            className="text-slate-400 font-semibold hover:text-white transition-colors block"
                                        >
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
