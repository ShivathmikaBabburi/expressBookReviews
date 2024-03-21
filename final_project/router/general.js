const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


public_users.get('/', async function (req, res) {
  
  

  try {
   
    return res.send(JSON.stringify(books));
    
    }

   
   catch (error) {
    
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});


 public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  

  try {
   

    return res.send(JSON.stringify(books[isbn]));
    }

    
   catch (error) {
    
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
  
// Get book details based on author

public_users.get('/author/:author', async function (req, res) {
  const author=req.params.author;
  const result = [];

  try {
   

    for(const key in books)
  {
    if(books[key].author==author)
    {
      return res.send(books[key]);
    }
  }
    }

    
   catch (error) {
    
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// Assuming books is an asynchronous operation that returns a Promise

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const result = [];

  try {
   

    for (const key in books) {
      if (books[key].title == title) {
        result.push(books[key]);
      }
    }

    return res.send(result);
  } catch (error) {
    
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});




//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  
  return res.send(books[isbn].reviews);

  
});






module.exports.general = public_users;
