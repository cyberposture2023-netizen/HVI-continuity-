import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './UserAssessments.css';

const UserAssessments = () => {
    const { user, token } = useContext(AuthContext);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserAssessments();
    }, [token]);

    const fetchUserAssessments = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/assessments', {
                headers: {
                    'Authorization': Bearer ${token},
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch assessments');
            }

            const data = await response.json();
            setAssessments(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching assessments:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'draft': { class: 'badge-draft', text: 'Draft' },
            'in-progress': { class: 'badge-in-progress', text: 'In Progress' },
            'completed': { class: 'badge-completed', text: 'Completed' }
        };
        
        const config = statusConfig[status] || { class: 'badge-draft', text: status };
        return <span className={adge ${config.class}}>{config.text}</span>;
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'score-high';
        if (score >= 60) return 'score-medium';
        return 'score-low';
    };

    if (loading) {
        return (
            <div className="assessments-loading">
                <div className="loading-spinner"></div>
                <p>Loading your assessments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="assessments-error">
                <h3>Error Loading Assessments</h3>
                <p>{error}</p>
                <button onClick={fetchUserAssessments} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="user-assessments">
            <div className="assessments-header">
                <h2>My Assessments</h2>
                <button className="new-assessment-btn">
                    + New Assessment
                </button>
            </div>

            {assessments.length === 0 ? (
                <div className="no-assessments">
                    <h3>No Assessments Yet</h3>
                    <p>Get started by creating your first HVI assessment.</p>
                    <button className="create-first-btn">
                        Create First Assessment
                    </button>
                </div>
            ) : (
                <div className="assessments-grid">
                    {assessments.map((assessment) => (
                        <div key={assessment._id} className="assessment-card">
                            <div className="card-header">
                                <h3>{assessment.title}</h3>
                                {getStatusBadge(assessment.status)}
                            </div>
                            
                            <div className="card-body">
                                <p className="assessment-description">
                                    {assessment.description || 'No description provided'}
                                </p>
                                
                                {assessment.scores && assessment.status === 'completed' && (
                                    <div className="scores-section">
                                        <h4>HVI Scores</h4>
                                        <div className="scores-grid">
                                            <div className="score-item">
                                                <span className="score-label">D1</span>
                                                <span className={score-value ${getScoreColor(assessment.scores.d1)}}>
                                                    {assessment.scores.d1}
                                                </span>
                                            </div>
                                            <div className="score-item">
                                                <span className="score-label">D2</span>
                                                <span className={score-value ${getScoreColor(assessment.scores.d2)}}>
                                                    {assessment.scores.d2}
                                                </span>
                                            </div>
                                            <div className="score-item">
                                                <span className="score-label">D3</span>
                                                <span className={score-value ${getScoreColor(assessment.scores.d3)}}>
                                                    {assessment.scores.d3}
                                                </span>
                                            </div>
                                            <div className="score-item">
                                                <span className="score-label">D4</span>
                                                <span className={score-value ${getScoreColor(assessment.scores.d4)}}>
                                                    {assessment.scores.d4}
                                                </span>
                                            </div>
                                            <div className="score-item overall">
                                                <span className="score-label">Overall</span>
                                                <span className={score-value ${getScoreColor(assessment.scores.overall)}}>
                                                    {assessment.scores.overall}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="card-meta">
                                    <span className="meta-item">
                                        Created: {new Date(assessment.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="meta-item">
                                        Questions: {assessment.questions?.length || 0}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="card-actions">
                                <button className="action-btn primary">
                                    {assessment.status === 'completed' ? 'View Results' : 'Continue'}
                                </button>
                                <button className="action-btn secondary">
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserAssessments;
