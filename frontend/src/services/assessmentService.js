// Assessment Service
const API_BASE_URL = 'http://localhost:5000/api';

class AssessmentService {
    static async createAssessment(assessmentData) {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/assessments\, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \Bearer \\
                },
                body: JSON.stringify(assessmentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create assessment');
            }

            return await response.json();
        } catch (error) {
            console.error('Create assessment error:', error);
            throw error;
        }
    }

    static async getUserAssessments(userId) {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/assessments/user/\\, {
                method: 'GET',
                headers: {
                    'Authorization': \Bearer \\
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch assessments');
            }

            return await response.json();
        } catch (error) {
            console.error('Get assessments error:', error);
            throw error;
        }
    }

    static async getAssessmentById(assessmentId) {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/assessments/\\, {
                method: 'GET',
                headers: {
                    'Authorization': \Bearer \\
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch assessment');
            }

            return await response.json();
        } catch (error) {
            console.error('Get assessment error:', error);
            throw error;
        }
    }

    static async submitAssessmentAnswers(assessmentId, answers) {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/assessments/\/submit\, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \Bearer \\
                },
                body: JSON.stringify({ answers }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit assessment');
            }

            return await response.json();
        } catch (error) {
            console.error('Submit assessment error:', error);
            throw error;
        }
    }

    static async deleteAssessment(assessmentId) {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(\\/assessments/\\, {
                method: 'DELETE',
                headers: {
                    'Authorization': \Bearer \\
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete assessment');
            }

            return await response.json();
        } catch (error) {
            console.error('Delete assessment error:', error);
            throw error;
        }
    }
}

export default AssessmentService;
