import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [scores, setScores] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const organizationId = '69129508927a2d85d97044cd'; // Test organization ID from backend

  useEffect(() => {
    fetchDashboardData();
  }, [organizationId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching dashboard data...');
      
      const [scoresResponse, trendResponse, assessmentResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/dashboard/scores?organizationId=${organizationId}`),
        fetch(`http://localhost:5000/api/dashboard/score-trend?organizationId=${organizationId}&timeframe=30d`),
        fetch(`http://localhost:5000/api/assessments/current?organizationId=${organizationId}`)
      ]);

      if (!scoresResponse.ok) throw new Error('Scores endpoint failed');
      if (!trendResponse.ok) throw new Error('Trend endpoint failed');
      if (!assessmentResponse.ok) throw new Error('Assessment endpoint failed');

      const scoresData = await scoresResponse.json();
      const trendData = await trendResponse.json();
      const assessmentData = await assessmentResponse.json();

      console.log('Dashboard data loaded:', { scoresData, trendData, assessmentData });

      setScores(scoresData);
      setTrendData(trendData);
      setCurrentAssessment(assessmentData);
      
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Digital Continuity Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.href = '/assessment'} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Digital Continuity Dashboard</h1>
        <div className="header-info">
          {scores?.organizationName && (
            <span className="organization-name">{scores.organizationName}</span>
          )}
          <button onClick={() => window.location.href = '/assessment'} className="refresh-button">
            Refresh
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Overall Score Card */}
        {scores?.hasAssessment && (
          <div className="score-section">
            <h2>Current Digital Continuity Score</h2>
            <div className="overall-score-card">
              <div className="score-circle">
                <div className="score-value">{scores.currentScores.overall}</div>
                <div className="score-label">Overall</div>
              </div>
              <div className="score-details">
                <p>Based on D1-D4 maturity assessment</p>
                <div className="score-breakdown">
                  <div className="breakdown-item">
                    <span className="dimension">D1: Leadership</span>
                    <span className="score">{scores.currentScores.dimensions.d1}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="dimension">D2: Technology</span>
                    <span className="score">{scores.currentScores.dimensions.d2}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="dimension">D3: Process</span>
                    <span className="score">{scores.currentScores.dimensions.d3}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="dimension">D4: People</span>
                    <span className="score">{scores.currentScores.dimensions.d4}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Status */}
        {currentAssessment && (
          <div className="status-section">
            <h2>Assessment Status</h2>
            <div className="status-card">
              <div className={`status-badge status-${currentAssessment.status}`}>
                {currentAssessment.status.replace('-', ' ').toUpperCase()}
              </div>
              {currentAssessment.progress !== undefined && (
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${currentAssessment.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{currentAssessment.progress}% Complete</span>
                </div>
              )}
              {currentAssessment.nextAction && (
                <button className="action-button">
                  {currentAssessment.nextAction === 'start-assessment' ? 'Start Assessment' : 'Continue Assessment'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Score Trend */}
        {trendData && trendData.trend && trendData.trend.length > 0 && (
          <div className="trend-section">
            <h2>Score Trend ({trendData.timeframe})</h2>
            <div className="trend-card">
              <div className="trend-sparkline">
                {trendData.trend.map((point, index) => (
                  <div key={index} className="trend-point" title={`${new Date(point.date).toLocaleDateString()}: ${point.overallScore}`}>
                    <div 
                      className="trend-bar" 
                      style={{ height: `${point.overallScore}%` }}
                    ></div>
                    <span className="trend-label">
                      {new Date(point.date).getDate()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="trend-summary">
                <div className="summary-item">
                  <span>Current: </span>
                  <strong>{trendData.summary.currentScore}</strong>
                </div>
                <div className="summary-item">
                  <span>Average: </span>
                  <strong>{trendData.summary.averageScore?.toFixed(1)}</strong>
                </div>
                <div className="summary-item">
                  <span>Change: </span>
                  <strong className={trendData.summary.scoreChange >= 0 ? 'positive' : 'negative'}>
                    {trendData.summary.scoreChange >= 0 ? '+' : ''}{trendData.summary.scoreChange}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {currentAssessment?.scores?.summary?.recommendations && (
          <div className="recommendations-section">
            <h2>Improvement Recommendations</h2>
            <div className="recommendations-grid">
              {currentAssessment.scores.summary.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <div className="rec-header">
                    <span className={`priority-badge priority-${rec.priority}`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <span className="dimension-tag">{rec.dimension}</span>
                  </div>
                  <h3>{rec.title}</h3>
                  <p>{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Assessment Message */}
        {scores && !scores.hasAssessment && (
          <div className="no-assessment-section">
            <h2>Welcome to Digital Continuity Assessment</h2>
            <p>No assessment completed yet. Start your first assessment to measure your organization's digital continuity maturity across four dimensions:</p>
            <div className="dimensions-overview">
              <div className="dimension-overview">
                <h3>D1: Leadership & Governance</h3>
                <p>Executive sponsorship, strategy, and compliance</p>
              </div>
              <div className="dimension-overview">
                <h3>D2: Technology & Infrastructure</h3>
                <p>Systems, security, and technical capabilities</p>
              </div>
              <div className="dimension-overview">
                <h3>D3: Process & Operations</h3>
                <p>Workflows, procedures, and operational excellence</p>
              </div>
              <div className="dimension-overview">
                <h3>D4: People & Culture</h3>
                <p>Skills, training, and organizational culture</p>
              </div>
            </div>
            <button className="start-assessment-button" onClick={() => navigate('/assessment')}>\n              Start Digital Continuity Assessment\n            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


