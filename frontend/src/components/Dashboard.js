import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </div>
        
        {user && (
          <div style={{ marginTop: '20px' }}>
            <h3>Welcome, {user.username}!</h3>
            <p>Email: {user.email}</p>
          </div>
        )}
        
        <div style={{ marginTop: '30px' }}>
          <h3>HVI Continuity Platform</h3>
          <p>Assessment management system is ready.</p>
          <div style={{ 
            background: '#e9ecef', 
            padding: '20px', 
            borderRadius: '4px',
            marginTop: '20px'
          }}>
            <h4>System Status: ✅ Operational</h4>
            <p>Backend: Connected</p>
            <p>Frontend: Built Successfully</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
