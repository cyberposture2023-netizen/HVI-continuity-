import React from 'react';
import './ScoreTrend.css';

const ScoreTrend = ({ trendData }) => {
  const { trend, summary, timeframe } = trendData;

  if (!trend || trend.length === 0) {
    return (
      <div className="score-trend">
        <h2>Score Trend</h2>
        <div className="no-data">
          <p>No trend data available for the selected period.</p>
        </div>
      </div>
    );
  }

  // Simple sparkline chart for trend visualization
  const maxScore = Math.max(...trend.map(t => t.overallScore));
  const minScore = Math.min(...trend.map(t => t.overallScore));

  return (
    <div className="score-trend">
      <div className="trend-header">
        <h2>Score Trend ({timeframe})</h2>
        <div className="trend-summary">
          <div className="summary-item">
            <span className="label">Current:</span>
            <span className="value">{summary.currentScore}</span>
          </div>
          <div className="summary-item">
            <span className="label">Average:</span>
            <span className="value">{summary.averageScore?.toFixed(1)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Change:</span>
            <span className={`value ${summary.scoreChange >= 0 ? 'positive' : 'negative'}`}>
              {summary.scoreChange >= 0 ? '+' : ''}{summary.scoreChange}
            </span>
          </div>
        </div>
      </div>

      <div className="trend-chart">
        <div className="chart-container">
          {trend.map((point, index) => {
            const height = ((point.overallScore - minScore) / (maxScore - minScore || 1)) * 100;
            return (
              <div key={index} className="chart-bar-container">
                <div 
                  className="chart-bar"
                  style={{ height: `${height}%` }}
                  title={`${new Date(point.date).toLocaleDateString()}: ${point.overallScore}`}
                ></div>
                <div className="chart-label">
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dimension-trends">
        <h4>Dimension Trends</h4>
        <div className="dimension-trend-grid">
          {['d1', 'd2', 'd3', 'd4'].map(dim => (
            <div key={dim} className="dimension-trend-item">
              <span className="dim-label">{dim.toUpperCase()}</span>
              <span className="dim-trend">
                {trend.length > 1 ? (
                  <span className={trend[trend.length - 1][dim] >= trend[0][dim] ? 'positive' : 'negative'}>
                    {trend[trend.length - 1][dim] >= trend[0][dim] ? '↗' : '↘'}
                  </span>
                ) : '→'}
              </span>
              <span className="dim-value">{trend[trend.length - 1][dim]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreTrend;
