class MovieManager {
    constructor() {
        this.movies = JSON.parse(localStorage.getItem('movies')) || [];
        this.OMDB_API_KEY = '9c6a1ea1';
    }

    async searchMovie(title) {
        const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${this.OMDB_API_KEY}`);
        const data = await response.json();
        return data;
    }

    async addMovie(title, rating, notes) {
        const movieData = await this.searchMovie(title);
        
        const movie = {
            id: Date.now(),
            title,
            rating: parseFloat(rating).toFixed(1),
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

    getAllMovies(sortBy = 'rating') {
        return [...this.movies].sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return parseFloat(b.rating) - parseFloat(a.rating);
                case 'title':
                    const cleanTitle = (title) => {
                        return title.replace(/^The\s+/i, '').trim();
                    };
                    return cleanTitle(a.title).localeCompare(cleanTitle(b.title));
                case 'year':
                    if (!a.year) return 1;
                    if (!b.year) return -1;
                    return parseInt(b.year) - parseInt(a.year);
                case 'director':
                    const getLastName = (director) => {
                        if (!director) return '';
                        return director.split(' ').pop();
                    };
                    return getLastName(a.director).localeCompare(getLastName(b.director));
                default:
                    return parseFloat(b.rating) - parseFloat(a.rating);
            }
        });
    }
}

const movieManager = new MovieManager();

const movieForm = document.getElementById('movieForm');
const moviesListDiv = document.getElementById('moviesList');

movieForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('movieTitle').value;
    const rating = document.getElementById('movieRating').value;
    const notes = document.getElementById('movieNotes').value;

    try {
        await movieManager.addMovie(title, rating, notes);
        displayMovies();
        movieForm.reset();
    } catch (error) {
        console.error('Error adding movie:', error);
        alert('Error adding movie. Please try again.');
    }
});

function displayMovies(sortBy = 'rating') {
    const movies = movieManager.getAllMovies(sortBy);
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

function deleteMovie(id) {
    movieManager.deleteMovie(id);
    displayMovies();
}

displayMovies();

document.addEventListener('DOMContentLoaded', () => {
    const secretButton = document.getElementById('secretButton');
    let messageElement = document.createElement('div');
    messageElement.className = 'secret-message';
    messageElement.textContent = 'I love you Kai ♥';
    document.body.appendChild(messageElement);

    secretButton.addEventListener('click', () => {
        secretButton.classList.toggle('active');
        messageElement.classList.toggle('visible');
        
        if (messageElement.classList.contains('visible')) {
            setTimeout(() => {
                messageElement.classList.remove('visible');
                secretButton.classList.remove('active');
            }, 3000);
        }
    });

    addSortingControls();
});

function addSortingControls() {
    const sortingDiv = document.createElement('div');
    sortingDiv.className = 'sorting-controls';
    sortingDiv.innerHTML = `
        <label>Sort by:</label>
        <select id="sortSelect">
            <option value="rating">Rating</option>
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="director">Director</option>
        </select>
    `;
    
    const moviesList = document.getElementById('moviesList');
    moviesList.parentNode.insertBefore(sortingDiv, moviesList);

    document.getElementById('sortSelect').addEventListener('change', (e) => {
        displayMovies(e.target.value);
    });
}