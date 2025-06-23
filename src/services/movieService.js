// This file contains functions for interacting with the OMDB API

// Replace this with your actual API key from http://www.omdbapi.com/
const API_KEY = '9a5f0b82';
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