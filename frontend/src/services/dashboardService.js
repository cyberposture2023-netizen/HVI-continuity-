import api from './index';

const dashboardService = {
    getDashboardData: async () => {
        try {
            const response = await api.get('/dashboard');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch dashboard data' };
        }
    },

    getDashboardStats: async () => {
        try {
            const response = await api.get('/dashboard/stats');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
        }
    }
};

export default dashboardService;
