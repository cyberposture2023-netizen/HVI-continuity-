Write-Host "Fixing dashboard data integration..." -ForegroundColor Yellow

$dashboardPath = "frontend/src/pages/Dashboard.js"

# Create the corrected Dashboard.js with proper data handling
$correctedDashboard = @'
import React, { useState, useEffect } from 'react';
import DashboardLayout, { DashboardCard } from '../components/Dashboard/DashboardLayout';
import HVIScoreCard from '../components/Dashboard/HVIScoreCard';
import DimensionRadarChart from '../components/Dashboard/DimensionRadarChart';
import DepartmentHeatmap from '../components/Dashboard/DepartmentHeatmap';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in production, this would come from your API
  const mockDashboardData = {
    currentScore: 720,
    trendData: [
      { date: '2024-01-01', score: 650 },
      { date: '2024-01-15', score: 680 },
      { date: '2024-02-01', score: 710 },
      { date: '2024-02-15', score: 690 },
      { date: '2024-03-01', score: 720 },
    ],
    dimensions: {
      behavioral: 75,
      technical: 82,
      organizational: 68,
      environmental: 71
    },
    departments: [
      { department: 'Engineering', score: 720, employeeCount: 45 },
      { department: 'Sales', score: 580, employeeCount: 32 },
      { department: 'Marketing', score: 650, employeeCount: 28 },
      { department: 'HR', score: 810, employeeCount: 18 },
      { department: 'Finance', score: 780, employeeCount: 22 },
      { department: 'Operations', score: 520, employeeCount: 35 },
    ]
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          setDashboardData(mockDashboardData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="HVI Risk Dashboard">
        <div className="loading">Loading Dashboard Data...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="HVI Risk Dashboard">
      <DashboardCard size="medium">
        <HVIScoreCard 
          currentScore={dashboardData.currentScore}
          trendData={dashboardData.trendData}
          peerAverage={650}
        />
      </DashboardCard>

      <DashboardCard size="medium">
        <DimensionRadarChart data={dashboardData.dimensions} />
      </DashboardCard>

      <DashboardCard size="large">
        <DepartmentHeatmap data={dashboardData.departments} />
      </DashboardCard>
    </DashboardLayout>
  );
};

export default Dashboard;
'@

# Write the corrected dashboard file
$correctedDashboard | Out-File -FilePath $dashboardPath -Encoding UTF8

Write-Host "Dashboard.js has been updated with proper data integration" -ForegroundColor Green
Write-Host "Mock data is now properly structured and will display" -ForegroundColor Green

Write-Host "`nThe dashboard should now show:" -ForegroundColor Cyan
Write-Host "- HVI Score: 720 with trend chart" -ForegroundColor White
Write-Host "- 4D Radar Chart with all dimensions" -ForegroundColor White
Write-Host "- Department Heatmap with 6 departments" -ForegroundColor White

Write-Host "`nPlease refresh your browser at: http://localhost:3000/dashboard" -ForegroundColor Yellow