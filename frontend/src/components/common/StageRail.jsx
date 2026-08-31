import React from 'react';

const FORWARD_STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED'];

const StageRail = ({ stage, showLabel = true }) => {
  if (stage === 'REJECTED') {
    return <span className="stage-chip-rejected">Rejected</span>;
  }

  const currentIndex = FORWARD_STAGES.indexOf(stage);

  return (
    <div className="stage-rail">
      {FORWARD_STAGES.map((s, i) => {
        let cls = 'stage-rail-segment';
        if (i < currentIndex) cls += ' done';
        if (i === currentIndex) cls += ' current';
        return <span key={s} className={cls} title={s} />;
      })}
      {showLabel && <span className="stage-rail-label">{(stage || '').toLowerCase()}</span>}
    </div>
  );
};

export default StageRail;