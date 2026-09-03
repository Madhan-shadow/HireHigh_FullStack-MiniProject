import React from 'react';

const STAGE_PERCENT = {
  APPLIED: 20,
  SCREENING: 40,
  INTERVIEW: 60,
  OFFER: 80,
  HIRED: 100,
};

const ApplicationProgress = ({ stage }) => {
  if (stage === 'REJECTED') {
    return (
      <div className="app-progress app-progress--rejected">
        <div className="app-progress-ring" style={{ '--pct': 0 }}>
          <span className="app-progress-percent">—</span>
        </div>
        <span className="app-progress-caption">Not proceeding</span>
      </div>
    );
  }

  const percent = STAGE_PERCENT[stage] ?? 0;
  const isHired = stage === 'HIRED';
  const label = (stage || '').charAt(0) + (stage || '').slice(1).toLowerCase();

  return (
    <div className="app-progress">
      <div className="app-progress-ring" style={{ '--pct': percent }}>
        <span className="app-progress-percent">{percent}%</span>
      </div>
      <span className={`app-progress-caption${isHired ? ' is-hired' : ''}`}>{label}</span>
    </div>
  );
};

export default ApplicationProgress;