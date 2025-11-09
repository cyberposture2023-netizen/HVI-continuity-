import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './AssessmentDashboard.css';

const AssessmentDashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAssessments();
  }, [filter, currentPage]);

  const fetchAssessments = async () => {
    try {
      const response = await api.get(\/assessments?status=\&page=\&limit=10\);
      if (response.data.success) {
        setAssessments(response.data.assessments);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <span className="status-badge status-active">Active</span> :
      <span className="status-badge status-inactive">Inactive</span>;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'Behavioral': 'type-behavioral',
      'Technical': 'type-technical',
      'Organizational': 'type-organizational',
      'Environmental': 'type-environmental',
      'Comprehensive': 'type-comprehensive'
    };
    
    return <span className={\	ype-badge \\}>{type}</span>;
  };

  const getCompletionStats = (assessment) => {
    const total = assessment.participants.length;
    const completed = assessment.participants.filter(p => p.completedAt).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, completionRate };
  };

  if (loading) {
    return <div className="loading">Loading assessments...</div>;
  }

  return (
    <div className="assessment-dashboard">
      <div className="dashboard-header">
        <h1>Assessment Management</h1>
        <div className="header-actions">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Assessments</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn-primary">Create New Assessment</button>
        </div>
      </div>

      <div className="assessments-grid">
        {assessments.map(assessment => {
          const stats = getCompletionStats(assessment);
          
          return (
            <div key={assessment._id} className="assessment-card">
              <div className="card-header">
                <h3>{assessment.title}</h3>
                <div className="badges">
                  {getTypeBadge(assessment.type)}
                  {getStatusBadge(assessment.isActive)}
                </div>
              </div>
              
              <div className="card-body">
                <p className="assessment-description">{assessment.description}</p>
                
                <div className="assessment-meta">
                  <div className="meta-item">
                    <span className="label">Participants:</span>
                    <span className="value">{stats.total}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Completion Rate:</span>
                    <span className={\alue \\}>
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Created:</span>
                    <span className="value">
                      {new Date(assessment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {assessment.targetGroup && assessment.targetGroup.length > 0 && (
                  <div className="target-groups">
                    <strong>Target Groups:</strong>
                    {assessment.targetGroup.map((group, index) => (
                      <span key={index} className="target-tag">
                        {group.department} - {group.role}
                      </span>
                    ))}
                  </div>
                )}

                {/* Progress Bar */}
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: \\%\ }}
                    ></div>
                  </div>
                  <div className="progress-stats">
                    {stats.completed} of {stats.total} completed
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button className="btn-info">View Analytics</button>
                <button className="btn-secondary">Manage Participants</button>
                {assessment.isActive && (
                  <button className="btn-success">Take Assessment</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {assessments.length === 0 && (
        <div className="empty-state">
          <h3>No assessments found</h3>
          <p>Create your first assessment to start evaluating human risk factors.</p>
          <button className="btn-primary">Create Assessment</button>
        </div>
      )}
    </div>
  );
};

export default AssessmentDashboard;
