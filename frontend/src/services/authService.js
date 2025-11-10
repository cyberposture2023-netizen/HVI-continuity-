// Authentication Service
const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
    static async register(userData) {
        try {
            const response = await fetch(\\/auth/register\, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    static async login(credentials) {
        try {
            const response = await fetch(\\/auth/login\, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            
            // Store token and user data in localStorage
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify({
                    userId: data.userId,
                    username: data.username,
                    email: data.email
                }));
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
    }

    static getAuthToken() {
        return localStorage.getItem('authToken');
    }

    static getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    static isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    static async verifyToken() {
        const token = this.getAuthToken();
        if (!token) return false;

        try {
            const response = await fetch(\\/auth/verify\, {
                method: 'GET',
                headers: {
                    'Authorization': \Bearer \\
                }
            });

            return response.ok;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    }
}

export default AuthService;
