import React from 'react';

const MAX_VISIBLE_DOTS = 12;

const CapacityBar = ({ currentFills = 0, hiringGoal = 1 }) => {
  const goal = Math.max(hiringGoal || 0, 0);
  const fills = Math.min(currentFills || 0, goal);

  if (goal > MAX_VISIBLE_DOTS) {
    return (
      <div className="seat-dots-wrap">
        <span className="seat-count-label">
          {fills} / {goal} seats filled
        </span>
      </div>
    );
  }

  const dots = Array.from({ length: goal || 1 }, (_, i) => i < fills);

  return (
    <div className="seat-dots-wrap">
      <div className="seat-dots" data-testid="capacity-bar-fill">
        {dots.map((filled, i) => (
          <span key={i} className={`seat-dot${filled ? ' filled' : ''}`} />
        ))}
      </div>
      <span className="seat-count-label">
        {fills} / {goal} filled
      </span>
    </div>
  );
};

export default CapacityBar;