const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Verificar si el username y password coinciden con uno registrado
// Check if the username and password match a registered one
const authenticatedUser = (username, password) => {
  // Validating the username
  let validUser = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validUser.length > 0) {
    return true;
  } else {
    return false;
  };
};

// Iniciando sesión como usuario registrado
// Login as a registered user
regd_users.post("/login", (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  if (!username || !password) {
    return response.status(404).json({ message: "Username or password not provided" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

    request.session.authorization = { accessToken, username };

    return response.status(200).send("You have successfully logged in!");
  } else {
    return response.status(404).json({ message: "Login failure. Check the username and password you have provided." });
  }
});

// Añadir una reseña de un libro
// Add a book review
regd_users.put("/auth/review/:isbn", (request, resolve) => {
  const isbn = request.params.isbn;
  const review = request.body.review;
  const username = request.session.authorization?.username;

  if (!username) {
    return response.status(401).json({ message: "You are not authenticated." });
  }

  if (!review) {
    return response.status(400).json({ message: "You have not provided a review." });
  }

  if (!books[isbn]) {
    return response.status(404).json({ message: "The provided ISBN code does not match any book." });
  }

  books[isbn].reviews[username] = review;

  return resolve.status(200).json({ message: "Review added or updated correctly.", reviews: books[isbn].reviews });
});

// Borrar una reseña de un libro
// Delete a book review
regd_users.delete("/auth/review/:isbn", (request, response) => {
  const isbn = request.params.isbn;

  const username = request.session.authorization?.username;
  if (!username) {
    return response.status(401).json({ message: "Unaunthenticated user." });
  }

  if (!books[isbn]) {
    return response.status(404).json({ message: "Book not founds." });
  }

  const reviews = books[isbn].reviews;

  if (reviews.hasOwnProperty(username)) {
    delete reviews[username];  // Deleting the user review
    return response.status(200).json({ message: "Review deleted correctly!", reviews: reviews });
  } else {
    return response.status(404).json({ message: "No review was found with your user, mate." });
  }
});

module.exports.authenticated = regd_users;
module.exports.users = users;
