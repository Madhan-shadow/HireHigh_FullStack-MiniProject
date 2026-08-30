import React, { forwardRef } from 'react';
import './SearchFilterBar.css';

const SearchFilterBar = forwardRef(function SearchFilterBar(
  { value, onChange, placeholder = 'Filter by candidate' },
  ref
) {
  return (
    <div className="search-bar">
      <svg className="search-bar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        ref={ref}
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
});

export default SearchFilterBar;