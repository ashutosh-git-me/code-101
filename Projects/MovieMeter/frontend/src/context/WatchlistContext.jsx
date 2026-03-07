import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export function useWatchlist() {
    return useContext(WatchlistContext);
}

export function WatchlistProvider({ children }) {
    const [watchlist, setWatchlist] = useState(() => {
        try {
            const items = window.localStorage.getItem('moviemeter_watchlist');
            return items ? JSON.parse(items) : [];
        } catch (error) {
            console.error('Failed to parse watchlist from local storage', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('moviemeter_watchlist', JSON.stringify(watchlist));
        } catch (error) {
            console.error('Failed to save watchlist to local storage', error);
        }
    }, [watchlist]);

    const addToWatchlist = (item) => {
        setWatchlist((prev) => {
            if (!prev.find(i => i.id === item.id)) {
                return [...prev, { id: item.id, mediaType: item.mediaType }];
            }
            return prev;
        });
    };

    const removeFromWatchlist = (movieId) => {
        setWatchlist((prev) => prev.filter((item) => item.id !== movieId));
    };

    const isInWatchlist = (movieId) => {
        return watchlist.some(item => item.id === movieId);
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, setWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
}
