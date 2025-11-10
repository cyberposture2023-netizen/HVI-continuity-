import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AssessmentService } from '../services';
import './UserAssessments.css';

const UserAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadUserAssessments();
        }
    }, [user]);

    const loadUserAssessments = async () => {
        try {
            setLoading(true);
            const userAssessments = await AssessmentService.getUserAssessments(user.userId);
            setAssessments(userAssessments);
            setError('');
        } catch (error) {
            setError('Failed to load assessments: ' + error.message);
            console.error('Error loading assessments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAssessment = async (assessmentId) => {
        if (!window.confirm('Are you sure you want to delete this assessment?')) {
            return;
        }

        try {
            await AssessmentService.deleteAssessment(assessmentId);
            setAssessments(assessments.filter(assessment => assessment._id !== assessmentId));
        } catch (error) {
            setError('Failed to delete assessment: ' + error.message);
            console.error('Error deleting assessment:', error);
        }
    };

    const handleCreateAssessment = async () => {
        const title = prompt('Enter assessment title:');
        if (!title) return;

        const newAssessment = {
            title: title,
            description: 'New assessment created via dashboard',
            questions: [
                {
                    questionText: 'Sample question?',
                    options: ['Option 1', 'Option 2', 'Option 3'],
                    correctAnswer: 0
                }
            ]
        };

        try {
            const createdAssessment = await AssessmentService.createAssessment(newAssessment);
            setAssessments([...assessments, createdAssessment]);
        } catch (error) {
            setError('Failed to create assessment: ' + error.message);
            console.error('Error creating assessment:', error);
        }
    };

    if (loading) {
        return (
            <div className="assessments-container">
                <div className="loading-spinner">Loading assessments...</div>
            </div>
        );
    }

    return (
        <div className="assessments-container">
            <div className="assessments-header">
                <h2>My Assessments</h2>
                <button 
                    className="create-assessment-btn"
                    onClick={handleCreateAssessment}
                >
                    + Create New Assessment
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={loadUserAssessments} className="retry-btn">
                        Retry
                    </button>
                </div>
            )}

            {assessments.length === 0 ? (
                <div className="no-assessments">
                    <p>No assessments found.</p>
                    <button 
                        className="create-first-assessment"
                        onClick={handleCreateAssessment}
                    >
                        Create Your First Assessment
                    </button>
                </div>
            ) : (
                <div className="assessments-grid">
                    {assessments.map((assessment) => (
                        <div key={assessment._id} className="assessment-card">
                            <div className="assessment-header">
                                <h3>{assessment.title}</h3>
                                <div className="assessment-actions">
                                    <button 
                                        className="action-btn view-btn"
                                        onClick={() => window.alert('View assessment: ' + assessment.title)}
                                    >
                                        View
                                    </button>
                                    <button 
                                        className="action-btn delete-btn"
                                        onClick={() => handleDeleteAssessment(assessment._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="assessment-description">
                                {assessment.description || 'No description provided'}
                            </p>
                            <div className="assessment-meta">
                                <span>Questions: {assessment.questions?.length || 0}</span>
                                <span>Created: {new Date(assessment.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserAssessments;
