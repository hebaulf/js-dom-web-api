// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    }
  }
  
/* HANDLE UI TASKS */
class UI {
    static displayBooks() {
      const books = Store.getBooks();
  
      books.forEach((book) => UI.addBookToList(book));
    }
  
    static addBookToList(book) {
      const bookList = document.querySelector('#book-list');
  
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
  
    static deleteBook(el) {
      if(el.classList.contains('delete')) {
        el.parentElement.parentElement.remove();
      }
    }
  
    static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.book-list__wrap');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);
  
      // Alert to vanish in 3 seconds
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  
    static clearFields() {
      document.querySelector('#booktitle').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#isbn').value = '';
    }
}

/* STORE BOOKS IN LOCALSTORAGE */
class Store {
    static getBooks() {
      let books;
      if(localStorage.getItem('books') === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }
  
      return books;
    }
  
    static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    }
  
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
  
    // Validate
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