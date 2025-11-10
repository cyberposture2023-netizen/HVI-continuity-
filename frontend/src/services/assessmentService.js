import api from './index';

const assessmentService = {
    getAllAssessments: async () => {
        try {
            const response = await api.get('/assessments');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch assessments' };
        }
    },

    getAssessment: async (id) => {
        try {
            const response = await api.get(`/assessments/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch assessment' };
        }
    },

    createAssessment: async (assessmentData) => {
        try {
            const response = await api.post('/assessments', assessmentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create assessment' };
        }
    },

    updateAssessment: async (id, assessmentData) => {
        try {
            const response = await api.put(`/assessments/${id}`, assessmentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update assessment' };
        }
    },

    deleteAssessment: async (id) => {
        try {
            const response = await api.delete(`/assessments/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete assessment' };
        }
    },

    getAssessmentQuestions: async (assessmentId) => {
        try {
            const response = await api.get(`/questions/assessment/${assessmentId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch assessment questions' };
        }
    }
};

export default assessmentService;
