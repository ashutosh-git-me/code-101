import axios from 'axios';
import { getCachedData, setCachedData } from '../utils/cacheManager';

export const fetchCreatorReviews = async (movieTitle, maxResults = 2) => {
    const cacheKey = `yt_reviews_${movieTitle.replace(/\s+/g, '_')}`;
    const cached = getCachedData(cacheKey, 24);
    if (cached) return cached;

    try {
        const res = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                part: 'snippet',
                q: `${movieTitle} movie review`,
                maxResults: maxResults,
                type: 'video',
                key: import.meta.env.VITE_YOUTUBE_API_KEY
            }
        });

        const formattedData = res.data.items.map(item => {
            const thumbs = item.snippet.thumbnails;
            // Extract the highest available resolution for the authentic YouTube thumbnail
            const bestThumbnail = thumbs.maxres?.url || thumbs.high?.url || thumbs.medium?.url;

            return {
                id: `yt-${item.id.videoId}`,
                title: item.snippet.title,
                overview: `Featured Creator Review by ${item.snippet.channelTitle}`,
                backdrop_path: bestThumbnail, // Absolute YouTube image URL
                heroVideoKey: item.id.videoId,
                isCreatorContent: true,
                channelName: item.snippet.channelTitle
            };
        });

        setCachedData(cacheKey, formattedData);
        return formattedData;
    } catch (error) {
        console.error("YouTube API Error:", error);
        return [];
    }
};
