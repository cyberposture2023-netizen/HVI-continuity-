import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { assessmentService } from '../services';
import './AssessmentTake.css';

const AssessmentTake = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const assessmentData = await assessmentService.getAssessment(assessmentId);
      setAssessment(assessmentData);
    } catch (err) {
      setError('Failed to load assessment');
      console.error('Error fetching assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit this assessment? This action cannot be undone.')) {
      try {
        setSubmitting(true);
        const result = await assessmentService.submitAssessment(assessmentId, answers);
        navigate(`/assessment-results/${assessmentId}`, { state: { results: result } });
      } catch (err) {
        setError('Failed to submit assessment');
        console.error('Error submitting assessment:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="assessment-loading">
        <div className="loading-spinner"></div>
        <p>Loading assessment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assessment-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="assessment-not-found">
        <h2>Assessment Not Found</h2>
        <p>The requested assessment could not be found.</p>
        <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  return (
    <div className="assessment-take">
      <header className="assessment-header">
        <h1>{assessment.title}</h1>
        <p>{assessment.description}</p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Question {currentQuestionIndex + 1} of {assessment.questions.length}
        </div>
      </header>

      <div className="question-container">
        <div className="question-card">
          <h3 className="question-text">{currentQuestion.questionText}</h3>
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={option}
                  checked={answers[currentQuestion._id] === option}
                  onChange={() => handleAnswerSelect(currentQuestion._id, option)}
                  className="option-input"
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="navigation-buttons">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary"
          >
            Previous
          </button>
          
          {currentQuestionIndex === assessment.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || !answers[currentQuestion._id]}
              className="btn-primary"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion._id]}
              className="btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>

      <div className="question-indicators">
        {assessment.questions.map((question, index) => (
          <button
            key={question._id}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`indicator ${index === currentQuestionIndex ? 'active' : ''} ${
              answers[question._id] ? 'answered' : ''
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssessmentTake;