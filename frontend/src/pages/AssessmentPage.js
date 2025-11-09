import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AssessmentPage.css';

const AssessmentPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('overview'); // overview, dimension, questions, completion
  const [currentDimension, setCurrentDimension] = useState(null);
  const [progress, setProgress] = useState(0);
  const [dimensionStatus, setDimensionStatus] = useState({
    d1: 'not-started',
    d2: 'not-started',
    d3: 'not-started',
    d4: 'not-started'
  });

  const dimensions = [
    {
      id: 'd1',
      name: 'Behavioral Risk',
      description: 'Personal cybersecurity habits and behaviors',
      questions: [
        {
          id: 'd1q1',
          text: 'How often do you click on links or attachments in unsolicited emails?',
          options: [
            { value: 'never', label: 'Never', score: 0 },
            { value: 'rarely', label: 'Rarely', score: 1 },
            { value: 'sometimes', label: 'Sometimes', score: 2 },
            { value: 'often', label: 'Often', score: 3 },
            { value: 'always', label: 'Always', score: 4 }
          ]
        },
        {
          id: 'd1q2',
          text: 'Do you use the same password for multiple accounts?',
          options: [
            { value: 'never', label: 'Never', score: 0 },
            { value: 'few', label: 'A few accounts', score: 2 },
            { value: 'many', label: 'Many accounts', score: 3 },
            { value: 'all', label: 'All accounts', score: 4 }
          ]
        }
      ]
    },
    {
      id: 'd2',
      name: 'Technical Risk',
      description: 'Device security and technical safeguards',
      questions: [
        {
          id: 'd2q1',
          text: 'Is multi-factor authentication (MFA) enabled on all your corporate accounts?',
          options: [
            { value: 'all', label: 'All accounts', score: 0 },
            { value: 'most', label: 'Most accounts', score: 1 },
            { value: 'some', label: 'Some accounts', score: 2 },
            { value: 'none', label: 'No accounts', score: 4 }
          ]
        }
      ]
    },
    {
      id: 'd3',
      name: 'Organizational Risk',
      description: 'Workplace security culture and policies',
      questions: [
        {
          id: 'd3q1',
          text: 'Has your department conducted cybersecurity training in the last 6 months?',
          options: [
            { value: 'yes_recent', label: 'Yes, within 3 months', score: 0 },
            { value: 'yes_6months', label: 'Yes, within 6 months', score: 1 },
            { value: 'yes_year', label: 'Yes, over a year ago', score: 2 },
            { value: 'no', label: 'No training', score: 4 }
          ]
        }
      ]
    },
    {
      id: 'd4',
      name: 'Environmental Risk',
      description: 'Physical and digital work environment',
      questions: [
        {
          id: 'd4q1',
          text: 'Do you work primarily from a public, unsecured Wi-Fi network?',
          options: [
            { value: 'never', label: 'Never', score: 0 },
            { value: 'rarely', label: 'Rarely', score: 1 },
            { value: 'sometimes', label: 'Sometimes', score: 2 },
            { value: 'often', label: 'Often', score: 3 },
            { value: 'always', label: 'Always', score: 4 }
          ]
        }
      ]
    }
  ];

  const [answers, setAnswers] = useState({});

  const handleBeginAssessment = () => {
    setCurrentStep('dimension');
  };

  const handleDimensionSelect = (dimensionId) => {
    setCurrentDimension(dimensionId);
    setCurrentStep('questions');
  };

  const handleAnswerSelect = (questionId, answerValue, score) => {
    const newAnswers = {
      ...answers,
      [questionId]: {
        value: answerValue,
        score: score,
        dimension: currentDimension
      }
    };
    setAnswers(newAnswers);
    
    // Update progress
    const totalQuestions = dimensions.reduce((total, dim) => total + dim.questions.length, 0);
    const answeredQuestions = Object.keys(newAnswers).length;
    const newProgress = Math.round((answeredQuestions / totalQuestions) * 100);
    setProgress(newProgress);

    // Update dimension status if all questions in current dimension are answered
    const currentDimQuestions = dimensions.find(d => d.id === currentDimension)?.questions || [];
    const answeredInCurrentDim = currentDimQuestions.filter(q => newAnswers[q.id]).length;
    if (answeredInCurrentDim === currentDimQuestions.length) {
      setDimensionStatus(prev => ({
        ...prev,
        [currentDimension]: 'completed'
      }));
    }
  };

  const handleCompleteDimension = () => {
    setCurrentStep('dimension');
    setCurrentDimension(null);
  };

  const handleCompleteAssessment = () => {
    // Calculate scores and navigate to dashboard
    console.log('Assessment answers:', answers);
    navigate('/dashboard');
  };

  const getCurrentDimension = () => {
    return dimensions.find(d => d.id === currentDimension);
  };

  const getDimensionStatus = (dimId) => {
    return dimensionStatus[dimId] || 'not-started';
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
              <h3>D{dimension.id.slice(1)}: {dimension.name}</h3>
              <p>{dimension.description}</p>
              <div className={`dimension-status ${getStatusClass(getDimensionStatus(dimension.id))}`}>
                {getStatusDisplay(getDimensionStatus(dimension.id))}
              </div>
              <button 
                className="btn-dimension"
                onClick={() => handleDimensionSelect(dimension.id)}
                disabled={getDimensionStatus(dimension.id) === 'completed'}
              >
                {getDimensionStatus(dimension.id) === 'completed' ? 'Completed' : 'Start'}
              </button>
            </div>
          ))}
        </div>

        <div className="assessment-actions">
          <button className="btn-primary" onClick={handleBeginAssessment}>
            Begin Assessment
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
              <h3>D{dimension.id.slice(1)}: {dimension.name}</h3>
              <p>{dimension.description}</p>
              <div className="dimension-info">
                <span className="questions-count">{dimension.questions.length} questions</span>
                <span className={`status-badge ${getStatusClass(getDimensionStatus(dimension.id))}`}>
                  {getStatusDisplay(getDimensionStatus(dimension.id))}
                </span>
              </div>
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
    const dimension = getCurrentDimension();
    const currentQuestions = dimension?.questions || [];

    return (
      <div className="assessment-page">
        <div className="assessment-header">
          <h1>D{currentDimension.slice(1)}: {dimension?.name}</h1>
          <p>{dimension?.description}</p>
        </div>

        <div className="assessment-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{progress}% Complete</div>
        </div>

        <div className="questions-container">
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="question-card">
              <h3>Question {index + 1}</h3>
              <p className="question-text">{question.text}</p>
              <div className="options-container">
                {question.options.map(option => (
                  <button
                    key={option.value}
                    className={`option-btn ${answers[question.id]?.value === option.value ? 'option-selected' : ''}`}
                    onClick={() => handleAnswerSelect(question.id, option.value, option.score)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="assessment-actions">
          <button className="btn-secondary" onClick={() => setCurrentStep('dimension')}>
            Back to Dimensions
          </button>
          <button className="btn-primary" onClick={handleCompleteDimension}>
            Complete {dimension?.name}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AssessmentPage;
