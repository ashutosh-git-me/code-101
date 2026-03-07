import { getCachedData, setCachedData } from '../utils/cacheManager';

export const generateAIVibeCheck = async (movieData, reviews) => {
    // 1. Check if we already analyzed this movie today
    const cacheKey = `ai_vibe_${movieData.id}`;
    const cachedAI = getCachedData(cacheKey, 24); // 24-hour TTL
    if (cachedAI) {
        console.log("Loaded AI Vibe Check from cache!");
        return cachedAI;
    }

    const hasReviews = reviews && reviews.length > 0;
    const reviewText = hasReviews ? reviews.slice(0, 5).map(r => r.content).join('\n\n') : 'No reviews available.';

    const systemPrompt = `You are an expert film analyst for MovieMeter. 
  Movie: ${movieData.title}
  Status: ${movieData.status}
  Plot: ${movieData.overview}
  
  TASK:
  If user reviews exist below, analyze them to determine the general consensus.
  If NO reviews exist (unreleased or obscure), analyze the plot and status to generate a hype/anticipation forecast.
  
  Return ONLY valid JSON in this exact format, with no markdown formatting or text outside the brackets:
  {
    "mode": "${hasReviews ? 'sentiment' : 'forecast'}",
    "title": "${hasReviews ? 'Audience Vibe Check' : 'Anticipation Forecast'}",
    "summary": "A punchy, 2-sentence summary of the reviews OR the hype surrounding the plot.",
    "gaugeLabel": "${hasReviews ? 'Polarity Index' : 'Intrigue Score'}",
    "score": <number between 0 and 100>,
    "verdict": "A 2-word conclusion (e.g., 'Highly Divisive', 'Universal Praise')"
  }

  REVIEWS:
  ${reviewText}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        if (!response.ok) {
            console.error(`Gemini API Failed with status: ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            console.error("Gemini API returned empty candidates.");
            return null;
        }

        const aiText = data.candidates[0].content.parts[0].text;
        const cleanJson = aiText.trim().replace(/```json/g, '').replace(/```/g, '');
        const parsedData = JSON.parse(cleanJson);

        // 2. Save the successful result to the cache before returning it
        setCachedData(cacheKey, parsedData);

        return parsedData;

    } catch (error) {
        console.error("Gemini AI Parsing Error:", error);
        return null;
    }
};
