import React from 'react';

const CapacityBar = ({ currentFills = 0, hiringGoal = 1 }) => {
  const pct = hiringGoal > 0 ? Math.min(100, Math.round((currentFills / hiringGoal) * 100)) : 0;

  return (
    <div className="capacity-bar-wrap">
      <span className="capacity-bar-label">
        {currentFills} / {hiringGoal} filled
      </span>
      <div className="capacity-bar-track">
        <div className="capacity-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default CapacityBar;