# Book Review Application (Certification project)

This is a book store project that I have created as part of a professional certificate project. It is written in server-side JavaScript using Node.js and Express.js. The application is integrated into a secure REST API using JWT-based session authentication. It allows general access to some books using their ISBN code, or searching for them by title or author. On the other hand, a registered and authenticated user can write reviews for each book, and the review will be saved next to their username.

## End-points without authentication required (Use Postman)

Note: The list of books is in the directory "router/booksdb.js", this was provided by the certification course.

### Get the list of available books

GET /

### Get the details of a book by providing an ID

GET /isbn/"id"

Example: "/isbn/8"

### Get the details of a book by providing an author name

GET /author/"author name"

Example: "/author/Dante%20Alighieri"

### Get the details of a book by providing a title

GET /title/"title"

Example: "/author/The%20Divine%20Comedy"

### Get book reviews by providing an ID

GET /review/"id"

Example: "/review/8"

### Register a new user

POST /register

You need to send a POST using a request body, here is a example in Postman: { "username": "user1", "password: "pwd123" }.

## End-points with authentication required

### Login as previously registered user

POST /customer/login

Use the body of the request that was used for user registration, as in the previous example.

### Add a book review (or modify an existing one)

PUT /customer/auth/review/"id"

You have to place the ID in the url and send a request body like this: { "review": "This book has changed my life, 11/10." }.

A review will be created and saved with your user logged in.

### Deleting a book review

DELETE /customer/auth/review/"id"

The review of the book made by the user currently logged in will be deleted.
