import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import DynamicHeroCarousel from '../components/DynamicHeroCarousel';
import MovieRow from '../components/MovieRow';
import VideoCarousel from '../components/VideoCarousel';
import WeeklyCharts from '../components/WeeklyCharts';
import GenreCarousel from '../components/GenreCarousel';
import { fetchTrending, fetchTopRated, fetchUpcoming, fetchTrendingTV, fetchK_Drama, fetchMovieVideos, fetchInTheaters, getImageUrl } from '../services/tmdb';
import { fetchCreatorReviews } from '../services/youtube';
import { calculateHype } from '../utils/ScoringEngine';

const mapTMDBToMovie = (m, mediaType = 'movie') => ({
    id: m.id,
    title: m.title || m.name,
    posterUrl: getImageUrl(m.poster_path, 'w500'),
    backdropUrl: getImageUrl(m.backdrop_path, 'original'),
    plot: m.overview,
    mqs: m.vote_average ? (m.vote_average * 10) : 0,
    year: (m.release_date || m.first_air_date || '').substring(0, 4) || 'N/A',
    hypeIndex: calculateHype(m.popularity || 0)
});

const Home = () => {
    const [discoveryFeed, setDiscoveryFeed] = useState([]);
    const [trending, setTrending] = useState([]);
    const [acclaimed, setAcclaimed] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [trendingTV, setTrendingTV] = useState([]);
    const [kDramas, setKDramas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomePageData = async () => {
            try {
                const [trendRes, topRes, upRes, tvRes, kdramaRes, theaterRes] = await Promise.all([
                    fetchTrending(),
                    fetchTopRated(),
                    fetchUpcoming(),
                    fetchTrendingTV(),
                    fetchK_Drama(),
                    fetchInTheaters()
                ]);

                // Generate Versatile Discovery Feed
                let interleaved = [];
                const maxLen = Math.max(trendRes?.length || 0, theaterRes?.length || 0);
                for (let i = 0; i < maxLen; i++) {
                    if (trendRes && trendRes[i]) interleaved.push(mapTMDBToMovie(trendRes[i], 'movie'));
                    if (theaterRes && theaterRes[i]) interleaved.push(mapTMDBToMovie(theaterRes[i], 'movie'));
                }
                const uniqueItems = Array.from(new Map(interleaved.map(item => [item.id, item])).values());
                const top6TMDB = uniqueItems.slice(0, 6);

                await Promise.all(top6TMDB.map(async (item) => {
                    try {
                        const videoData = await fetchMovieVideos(item.id, 'movie');
                        const videos = videoData.results || [];
                        const bestVideo = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
                            videos.find(v => v.type === 'Featurette' && v.site === 'YouTube') ||
                            videos.find(v => v.type === 'Clip' && v.site === 'YouTube');
                        if (bestVideo) {
                            item.heroVideoKey = bestVideo.key;
                        }
                    } catch (err) {
                        console.error(`Failed to fetch video for ${item.id}`, err);
                    }
                }));

                const moviesForReviews = top6TMDB.slice(0, 3);
                const reviewPromises = moviesForReviews.map(async (movie) => {
                    const reviews = await fetchCreatorReviews(movie.title, 1);
                    return reviews && reviews.length > 0 ? reviews[0] : null;
                });
                const resolvedReviews = (await Promise.all(reviewPromises)).filter(Boolean);

                const finalFeed = [...top6TMDB, ...resolvedReviews];
                setDiscoveryFeed(finalFeed);

                // Map TMDB responses to the expected internal format, then sort by hype
                if (trendRes) {
                    const mappedTrending = trendRes.map(m => mapTMDBToMovie(m, 'movie')).sort((a, b) => b.hypeIndex - a.hypeIndex);
                    setTrending(mappedTrending);
                }

                if (topRes) setAcclaimed(topRes.map(m => mapTMDBToMovie(m, 'movie')));
                if (upRes) setNewArrivals(upRes.map(m => mapTMDBToMovie(m, 'movie')));
                if (tvRes) setTrendingTV(tvRes.map(m => mapTMDBToMovie(m, 'tv')).sort((a, b) => b.hypeIndex - a.hypeIndex));
                if (kdramaRes) setKDramas(kdramaRes.map(m => mapTMDBToMovie(m, 'tv')));
            } catch (error) {
                console.error("Failed to fetch TMDB data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadHomePageData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 pb-20">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="w-full flex flex-col min-h-screen bg-slate-900 pb-20">
            {/* 70/30 SPLIT GRID FOR HERO & WEEKLY CHARTS */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch pt-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
                <div className="flex-1 min-w-0 h-[500px]">
                    {discoveryFeed?.length > 0 && <DynamicHeroCarousel items={discoveryFeed} />}
                </div>
                <div className="w-full lg:w-1/3 xl:w-1/4 h-[500px] hidden lg:block border border-slate-700 rounded-2xl overflow-hidden shadow-2xl bg-slate-900/50">
                    <WeeklyCharts movies={trending} />
                </div>
            </div>

            {/* QUICK TAGS ROW */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-wrap gap-3 py-6">
                {[
                    { label: 'In Theaters', path: '/category/in-theaters' },
                    { label: 'Top Pics', path: '/category/top-rated' },
                    { label: 'Bollywood Buzz', path: '/category/bollywood' },
                    { label: 'Action', path: '/category/action' },
                    { label: 'Romance', path: '/category/romance' },
                    { label: 'Latest Reviews', path: '/' },
                    { label: 'Streaming Now', path: '/' }
                ].map((tag, idx) => (
                    <Link key={idx} to={tag.path} className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-full text-sm font-semibold transition-colors border border-slate-700 whitespace-nowrap">
                        {tag.label}
                    </Link>
                ))}
            </div>

            {/* GENRE BROWSE CAROUSEL */}
            <GenreCarousel />

            {trending?.length > 5 && (
                <div className="bg-slate-900 border-b border-slate-800">
                    <VideoCarousel title="Trending Trailers & Clips" movies={trending.slice(5, 15)} />
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 w-full">
                {trending?.length > 0 && <MovieRow title="Trending This Week" movies={trending} />}
                {trendingTV?.length > 0 && <MovieRow title="Trending Web Series" movies={trendingTV} mediaType="tv" />}
                {kDramas?.length > 0 && <MovieRow title="Popular K-Dramas" movies={kDramas} mediaType="tv" />}
                {acclaimed?.length > 0 && <MovieRow title="Critically Acclaimed" movies={acclaimed} />}
                {newArrivals?.length > 0 && <MovieRow title="New Arrivals" movies={newArrivals} />}
            </div>
        </main>
    );
};

export default Home;

