import React, { useState, useEffect, useRef } from 'react';

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
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchFilterBar;