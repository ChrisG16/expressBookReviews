const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

/*
// Commented on by the implementation of async and await below
// Obtener la lista de libros disponibles en la tienda
// Get the book list available in the shop
public_users.get('/', function (request, response) {
    return response.status(200).send(JSON.stringify(books));
});
*/

// Obtener la lista de libros disponibles en la tienda de forma asíncrona
// Get the book list available in the shop using custom promise and Async/Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve({ data: books });
        } else {
          reject("No books found.");
        }
      });
    };

    const response = await getBooks();
    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ message: "Error getting book list", error: error.toString() });
  }
});

/*
// Commented on by the implementation of async and await below
// Obtener los detalles del libro basado en un ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (request, response) {
  const isbn = request.params.isbn;
  return response.status(200).send(books[isbn]);
});
*/

// Obtener los detalles del libro basado en un ISBN de forma asíncrona
// Get book details based on ISBN using custom promise and Async/Await
public_users.get('/isbn/:isbn', async function (request, response) {
  const isbn = request.params.isbn;

  try {
    const getBookByISBN = () => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve({ data: books[isbn] });
        } else {
          reject("Book not found.");
        }
      });
    };

    const result = await getBookByISBN();

    return response.status(200).json(result.data);

  } catch (error) {
    return response.status(404).json({ message: error });
  }
});

/*
// Commented on by the implementation of async and await below
// Obtener los detalles del libro basandose en el autor
// Get book details based on author
public_users.get('/author/:author', function (request, response) {
  const author = request.params.author;
  const keys = Object.keys(books);

  const filtered_book = keys
    .map(key => books[key])
    .filter(book => book.author === author);

  if (filtered_book.length > 0) {
    return response.status(200).send(filtered_book);
  } else {
    return response.status(404).send(`No books found with the autor "${author}".`);
  }
});
*/

// Obtener los detalles del libro basandose en el autor de forma asíncrona
// Get book details based on author using custom promise and Async/Await
public_users.get('/author/:author', async function (request, response) {
  const author = request.params.author;

  const getBooksByAuthor = () => {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const filtered_books = keys
        .map(key => books[key])
        .filter(book => book.author === author);

      if (filtered_books.length > 0) {
        resolve({ data: filtered_books });
      } else {
        reject(`No books found with the author "${author}".`);
      }
    });
  };

  try {
    const result = await getBooksByAuthor();
    return response.status(200).json(result.data);
  } catch (error) {
    return response.status(404).json({ message: error });
  }
});

/*
// Commented on by the implementation of async and await below
// Obtener todos los libros basandose en el título
// Get all books based on title
public_users.get('/title/:title', function (request, response) {
  const title = request.params.title;
  const keys = Object.keys(books);

  const filtered_book = keys
    .map(key => books[key])
    .filter(book => book.title === title);

  if (filtered_book.length > 0) {
    return response.status(200).send(filtered_book);
  } else {
    return response.status(404).send(`Book with title "${title}" not found.`);
  }
});
*/

// Obtener todos los libros basandose en el título de forma asíncrona
// Get all books based on title using custom promise and Async/Await
public_users.get('/title/:title', async function (request, response) {
  const title = request.params.title;

  const getBooksByTitle = () => {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const filtered_books = keys
        .map(key => books[key])
        .filter(book => book.title === title);

      if (filtered_books.length > 0) {
        resolve({ data: filtered_books });
      } else {
        reject(`Book with title "${title}" not found.`);
      }
    });
  };

  try {
    const result = await getBooksByTitle();
    return response.status(200).json(result.data);
  } catch (error) {
    return response.status(404).json({ message: error });
  }
});

// Obtener las reseñas de un libro mediante su ISBN
// Get book reviews using ISBN
public_users.get('/review/:isbn', function (request, response) {
  const isbn = request.params.isbn;
  return response.status(200).send(books[isbn].reviews);
});

module.exports.general = public_users;
