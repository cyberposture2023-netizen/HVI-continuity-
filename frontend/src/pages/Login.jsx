import React, { useState } from 'react'
import apiService from '../services/apiService'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      console.log('Attempting login with:', credentials)
      const result = await apiService.login(credentials)
      console.log('Login successful:', result)
      setMessage({
        type: 'success',
        text: 'Login successful! Response: ' + JSON.stringify(result)
      })
    } catch (error) {
      console.error('Login failed:', error)
      setMessage({
        type: 'error', 
        text: 'Login failed: ' + (error.response?.data?.message || error.message || 'Unknown error')
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1>🔐 Login</h1>
        <p>Access the HVI Continuity Platform</p>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Username:
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔄 Logging in...' : '🚀 Login'}
          </button>
        </form>

        {message && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
            borderRadius: '4px',
            color: message.type === 'success' ? '#065f46' : '#dc2626'
          }}>
            <strong>{message.type === 'success' ? '✅' : '❌'} {message.type === 'success' ? 'Success' : 'Error'}:</strong> {message.text}
          </div>
        )}

        <div style={{ 
          marginTop: '25px', 
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <strong>💡 Demo Credentials:</strong>
          <p>Try any username/password combination for testing</p>
          <p>The backend login endpoint is demo-only and will accept any credentials.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
