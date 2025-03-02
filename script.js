// Store and retrieve movies from localStorage
class MovieManager {
    constructor() {
        this.movies = JSON.parse(localStorage.getItem('movies')) || [];
        this.OMDB_API_KEY = '9c6a1ea1';
    }

    async searchMovie(title) {
        const response = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${this.OMDB_API_KEY}`);
        const data = await response.json();
        return data;
    }

    async addMovie(title, rating, notes) {
        // Fetch movie data from OMDB
        const movieData = await this.searchMovie(title);
        
        const movie = {
            id: Date.now(),
            title,
            rating: Number(rating),
            notes,
            date: new Date().toISOString(),
            poster: movieData.Poster !== 'N/A' ? movieData.Poster : null,
            year: movieData.Year || null,
            director: movieData.Director || null,
            plot: movieData.Plot || null
        };

        this.movies.push(movie);
        this.saveMovies();
        return movie;
    }

    deleteMovie(id) {
        this.movies = this.movies.filter(movie => movie.id !== id);
        this.saveMovies();
    }

    saveMovies() {
        localStorage.setItem('movies', JSON.stringify(this.movies));
    }

    getAllMovies() {
        return this.movies.sort((a, b) => b.rating - a.rating);
    }
}

// Initialize the movie manager
const movieManager = new MovieManager();

// DOM Elements
const movieForm = document.getElementById('movieForm');
const moviesListDiv = document.getElementById('moviesList');

// Event Listeners
movieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('movieTitle').value;
    const rating = document.getElementById('movieRating').value;
    const notes = document.getElementById('movieNotes').value;

    // Add loading state if desired
    try {
        await movieManager.addMovie(title, rating, notes);
        displayMovies();
        movieForm.reset();
    } catch (error) {
        console.error('Error adding movie:', error);
        alert('Error adding movie. Please try again.');
    }
});

// Display movies function
function displayMovies() {
    const movies = movieManager.getAllMovies();
    moviesListDiv.innerHTML = movies.map(movie => `
        <div class="movie-card">
            ${movie.poster ? `
                <img src="${movie.poster}" alt="${movie.title} poster" class="movie-poster">
            ` : ''}
            <div class="movie-info">
                <h3>${movie.title} ${movie.year ? `(${movie.year})` : ''}</h3>
                <p>Rating: ${movie.rating}/10</p>
                ${movie.director ? `<p>Director: ${movie.director}</p>` : ''}
                ${movie.plot ? `<p>Plot: ${movie.plot}</p>` : ''}
                ${movie.notes ? `<p>Notes: ${movie.notes}</p>` : ''}
                <button onclick="deleteMovie(${movie.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Delete movie function
function deleteMovie(id) {
    movieManager.deleteMovie(id);
    displayMovies();
}

// Initial display
displayMovies();
