// Store and retrieve movies from localStorage
class MovieManager {
    constructor() {
        this.movies = JSON.parse(localStorage.getItem('movies')) || [];
        this.OMDB_API_KEY = '9c6a1ea1'; // This is a temporary solution
    }

    async searchMovie(title) {
        try {
            console.log('Searching for movie:', title); // Debug log
            const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${this.OMDB_API_KEY}`;
            console.log('API URL:', url); // Debug log
            
            const response = await fetch(url);
            const data = await response.json();
            
            console.log('API Response:', data); // Debug log
            
            if (data.Error) {
                throw new Error(data.Error);
            }
            
            return data;
        } catch (error) {
            console.error('Search movie error:', error.message);
            throw error;
        }
    }

    async addMovie(title, rating, notes) {
        try {
            const movieData = await this.searchMovie(title);
            
            // Check if movie already exists
            const movieExists = this.movies.some(movie => 
                movie.Title?.toLowerCase() === movieData.Title?.toLowerCase()
            );
            
            if (movieExists) {
                throw new Error('Movie already in list');
            }
            
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
        } catch (error) {
            console.error('Add movie error:', error.message);
            throw error;
        }
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

// Add this at the end of your file
document.addEventListener('DOMContentLoaded', () => {
    const secretButton = document.getElementById('secretButton');
    let messageElement = document.createElement('div');
    messageElement.className = 'secret-message';
    messageElement.textContent = 'i love you kai ♥';
    document.body.appendChild(messageElement);

    secretButton.addEventListener('click', () => {
        secretButton.classList.toggle('active');
        messageElement.classList.toggle('visible');
        
        // Auto-hide after 3 seconds
        if (messageElement.classList.contains('visible')) {
            setTimeout(() => {
                messageElement.classList.remove('visible');
                secretButton.classList.remove('active');
            }, 3000);
        }
    });
});
