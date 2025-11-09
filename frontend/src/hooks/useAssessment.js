import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useAssessment = () => {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start a new assessment
  const startAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.startAssessment();
      setCurrentAssessment(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start assessment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Submit answers for a dimension
  const submitDimensionAnswers = async (assessmentId, dimension, answers) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.submitDimensionAnswers(assessmentId, dimension, answers);
      setCurrentAssessment(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get current assessment
  const getCurrentAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCurrentAssessment();
      setCurrentAssessment(response.data);
      return response.data;
    } catch (err) {
      // It's okay if no current assessment exists
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to fetch assessment');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get questions for a dimension
  const getQuestionsByDimension = async (dimension) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getQuestionsByDimension(dimension);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get assessment results
  const getAssessmentResults = async (assessmentId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAssessmentResults(assessmentId);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch assessment results');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear current assessment
  const clearCurrentAssessment = () => {
    setCurrentAssessment(null);
    setError(null);
  };

  useEffect(() => {
    // Load current assessment when hook is initialized
    getCurrentAssessment();
  }, []);

  return {
    currentAssessment,
    loading,
    error,
    startAssessment,
    submitDimensionAnswers,
    getCurrentAssessment,
    getQuestionsByDimension,
    getAssessmentResults,
    clearCurrentAssessment
  };
};

export default useAssessment;
