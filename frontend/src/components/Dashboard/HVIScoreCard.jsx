import React from "react";

const HVIScoreCard = ({ currentScore, trendData, peerAverage = 650 }) => {
  const getRiskLevel = (score) => {
    if (score >= 800) return "low";
    if (score >= 600) return "medium";
    return "high";
  };

  const getRiskColor = (score) => {
    if (score >= 800) return "#10b981";
    if (score >= 600) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="hvi-score-card">
      <div className="score-header">
        <h3>HVI Score</h3>
        <span className={`risk-badge risk-${getRiskLevel(currentScore)}`}>
          {getRiskLevel(currentScore).toUpperCase()} RISK
        </span>
      </div>
      <div className="score-main">
        <div className="current-score" style={{ color: getRiskColor(currentScore) }}>
          {currentScore}
        </div>
        <div className="score-comparison">
          <div className="peer-average">
            Peer Average: {peerAverage}
          </div>
          <div className="score-trend">
            {trendData && trendData.length > 0 ? (
              <span className={trendData[trendData.length - 1].score > currentScore ? "trend-up" : "trend-down"}>
                {trendData[trendData.length - 1].score > currentScore ? "↑" : "↓"} 
                from last period
              </span>
            ) : (
              <span>No trend data</span>
            )}
          </div>
        </div>
      </div>
      <div className="score-breakdown">
        <div className="breakdown-item">
          <span className="label">Governance</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "75%" }}></div>
          </div>
        </div>
        <div className="breakdown-item">
          <span className="label">Technical</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "60%" }}></div>
          </div>
        </div>
        <div className="breakdown-item">
          <span className="label">Operational</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "85%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HVIScoreCard;
