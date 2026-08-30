import React from 'react';
import './CapacityBar.css';

export default function CapacityBar({ currentFills = 0, hiringGoal = 1 }) {
  const seats = Array.from({ length: hiringGoal }, (_, i) => i < currentFills);

  return (
    <div className="capacity-bar" aria-label={`${currentFills} of ${hiringGoal} seats filled`}>
      <div className="capacity-seats">
        {seats.map((filled, i) => (
          <span key={i} className={`seat ${filled ? 'seat--filled' : 'seat--open'}`} />
        ))}
      </div>
      <span className="capacity-count mono">{currentFills}/{hiringGoal}</span>
    </div>
  );
}