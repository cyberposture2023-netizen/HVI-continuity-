import React from 'react';
import './AssessmentProgress.css';

const AssessmentProgress = ({ progress, onStartAssessment }) => {
  const { completed, total, lastUpdated } = progress;
  const progressPercentage = (completed / total) * 100;
  
  const getProgressText = () => {
    if (completed === 0) return 'Start your first assessment to get your HVI score';
    if (completed < total) return `Complete all ${total} dimensions for full HVI assessment`;
    return 'All dimensions assessed! Your HVI score is ready.';
  };

  const getProgressVariant = () => {
    if (completed === 0) return 'not-started';
    if (completed < total) return 'in-progress';
    return 'completed';
  };

  return (
    <div className={`assessment-progress ${getProgressVariant()}`}>
      <div className="progress-header">
        <h3>Assessment Progress</h3>
        <span className="progress-count">{completed}/{total} Dimensions</span>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <p className="progress-text">{getProgressText()}</p>
      
      <div className="progress-actions">
        <button 
          onClick={onStartAssessment}
          className={`progress-btn ${getProgressVariant()}`}
        >
          {completed === 0 ? 'Start Assessment' : 
           completed < total ? 'Continue Assessment' : 'Retake Assessment'}
        </button>
        
        {lastUpdated && (
          <span className="last-updated">
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default AssessmentProgress;
