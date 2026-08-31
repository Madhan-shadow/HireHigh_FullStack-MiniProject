import React, { useState, useEffect, useRef } from 'react';

const SearchIcon = () => (
  <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SearchFilterBar = ({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  autoFocus = false,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const next = e.target.value;
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch && onSearch(next);
    }, debounceMs);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="search-filter-bar">
      <div className="search-input-wrap">
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default SearchFilterBar;