import React from 'react';
import './DashboardLayout.css';

const DashboardLayout = ({ children, title, filters }) => {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{title}</h1>
        <div className="dashboard-filters">
          {filters}
        </div>
      </div>
      <div className="dashboard-grid">
        {children}
      </div>
    </div>
  );
};

export const DashboardCard = ({ title, children, className = '', size = 'medium' }) => {
  return (
    <div className={`dashboard-card ${className} ${size}`}>
      <h3 className="card-title">{title}</h3>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
