import React, { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import MovieList from './MovieList'
import MovieDetails from './MovieDetails'
import LoadingSpinner from '../common/LoadingSpinner'
import { searchMovies, getMovieDetails } from '../../services/movieService'
import '../../styles/MovieContainer.css'

function MovieContainer() {
  // State for the list of movies
  const [movies, setMovies] = useState([]);
  
  // State for the currently selected movie (detailed view)
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // States for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for total results count
  const [totalResults, setTotalResults] = useState(0);
  
  // Search for movies when the component mounts
  useEffect(() => {
    // Only search if there's a query
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery]);
  
  // Function to handle search form submission
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  // Function to perform the actual search
  const performSearch = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchMovies(query);
      setMovies(data.Search);
      setTotalResults(parseInt(data.totalResults, 10));
    } catch (err) {
      setError(err.message);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle when a movie card is clicked
  const handleMovieClick = async (movieId) => {
    setLoading(true);
    setError(null);
    
    try {
      const movieData = await getMovieDetails(movieId);
      setSelectedMovie(movieData);
    } catch (err) {
      setError(`Error loading movie details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to close the movie details modal
  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };
  
  return (
    <div className="movie-container">
      <SearchBar onSearch={handleSearch} />
      
      {/* Show search results count if we have results */}
      {totalResults > 0 && (
        <div className="results-count">
          <span>{totalResults} movies found</span>
        </div>
      )}
      
      {/* Show loading spinner while loading */}
      {loading && <LoadingSpinner />}
      
      {/* Show error message if there's an error */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      )}
      
      {/* Show welcome message if no search has been performed */}
      {!loading && !error && movies.length === 0 && !searchQuery && (
        <div className="welcome-message">
          <div className="welcome-icon">🎬</div>
          <h2>Welcome to Movie Explorer!</h2>
          <p>Search for a movie above to get started.</p>
        </div>
      )}
      
      {/* Show movie list if we have movies */}
      {!loading && !error && movies.length > 0 && (
        <MovieList 
          movies={movies} 
          onMovieClick={handleMovieClick} 
        />
      )}
      
      {/* Show movie details modal if a movie is selected */}
      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  )
}

export default MovieContainer