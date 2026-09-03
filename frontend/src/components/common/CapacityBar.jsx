import React from "react";

export default function CapacityBar({ current = 0, goal = 0 }) {
  const safeCurrent = Number(current) || 0;
  const safeGoal = Number(goal) || 0;

  const percentage =
    safeGoal > 0
      ? Math.min(100, (safeCurrent / safeGoal) * 100)
      : 0;

  return (
    <div className="capacity">
      <div className="capacity-track">
        <div
          className="capacity-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span>
        {safeCurrent} / {safeGoal}
      </span>
    </div>
  );
}