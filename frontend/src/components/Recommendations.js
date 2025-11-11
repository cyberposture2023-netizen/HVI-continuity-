import React from 'react';
import './Recommendations.css';

const Recommendations = ({ scores }) => {
  if (!scores.summary || !scores.summary.recommendations) {
    return (
      <div className="recommendations">
        <h2>Recommendations</h2>
        <div className="no-recommendations">
          <p>Complete an assessment to get personalized recommendations.</p>
        </div>
      </div>
    );
  }

  const { recommendations } = scores.summary;

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getPriorityLabel = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <div className="recommendations">
      <h2>Improvement Recommendations</h2>
      <div className="recommendations-grid">
        {recommendations.map((rec, index) => (
          <div key={index} className={`recommendation-card priority-${rec.priority}`}>
            <div className="recommendation-header">
              <div className="priority-indicator">
                <span className="priority-icon">{getPriorityIcon(rec.priority)}</span>
                <span className="priority-label">{getPriorityLabel(rec.priority)} Priority</span>
              </div>
              <div className="dimension-badge">{rec.dimension}</div>
            </div>
            
            <h3 className="recommendation-title">{rec.title}</h3>
            <p className="recommendation-description">{rec.description}</p>
            
            <div className="recommendation-actions">
              <button className="action-button primary">
                Implement
              </button>
              <button className="action-button secondary">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
