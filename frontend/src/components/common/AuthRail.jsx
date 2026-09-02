import React from 'react';

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

/**
 * Illustrative rail shown on the auth screens. Not wired to real data —
 * it exists purely to show, rather than tell, what this product does.
 */
const AuthRail = ({ activeStage }) => {
  const activeIndex = STAGES.indexOf(activeStage);

  return (
    <ol className="auth-rail" aria-label="Hiring pipeline stages">
      {STAGES.map((stage, i) => {
        let state = 'upcoming';
        if (i < activeIndex) state = 'done';
        if (i === activeIndex) state = 'current';

        return (
          <li key={stage} className={`auth-rail-step auth-rail-step--${state}`}>
            <span className="auth-rail-dot" />
            <span className="auth-rail-label">{stage}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default AuthRail;