import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService'

const Assessments = () => {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssessments()
  }, [])

  const loadAssessments = async () => {
    try {
      const data = await apiService.getAssessments()
      setAssessments(data.assessments || data)
    } catch (error) {
      console.error('Failed to load assessments:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading assessments...</div>

  return (
    <div className="assessments">
      <h1>Assessments Management</h1>
      <div className="assessments-list">
        {assessments.length > 0 ? (
          <ul>
            {assessments.map((assessment, index) => (
              <li key={index}>{JSON.stringify(assessment)}</li>
            ))}
          </ul>
        ) : (
          <p>No assessments found</p>
        )}
      </div>
    </div>
  )
}

export default Assessments
