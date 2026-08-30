import React from 'react';
import './StageRail.css';

const STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED'];

export default function StageRail({ stage, size = 'md' }) {
  const isRejected = stage === 'REJECTED';
  const activeIndex = isRejected ? -1 : STAGES.indexOf(stage);

  return (
    <div className={`stage-rail stage-rail--${size} ${isRejected ? 'stage-rail--rejected' : ''}`}>
      {STAGES.map((s, i) => {
        const done = !isRejected && i < activeIndex;
        const active = !isRejected && i === activeIndex;
        return (
          <React.Fragment key={s}>
            <div className={`stage-node ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`} title={s}>
              <span className="stage-dot" />
              <span className="stage-label">{s.charAt(0) + s.slice(1).toLowerCase()}</span>
            </div>
            {i < STAGES.length - 1 && <div className={`stage-track ${done ? 'is-done' : ''}`} />}
          </React.Fragment>
        );
      })}
      {isRejected && (
        <div className="stage-branch">
          <span className="stage-branch-line" />
          <span className="stage-node is-rejected">
            <span className="stage-dot" />
            <span className="stage-label">Rejected</span>
          </span>
        </div>
      )}
    </div>
  );
}