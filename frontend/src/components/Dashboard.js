import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardService, AssessmentService } from '../services';
import './Dashboard.css';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [userAssessments, setUserAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();

    useEffect(() => {
        if (user) {
            loadDashboardData();
            loadUserAssessments();
        }
    }, [user]);

    const loadDashboardData = async () => {
        try {
            const data = await DashboardService.getDashboardData();
            setDashboardData(data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Continue without dashboard data
        }
    };

    const loadUserAssessments = async () => {
        try {
            setLoading(true);
            const assessments = await AssessmentService.getUserAssessments(user.userId);
            setUserAssessments(assessments);
            setError('');
        } catch (error) {
            setError('Failed to load assessments: ' + error.message);
            console.error('Error loading assessments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTakeAssessment = (assessmentId) => {
        // Navigate to assessment taking interface
        window.alert(\Starting assessment: \\nThis will open the assessment interface in the next step.\);
    };

    const handleCreateNewAssessment = async () => {
        const title = prompt('Enter assessment title:');
        if (!title) return;

        const newAssessment = {
            title: title,
            description: 'Assessment created from dashboard',
            questions: [
                {
                    questionText: 'How are you feeling today?',
                    options: ['Excellent', 'Good', 'Fair', 'Poor'],
                    correctAnswer: 1
                },
                {
                    questionText: 'How would you rate your stress level?',
                    options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
                    correctAnswer: 2
                }
            ]
        };

        try {
            const createdAssessment = await AssessmentService.createAssessment(newAssessment);
            setUserAssessments([...userAssessments, createdAssessment]);
        } catch (error) {
            setError('Failed to create assessment: ' + error.message);
            console.error('Error creating assessment:', error);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-spinner">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>HVI Continuity Platform</h1>
                    <div className="user-info">
                        <span>Welcome, {user?.username}</span>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h2>Human Vulnerability Index Assessment</h2>
                    <p>Monitor and improve your psychological well-being through comprehensive assessments.</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={loadUserAssessments} className="retry-btn">
                            Retry
                        </button>
                    </div>
                )}

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Assessments</h3>
                        <div className="stat-value">{userAssessments.length}</div>
                        <p>Assessments created</p>
                    </div>
                    <div className="stat-card">
                        <h3>Completed</h3>
                        <div className="stat-value">
                            {userAssessments.filter(a => a.completed).length}
                        </div>
                        <p>Assessments taken</p>
                    </div>
                    <div className="stat-card">
                        <h3>Progress</h3>
                        <div className="stat-value">
                            {userAssessments.length > 0 
                                ? Math.round((userAssessments.filter(a => a.completed).length / userAssessments.length) * 100) 
                                : 0
                            }%
                        </div>
                        <p>Completion rate</p>
                    </div>
                </div>

                <div className="assessments-section">
                    <div className="section-header">
                        <h3>My Assessments</h3>
                        <button 
                            className="create-assessment-btn"
                            onClick={handleCreateNewAssessment}
                        >
                            + New Assessment
                        </button>
                    </div>

                    {userAssessments.length === 0 ? (
                        <div className="empty-state">
                            <p>No assessments yet. Create your first assessment to get started.</p>
                            <button 
                                className="primary-btn"
                                onClick={handleCreateNewAssessment}
                            >
                                Create First Assessment
                            </button>
                        </div>
                    ) : (
                        <div className="assessments-list">
                            {userAssessments.map((assessment) => (
                                <div key={assessment._id} className="assessment-item">
                                    <div className="assessment-info">
                                        <h4>{assessment.title}</h4>
                                        <p>{assessment.description || 'No description'}</p>
                                        <div className="assessment-meta">
                                            <span>Questions: {assessment.questions?.length || 0}</span>
                                            <span>Created: {new Date(assessment.createdAt).toLocaleDateString()}</span>
                                            {assessment.completed && (
                                                <span className="completed-badge">Completed</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="assessment-actions">
                                        {!assessment.completed && (
                                            <button 
                                                className="action-btn primary"
                                                onClick={() => handleTakeAssessment(assessment._id)}
                                            >
                                                Take Assessment
                                            </button>
                                        )}
                                        <button 
                                            className="action-btn secondary"
                                            onClick={() => window.alert('View results for: ' + assessment.title)}
                                        >
                                            View Results
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
