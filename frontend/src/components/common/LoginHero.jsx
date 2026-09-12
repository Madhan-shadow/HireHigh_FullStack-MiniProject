import React from 'react';
import './LoginHero.css';

const RAIL_STAGES = [
  { color: '#3d6b5a' }, // Applied
  { color: '#3d6b5a' }, // Screening
  { color: '#b5673c' }, // Interview
  { color: '#6d4e96' }, // Offer
  { color: '#a9791f' }, // Hired
];

const LoginHero = () => {
  return (
    <div className="login-hero">
      <span className="login-hero-corner login-hero-corner--gold" aria-hidden="true" />
      <span className="login-hero-corner login-hero-corner--lavender" aria-hidden="true" />

      <div className="login-hero-content">
        <div className="login-hero-rail" aria-hidden="true">
          {RAIL_STAGES.map((stage, i) => (
            <React.Fragment key={i}>
              <span
                className={
                  'login-hero-rail-dot' + (i === RAIL_STAGES.length - 1 ? ' is-final' : '')
                }
                style={{ background: stage.color }}
              />
              {i < RAIL_STAGES.length - 1 && (
                <span
                  className="login-hero-rail-line"
                  style={{ background: stage.color }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="login-hero-text">
          <span className="login-hero-mark" aria-hidden="true">&#8220;</span>
          <p className="login-hero-quote">
            Somewhere between &ldquo;Applied&rdquo; and &ldquo;Hired,&rdquo;
            people are waiting. We keep them visible.
          </p>
          <span className="login-hero-rule" />
          <p className="login-hero-attribution">
            Built for recruiters and candidates alike
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginHero;