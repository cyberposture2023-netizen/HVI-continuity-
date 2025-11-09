import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import HVIScoreCard from '../components/Dashboard/HVIScoreCard';
import DimensionRadarChart from '../components/Dashboard/DimensionRadarChart';
import DepartmentHeatmap from '../components/Dashboard/DepartmentHeatmap';
import AssessmentProgress from '../components/Dashboard/AssessmentProgress';
import apiService from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    currentScore: 0,
    scoreTrend: [],
    dimensionScores: { D1: 0, D2: 0, D3: 0, D4: 0 },
    departmentData: [],
    assessmentProgress: { completed: 0, total: 4 },
    recentAssessments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [scoresResponse, trendResponse, currentAssessmentResponse] = await Promise.all([
        apiService.getUserScores(),
        apiService.getScoreTrend(),
        apiService.getCurrentAssessment()
      ]);

      const userScores = scoresResponse.data;
      const scoreTrend = trendResponse.data;
      const currentAssessment = currentAssessmentResponse.data;

      // Calculate assessment progress
      const completedDimensions = currentAssessment ? 
        Object.values(currentAssessment.dimensions).filter(dim => dim.completed).length : 0;

      // Prepare dimension scores for radar chart
      const dimensionScores = currentAssessment ? {
        D1: currentAssessment.dimensions.D1?.score || 0,
        D2: currentAssessment.dimensions.D2?.score || 0,
        D3: currentAssessment.dimensions.D3?.score || 0,
        D4: currentAssessment.dimensions.D4?.score || 0
      } : { D1: 0, D2: 0, D3: 0, D4: 0 };

      // Fetch department data if available
      let departmentData = [];
      try {
        const deptResponse = await apiService.getDepartmentScores();
        departmentData = deptResponse.data;
      } catch (deptError) {
        console.log('Department data not available, using mock data structure');
        departmentData = [
          { department: 'IT', score: 72, riskLevel: 'medium' },
          { department: 'HR', score: 65, riskLevel: 'medium' },
          { department: 'Finance', score: 58, riskLevel: 'high' },
          { department: 'Operations', score: 81, riskLevel: 'low' }
        ];
      }

      setDashboardData({
        currentScore: userScores.overallHVI || currentAssessment?.overallScore || 0,
        scoreTrend: scoreTrend,
        dimensionScores: dimensionScores,
        departmentData: departmentData,
        assessmentProgress: {
          completed: completedDimensions,
          total: 4,
          lastUpdated: currentAssessment?.updatedAt
        },
        recentAssessments: currentAssessment ? [currentAssessment] : []
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  const handleViewAssessment = (assessmentId) => {
    navigate(`/assessment/${assessmentId}`);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your HVI dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Unable to Load Dashboard</h3>
        <p>{error}</p>
        <button onClick={loadDashboardData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>HVI Continuity Dashboard</h1>
        <p>Monitor your human vulnerability index and assessment progress</p>
      </div>

      {/* Assessment Progress Section */}
      <div className="dashboard-section">
        <AssessmentProgress 
          progress={dashboardData.assessmentProgress}
          onStartAssessment={handleStartAssessment}
        />
      </div>

      {/* Main Score and Visualization Section */}
      <div className="dashboard-main-grid">
        <div className="score-card-section">
          <HVIScoreCard 
            score={dashboardData.currentScore}
            trend={dashboardData.scoreTrend}
            lastUpdated={dashboardData.assessmentProgress.lastUpdated}
          />
        </div>
        
        <div className="radar-chart-section">
          <DimensionRadarChart 
            dimensionScores={dashboardData.dimensionScores}
            onDimensionClick={(dimension) => navigate('/assessment', { state: { startDimension: dimension } })}
          />
        </div>
      </div>

      {/* Department Overview Section */}
      <div className="dashboard-section">
        <DepartmentHeatmap 
          departmentData={dashboardData.departmentData}
          onDepartmentSelect={(dept) => console.log('Selected department:', dept)}
        />
      </div>

      {/* Recent Assessments Section */}
      {dashboardData.recentAssessments.length > 0 && (
        <div className="dashboard-section">
          <h3>Recent Assessments</h3>
          <div className="recent-assessments">
            {dashboardData.recentAssessments.map(assessment => (
              <div key={assessment._id} className="assessment-card">
                <div className="assessment-info">
                  <span className="assessment-date">
                    {new Date(assessment.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="assessment-score">
                    Overall HVI: {assessment.overallScore || 0}
                  </span>
                </div>
                <button 
                  onClick={() => handleViewAssessment(assessment._id)}
                  className="view-assessment-btn"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
