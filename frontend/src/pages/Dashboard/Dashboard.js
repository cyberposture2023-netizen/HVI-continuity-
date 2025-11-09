import React from 'react';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>HVI-Continuity Dashboard</h1>
            <p>4D Human Risk Assessment Overview</p>
            <div className="dashboard-grid">
                {/* Dashboard content will be implemented in later steps */}
                <div className="card">
                    <h3>Overall Risk Score</h3>
                    <p>Loading...</p>
                </div>
                <div className="card">
                    <h3>Active Assessments</h3>
                    <p>Loading...</p>
                </div>
                <div className="card">
                    <h3>Simulation Progress</h3>
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
