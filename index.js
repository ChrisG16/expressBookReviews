const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
let users = require('./router/auth_users.js').users;

const app = express();

const port = 5000;

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Middleware para autenticación
// Authentication Middleware
app.use("/customer/auth/*", function auth(request, response, next) {
  const authData = request.session.authorization;

  if (authData && authData.accessToken) {
    const token = authData.accessToken;

    jwt.verify(token, "access", (error, user) => {
      if (!error) {
        request.user = user;
        next();
      } else {
        return response.status(403).json({ message: "Invalid Token. Unauthenticated user." });
      }
    });
  } else {
    return response.status(403).json({ message: "User is not authenticated!" });
  }
});

// Función para verificar si un username proporcionado ya existe
// Function to verify if a provided username already exists
const userExists = (username) => {
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });

  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Endpoint público para registrar un nuevo usuario
// Public endpoint to register a new user
app.post("/register", (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  if (username && password) {
    if (!userExists(username)) {
      users.push({ "username": username, "password": password });
      return response.status(200).json({ message: "The user has been successfully registered!" });
    } else {
      return response.status(404).json({ message: "Error. The user already exists!" });
    }
  } else {
    return response.status(404).json({ message: "You have not entered a username or password. Please try again." });
  }
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(port, () => console.log("Server has started on port 5000."));
