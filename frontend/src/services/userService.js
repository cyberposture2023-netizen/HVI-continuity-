import api from './index';

const userService = {
    getProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch user profile' };
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/users/profile', profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update user profile' };
        }
    }
};

export default userService;
