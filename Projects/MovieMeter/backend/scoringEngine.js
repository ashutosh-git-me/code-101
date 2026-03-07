/**
 * A. The Dynamic Outlier Penalty (Anti-Bias Fix)
 * Calculates the Weighted Base Score (S_base)
 */
function calculateBaseScore(platformScores) {
    const defaultWeights = {
        imdb: 0.30,
        rt: 0.25,
        meta: 0.15,
        google: 0.15,
        toi: 0.15
    };

    const validPlatforms = Object.keys(defaultWeights).filter(p => platformScores[p] != null);

    if (validPlatforms.length === 0) return 0;

    let sumScores = 0;
    validPlatforms.forEach(p => {
        sumScores += platformScores[p];
    });
    const mean = sumScores / validPlatforms.length;

    let adjustedWeights = {};
    validPlatforms.forEach(p => {
        let weight = defaultWeights[p];
        const score = platformScores[p];
        if (Math.abs(score - mean) > 20) {
            weight *= 0.5; // Outlier penalty
        }
        adjustedWeights[p] = weight;
    });

    const totalAdjustedWeight = Object.values(adjustedWeights).reduce((sum, w) => sum + w, 0);

    let sBase = 0;
    if (totalAdjustedWeight > 0) {
        validPlatforms.forEach(p => {
            const normalizedWeight = adjustedWeights[p] / totalAdjustedWeight;
            sBase += platformScores[p] * normalizedWeight;
        });
    }

    return sBase;
}

/**
 * B. The MovieMeter Quality Score (MQS)
 */
function calculateMQS(sBase, v) {
    const m = 10000; // Reliability Threshold
    const C = 65.0;  // Database Mean

    return ((v / (v + m)) * sBase) + ((m / (v + m)) * C);
}

/**
 * C. The Dynamic Hype Index
 */
function calculateHypeIndex(v, t) {
    const vMax = 2500000;

    if (v <= 1) return 0;

    const baseVol = (Math.log10(v) / Math.log10(vMax)) * 100;
    const clampedVol = Math.min(100, baseVol);
    const timeDecay = Math.exp(-0.1 * t);

    return clampedVol * timeDecay;
}

/**
 * Main engine processing function
 */
function processMovieData(movie) {
    const sBase = calculateBaseScore(movie.platformScores);
    const mqs = calculateMQS(sBase, movie.votes);
    const hypeIndex = calculateHypeIndex(movie.votes, movie.weeksSinceRelease);

    return {
        ...movie,
        sBase: parseFloat(sBase.toFixed(2)),
        mqs: parseFloat(mqs.toFixed(2)),
        hypeIndex: parseFloat(hypeIndex.toFixed(2))
    };
}

module.exports = {
    calculateBaseScore,
    calculateMQS,
    calculateHypeIndex,
    processMovieData
};
