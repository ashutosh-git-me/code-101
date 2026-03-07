import axios from 'axios';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getImageUrl = (path, size = 'original') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const fetchTrending = async () => {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};

export const fetchInTheaters = async () => {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};

export const fetchTopRated = async () => {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};

export const fetchUpcoming = async () => {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};

export const searchMulti = async (query) => {
    if (!query) return [];
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results;
};

export const fetchMoviesByGenre = async (genreId) => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    const data = await response.json();
    return data.results;
};

export const fetchBollywood = async () => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=hi&sort_by=popularity.desc`);
    const data = await response.json();
    return data.results;
};

export const fetchRevenue = async () => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=revenue.desc`);
    const data = await response.json();
    return data.results;
};

export const fetchMovieDetails = async (id) => {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits,watch/providers`);
    const data = await response.json();
    return data;
};

export const fetchMovieVideos = async (id, mediaType = 'movie') => {
    const response = await fetch(`${BASE_URL}/${mediaType}/${id}/videos?api_key=${API_KEY}`);
    const data = await response.json();
    return data;
};

export const fetchTVDetails = async (id) => {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=videos,credits,watch/providers,external_ids`);
    const data = await response.json();
    return data;
};

export const fetchTrendingTV = async () => {
    const response = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};

export const fetchTopRatedTV = async () => {
    const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export const fetchOmdbDetails = async (imdbId) => {
    if (!imdbId) return null;
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`);
        const data = await response.json();
        return data.Response === "True" ? data : null;
    } catch (error) {
        console.error("Error fetching omdb:", error);
        return null;
    }
};

export const fetchK_Drama = async () => {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=ko&sort_by=popularity.desc`);
    const data = await response.json();
    return data.results;
};

export const fetchAnime = async () => {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&with_original_language=ja`);
    const data = await response.json();
    return data.results;
};

export const fetchMovieReviews = (id, mediaType = 'movie') => {
    // Assuming you have an axios instance configured, otherwise use standard axios
    return axios.get(`${BASE_URL}/${mediaType}/${id}/reviews?api_key=${API_KEY}`);
};
