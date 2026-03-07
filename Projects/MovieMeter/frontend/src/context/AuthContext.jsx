import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWatchlist } from './WatchlistContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const { setWatchlist } = useWatchlist();

    // Initial load from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('mm_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = () => {
        const mockUser = { name: "Ashutosh", role: "User" };
        setUser(mockUser);
        localStorage.setItem('mm_user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mm_user');
        setWatchlist([]);
        localStorage.removeItem('moviemeter_watchlist');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
