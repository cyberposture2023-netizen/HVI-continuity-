import React from 'react';
import './ScoreCard.css';

const ScoreCard = ({ scores }) => {
  const { overall, dimensions } = scores;

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  };

  const getDimensionLabel = (dim) => {
    const labels = {
      d1: 'Leadership & Governance',
      d2: 'Technology & Infrastructure',
      d3: 'Process & Operations',
      d4: 'People & Culture'
    };
    return labels[dim] || dim;
  };

  return (
    <div className="score-card">
      <h2>Current Scores</h2>
      <div className="scores-container">
        <div className="overall-score">
          <div className="score-circle">
            <div className={`score-value ${getScoreClass(overall)}`}>
              {overall}
            </div>
            <div className="score-label">Overall</div>
          </div>
        </div>
        
        <div className="dimension-scores">
          {Object.entries(dimensions).map(([dim, score]) => (
            <div key={dim} className="dimension-score">
              <div className="dimension-header">
                <span className="dimension-name">{getDimensionLabel(dim)}</span>
                <span className={`dimension-value ${getScoreClass(score)}`}>
                  {score}
                </span>
              </div>
              <div className="score-bar">
                <div 
                  className={`score-progress ${getScoreClass(score)}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
