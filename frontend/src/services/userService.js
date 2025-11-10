// User Service
const API_BASE_URL = 'http://localhost:5000/api';

class UserService {
    static async getUserProfile() {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/users/profile\, {
                method: 'GET',
                headers: {
                    'Authorization': \Bearer \\
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user profile');
            }

            return await response.json();
        } catch (error) {
            console.error('Get user profile error:', error);
            throw error;
        }
    }

    static async updateUserProfile(profileData) {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/users/profile\, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \Bearer \\
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user profile');
            }

            return await response.json();
        } catch (error) {
            console.error('Update user profile error:', error);
            throw error;
        }
    }

    static async changePassword(passwordData) {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/users/change-password\, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \Bearer \\
                },
                body: JSON.stringify(passwordData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            return await response.json();
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    }
}

export default UserService;
