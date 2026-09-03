import React from 'react';

const CapacityBar = ({ currentFills = 0, hiringGoal = 1 }) => {
  const goal = Math.max(hiringGoal || 0, 0);
  const fills = Math.min(Math.max(currentFills || 0, 0), goal);
  const percentage = goal > 0 ? Math.round((fills / goal) * 100) : 0;
  const isFull = goal > 0 && fills >= goal;

  return (
    <div className="capacity-bar-wrap" data-testid="capacity-bar">
      <div className="capacity-bar-track">
        <div
          className={`capacity-bar-fill${isFull ? ' is-full' : ''}`}
          style={{ width: `${percentage}%` }}
          data-testid="capacity-bar-fill"
        />
      </div>
      <span className="capacity-bar-label">
        {fills}/{goal} filled · {percentage}%
      </span>
    </div>
  );
};

export default CapacityBar;