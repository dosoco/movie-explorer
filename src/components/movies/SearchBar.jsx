import React, { useState } from 'react'
import '../../styles/SearchBar.css'

function SearchBar({ onSearch }) {
  // State to track the search input value
  const [searchTerm, setSearchTerm] = useState('');
  
  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Trim the search term to remove whitespace
    const trimmedSearchTerm = searchTerm.trim();
    
    // Only search if there's actually something to search for
    if (trimmedSearchTerm) {
      onSearch(trimmedSearchTerm);
    }
  };
  
  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i>
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar