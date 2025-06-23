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