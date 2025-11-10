import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService'

const Assessments = () => {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAssessments()
  }, [])

  const loadAssessments = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading assessments from /api/assessments...')
      const data = await apiService.getAssessments()
      console.log('Assessments data received:', data)
      
      // Handle different response formats
      if (data.assessments && Array.isArray(data.assessments)) {
        setAssessments(data.assessments)
      } else if (Array.isArray(data)) {
        setAssessments(data)
      } else if (data && typeof data === 'object') {
        // If it's an object but not array, create array with the data
        setAssessments([data])
      } else {
        setAssessments([])
      }
    } catch (error) {
      console.error('Failed to load assessments:', error)
      setError('Failed to load assessments: ' + (error.message || 'Unknown error'))
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
      <h3>🔄 Loading Assessments...</h3>
      <p>Fetching data from /api/assessments endpoint</p>
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
      <h3>❌ Assessments Error</h3>
      <p>{error}</p>
      <button 
        onClick={loadAssessments}
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
    <div className="assessments">
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1>📝 Assessments Management</h1>
        <p>Manage HVI continuity assessments</p>
        <div style={{ 
          background: '#d1fae5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '14px',
          marginTop: '10px'
        }}>
          <strong>✅ Backend Connected:</strong> Using /api/assessments endpoint
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Available Assessments ({assessments.length})</h3>
          <button 
            onClick={loadAssessments}
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

        {assessments.length > 0 ? (
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
                {JSON.stringify(assessments, null, 2)}
              </pre>
            </div>

            {/* Display assessments in a structured way */}
            <div style={{ display: 'grid', gap: '15px' }}>
              {assessments.map((assessment, index) => (
                <div key={index} style={{ 
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6'
                }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>
                    Assessment {index + 1}
                    {assessment.name && `: ${assessment.name}`}
                    {assessment.title && `: ${assessment.title}`}
                  </h4>
                  {assessment.description && (
                    <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>
                      {assessment.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
                    {assessment.status && (
                      <span style={{ 
                        background: assessment.status === 'completed' ? '#dcfce7' : 
                                   assessment.status === 'in-progress' ? '#fef3c7' : '#f3f4f6',
                        color: assessment.status === 'completed' ? '#166534' : 
                               assessment.status === 'in-progress' ? '#92400e' : '#6b7280',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                      }}>
                        {assessment.status}
                      </span>
                    )}
                    {assessment.score && (
                      <span style={{ fontWeight: 'bold' }}>
                        Score: {assessment.score}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '2px dashed #dee2e6'
          }}>
            <h4>📭 No Assessments Found</h4>
            <p>The assessments endpoint returned an empty list.</p>
            <p style={{ fontSize: '14px', color: '#6c757d' }}>
              This is normal if no assessments have been created yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Assessments
