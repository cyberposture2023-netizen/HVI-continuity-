import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import './AssessmentPage.css';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const {
    currentAssessment,
    loading,
    error,
    startAssessment,
    submitDimensionAnswers,
    getDimensionQuestions
  } = useAssessment();

  const [currentStep, setCurrentStep] = useState('overview');
  const [currentDimension, setCurrentDimension] = useState(null);
  const [dimensionQuestions, setDimensionQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const dimensions = [
    {
      id: 'behavioral',
      name: 'Behavioral Risk',
      description: 'Personal cybersecurity habits and behaviors',
      weight: 0.3
    },
    {
      id: 'technical', 
      name: 'Technical Risk',
      description: 'Device security and technical safeguards',
      weight: 0.3
    },
    {
      id: 'organizational',
      name: 'Organizational Risk', 
      description: 'Workplace security culture and policies',
      weight: 0.2
    },
    {
      id: 'environmental',
      name: 'Environmental Risk',
      description: 'Physical and digital work environment', 
      weight: 0.2
    }
  ];

  // Calculate progress based on completed dimensions
  const calculateProgress = () => {
    if (!currentAssessment) return 0;
    
    const completedDimensions = dimensions.filter(dim => 
      currentAssessment.dimensions[dim.id]?.answers?.length > 0
    ).length;
    
    return Math.round((completedDimensions / dimensions.length) * 100);
  };

  const progress = calculateProgress();

  const handleBeginAssessment = async () => {
    try {
      if (!currentAssessment) {
        await startAssessment();
      }
      setCurrentStep('dimension');
    } catch (err) {
      console.error('Failed to start assessment:', err);
    }
  };

  const handleDimensionSelect = async (dimensionId) => {
    setCurrentDimension(dimensionId);
    try {
      const questions = await getDimensionQuestions(dimensionId);
      setDimensionQuestions(questions);
      
      // Load existing answers if any
      const existingAnswers = currentAssessment?.dimensions[dimensionId]?.answers || [];
      const answerMap = {};
      existingAnswers.forEach(answer => {
        answerMap[answer.questionId] = answer.selectedOption;
      });
      setAnswers(answerMap);
      
      setCurrentStep('questions');
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
  };

  const handleAnswerSelect = (questionId, answerValue) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerValue
    }));
  };

  const handleCompleteDimension = async () => {
    if (!currentDimension || !currentAssessment) return;

    setSubmitting(true);
    try {
      // Prepare answers in the format expected by backend
      const formattedAnswers = dimensionQuestions.map(question => {
        const selectedOption = answers[question.id];
        const option = question.options.find(opt => opt.value === selectedOption);
        
        return {
          questionId: question.id,
          questionText: question.text,
          selectedOption: selectedOption,
          score: option ? option.score : 0
        };
      }).filter(answer => answer.selectedOption); // Only include answered questions

      await submitDimensionAnswers(currentDimension, formattedAnswers);
      
      setCurrentStep('dimension');
      setCurrentDimension(null);
      setDimensionQuestions([]);
      setAnswers({});
    } catch (err) {
      console.error('Failed to submit answers:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteAssessment = () => {
    // Navigate to dashboard where real scores will be displayed
    navigate('/dashboard');
  };

  const getDimensionStatus = (dimId) => {
    if (!currentAssessment) return 'not-started';
    
    const dimension = currentAssessment.dimensions[dimId];
    if (dimension?.answers?.length > 0) {
      return 'completed';
    }
    return 'not-started';
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      default: return 'Not Started';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      default: return 'status-not-started';
    }
  };

  // Show loading state
  if (loading && !currentAssessment && currentStep === 'overview') {
    return (
      <div className="assessment-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && currentStep === 'overview') {
    return (
      <div className="assessment-page">
        <div className="error-container">
          <h3>Error Loading Assessment</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render overview screen
  if (currentStep === 'overview') {
    return (
      <div className="assessment-page">
        <div className="assessment-header">
          <h1>Human Vulnerability Index Assessment</h1>
          <p>Complete this assessment to calculate your personalized HVI score across four key dimensions.</p>
        </div>

        <div className="assessment-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{progress}% Complete</div>
        </div>

        <div className="dimensions-overview">
          {dimensions.map(dimension => (
            <div key={dimension.id} className="dimension-card">
              <h3>{dimension.name}</h3>
              <p>{dimension.description}</p>
              <div className="dimension-weight">Weight: {dimension.weight * 100}%</div>
              <div className={`dimension-status ${getStatusClass(getDimensionStatus(dimension.id))}`}>
                {getStatusDisplay(getDimensionStatus(dimension.id))}
              </div>
              <button 
                className="btn-dimension"
                onClick={() => handleDimensionSelect(dimension.id)}
                disabled={getDimensionStatus(dimension.id) === 'completed'}
              >
                {getDimensionStatus(dimension.id) === 'completed' ? 'Review' : 'Start'}
              </button>
            </div>
          ))}
        </div>

        <div className="assessment-actions">
          <button className="btn-primary" onClick={handleBeginAssessment}>
            {currentAssessment ? 'Continue Assessment' : 'Begin Assessment'}
          </button>
        </div>
      </div>
    );
  }

  // Render dimension selection screen
  if (currentStep === 'dimension') {
    return (
      <div className="assessment-page">
        <div className="assessment-header">
          <h1>Select Assessment Dimension</h1>
          <p>Choose which dimension you would like to assess next.</p>
        </div>

        <div className="assessment-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{progress}% Complete</div>
        </div>

        <div className="dimensions-selection">
          {dimensions.map(dimension => (
            <div key={dimension.id} className="dimension-selection-card">
              <h3>{dimension.name}</h3>
              <p>{dimension.description}</p>
              <div className="dimension-info">
                <span className="questions-count">Multiple questions</span>
                <span className={`status-badge ${getStatusClass(getDimensionStatus(dimension.id))}`}>
                  {getStatusDisplay(getDimensionStatus(dimension.id))}
                </span>
              </div>
              {currentAssessment?.dimensions[dimension.id]?.score && (
                <div className="dimension-score">
                  Score: {currentAssessment.dimensions[dimension.id].score}/100
                </div>
              )}
              <button 
                className={`btn-dimension ${getDimensionStatus(dimension.id) === 'completed' ? 'btn-completed' : ''}`}
                onClick={() => handleDimensionSelect(dimension.id)}
              >
                {getDimensionStatus(dimension.id) === 'completed' ? 'Review' : 'Start'}
              </button>
            </div>
          ))}
        </div>

        <div className="assessment-actions">
          <button className="btn-secondary" onClick={() => setCurrentStep('overview')}>
            Back to Overview
          </button>
          {progress === 100 && (
            <button className="btn-primary" onClick={handleCompleteAssessment}>
              Complete Assessment
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render questions screen
  if (currentStep === 'questions' && currentDimension) {
    const currentDim = dimensions.find(d => d.id === currentDimension);

    return (
      <div className="assessment-page">
        <div className="assessment-header">
          <h1>{currentDim?.name}</h1>
          <p>{currentDim?.description}</p>
        </div>

        <div className="assessment-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{progress}% Complete</div>
        </div>

        <div className="questions-container">
          {dimensionQuestions.map((question, index) => (
            <div key={question.id} className="question-card">
              <h3>Question {index + 1}</h3>
              <p className="question-text">{question.text}</p>
              <div className="options-container">
                {question.options.map(option => (
                  <button
                    key={option.value}
                    className={`option-btn ${answers[question.id] === option.value ? 'option-selected' : ''}`}
                    onClick={() => handleAnswerSelect(question.id, option.value)}
                    disabled={submitting}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="assessment-actions">
          <button 
            className="btn-secondary" 
            onClick={() => setCurrentStep('dimension')}
            disabled={submitting}
          >
            Back to Dimensions
          </button>
          <button 
            className="btn-primary" 
            onClick={handleCompleteDimension}
            disabled={submitting || dimensionQuestions.some(q => !answers[q.id])}
          >
            {submitting ? 'Submitting...' : `Complete ${currentDim?.name}`}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AssessmentPage;
