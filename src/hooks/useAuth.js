// src/hooks/useAuth.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on initial load
    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem('token');

                if (token) {
                    const response = await authApi.getProfile();
                    setUser(response.data);
                }
            } catch (err) {
                // Token might be expired or invalid
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    // Register user
    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authApi.register(userData);
            localStorage.setItem('token', response.data.token);
            setUser(response.data);

            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Đăng ký không thành công');
            setLoading(false);
            return false;
        }
    };

    // Login user
    const login = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authApi.login(userData);
            localStorage.setItem('token', response.data.token);
            setUser(response.data);

            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Đăng nhập không thành công');
            setLoading(false);
            return false;
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}