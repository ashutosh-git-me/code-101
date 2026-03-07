import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Star } from 'lucide-react';
import { fetchMoviesByGenre, fetchBollywood, fetchRevenue, fetchK_Drama, fetchAnime, fetchTopRatedTV, fetchInTheaters, getImageUrl } from '../services/tmdb';

const genreMap = {
    action: 28,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    horror: 27,
    mystery: 9648,
    romance: 10749,
    scifi: 878,
    thriller: 53
};

export default function Browse() {
    const { id } = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const title = id ? id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Browse';

    useEffect(() => {
        const loadCategory = async () => {
            setLoading(true);
            try {
                const categorySearch = id ? id.toLowerCase() : '';
                let results = [];

                if (categorySearch === 'in-theaters') {
                    results = await fetchInTheaters();
                } else if (categorySearch === 'bollywood' || categorySearch === 'bollywood-buzz') {
                    results = await fetchBollywood();
                } else if (categorySearch === 'top-box-office') {
                    results = await fetchRevenue();
                } else if (categorySearch === 'kdrama') {
                    results = await fetchK_Drama();
                } else if (categorySearch === 'anime') {
                    results = await fetchAnime();
                } else if (categorySearch === 'top-rated-tv' || categorySearch === 'top-rated') {
                    results = await fetchTopRatedTV();
                } else {
                    const genreId = genreMap[categorySearch] || genreMap[categorySearch.replace('-', '')];
                    if (genreId) {
                        results = await fetchMoviesByGenre(genreId);
                    }
                }

                if (results && results.length > 0) {
                    const mapped = results.map(m => ({
                        id: m.id,
                        title: m.title || m.name,
                        poster: getImageUrl(m.poster_path, 'w500'),
                        mqs: m.vote_average ? (m.vote_average * 10) : 0,
                    }));
                    setMovies(mapped);
                } else {
                    setMovies([]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCategory();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            </div>
        );
    }

    const categorySearch = id ? id.toLowerCase() : '';
    const isTv = ['kdrama', 'anime', 'top-rated-tv', 'top-rated'].includes(categorySearch);
    const mediaType = isTv ? 'tv' : 'movie';

    return (
        <main className="w-full flex flex-col min-h-screen bg-slate-900 pb-20 pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-10 flex items-center gap-4">
                <span className="w-2 h-10 bg-indigo-500 rounded-full"></span>
                Browsing: <span className="capitalize">{title}</span>
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map(movie => (
                    <Link to={`/${mediaType}/${movie.id}`} key={movie.id} className="group relative rounded-2xl overflow-hidden aspect-[2/3] shadow-lg ring-1 ring-slate-800 hover:ring-indigo-500 transition-all duration-300">
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
        </main>
    );
}
