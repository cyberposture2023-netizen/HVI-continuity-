import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AssessmentService } from '../services';
import './AssessmentTake.css';

const AssessmentTake = () => {
    const { assessmentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [assessment, setAssessment] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (assessmentId) {
            loadAssessment();
        }
    }, [assessmentId]);

    const loadAssessment = async () => {
        try {
            setLoading(true);
            const assessmentData = await AssessmentService.getAssessmentById(assessmentId);
            setAssessment(assessmentData);
            setError('');
        } catch (error) {
            setError('Failed to load assessment: ' + error.message);
            console.error('Error loading assessment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < assessment.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitAssessment = async () => {
        if (!window.confirm('Are you sure you want to submit this assessment? You cannot change your answers after submission.')) {
            return;
        }

        try {
            setSubmitting(true);
            const submissionData = {
                assessmentId: assessmentId,
                answers: answers,
                submittedAt: new Date().toISOString(),
                userId: user.userId
            };

            const result = await AssessmentService.submitAssessmentAnswers(assessmentId, answers);
            
            // Navigate to results page
            navigate(`/assessment/${assessmentId}/results`, { 
                state: { 
                    results: result,
                    assessment: assessment
                }
            });
        } catch (error) {
            setError('Failed to submit assessment: ' + error.message);
            console.error('Error submitting assessment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const calculateProgress = () => {
        if (!assessment) return 0;
        return ((currentQuestionIndex + 1) / assessment.questions.length) * 100;
    };

    const calculateAnsweredCount = () => {
        return Object.keys(answers).length;
    };

    if (loading) {
        return (
            <div className="assessment-taking-container">
                <div className="loading-spinner">Loading assessment...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="assessment-taking-container">
                <div className="error-message">
                    {error}
                    <button onClick={loadAssessment} className="retry-btn">Retry</button>
                    <button onClick={() => navigate('/dashboard')} className="back-btn">Back to Dashboard</button>
                </div>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="assessment-taking-container">
                <div className="error-message">
                    Assessment not found.
                    <button onClick={() => navigate('/dashboard')} className="back-btn">Back to Dashboard</button>
                </div>
            </div>
        );
    }

    const currentQuestion = assessment.questions[currentQuestionIndex];

    return (
        <div className="assessment-taking-container">
            <header className="assessment-header">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="back-button"
                >
                    ← Back to Dashboard
                </button>
                <h1>{assessment.title}</h1>
                <div className="assessment-meta">
                    <span>Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
                </div>
            </header>

            <div className="progress-container">
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ width: `${calculateProgress()}%` }}
                    ></div>
                </div>
                <div className="progress-stats">
                    <span>{calculateAnsweredCount()} of {assessment.questions.length} answered</span>
                    <span>{Math.round(calculateProgress())}% complete</span>
                </div>
            </div>

            <div className="question-container">
                <div className="question-header">
                    <h2>{currentQuestion.questionText}</h2>
                    <div className="question-number">
                        Question {currentQuestionIndex + 1}
                    </div>
                </div>

                <div className="options-container">
                    {currentQuestion.options.map((option, optionIndex) => (
                        <div 
                            key={optionIndex}
                            className={`option-card ${answers[currentQuestionIndex] === optionIndex ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                        >
                            <div className="option-indicator">
                                {answers[currentQuestionIndex] === optionIndex ? '✓' : String.fromCharCode(65 + optionIndex)}
                            </div>
                            <div className="option-text">{option}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="navigation-container">
                <button 
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="nav-button prev-button"
                >
                    ← Previous
                </button>

                <div className="navigation-center">
                    <button 
                        onClick={() => {
                            const unanswered = assessment.questions.findIndex((_, index) => !answers.hasOwnProperty(index));
                            if (unanswered !== -1) {
                                setCurrentQuestionIndex(unanswered);
                            }
                        }}
                        disabled={calculateAnsweredCount() === assessment.questions.length}
                        className="jump-to-unanswered"
                    >
                        Jump to First Unanswered
                    </button>
                </div>

                {currentQuestionIndex === assessment.questions.length - 1 ? (
                    <button 
                        onClick={handleSubmitAssessment}
                        disabled={calculateAnsweredCount() !== assessment.questions.length || submitting}
                        className="nav-button submit-button"
                    >
                        {submitting ? 'Submitting...' : 'Submit Assessment'}
                    </button>
                ) : (
                    <button 
                        onClick={handleNextQuestion}
                        className="nav-button next-button"
                    >
                        Next →
                    </button>
                )}
            </div>

            <div className="quick-navigation">
                <h4>Question Navigation</h4>
                <div className="question-dots">
                    {assessment.questions.map((_, index) => (
                        <button
                            key={index}
                            className={`question-dot ${currentQuestionIndex === index ? 'active' : ''} ${answers.hasOwnProperty(index) ? 'answered' : 'unanswered'}`}
                            onClick={() => setCurrentQuestionIndex(index)}
                            title={`Question ${index + 1}: ${answers.hasOwnProperty(index) ? 'Answered' : 'Unanswered'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AssessmentTake;