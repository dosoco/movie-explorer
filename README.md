# CODE ALONG: MOVIE EXPLORER APP
## React API Integration Mini-Project

This code-along will guide you through building a Movie Explorer application, teaching you how to integrate with external APIs in React. We'll focus on:

1. Making API requests using the Fetch API
2. Managing loading and error states
3. Building a search interface
4. Displaying dynamic content from API responses
5. Creating a responsive, user-friendly UI

## PART 1: PROJECT SETUP

Let's start by creating a new Vite React project:

```bash
npm create vite@latest movie-explorer -- --template react
cd movie-explorer
npm install
npm run dev
```

## PART 2: PROJECT STRUCTURE

Create a well-organized folder structure:

1. Create the following folders in the `src` directory:
   - `components` (for UI components)
   - `components/movies` (for movie-specific components)
   - `components/common` (for reusable components)
   - `styles` (for CSS files)
   - `services` (for API-related code)
   - `hooks` (for custom hooks)

2. Delete any unnecessary files from the starter template:
   - `src/assets/react.svg`

## PART 3: SETTING UP THE API SERVICE

We'll use the OMDB API (Open Movie Database) which requires an API key. 

1. Go to [OMDB API](http://www.omdbapi.com/apikey.aspx) and request a free API key
2. Create a new file: `src/services/movieService.js`
3. Add the following code:

```javascript
// This file contains functions for interacting with the OMDB API

// Replace this with your actual API key from http://www.omdbapi.com/
const API_KEY = 'YOUR_OMDB_API_KEY';
const BASE_URL = 'https://www.omdbapi.com/';

/**
 * Search for movies by title
 * @param {string} query - The movie title to search for
 * @param {number} page - The page number (each page contains 10 results)
 * @returns {Promise} - The search results
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // The API returns { Response: "False" } when there are no results
    if (data.Response === "False") {
      throw new Error(data.Error || "No movies found");
    }
    
    return data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

/**
 * Get detailed information about a specific movie by its ID
 * @param {string} id - The IMDB ID of the movie
 * @returns {Promise} - The movie details
 */
export const getMovieDetails = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === "False") {
      throw new Error(data.Error || "Movie details not found");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
```

## PART 4: CREATING THE HEADER COMPONENT

1. Create a new file: `src/components/common/Header.jsx`
2. Add the following code:

```jsx
import React from 'react'
import '../../styles/Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <h1 className="logo-text">Movie Explorer</h1>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link">Favorites</a>
          <a href="#" className="nav-link">About</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
```

3. Create a CSS file: `src/styles/Header.css`
4. Add the following styles:

```css
.header {
  background: linear-gradient(to right, #032541, #01b4e4);
  color: white;
  padding: 16px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 0;
  position: relative;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 1;
}

.nav-link.active {
  opacity: 1;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav {
    width: 100%;
    justify-content: center;
  }
}
```

## PART 5: CREATING THE SEARCH BAR COMPONENT

1. Create a new file: `src/components/movies/SearchBar.jsx`
2. Add the following code:

```jsx
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
```

3. Create a CSS file: `src/styles/SearchBar.css`
4. Add the following styles:

```css
.search-container {
  max-width: 800px;
  margin: 0 auto 30px auto;
  padding: 0 20px;
}

.search-form {
  display: flex;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 16px 20px;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-button {
  background-color: #01b4e4;
  color: white;
  border: none;
  padding: 0 25px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #0095c8;
}

.search-button i {
  font-size: 1rem;
}

@media (max-width: 576px) {
  .search-form {
    flex-direction: column;
    border-radius: 10px;
  }
  
  .search-input {
    width: 100%;
    border-radius: 10px 10px 0 0;
  }
  
  .search-button {
    width: 100%;
    padding: 12px;
    justify-content: center;
  }
}
```

## PART 6: CREATING THE LOADING SPINNER COMPONENT

1. Create a new file: `src/components/common/LoadingSpinner.jsx`
2. Add the following code:

```jsx
import React from 'react'
import '../../styles/LoadingSpinner.css'

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  )
}

export default LoadingSpinner
```

3. Create a CSS file: `src/styles/LoadingSpinner.css`
4. Add the following styles:

```css
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #01b4e4;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

.loading-text {
  margin-top: 15px;
  color: #666;
  font-size: 1.1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

## PART 7: CREATING THE MOVIE CARD COMPONENT

1. Create a new file: `src/components/movies/MovieCard.jsx`
2. Add the following code:

```jsx
import React from 'react'
import '../../styles/MovieCard.css'

function MovieCard({ movie, onClick }) {
  // Use a placeholder image if poster is not available or is "N/A"
  const posterUrl = movie.Poster && movie.Poster !== 'N/A'
    ? movie.Poster
    : 'https://via.placeholder.com/300x450?text=No+Poster+Available';
  
  return (
    <div className="movie-card" onClick={() => onClick(movie.imdbID)}>
      <div className="movie-poster-container">
        <img 
          src={posterUrl} 
          alt={`${movie.Title} poster`} 
          className="movie-poster"
        />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">{movie.Year}</p>
      </div>
    </div>
  )
}

export default MovieCard
```

3. Create a CSS file: `src/styles/MovieCard.css`
4. Add the following styles:

```css
.movie-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.movie-poster-container {
  height: 300px;
  overflow: hidden;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

.movie-info {
  padding: 15px;
}

.movie-title {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-year {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
```

## PART 8: CREATING THE MOVIE DETAILS COMPONENT

1. Create a new file: `src/components/movies/MovieDetails.jsx`
2. Add the following code:

```jsx
import React from 'react'
import '../../styles/MovieDetails.css'

function MovieDetails({ movie, onClose }) {
  // Use a placeholder image if poster is not available
  const posterUrl = movie.Poster && movie.Poster !== 'N/A'
    ? movie.Poster
    : 'https://via.placeholder.com/300x450?text=No+Poster+Available';
  
  return (
    <div className="movie-details-overlay">
      <div className="movie-details-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="movie-details-grid">
          <div className="movie-details-poster">
            <img src={posterUrl} alt={`${movie.Title} poster`} />
          </div>
          
          <div className="movie-details-info">
            <h2 className="details-title">{movie.Title}</h2>
            
            <div className="movie-meta">
              <span className="year">{movie.Year}</span>
              <span className="separator">•</span>
              <span className="rated">{movie.Rated}</span>
              <span className="separator">•</span>
              <span className="runtime">{movie.Runtime}</span>
            </div>
            
            <div className="movie-genres">
              {movie.Genre.split(', ').map(genre => (
                <span key={genre} className="genre-tag">{genre}</span>
              ))}
            </div>
            
            <div className="rating-container">
              <div className="imdb-rating">
                <span className="rating-label">IMDb Rating:</span>
                <span className="rating-value">{movie.imdbRating}</span>/10
              </div>
            </div>
            
            <div className="movie-plot">
              <h3>Plot</h3>
              <p>{movie.Plot}</p>
            </div>
            
            <div className="movie-people">
              <div className="person-group">
                <h3>Director</h3>
                <p>{movie.Director}</p>
              </div>
              
              <div className="person-group">
                <h3>Writer</h3>
                <p>{movie.Writer}</p>
              </div>
              
              <div className="person-group">
                <h3>Actors</h3>
                <p>{movie.Actors}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
```

3. Create a CSS file: `src/styles/MovieDetails.css`
4. Add the following styles:

```css
.movie-details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s;
}

.movie-details-content {
  background-color: white;
  border-radius: 10px;
  overflow: auto;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  position: relative;
  animation: slideUp 0.3s;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  z-index: 10;
}

.movie-details-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  padding: 30px;
}

.movie-details-poster img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.details-title {
  font-size: 2rem;
  margin: 0 0 10px 0;
  color: #032541;
}

.movie-meta {
  margin-bottom: 15px;
  color: #666;
}

.separator {
  margin: 0 8px;
}

.movie-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.genre-tag {
  background-color: #032541;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.rating-container {
  margin-bottom: 20px;
}

.imdb-rating {
  display: inline-block;
  background-color: #f5c518;
  color: #000;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
}

.rating-label {
  margin-right: 5px;
}

.rating-value {
  font-size: 1.2rem;
}

.movie-plot h3,
.movie-people h3 {
  color: #032541;
  margin-bottom: 5px;
}

.movie-plot p {
  line-height: 1.6;
  margin-bottom: 20px;
}

.person-group {
  margin-bottom: 15px;
}

.person-group p {
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 768px) {
  .movie-details-grid {
    grid-template-columns: 1fr;
  }
  
  .movie-details-poster {
    max-width: 300px;
    margin: 0 auto;
  }
}
```

## PART 9: CREATING THE MOVIE LIST COMPONENT

1. Create a new file: `src/components/movies/MovieList.jsx`
2. Add the following code:

```jsx
import React from 'react'
import MovieCard from './MovieCard'
import '../../styles/MovieList.css'

function MovieList({ movies, onMovieClick }) {
  return (
    <div className="movie-list">
      {movies.map(movie => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onClick={onMovieClick}
        />
      ))}
    </div>
  )
}

export default MovieList
```

3. Create a CSS file: `src/styles/MovieList.css`
4. Add the following styles:

```css
.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .movie-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
}
```

## PART 10: CREATING THE MOVIE CONTAINER COMPONENT

1. Create a new file: `src/components/movies/MovieContainer.jsx`
2. Add the following code:

```jsx
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
```

3. Create a CSS file: `src/styles/MovieContainer.css`
4. Add the following styles:

```css
.movie-container {
  padding: 30px 0;
}

.results-count {
  max-width: 1200px;
  margin: 0 auto 20px;
  padding: 0 20px;
  font-size: 0.9rem;
  color: #666;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 15px 20px;
  border-radius: 8px;
  max-width: 800px;
  margin: 20px auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-message i {
  font-size: 1.5rem;
}

.error-message p {
  margin: 0;
}

.welcome-message {
  text-align: center;
  padding: 60px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.welcome-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.welcome-message h2 {
  margin-bottom: 10px;
  color: #032541;
}

.welcome-message p {
  color: #666;
  font-size: 1.1rem;
}
```

## PART 11: CREATING THE FOOTER COMPONENT

1. Create a new file: `src/components/common/Footer.jsx`
2. Add the following code:

```jsx
import React from 'react'
import '../../styles/Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <p>&copy; {currentYear} Movie Explorer</p>
          <p className="footer-note">Built with React & Vite</p>
        </div>
        
        <div className="api-credit">
          <p>Data provided by 
            <a href="http://www.omdbapi.com/" target="_blank" rel="noopener noreferrer">
              OMDb API
            </a>
          </p>
        </div>
        
        <div className="footer-links">
          <a href="#" className="footer-link">About</a>
          <a href="#" className="footer-link">Contact</a>
          <a href="#" className="footer-link">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

3. Create a CSS file: `src/styles/Footer.css`
4. Add the following styles:

```css
.footer {
  background-color: #032541;
  color: white;
  padding: 30px 0;
  margin-top: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info p {
  margin: 0;
}

.footer-note {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-top: 5px !important;
}

.api-credit {
  text-align: center;
}

.api-credit a {
  color: #01b4e4;
  margin-left: 5px;
  text-decoration: none;
}

.api-credit a:hover {
  text-decoration: underline;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-link {
  color: white;
  opacity: 0.7;
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer-link:hover {
  opacity: 1;
  text-decoration: none;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
}
```

## PART 12: UPDATING THE APP COMPONENT

1. Update the `App.jsx` file:

```jsx
import React from 'react'
import './App.css'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import MovieContainer from './components/movies/MovieContainer'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <MovieContainer />
      </main>
      <Footer />
    </div>
  )
}

export default App
```

2. Update the `App.css` file:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.5;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
```

## PART 13: CONNECTING FONT AWESOME FOR ICONS

1. Add the Font Awesome CDN to the `index.html` file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Add Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <title>Movie Explorer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## PART 14: RUNNING THE APPLICATION

Now let's run the application:

```bash
npm run dev
```

Visit the URL shown in your terminal (usually http://localhost:5173) to see your Movie Explorer in action!

**Note:** For the app to work correctly, you need to replace `'YOUR_OMDB_API_KEY'` in the `movieService.js` file with your actual API key from OMDB.

## PART 15: MANAGING API REQUESTS

A key aspect of this project is understanding how to properly manage API requests in React. Let's explore the important patterns used:

### 1. Separation of API Logic

We've separated our API-related code into a dedicated service (`movieService.js`), which provides several benefits:
- Keeps components clean and focused on the UI
- Makes it easier to change the API endpoint or implementation details
- Centralizes error handling
- Provides reusable functions across components

### 2. Loading States

We're using loading states to show a spinner when data is being fetched:
```jsx
// Inside MovieContainer.jsx
const [loading, setLoading] = useState(false);

// Before making API request
setLoading(true);

// After API request completes
setLoading(false);

// In the render section
{loading && <LoadingSpinner />}
```

### 3. Error Handling

We're properly handling and displaying errors from API requests:
```jsx
// Inside MovieContainer.jsx
try {
  const data = await searchMovies(query);
  // Process data
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}

// In the render section
{error && (
  <div className="error-message">
    <i className="fas fa-exclamation-circle"></i>
    <p>{error}</p>
  </div>
)}
```

### 4. Controlled API Calls

We're using `useEffect` to control when API calls happen:
```jsx
useEffect(() => {
  if (searchQuery) {
    performSearch(searchQuery);
  }
}, [searchQuery]);
```

## PART 16: KEY CONCEPTS

### 1. API Integration
- Making HTTP requests with the Fetch API
- Handling asynchronous operations with async/await
- Proper error handling
- Service-based architecture for API calls

### 2. State Management
- Using React's useState hook for local state
- Managing multiple related states (movies, loading, error)
- Conditional rendering based on state
- Lifting state up for shared data

### 3. Component Design
- Creating reusable components
- Props for component communication
- Implementing modals (MovieDetails component)
- Responsive UI design

### 4. React Hooks
- useState for local state management
- useEffect for side effects like API calls
- Dependency arrays to control when effects run

### 5. Event Handling
- Form submissions
- Click handlers
- Closing modals
- Search functionality

## PART 17: EXTENSION CHALLENGES

Now that you've built the basic application, try these extension challenges:

1. **Pagination**
   - Add pagination controls to navigate through search results
   - Implement "Load More" functionality

2. **Favorites Feature**
   - Add the ability to mark movies as favorites
   - Store favorites in localStorage
   - Create a separate page to display favorite movies

3. **Advanced Search Filters**
   - Add filters for year, type (movie, series, episode)
   - Create a dropdown for filtering search results

4. **Responsive Enhancements**
   - Improve mobile experience with touch-friendly controls
   - Add swipe gestures for navigating movie details

5. **Performance Optimizations**
   - Implement debouncing for the search input
   - Add lazy loading for movie images
   - Memoize components with React.memo

## PART 18: UNDERSTANDING API RATE LIMITS

When working with external APIs like OMDB, it's important to understand rate limits:

1. The free tier of OMDB API has a limit of 1,000 requests per day
2. If you exceed this limit, you'll receive an error response
3. To handle this gracefully, add appropriate error messages

Example error handling for rate limits:

```jsx
try {
  const data = await searchMovies(query);
  // Process data
} catch (err) {
  // Check for rate limit errors
  if (err.message.includes('limit')) {
    setError('API request limit reached. Please try again tomorrow.');
  } else {
    setError(err.message);
  }
}
```

## CONCLUSION

Congratulations! You've built a React application that integrates with an external API. This project demonstrates important concepts for modern web development:

- How to make API requests in React
- Managing loading and error states
- Creating a responsive, user-friendly UI
- Implementing search functionality
- Displaying dynamic content from API responses

The skills you've learned in this project are directly applicable to many real-world applications. APIs power much of the modern web, and knowing how to effectively integrate with them is an essential skill for any front-end developer.

Remember to protect your API keys and respect API rate limits when building applications. In a production environment, you would typically make API requests through a backend service rather than directly from the client, but this approach works well for learning and small applications.

Feel free to extend this project with the challenges mentioned above, or explore other movie-related APIs to add even more features!