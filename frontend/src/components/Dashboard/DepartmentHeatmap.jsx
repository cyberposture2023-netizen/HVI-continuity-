import React, { useState } from 'react';

const DepartmentHeatmap = ({ data, onDepartmentSelect }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
    if (onDepartmentSelect) {
      onDepartmentSelect(department);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 800) return '#10b981';
    if (score >= 600) return '#f59e0b';
    if (score >= 400) return '#ef4444';
    return '#dc2626';
  };

  const getRiskLabel = (score) => {
    if (score >= 800) return 'Low';
    if (score >= 600) return 'Moderate';
    if (score >= 400) return 'High';
    return 'Critical';
  };

  const sampleData = data || [
    { department: 'Engineering', score: 720, employeeCount: 45 },
    { department: 'Sales', score: 580, employeeCount: 32 },
    { department: 'Marketing', score: 650, employeeCount: 28 },
    { department: 'HR', score: 810, employeeCount: 18 },
    { department: 'Finance', score: 780, employeeCount: 22 },
    { department: 'Operations', score: 520, employeeCount: 35 },
  ];

  return (
    <div className="department-heatmap">
      <h3>Department Risk Overview</h3>
      
      <div className="heatmap-container">
        {sampleData.map((dept) => (
          <div
            key={dept.department}
            className={`heatmap-item ${selectedDepartment?.department === dept.department ? 'selected' : ''}`}
            style={{ 
              backgroundColor: getRiskColor(dept.score)
            }}
            onClick={() => handleDepartmentClick(dept)}
          >
            <div className="department-name">{dept.department}</div>
            <div className="department-score">{dept.score}</div>
            <div className="risk-level">{getRiskLabel(dept.score)}</div>
            <div className="employee-count">{dept.employeeCount} employees</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentHeatmap;
