// Movie Class: Represents a Movie
class Movie {
    constructor(title, director, score) {
      this.title = title;
      this.director = director;
      this.score = score;
    }
}
  
/* HANDLE UI TASKS */
class UIMovies {
    static displayMovies() {
      const movies = StoreMovies.getMovies();
  
      movies.forEach((movie) => UIMovies.addMovieToList(movie));
    }
  
    static addMovieToList(movie) {
      const movieList = document.querySelector('#movie-list');
      const movieId = (movie.title).toLowerCase().replace(/\s+/g, '');
  
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
  
    static deleteMovie(el) {
      if(el.classList.contains('delete')) {
        el.parentElement.parentElement.remove();
      }
    }
  
    static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.movie-list__wrap');
      const form = document.querySelector('#movie-form');
      container.insertBefore(div, form);
  
      // Alert to vanish in 3 seconds
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  
    static clearFields() {
      document.querySelector('#movietitle').value = '';
      document.querySelector('#director').value = '';
      document.querySelector('#score').value = '';
    }
}

/* STORE MOVIES IN LOCALSTORAGE */
class StoreMovies {
    static getMovies() {
      let movies;
      if(localStorage.getItem('movies') === null) {
        movies = [];
      } else {
        movies = JSON.parse(localStorage.getItem('movies'));
      }
  
      return movies;
    }
  
    static addMovie(movie) {
      const movies = StoreMovies.getMovies();
      movies.push(movie);
      localStorage.setItem('movies', JSON.stringify(movies));
    }
  
    static removeMovie(title) {
      const movies = StoreMovies.getMovies();
  
      movies.forEach((movie, index) => {
        if(movie.title === title) {
            movies.splice(index, 1);
            console.log(title + ' removed from store');
        }
        // console.log(`movie.title: ${movie.title}, title: ${title}, index: ${index}`);
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
  
    // Validate
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
    
    UIMovies.deleteMovie(e.target); // Remove book from UI
    StoreMovies.removeMovie(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);// Remove book from store
    // console.log(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent)
    UIMovies.showAlert('Movie Removed', 'success'); // Show success message
});