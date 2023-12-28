const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

/* const isValid = (username)=>{
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  }
  else{
    return false;
  }
 } */

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  let validusers = users.filter((user) => {
    if(user.username === username && user.password === password){
      return user;
    }
  });

  if(validusers.length > 0){
    const accessToken = jwt.sign({username: username}, "access");
    const refreshToken = jwt.sign({username: username}, "refresh");
    req.session.authorization = {accessToken: accessToken, refreshToken: refreshToken};
    return res.status(200).json({message: "Login successful"});
  }
  else{
    return res.status(401).json({message: "Invalid credentials"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.reviews;
  const username = req.session.authorization['accessToken'];

  if(!review){
    return res.status(400).json({message: "Please provide review"});
  }
  if(!username){
    return res.status(401).json({message: "User not logged in"});
  }

  if(books[isbn].reviews[username]){
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review updated successfully"});
  }
  else {
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added successfully"});
  }
});

// deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['accessToken'];
  if(!username){
    return res.status(401).json({message: "User not logged in"});
  }
  if(books[isbn].reviews[username]){
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
  }
  else {
    return res.status(404).json({message: "Review not found"});
  }
});

module.exports.authenticated = regd_users;
// module.exports.isValid = isValid;
module.exports.users = users;
