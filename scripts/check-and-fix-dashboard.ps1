Write-Host "Checking current Dashboard.js content..." -ForegroundColor Yellow

$dashboardPath = "frontend/src/pages/Dashboard.js"

if (Test-Path $dashboardPath) {
    $currentContent = Get-Content $dashboardPath -Raw
    Write-Host "Current Dashboard.js content:" -ForegroundColor Cyan
    Write-Host $currentContent -ForegroundColor Gray
    Write-Host "`n" + "="*50 -ForegroundColor Cyan
} else {
    Write-Host "Dashboard.js not found at: $dashboardPath" -ForegroundColor Red
    exit 1
}

Write-Host "Replacing with correct dashboard implementation..." -ForegroundColor Yellow

# Create the correct Dashboard.js
$correctDashboard = @'
import React, { useState, useEffect } from 'react';
import DashboardLayout, { DashboardCard } from '../components/Dashboard/DashboardLayout';
import HVIScoreCard from '../components/Dashboard/HVIScoreCard';
import DimensionRadarChart from '../components/Dashboard/DimensionRadarChart';
import DepartmentHeatmap from '../components/Dashboard/DepartmentHeatmap';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API calls
        setTimeout(() => {
          setDashboardData({
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
          });
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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading HVI Dashboard...</h2>
      </div>
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

# Replace the file
$correctDashboard | Out-File -FilePath $dashboardPath -Encoding UTF8 -Force

Write-Host "Dashboard.js has been replaced with the correct implementation" -ForegroundColor Green

Write-Host "`nThe dashboard should now show:" -ForegroundColor Cyan
Write-Host "✓ HVI Score Card (720 with trend line)" -ForegroundColor White
Write-Host "✓ 4D Dimension Radar Chart" -ForegroundColor White
Write-Host "✓ Department Risk Heatmap" -ForegroundColor White

Write-Host "`nPlease REFRESH your browser: http://localhost:3000/dashboard" -ForegroundColor Yellow
Write-Host "If you still see the old dashboard, try hard refresh (Ctrl+F5)" -ForegroundColor Yellow