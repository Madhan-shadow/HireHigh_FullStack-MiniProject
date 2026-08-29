import React from 'react';

const CapacityBar = ({ currentFills = 0, hiringGoal = 1 }) => {
  const safeGoal = hiringGoal > 0 ? hiringGoal : 1;
  const percent = Math.min(100, Math.round((currentFills / safeGoal) * 100));

  return (
    <div className="capacity-bar-wrapper">
      <span className="capacity-label">
        {currentFills} / {hiringGoal} filled
      </span>
      <div className="capacity-bar-track">
        <div
          className="capacity-bar-fill"
          style={{ width: `${percent}%` }}
          data-testid="capacity-bar-fill"
        />
      </div>
    </div>
  );
};

export default CapacityBar;