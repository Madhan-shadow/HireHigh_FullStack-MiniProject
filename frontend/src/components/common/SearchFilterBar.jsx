import React from 'react';

const SearchFilterBar = ({ placeholder, onSearch, value, onChange, inputRef }) => {
  const handleChange = (e) => {
    if (onChange) onChange(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="search-filter-bar">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchFilterBar;