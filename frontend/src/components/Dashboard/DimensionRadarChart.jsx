import React from "react";

const DimensionRadarChart = ({ data }) => {
  const chartData = data || [
    { dimension: "Governance", score: 75, fullMark: 100 },
    { dimension: "Technical", score: 60, fullMark: 100 },
    { dimension: "Operational", score: 85, fullMark: 100 },
    { dimension: "Compliance", score: 70, fullMark: 100 },
    { dimension: "Security", score: 80, fullMark: 100 }
  ];

  return (
    <div className="radar-chart-container">
      <h4>Dimension Analysis</h4>
      <div className="simple-radar-chart">
        {chartData.map((item, index) => (
          <div key={index} className="radar-item">
            <div className="dimension-name">{item.dimension}</div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ width: `${item.score}%` }}
                data-score={item.score}
              ></div>
            </div>
            <div className="score-value">{item.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DimensionRadarChart;
