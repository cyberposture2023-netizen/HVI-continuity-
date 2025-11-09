import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const DimensionRadarChart = ({ data }) => {
  const chartData = [
    { subject: 'Behavioral', value: data?.behavioral || 0, fullMark: 100 },
    { subject: 'Technical', value: data?.technical || 0, fullMark: 100 },
    { subject: 'Organizational', value: data?.organizational || 0, fullMark: 100 },
    { subject: 'Environmental', value: data?.environmental || 0, fullMark: 100 },
  ];

  return (
    <div className="radar-chart-container">
      <h3>4D Risk Dimensions</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Tooltip />
          <Radar
            name="Risk Score"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DimensionRadarChart;
