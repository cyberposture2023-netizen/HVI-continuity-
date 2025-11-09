import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HVIScoreCard = ({ currentScore, trendData, peerAverage = 650 }) => {
  const getRiskLevel = (score) => {
    if (score >= 800) return { level: 'Low', color: '#10b981' };
    if (score >= 600) return { level: 'Moderate', color: '#f59e0b' };
    if (score >= 400) return { level: 'High', color: '#ef4444' };
    return { level: 'Critical', color: '#dc2626' };
  };

  const riskInfo = getRiskLevel(currentScore);

  return (
    <div className="hvi-score-card">
      <div className="score-header">
        <h3>HVI Risk Score</h3>
      </div>
      
      <div className="score-display">
        <div className="score-circle">
          <div 
            className="score-value" 
            style={{ color: riskInfo.color }}
          >
            {currentScore}
          </div>
          <div className="score-label">Current Score</div>
        </div>
        
        <div className="score-details">
          <div className="risk-level" style={{ color: riskInfo.color }}>
            {riskInfo.level} Risk
          </div>
          <div className="peer-comparison">
            vs Peer Average: {peerAverage}
          </div>
        </div>
      </div>

      {trendData && trendData.length > 0 && (
        <div className="trend-chart">
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 1000]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={riskInfo.color}
                strokeWidth={3}
                dot={{ fill: riskInfo.color, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default HVIScoreCard;
