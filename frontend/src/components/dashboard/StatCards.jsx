import React from 'react';

const StatCards = ({ jobs = [], applications = [] }) => {
  const openJobs = jobs.filter((j) => j.status === 'OPEN').length;
  const totalHiringGoal = jobs.reduce((sum, j) => sum + (j.hiringGoal || 0), 0);
  const totalFills = jobs.reduce((sum, j) => sum + (j.currentFills || 0), 0);
  const totalApplications = applications.length;

  const stats = [
    { label: 'Open roles', value: openJobs },
    { label: 'Total applications', value: totalApplications },
    { label: 'Hiring goal', value: totalHiringGoal },
    { label: 'Positions filled', value: totalFills },
  ];

  return (
    <div className="stat-cards">
      {stats.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatCards;