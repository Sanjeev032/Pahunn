import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkLoggedIn = async () => {
            // We don't check for token in localStorage here. 
            // We force a getMe() call. 
            // If we have an accessToken, it's attached. 
            // If not, we get 401. 
            // The client.js interceptor catches 401, matches cookie (refreshToken), 
            // gets new accessToken, saves it, and retries getMe().
            // If that fails, we are truly logged out.

            try {
                const res = await authApi.getMe();
                if (res.data.success) {
                    setUser(res.data.data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Session check failed", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authApi.login({ email, password });
            if (res.data.success) {
                localStorage.setItem('accessToken', res.data.accessToken); // Store new key

                const userRes = await authApi.getMe();
                setUser(userRes.data.data);
                return { success: true };
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authApi.register(userData);
            if (res.data.success) {
                localStorage.setItem('accessToken', res.data.accessToken);
                const userRes = await authApi.getMe();
                setUser(userRes.data.data);
                return { success: true };
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            return { success: false, error: err.response?.data?.error || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authApi.logout();
            localStorage.removeItem('accessToken');
            setUser(null);
        } catch (err) {
            console.error('Logout failed', err);
            localStorage.removeItem('accessToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
