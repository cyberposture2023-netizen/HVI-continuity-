// Dashboard Service
const API_BASE_URL = 'http://localhost:5000/api';

class DashboardService {
    static async getDashboardData() {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/dashboard\, {
                method: 'GET',
                headers: {
                    'Authorization': \Bearer \\
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch dashboard data');
            }

            return await response.json();
        } catch (error) {
            console.error('Get dashboard data error:', error);
            throw error;
        }
    }

    static async getUserProgress() {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/dashboard/progress\, {
                method: 'GET',
                headers: {
                    'Authorization': \Bearer \\
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user progress');
            }

            return await response.json();
        } catch (error) {
            console.error('Get user progress error:', error);
            throw error;
        }
    }

    static async getAssessmentStats() {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/dashboard/stats\, {
                method: 'GET',
                headers: {
                    'Authorization': \Bearer \\
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch assessment stats');
            }

            return await response.json();
        } catch (error) {
            console.error('Get assessment stats error:', error);
            throw error;
        }
    }
}

export default DashboardService;
