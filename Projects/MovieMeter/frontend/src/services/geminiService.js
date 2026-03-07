import { getCachedData, setCachedData } from '../utils/cacheManager';

export const generateAIVibeCheck = async (movieData, reviews) => {
    const cacheKey = `ai_vibe_${movieData.id}`;
    const cachedAI = getCachedData(cacheKey, 24);
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
  If NO reviews exist, analyze the plot and status to generate a hype/anticipation forecast.
  
  Return ONLY valid JSON in this exact format.
  {
    "mode": "${hasReviews ? 'sentiment' : 'forecast'}",
    "title": "${hasReviews ? 'Audience Vibe Check' : 'Anticipation Forecast'}",
    "summary": "Write a comprehensive, engaging 3-to-4 sentence paragraph. Do not be brief. Detail both the specific praise and the specific criticisms mentioned in the reviews (or the strengths of the plot if unreleased).",
    "keyThemes": ["Theme 1", "Theme 2", "Theme 3"], 
    "gaugeLabel": "${hasReviews ? 'Polarity Index' : 'Intrigue Score'}",
    "score": <number between 0 and 100>,
    "verdict": "A 2-word conclusion"
  }

  REVIEWS:
  ${reviewText}`;

    try {
        const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", // Updated to Groq's most stable current model
                messages: [
                    {
                        role: "user",
                        content: systemPrompt + "\n\nCRITICAL: Analyze this movie and return ONLY the JSON object. No markdown, no conversational text."
                    }
                ],
                temperature: 0.2 // Lower temperature for more consistent formatting
            })
        });

        if (!response.ok) {
            console.error(`Groq API Failed with status: ${response.status}`);
            const errorText = await response.text();
            console.error("Groq Error Details:", errorText);
            return null;
        }

        const data = await response.json();
        const aiText = data.choices[0].message.content;

        // Manually clean the response in case the AI wraps it in markdown backticks
        const cleanJson = aiText.trim().replace(/```json/g, '').replace(/```/g, '');
        const parsedData = JSON.parse(cleanJson);

        setCachedData(cacheKey, parsedData);
        return parsedData;

    } catch (error) {
        console.error("Groq AI Parsing Error:", error);
        return null;
    }
};
