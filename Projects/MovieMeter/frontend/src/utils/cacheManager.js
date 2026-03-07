export const getCachedData = (key, ttlHours) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < ttlHours * 60 * 60 * 1000) return data;
    localStorage.removeItem(key);
    return null;
};

export const setCachedData = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};
