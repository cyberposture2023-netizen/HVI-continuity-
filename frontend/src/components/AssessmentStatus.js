import React from 'react';
import './AssessmentStatus.css';

const AssessmentStatus = ({ assessment }) => {
  if (!assessment) {
    return (
      <div className="assessment-status">
        <h2>Assessment Status</h2>
        <div className="no-assessment">
          <p>No assessment data available.</p>
        </div>
      </div>
    );
  }

  const { status, progress, nextAction, scores, summary } = assessment;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'not-started':
        return '⏸️';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'not-started':
        return 'status-not-started';
      default:
        return 'status-unknown';
    }
  };

  const getActionButton = (nextAction) => {
    const actions = {
      'start-assessment': { label: 'Start Assessment', variant: 'primary' },
      'resume-assessment': { label: 'Resume Assessment', variant: 'primary' },
      'continue-governance': { label: 'Continue D1', variant: 'secondary' },
      'continue-technology': { label: 'Continue D2', variant: 'secondary' },
      'continue-processes': { label: 'Continue D3', variant: 'secondary' },
      'continue-people': { label: 'Continue D4', variant: 'secondary' }
    };

    const action = actions[nextAction] || { label: 'Continue', variant: 'secondary' };
    
    return (
      <button className={`action-button ${action.variant}`}>
        {action.label}
      </button>
    );
  };

  return (
    <div className="assessment-status">
      <h2>Assessment Status</h2>
      
      <div className="status-card">
        <div className={`status-header ${getStatusColor(status)}`}>
          <span className="status-icon">{getStatusIcon(status)}</span>
          <span className="status-text">
            {status.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {progress !== undefined && (
          <div className="progress-section">
            <div className="progress-header">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {nextAction && (
          <div className="action-section">
            {getActionButton(nextAction)}
          </div>
        )}

        {status === 'completed' && summary && (
          <div className="completion-details">
            <div className="detail-item">
              <span className="label">Completed:</span>
              <span className="value">
                {new Date(assessment.completedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Level:</span>
              <span className="value">{summary.overall.level}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentStatus;
