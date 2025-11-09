import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './SimulationDashboard.css';

const SimulationDashboard = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  useEffect(() => {
    fetchSimulations();
  }, []);

  const fetchSimulations = async () => {
    try {
      const response = await api.get('/simulations');
      if (response.data.success) {
        setSimulations(response.data.simulations);
      }
    } catch (error) {
      console.error('Error fetching simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const launchSimulation = async (simulationId) => {
    try {
      const response = await api.post(\/simulations/\/launch\);
      if (response.data.success) {
        alert(\Simulation launched! \ participants enrolled.\);
        fetchSimulations();
      }
    } catch (error) {
      console.error('Error launching simulation:', error);
      alert('Error launching simulation: ' + error.response?.data?.error || error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Draft': { class: 'status-draft', label: 'Draft' },
      'Scheduled': { class: 'status-scheduled', label: 'Scheduled' },
      'Running': { class: 'status-running', label: 'Running' },
      'Completed': { class: 'status-completed', label: 'Completed' },
      'Archived': { class: 'status-archived', label: 'Archived' }
    };
    
    const config = statusConfig[status] || { class: 'status-draft', label: status };
    return <span className={\status-badge \\}>{config.label}</span>;
  };

  if (loading) {
    return <div className="loading">Loading simulations...</div>;
  }

  return (
    <div className="simulation-dashboard">
      <div className="dashboard-header">
        <h1>Behavioral Simulations</h1>
        <button className="btn-primary">Create New Simulation</button>
      </div>

      <div className="simulations-grid">
        {simulations.map(simulation => (
          <div key={simulation._id} className="simulation-card">
            <div className="card-header">
              <h3>{simulation.title}</h3>
              {getStatusBadge(simulation.status)}
            </div>
            
            <div className="card-body">
              <p className="simulation-description">{simulation.description}</p>
              
              <div className="simulation-meta">
                <div className="meta-item">
                  <span className="label">Type:</span>
                  <span className="value">{simulation.type}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Participants:</span>
                  <span className="value">{simulation.participants?.length || 0}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Created:</span>
                  <span className="value">
                    {new Date(simulation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {simulation.targetGroup && (
                <div className="target-groups">
                  <strong>Target Groups:</strong>
                  {simulation.targetGroup.map((group, index) => (
                    <span key={index} className="target-tag">
                      {group.department} - {group.role}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="card-actions">
              {simulation.status === 'Draft' && (
                <button 
                  className="btn-success"
                  onClick={() => launchSimulation(simulation._id)}
                >
                  Launch Simulation
                </button>
              )}
              
              {simulation.status === 'Running' && (
                <button 
                  className="btn-info"
                  onClick={() => setSelectedSimulation(simulation)}
                >
                  View Analytics
                </button>
              )}
              
              <button className="btn-secondary">View Details</button>
            </div>
          </div>
        ))}
      </div>

      {simulations.length === 0 && (
        <div className="empty-state">
          <h3>No simulations created yet</h3>
          <p>Create your first behavioral simulation to start assessing human risk factors.</p>
          <button className="btn-primary">Create Simulation</button>
        </div>
      )}
    </div>
  );
};

export default SimulationDashboard;
