// Book Class: Represents a Book
class Book {
    // constructor for book information
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    }
  }
  
/* HANDLE UI TASKS */
class UI {
    // Function to display books in list
    static displayBooks() {
      const books = Store.getBooks(); // Get books from localStorage
  
      books.forEach((book) => UI.addBookToList(book));
    }
  
    // Function to add books to list
    static addBookToList(book) {
      const bookList = document.querySelector('#book-list');
  
      // HTML for book items to be displayed in list
      const bookItem = /*html*/`
        <tr class="table-body-row" data-id="${book.isbn}">
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><i class="fa-solid fa-trash delete"></i></td>
        </tr>
      `;

      bookList.insertAdjacentHTML('beforeend', bookItem);
    }
  
    // Function to delete book from list
    static deleteBook(el) {
      if(el.classList.contains('delete')) { // Find delete btn
        el.parentElement.parentElement.remove(); // Find parent of parent element and remove from list
      }
    }
  
    // Function to show alert when deleted, added or error
    static showAlert(message, className) {
      const div = document.createElement('div'); // Create a div
      div.className = `alert alert-${className}`; // Add class to div
      div.appendChild(document.createTextNode(message)); // Add message to div
      const container = document.querySelector('.book-list__wrap'); // Get container
      const form = document.querySelector('#book-form'); // Get form
      container.insertBefore(div, form); // Display message before form element
  
      // Alert to vanish in 3 seconds
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  
    // Function to clear form fields after item is added
    static clearFields() {
      document.querySelector('#booktitle').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#isbn').value = '';
    }
}

/* STORE BOOKS IN LOCALSTORAGE */
class Store {
    // Function to get books from localStorage
    static getBooks() {
      let books; // variable 'books' created with no value
      if(localStorage.getItem('books') === null) {
        // if localStorage is empty, the books array is empty
        books = [];
      } else {
        // Else books array gets items from localStorage
        books = JSON.parse(localStorage.getItem('books'));
      }
  
      return books;
    }
  
    // Function to add books to localStorage
    static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    // Function to remove books from localStorage by isbn nr.
    static removeBook(isbn) {
      const books = Store.getBooks();
  
      books.forEach((book, index) => {
        if(book.isbn === isbn) {
          books.splice(index, 1);
        }

        console.log(book.isbn, isbn);
      });
  
      localStorage.setItem('books', JSON.stringify(books));
    }
}
  
/* DISPLAY BOOKS */
document.addEventListener('DOMContentLoaded', UI.displayBooks);
  
/* ADD A BOOK */
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();
  
    // Get form values
    const title = document.querySelector('#booktitle').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
  
    // Validate form inputs
    if(title === '' || author === '' || isbn === '') {
      UI.showAlert('Please fill in all fields', 'danger');
    } else {
      // Instatiate book
      const book = new Book(title, author, isbn);
  
      UI.addBookToList(book); // Add Book to UI
      Store.addBook(book); // Add book to store
      UI.showAlert('Book Added', 'success'); // Show success message
      UI.clearFields(); // Clear fields
    }
});
  
// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    e.preventDefault();
    
    UI.deleteBook(e.target); // Remove book from UI
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);// Remove book from store
    UI.showAlert('Book Removed', 'success'); // Show success message
});