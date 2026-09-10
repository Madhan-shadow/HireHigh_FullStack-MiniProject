import React from 'react';
import './AuthQuote.css';

const AuthQuote = ({ quote, attribution }) => {
  return (
    <div className="auth-quote">
      <span className="auth-quote-mark" aria-hidden="true">&#8220;</span>
      <p className="auth-quote-text">{quote}</p>
      <span className="auth-quote-rule" />
      {attribution && <p className="auth-quote-attribution">{attribution}</p>}
    </div>
  );
};

export default AuthQuote;