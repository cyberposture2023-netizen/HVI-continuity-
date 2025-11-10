import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Assessments from './pages/Assessments'
import Login from './pages/Login'

function App() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [healthData, setHealthData] = useState(null)

  useEffect(() => {
    checkBackend()
  }, [])

  const checkBackend = async () => {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealthData(data)
      setBackendStatus('connected')
    } catch (error) {
      console.error('Backend connection failed:', error)
      setBackendStatus('error')
    }
  }

  const Navigation = () => (
    <nav style={{
      background: '#2c3e50',
      padding: '1rem 2rem',
      marginBottom: '20px'
    }}>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        gap: '2rem',
        margin: 0,
        padding: 0
      }}>
        <li><Link 
          to="/" 
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#34495e'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >📊 Dashboard</Link></li>
        <li><Link 
          to="/assessments"
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#34495e'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >📝 Assessments</Link></li>
        <li><Link 
          to="/login"
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#34495e'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >🔐 Login</Link></li>
      </ul>
    </nav>
  )

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh',
        background: '#f5f5f5'
      }}>
        <Navigation />
        
        <div style={{ 
          padding: '20px', 
          fontFamily: 'Arial, sans-serif',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Status Banner */}
          <div style={{ 
            background: 'white', 
            padding: '15px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            borderLeft: `4px solid ${backendStatus === 'connected' ? '#10b981' : backendStatus === 'error' ? '#ef4444' : '#f59e0b'}`
          }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>🚀 HVI Continuity Platform</h2>
            <p style={{ margin: '5px 0 0 0', color: '#7f8c8d' }}>
              Backend Status: 
              <span style={{ 
                color: backendStatus === 'connected' ? '#10b981' : backendStatus === 'error' ? '#ef4444' : '#f59e0b',
                fontWeight: 'bold',
                marginLeft: '10px'
              }}>
                {backendStatus === 'connected' ? '✅ CONNECTED' : 
                 backendStatus === 'error' ? '❌ CONNECTION FAILED' : '🔄 CHECKING...'}
              </span>
            </p>
          </div>

          {/* Main Content */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
