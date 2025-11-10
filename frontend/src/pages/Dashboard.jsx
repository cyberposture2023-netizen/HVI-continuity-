import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading dashboard data from /api/dashboard...')
      const data = await apiService.getDashboardData()
      console.log('Dashboard data received:', data)
      setDashboardData(data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>🔄 Loading Dashboard...</h3>
      <p>Fetching data from /api/dashboard endpoint</p>
    </div>
  )

  if (error) return (
    <div style={{ 
      padding: '20px', 
      background: '#fee2e2',
      border: '1px solid #ef4444',
      borderRadius: '8px',
      color: '#dc2626'
    }}>
      <h3>❌ Dashboard Error</h3>
      <p>{error}</p>
      <button 
        onClick={loadDashboardData}
        style={{
          padding: '8px 16px',
          background: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        🔄 Retry
      </button>
    </div>
  )

  return (
    <div className="dashboard">
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1>📊 Dashboard</h1>
        <p>HVI Continuity Platform - Main Dashboard</p>
        <div style={{ 
          background: '#d1fae5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '14px',
          marginTop: '10px'
        }}>
          <strong>✅ Backend Connected:</strong> Using /api/dashboard endpoint
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Dashboard Data</h3>
          <button 
            onClick={loadDashboardData}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {dashboardData ? (
          <div>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '6px',
              border: '1px solid #e9ecef',
              marginBottom: '15px'
            }}>
              <h4>Raw API Response:</h4>
              <pre style={{ 
                margin: 0, 
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
                background: 'white',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                {JSON.stringify(dashboardData, null, 2)}
              </pre>
            </div>
            
            {/* Display structured data if available */}
            {dashboardData.overview && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
                <div style={{ background: '#e0f2fe', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#0369a1' }}>Total Assessments</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#0369a1' }}>
                    {dashboardData.overview.totalAssessments || 'N/A'}
                  </p>
                </div>
                <div style={{ background: '#dcfce7', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#166534' }}>Completed</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#166534' }}>
                    {dashboardData.overview.completed || 'N/A'}
                  </p>
                </div>
                <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#92400e' }}>In Progress</h4>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#92400e' }}>
                    {dashboardData.overview.inProgress || 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '2px dashed #dee2e6'
          }}>
            <h4>📭 No Dashboard Data</h4>
            <p>The dashboard endpoint returned no data.</p>
            <p style={{ fontSize: '14px', color: '#6c757d' }}>
              Check if the backend is returning data for /api/dashboard
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
