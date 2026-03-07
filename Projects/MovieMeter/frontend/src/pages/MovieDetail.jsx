import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import HeroRatingsDashboard from '../components/HeroRatingsDashboard';
import { fetchMovieDetails, fetchTVDetails, fetchOmdbDetails, getImageUrl, fetchMovieReviews } from '../services/tmdb';
import { generateAIVibeCheck } from '../services/geminiService';
import { calculateHype, generateSimulatedScores, parseOmdbScores, calculatePoolA, calculatePoolB, calculateFinalMQS } from '../utils/ScoringEngine';

const getStreamingUrl = (providerName, movieTitle) => {
    if (!providerName || !movieTitle) return null;
    const name = providerName.toLowerCase();

    if (name.includes('netflix')) {
        return `https://www.netflix.com/search?q=${encodeURIComponent(movieTitle)}`;
    }
    if (name.includes('amazon') || name.includes('prime')) {
        return `https://www.amazon.in/s?k=${encodeURIComponent(movieTitle)}&i=instant-video`;
    }
    if (name.includes('hotstar')) {
        return `https://www.hotstar.com/in/search?q=${encodeURIComponent(movieTitle)}`;
    }
    return `https://www.google.com/search?q=Watch+${encodeURIComponent(movieTitle)}`;
};

export default function MovieDetail() {
    const { mediaType, id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiInsights, setAiInsights] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [hasRequestedAi, setHasRequestedAi] = useState(false);
    const [rawMovieData, setRawMovieData] = useState(null);
    const [movieReviews, setMovieReviews] = useState([]);

    useEffect(() => {
        // Wipe the AI memory clean when navigating to a new movie
        setAiInsights(null);
        setHasRequestedAi(false);
        setIsAiLoading(false);
    }, [id]);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const data = mediaType === 'tv' ? await fetchTVDetails(id) : await fetchMovieDetails(id);
                const inProvider = data['watch/providers']?.results?.IN?.flatrate?.[0] || data['watch/providers']?.results?.IN?.rent?.[0] || data['watch/providers']?.results?.IN?.buy?.[0];
                const usProvider = data['watch/providers']?.results?.US?.flatrate?.[0] || data['watch/providers']?.results?.US?.rent?.[0] || data['watch/providers']?.results?.US?.buy?.[0];
                const provider = inProvider || usProvider;

                let streamingPlatform = null;
                let watchLink = null;
                let providerLogo = null;
                let isBookMyShow = false;

                if (provider) {
                    streamingPlatform = provider.provider_name;
                    const customDeepLink = getStreamingUrl(streamingPlatform, data.title || data.name);
                    watchLink = customDeepLink || data['watch/providers']?.results?.IN?.link || data['watch/providers']?.results?.US?.link || `https://www.themoviedb.org/movie/${data.id}/watch`;
                    providerLogo = getImageUrl(provider.logo_path, 'w92');
                } else if (data.status === 'Released') {
                    streamingPlatform = 'Book on BookMyShow';
                    watchLink = `https://in.bookmyshow.com/explore/movies?q=${encodeURIComponent(data.title)}`;
                    isBookMyShow = true;
                }

                // OMDB and Scoring Engine Integration
                const imdbId = mediaType === 'tv' ? data.external_ids?.imdb_id : data.imdb_id;
                const omdbData = imdbId ? await fetchOmdbDetails(imdbId) : null;
                const tmdbScore = data.vote_average ? data.vote_average * 10 : 0;

                const simScores = generateSimulatedScores(tmdbScore);
                const { imdb, rt, meta } = parseOmdbScores(omdbData);

                const poolA = calculatePoolA(rt, meta);
                const poolB = calculatePoolB(simScores.bms, simScores.google, imdb || tmdbScore, tmdbScore, data.vote_count);
                const finalMqs = calculateFinalMQS(poolA, poolB, data.vote_count);

                // Map complex TMDB JSON directly backwards into the old HeroRatings Dashboard schema
                setMovie({
                    id: data.id,
                    title: data.title || data.name,
                    poster: getImageUrl(data.poster_path, 'w500'),
                    backdrop: getImageUrl(data.backdrop_path, 'original'),
                    plot: data.overview,
                    mqs: finalMqs,
                    year: (data.release_date || data.first_air_date || '').substring(0, 4) || 'N/A',
                    runtime: mediaType === 'tv'
                        ? `${data.number_of_seasons || 1} Seasons • ${data.number_of_episodes || 0} Episodes`
                        : data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : 'N/A',
                    director: mediaType === 'tv'
                        ? `Creator: ${data.created_by?.[0]?.name || 'Unknown'}`
                        : `Directed by ${data.credits?.crew?.find(c => c.job === 'Director')?.name || 'Unknown'}`,
                    cast: data.credits?.cast?.slice(0, 4).map(c => c.name) || [],
                    trailerUrl: data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key
                        ? `https://www.youtube.com/embed/${data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube').key}`
                        : null,
                    streamingPlatform,
                    watchLink,
                    providerLogo,
                    isBookMyShow,
                    status: data.status,
                    releaseDate: data.release_date || data.first_air_date,
                    tmdbScore: data.vote_average || 0,
                    hypeIndex: calculateHype(data.popularity || 0),
                    platformScores: {
                        bms: simScores.bms,
                        google: Math.round(simScores.google),
                        rt: rt || null,
                        meta: meta || null,
                        imdb: imdb ? (imdb / 10).toFixed(1) : null
                    }
                });

                setRawMovieData(data);
                try {
                    const reviewsRes = await fetchMovieReviews(id, mediaType);
                    setMovieReviews(reviewsRes.data?.results || []);
                } catch (error) {
                    console.error("Failed to load movie reviews", error);
                }
            } catch (error) {
                console.error('Error fetching TMDB detail:', error);
                setMovie(null);
            } finally {
                setLoading(false);
            }
        };

        loadMovie();
    }, [id]);

    const handleGenerateAI = async () => {
        setHasRequestedAi(true);
        setIsAiLoading(true);
        try {
            const aiResult = await generateAIVibeCheck(rawMovieData, movieReviews);
            setAiInsights(aiResult);
        } catch (error) {
            console.error("Failed to generate AI", error);
        } finally {
            setIsAiLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                    <p className="text-slate-400 font-medium animate-pulse">Connecting to Data Node...</p>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6">
                <h2 className="text-2xl font-bold text-white">Movie not found</h2>
                <button onClick={() => navigate('/')} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-bold transition-colors">Back to Home</button>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-bold transition-colors border border-slate-700 shadow-md group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

            </div>

            <section>
                <HeroRatingsDashboard movie={movie} mediaType={mediaType} />

                {!hasRequestedAi && !aiInsights && (
                    <div className="mt-8 p-6 rounded-xl border border-purple-500/30 bg-[#161622] flex flex-col items-center justify-center text-center">
                        <h3 className="text-white font-bold mb-2">MovieMeter AI Insights</h3>
                        <p className="text-gray-400 text-sm mb-4">Get a real-time sentiment analysis based on audience reviews.</p>
                        <button
                            onClick={handleGenerateAI}
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                        >
                            ✨ Generate Vibe Check
                        </button>
                    </div>
                )}

                {isAiLoading && (
                    <div className="animate-pulse h-32 bg-purple-900/20 rounded-xl mt-8 border border-purple-500/30"></div>
                )}

                {!isAiLoading && aiInsights && (
                    <div className="border border-purple-500/30 bg-[#161622] rounded-xl p-6 mt-8 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">✨</span>
                            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-black tracking-wide uppercase text-sm">
                                MovieMeter AI • {aiInsights.title}
                            </h3>
                        </div>

                        {/* Summary */}
                        <p className="text-gray-300 italic text-sm leading-relaxed mb-4">
                            "{aiInsights.summary}"
                        </p>

                        {aiInsights.keyThemes && aiInsights.keyThemes.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {aiInsights.keyThemes.map((theme, index) => (
                                    <span key={index} className="bg-purple-900/40 border border-purple-500/30 text-purple-200 text-xs px-3 py-1 rounded-full shadow-sm">
                                        {theme}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* The Gauge UI */}
                        <div className="bg-black/40 rounded-lg p-4">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{aiInsights.gaugeLabel}</span>
                                <span className="text-white font-black text-lg">{aiInsights.score}/100</span>
                            </div>

                            {/* Dynamic Progress Bar */}
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${aiInsights.score > 70 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                                        aiInsights.score > 40 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                                            'bg-gradient-to-r from-green-400 to-emerald-500'
                                        }`}
                                    style={{ width: `${aiInsights.score}%` }}
                                ></div>
                            </div>
                            <div className="text-right mt-1">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{aiInsights.verdict}</span>
                            </div>
                        </div>
                    </div>
                )}
            </section>

        </main>
    );
}
