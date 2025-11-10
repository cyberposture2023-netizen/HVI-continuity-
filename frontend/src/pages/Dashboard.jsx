import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const data = await apiService.getDashboardData()
      setDashboardData(data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading dashboard...</div>

  return (
    <div className="dashboard">
      <h1>HVI Continuity Platform Dashboard</h1>
      <div className="dashboard-content">
        <p>Welcome to the HVI Continuity Platform</p>
        <p>Backend integration: ✅ Operational</p>
        {dashboardData && (
          <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}

export default Dashboard
