import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Initialize axios defaults
  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier,
        password
      });

      if (response.data.success) {
        const { user, tokens } = response.data.data;
        
        // Store tokens in cookies
        Cookies.set('accessToken', tokens.accessToken, { expires: 7 }); // 7 days
        Cookies.set('refreshToken', tokens.refreshToken, { expires: 30 }); // 30 days
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
        
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true, user };
      }
    } catch (error) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);

      if (response.data.success) {
        const { user, tokens } = response.data.data;
        
        // Store tokens in cookies
        Cookies.set('accessToken', tokens.accessToken, { expires: 7 });
        Cookies.set('refreshToken', tokens.refreshToken, { expires: 30 });
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
        
        setUser(user);
        setIsAuthenticated(true);
        
        return { success: true, user };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear tokens and user data regardless of API call result
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData);
      
      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true, user: response.data.data.user };
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      const message = error.response?.data?.message || 'Profile update failed.';
      return { success: false, error: message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/change-password`, {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        return { success: true };
      }
    } catch (error) {
      console.error('Password change failed:', error);
      const message = error.response?.data?.message || 'Password change failed.';
      return { success: false, error: message };
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken
      });

      if (response.data.success) {
        const newAccessToken = response.data.data.accessToken;
        Cookies.set('accessToken', newAccessToken, { expires: 7 });
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); // Force logout if refresh fails
      return false;
    }
  };

  // Add axios response interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && error.config && !error.config._retry) {
          error.config._retry = true;
          
          const refreshed = await refreshToken();
          if (refreshed) {
            return axios(error.config);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
