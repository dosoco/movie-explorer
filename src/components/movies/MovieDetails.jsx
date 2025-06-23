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