import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = ({ onToggleMode }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login, loading, error, clearError } = useAuth();

    useEffect(() => {
        clearError();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            // Redirect happens automatically via AuthContext
        } catch (error) {
            // Error is handled by AuthContext
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="login-subtitle">Sign in to your HVI Continuity account</p>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-switch">
                    <p>Don't have an account? 
                        <button 
                            type="button" 
                            className="switch-button"
                            onClick={onToggleMode}
                            disabled={loading}
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
