import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AssessmentService } from '../services';
import './AssessmentResults.css';

const AssessmentResults = () => {
    const { assessmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    
    const [results, setResults] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('summary');

    // Get results from navigation state or load from API
    useEffect(() => {
        if (location.state?.results) {
            setResults(location.state.results);
            setAssessment(location.state.assessment);
            setLoading(false);
        } else if (assessmentId) {
            loadResults();
        }
    }, [assessmentId, location.state]);

    const loadResults = async () => {
        try {
            setLoading(true);
            // In a real implementation, this would fetch results from an API endpoint
            const assessmentData = await AssessmentService.getAssessmentById(assessmentId);
            setAssessment(assessmentData);
            
            // For now, we'll simulate results based on the assessment
            const simulatedResults = simulateResults(assessmentData);
            setResults(simulatedResults);
            setError('');
        } catch (error) {
            setError('Failed to load results: ' + error.message);
            console.error('Error loading results:', error);
        } finally {
            setLoading(false);
        }
    };

    const simulateResults = (assessmentData) => {
        const questions = assessmentData.questions || [];
        const userAnswers = {};
        const correctAnswers = {};
        let score = 0;

        questions.forEach((question, index) => {
            // Simulate user answers (in real app, these come from submission)
            userAnswers[index] = Math.floor(Math.random() * question.options.length);
            correctAnswers[index] = question.correctAnswer;
            
            if (userAnswers[index] === question.correctAnswer) {
                score++;
            }
        });

        return {
            score: score,
            totalQuestions: questions.length,
            percentage: Math.round((score / questions.length) * 100),
            userAnswers: userAnswers,
            correctAnswers: correctAnswers,
            submittedAt: new Date().toISOString(),
            timeSpent: Math.floor(Math.random() * 300) + 60, // 1-5 minutes in seconds
            recommendations: generateRecommendations(score, questions.length)
        };
    };

    const generateRecommendations = (score, totalQuestions) => {
        const percentage = (score / totalQuestions) * 100;
        
        if (percentage >= 80) {
            return [
                'Excellent performance! Your psychological well-being appears strong.',
                'Consider maintaining your current self-care routines.',
                'You might explore advanced assessment modules for deeper insights.'
            ];
        } else if (percentage >= 60) {
            return [
                'Good performance with room for improvement.',
                'Consider incorporating daily mindfulness practices.',
                'Regular exercise can help improve overall well-being.'
            ];
        } else {
            return [
                'This assessment indicates areas for improvement.',
                'Consider speaking with a mental health professional.',
                'Practice stress management techniques daily.',
                'Establish a consistent sleep schedule.'
            ];
        }
    };

    const calculateCategoryScores = () => {
        if (!assessment || !results) return [];
        
        // Group questions by category (in real app, questions would have categories)
        const categories = {};
        assessment.questions.forEach((question, index) => {
            const category = question.category || 'General Well-being';
            if (!categories[category]) {
                categories[category] = {
                    name: category,
                    correct: 0,
                    total: 0
                };
            }
            categories[category].total++;
            if (results.userAnswers[index] === question.correctAnswer) {
                categories[category].correct++;
            }
        });

        return Object.values(categories).map(cat => ({
            ...cat,
            percentage: Math.round((cat.correct / cat.total) * 100)
        }));
    };

    if (loading) {
        return (
            <div className="results-container">
                <div className="loading-spinner">Loading results...</div>
            </div>
        );
    }

    if (error || !results || !assessment) {
        return (
            <div className="results-container">
                <div className="error-message">
                    {error || 'Results not available'}
                    <button onClick={() => navigate('/dashboard')} className="back-btn">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const categoryScores = calculateCategoryScores();

    return (
        <div className="results-container">
            <header className="results-header">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="back-button"
                >
                    ← Back to Dashboard
                </button>
                <h1>Assessment Results</h1>
                <div className="assessment-info">
                    <h2>{assessment.title}</h2>
                    <p>Completed on {new Date(results.submittedAt).toLocaleDateString()}</p>
                </div>
            </header>

            <div className="results-content">
                {/* Score Summary */}
                <div className="score-summary">
                    <div className="score-circle">
                        <div className="score-value">{results.percentage}%</div>
                        <div className="score-label">Overall Score</div>
                    </div>
                    <div className="score-details">
                        <div className="score-item">
                            <span className="label">Correct Answers:</span>
                            <span className="value">{results.score} / {results.totalQuestions}</span>
                        </div>
                        <div className="score-item">
                            <span className="label">Time Spent:</span>
                            <span className="value">{Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s</span>
                        </div>
                        <div className="score-item">
                            <span className="label">Completion Date:</span>
                            <span className="value">{new Date(results.submittedAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="results-tabs">
                    <button 
                        className={\	ab-button \\}
                        onClick={() => setActiveTab('summary')}
                    >
                        Summary
                    </button>
                    <button 
                        className={\	ab-button \\}
                        onClick={() => setActiveTab('details')}
                    >
                        Question Details
                    </button>
                    <button 
                        className={\	ab-button \\}
                        onClick={() => setActiveTab('recommendations')}
                    >
                        Recommendations
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'summary' && (
                        <div className="summary-tab">
                            <h3>Performance Summary</h3>
                            <div className="category-scores">
                                {categoryScores.map((category, index) => (
                                    <div key={index} className="category-score">
                                        <div className="category-name">{category.name}</div>
                                        <div className="category-progress">
                                            <div 
                                                className="progress-bar"
                                                style={{ width: \\%\ }}
                                            ></div>
                                        </div>
                                        <div className="category-percentage">{category.percentage}%</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="performance-insights">
                                <h4>Performance Insights</h4>
                                <div className="insight-cards">
                                    <div className={\insight-card \\}>
                                        <div className="insight-icon">
                                            {results.percentage >= 80 ? '⭐' : results.percentage >= 60 ? '✓' : '💡'}
                                        </div>
                                        <div className="insight-text">
                                            <strong>
                                                {results.percentage >= 80 ? 'Excellent' : results.percentage >= 60 ? 'Good' : 'Needs Improvement'}
                                            </strong>
                                            <p>
                                                {results.percentage >= 80 
                                                    ? 'You demonstrated strong understanding across all areas.' 
                                                    : results.percentage >= 60 
                                                    ? 'You have a good foundation with some areas for growth.'
                                                    : 'Focus on the recommended areas to improve your well-being.'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="details-tab">
                            <h3>Question-by-Question Review</h3>
                            <div className="questions-review">
                                {assessment.questions.map((question, index) => (
                                    <div 
                                        key={index} 
                                        className={\question-review \\}
                                    >
                                        <div className="question-header">
                                            <h4>Question {index + 1}</h4>
                                            <span className={\esult-badge \\}>
                                                {results.userAnswers[index] === question.correctAnswer ? 'Correct' : 'Incorrect'}
                                            </span>
                                        </div>
                                        <p className="question-text">{question.questionText}</p>
                                        <div className="answer-comparison">
                                            <div className=\"user-answer\">
                                                <strong>Your Answer:</strong>
                                                <span>{question.options[results.userAnswers[index]]}</span>
                                            </div>
                                            {results.userAnswers[index] !== question.correctAnswer && (
                                                <div className=\"correct-answer\">
                                                    <strong>Correct Answer:</strong>
                                                    <span>{question.options[question.correctAnswer]}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'recommendations' && (
                        <div className="recommendations-tab">
                            <h3>Personalized Recommendations</h3>
                            <div className="recommendations-list">
                                {results.recommendations.map((recommendation, index) => (
                                    <div key={index} className="recommendation-item">
                                        <div className="recommendation-number">{index + 1}</div>
                                        <div className="recommendation-text">{recommendation}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="next-steps">
                                <h4>Next Steps</h4>
                                <div className="action-buttons">
                                    <button 
                                        className=\"action-button primary\"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        Return to Dashboard
                                    </button>
                                    <button 
                                        className=\"action-button secondary\"
                                        onClick={() => window.alert('Retake assessment feature coming soon!')}
                                    >
                                        Retake Assessment
                                    </button>
                                    <button 
                                        className=\"action-button secondary\"
                                        onClick={() => window.alert('Export feature coming soon!')}
                                    >
                                        Export Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssessmentResults;
