import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from './api';

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

  // Check if user is logged in on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // This would typically verify token with backend
      const token = localStorage.getItem('authToken');
      if (token) {
        // For now, set a mock user until backend auth is implemented
        setUser({
          id: '1',
          username: 'demo-user',
          email: 'demo@hvi.com',
          department: 'IT'
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Mock login - replace with actual API call when backend auth is ready
      if (email && password) {
        const mockUser = {
          id: '1',
          username: email.split('@')[0],
          email: email,
          department: 'IT'
        };
        
        setUser(mockUser);
        localStorage.setItem('authToken', 'mock-token');
        return { success: true, user: mockUser };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      // Mock registration - replace with actual API call when backend auth is ready
      const mockUser = {
        id: '1',
        username: userData.username,
        email: userData.email,
        department: userData.department || 'General'
      };
      
      setUser(mockUser);
      localStorage.setItem('authToken', 'mock-token');
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
