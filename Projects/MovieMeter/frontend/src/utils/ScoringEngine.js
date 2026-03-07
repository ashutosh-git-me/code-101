export const calculateHype = (popularity) => {
    // Endgame ceiling ~ 10000
    return Math.round(Math.min(100, (Math.log(popularity + 1) / Math.log(10000)) * 100));
};

export const generateSimulatedScores = (tmdbScore) => {
    // Generate simulated dynamic data bounded realistically from TMDB core score
    const bmsVal = (tmdbScore / 10) + (Math.random() * 0.8 - 0.2);
    const googleVal = tmdbScore + (Math.random() * 10 - 5);
    return {
        bms: Number(Math.min(10, Math.max(0, bmsVal)).toFixed(1)),
        google: Math.min(100, Math.max(0, googleVal))
    };
};

export const parseOmdbScores = (omdbData) => {
    let imdb = null;
    let rt = null;
    let meta = null;

    if (!omdbData) return { imdb, rt, meta };

    if (omdbData.imdbRating && omdbData.imdbRating !== "N/A") {
        const val = parseFloat(omdbData.imdbRating);
        if (!isNaN(val)) imdb = val * 10;
    }

    if (omdbData.Ratings) {
        omdbData.Ratings.forEach(r => {
            if (r.Source === "Rotten Tomatoes") {
                const val = parseInt(r.Value.replace('%', ''));
                if (!isNaN(val)) rt = val;
            } else if (r.Source === "Metacritic") {
                const val = parseInt(r.Value.split('/')[0]);
                if (!isNaN(val)) meta = val;
            }
        });
    }

    return { imdb, rt, meta };
};

export const calculatePoolA = (rt, meta) => {
    // Pool A: Critic Scores
    if (rt && meta) {
        return (rt + meta) / 2;
    }
    if (rt) return rt;
    if (meta) return meta;
    return null;
};

export const calculatePoolB = (bms, google, imdb, tmdb, totalVotes) => {
    // Pool B: Audience Scores with Bayesian Smoothing and Variance Penalties
    let bmsWeight = 2.0;
    let googleWeight = 1.0;
    let imdbWeight = 1.0;
    let tmdbWeight = 1.0;

    const bms100 = bms * 10;

    // Penalties for extreme variance against the heavy-weight BMS
    if (Math.abs(google - bms100) > 20) googleWeight = 0.5;
    if (Math.abs(imdb - bms100) > 20) imdbWeight = 0.5;
    if (Math.abs(tmdb - bms100) > 20) tmdbWeight = 0.5;

    const totalWeight = bmsWeight + googleWeight + imdbWeight + tmdbWeight;
    const rawPoolB = ((bms100 * bmsWeight) + (google * googleWeight) + (imdb * imdbWeight) + (tmdb * tmdbWeight)) / totalWeight;

    // Bayesian Smoothing
    const v = totalVotes || 0;
    const m = 500; // Prior certainty
    const C = 65;  // Global average mean

    const stabilizedPoolB = ((v / (v + m)) * rawPoolB) + ((m / (v + m)) * C);
    return stabilizedPoolB;
};

export const calculateFinalMQS = (poolA, poolB, totalVotes) => {
    if (!poolA) return Math.round(poolB);

    if (totalVotes < 2500) {
        return Math.round((poolA * 0.6) + (poolB * 0.4));
    }
    if (totalVotes >= 2500 && totalVotes <= 10000) {
        return Math.round((poolA * 0.5) + (poolB * 0.5));
    }
    return Math.round((poolA * 0.3) + (poolB * 0.7));
};
