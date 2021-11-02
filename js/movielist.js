// Movie Class: Represents a Movie
class Movie {
    // constructor for movie information
    constructor(title, director, score) {
      this.title = title;
      this.director = director;
      this.score = score;
    }
}
  
/* HANDLE UI TASKS */
class UIMovies {
    // Function to display movies in list
    static displayMovies() {
      const movies = StoreMovies.getMovies(); // Get movies from localStorage
  
      movies.forEach((movie) => UIMovies.addMovieToList(movie));
    }
  
    // Function to add movies to list
    static addMovieToList(movie) {
      const movieList = document.querySelector('#movie-list');
      const movieId = (movie.title).toLowerCase().replace(/\s+/g, ''); // Gets movie title and puts it in lower case and removes spaces to create ID
  
      // HTML for movie items to be displayed in list
      const movieItem = /*html*/`
        <tr class="table-body-row" data-id="${movieId}">
            <td>${movie.title}</td>
            <td>${movie.director}</td>
            <td>${movie.score}</td>
            <td><i class="fa-solid fa-trash delete"></i></td>
        </tr>
      `;

      movieList.insertAdjacentHTML('beforeend', movieItem);
    }
  
    // Function to delete movie from list
    static deleteMovie(el) {
      if(el.classList.contains('delete')) { // Find delete btn
        el.parentElement.parentElement.remove(); // Find parent of parent element and remove from list
      }
    }
  
    // Function to show alert when deleted, added or error
    static showAlert(message, className) {
      const div = document.createElement('div'); // Create a div
      div.className = `alert alert-${className}`; // Add class to div
      div.appendChild(document.createTextNode(message)); // Add message to div
      const container = document.querySelector('.movie-list__wrap'); // Get container
      const form = document.querySelector('#movie-form'); // Get form
      container.insertBefore(div, form); // Display message before form element
  
      // Alert to vanish in 3 seconds
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  
    // Function to clear form fields after item is added
    static clearFields() {
      document.querySelector('#movietitle').value = '';
      document.querySelector('#director').value = '';
      document.querySelector('#score').value = '';
    }
}

/* STORE MOVIES IN LOCALSTORAGE */
class StoreMovies {
    // Function to get movies from localStorage
    static getMovies() {
      let movies; // variable 'movies' created with no value
      if(localStorage.getItem('movies') === null) {
        // if localStorage is empty, the movies array is empty
        movies = [];
      } else {
        // Else movies array gets items from localStorage
        movies = JSON.parse(localStorage.getItem('movies'));
      }
  
      return movies;
    }
  
    // Function to add movies to localStorage
    static addMovie(movie) {
      const movies = StoreMovies.getMovies();
      movies.push(movie);
      localStorage.setItem('movies', JSON.stringify(movies));
    }
  
    // Function to remove movies from localStorage by title
    static removeMovie(title) {
      const movies = StoreMovies.getMovies();
  
      movies.forEach((movie, index) => {
        if(movie.title === title) {
            movies.splice(index, 1);
        }

        console.log(movie.title === title);
      });

      localStorage.setItem('movies', JSON.stringify(movies));
    }
}
  
/* DISPLAY MOVIES */
document.addEventListener('DOMContentLoaded', UIMovies.displayMovies);
  
/* ADD A MOVIE */
document.querySelector('#movie-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();
  
    // Get form values
    const title = document.querySelector('#movietitle').value;
    const director = document.querySelector('#director').value;
    const score = document.querySelector('#score').value;
  
    // Validate form inputs
    if(title === '' || director === '' || score === '') {
        UIMovies.showAlert('Please fill in all fields', 'danger');
    } else {
      // Instatiate movie
      const movie = new Movie(title, director, score);
  
      UIMovies.addMovieToList(movie); // Add movie to UI
      StoreMovies.addMovie(movie); // Add movie to storage
      UIMovies.showAlert('movie Added', 'success'); // Show success message
      UIMovies.clearFields(); // Clear fields
    }
});
  
// Event: Remove a Movie
document.querySelector('#movie-list').addEventListener('click', (e) => {
    e.preventDefault();
    
    UIMovies.deleteMovie(e.target); // Remove movie from UI
    StoreMovies.removeMovie(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);// Remove movie from store
    UIMovies.showAlert('Movie Removed', 'success'); // Show success message
});