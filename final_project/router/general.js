const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// burada kaldım
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
}); 


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const isbn = Object.keys(books).find(isbn => books[isbn].author === author);

  if (isbn) {
    res.send(books[isbn]);
  } else {
    res.status(404).send('Book not found for the given author');
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const isbn = Object.keys(books).find(isbn => books[isbn].title === title);

  if (isbn) {
    res.send(books[isbn]);
  } else {
    res.status(404).send('Book not found for the given title');
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
