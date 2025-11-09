import React from 'react';
import './AssessmentPage.css';

const AssessmentPage = () => {
  return (
    <div className="assessment-page">
      <div className="assessment-header">
        <h1>Human Vulnerability Index Assessment</h1>
        <p>Complete this assessment to calculate your personalized HVI score across four key dimensions.</p>
      </div>

      <div className="assessment-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '0%' }}></div>
        </div>
        <div className="progress-text">0% Complete</div>
      </div>

      <div className="dimensions-overview">
        <div className="dimension-card">
          <h3>D1: Behavioral Risk</h3>
          <p>Personal cybersecurity habits and behaviors</p>
          <div className="dimension-status">Not Started</div>
        </div>
        
        <div className="dimension-card">
          <h3>D2: Technical Risk</h3>
          <p>Device security and technical safeguards</p>
          <div className="dimension-status">Not Started</div>
        </div>
        
        <div className="dimension-card">
          <h3>D3: Organizational Risk</h3>
          <p>Workplace security culture and policies</p>
          <div className="dimension-status">Not Started</div>
        </div>
        
        <div className="dimension-card">
          <h3>D4: Environmental Risk</h3>
          <p>Physical and digital work environment</p>
          <div className="dimension-status">Not Started</div>
        </div>
      </div>

      <div className="assessment-actions">
        <button className="btn-primary">Begin Assessment</button>
      </div>
    </div>
  );
};

export default AssessmentPage;
