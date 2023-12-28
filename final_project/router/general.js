const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bodyParser = require('body-parser');
public_users.use(bodyParser.json());

// user register
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).json({message: "Please provide username and password"});
  }
  if(users[username]){
    return res.status(400).json({message: "Username already exists"});
  }
  else {
    users.push({username: username, password: password});
    return res.status(200).json({message: "User created successfully"});
  }


});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
  })
    .then((bookList) => {
      res.send(bookList);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving book list');
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  new Promise ((resolve,reject) => {
    resolve(JSON.stringify(books[req.params.isbn], null, 4));
  })
    .then((bookDetails) => {
      res.send(bookDetails);
    })
    .catch((error) => {
      res.status(500).send('Error retrieving book details');
    });
});

public_users.get('/author/:author', function (req, res) {
  // using promises as an alternative
  new Promise((resolve) => {
    resolve(Object.keys(books).find(isbn => books[isbn].author === req.params.author));
  })
  .then((isbn) => {
    res.send(books[isbn]);
  })
  .catch(() => {
    res.status(500).send('Error retrieving book details');
  });

  /* const author = req.params.author;
  const isbn = Object.keys(books).find(isbn => books[isbn].author === author);

  if (isbn) {
    res.send(books[isbn]);
  } else {
    res.status(404).send('Book not found for the given author');
  } */
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

  new Promise((resolve) => {
    resolve(Object.keys(books).find(isbn => books[isbn].title === req.params.title));
  })
  .then((isbn) => {
    res.send(books[isbn]);
  })
  .catch(() => {
    res.status(500).send('Error retrieving book details');
  });

  /* const title = req.params.title;
  const isbn = Object.keys(books).find(isbn => books[isbn].title === title);

  if (isbn) {
    res.send(books[isbn]);
  } else {
    res.status(404).send('Book not found for the given title');
  }
  */
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  new Promise((resolve) => {
    resolve(books[req.params.isbn].reviews);
  })
  .then((reviews) => {
    res.send(reviews);
  })
  .catch(() => {
    res.status(500).send('Error retrieving book review');
  });
  // const isbn = req.params.isbn;
  // res.send(books[isbn].reviews);
});

module.exports.general = public_users;
