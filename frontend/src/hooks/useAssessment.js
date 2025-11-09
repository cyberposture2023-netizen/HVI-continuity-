import { useState, useEffect } from 'react';
import { assessmentAPI, questionsAPI } from '../services/api';

export const useAssessment = () => {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start a new assessment
  const startAssessment = async (assessmentData = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentAPI.startAssessment(assessmentData);
      setCurrentAssessment(response.data.assessment);
      return response.data.assessment;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start assessment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Submit answers for a dimension
  const submitDimensionAnswers = async (dimension, answers) => {
    if (!currentAssessment) {
      throw new Error('No active assessment found');
    }

    setLoading(true);
    setError(null);
    try {
      const response = await assessmentAPI.submitDimensionAnswers(
        currentAssessment._id, 
        dimension, 
        answers
      );
      
      // Update current assessment with new scores
      if (response.data.isComplete) {
        // Assessment is complete, refresh the entire assessment
        const updatedAssessment = await assessmentAPI.getAssessment(currentAssessment._id);
        setCurrentAssessment(updatedAssessment.data.assessment);
      } else {
        // Update just the dimension that was completed
        setCurrentAssessment(prev => ({
          ...prev,
          dimensions: {
            ...prev.dimensions,
            [dimension]: {
              ...prev.dimensions[dimension],
              score: response.data.dimensionScore,
              answers: answers,
              completedAt: new Date()
            }
          },
          overallScore: response.data.overallScore
        }));
      }
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load current assessment
  const loadCurrentAssessment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentAPI.getCurrentAssessment();
      setCurrentAssessment(response.data.assessment);
      return response.data.assessment;
    } catch (err) {
      if (err.response?.status === 404) {
        // No current assessment found, which is fine
        setCurrentAssessment(null);
      } else {
        setError(err.response?.data?.message || 'Failed to load assessment');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get questions for a dimension
  const getDimensionQuestions = async (dimension) => {
    setLoading(true);
    setError(null);
    try {
      const response = await questionsAPI.getDimensionQuestions(dimension);
      return response.data.questions;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear current assessment
  const clearAssessment = () => {
    setCurrentAssessment(null);
    setError(null);
  };

  // Load assessment on hook initialization
  useEffect(() => {
    loadCurrentAssessment();
  }, []);

  return {
    currentAssessment,
    loading,
    error,
    startAssessment,
    submitDimensionAnswers,
    loadCurrentAssessment,
    getDimensionQuestions,
    clearAssessment
  };
};
