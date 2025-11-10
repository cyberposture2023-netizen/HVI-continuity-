import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../services';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const userData = AuthService.getUserData();
            const token = AuthService.getAuthToken();
            
            if (token && userData) {
                const isValid = await AuthService.verifyToken();
                if (isValid) {
                    setUser(userData);
                } else {
                    AuthService.logout();
                }
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            AuthService.logout();
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError('');
        try {
            const result = await AuthService.register(userData);
            setLoading(false);
            return result;
        } catch (error) {
            setError(error.message);
            setLoading(false);
            throw error;
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError('');
        try {
            const result = await AuthService.login(credentials);
            setUser(AuthService.getUserData());
            setLoading(false);
            return result;
        } catch (error) {
            setError(error.message);
            setLoading(false);
            throw error;
        }
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
        setError('');
    };

    const clearError = () => {
        setError('');
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        clearError,
        isAuthenticated: AuthService.isAuthenticated()
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
