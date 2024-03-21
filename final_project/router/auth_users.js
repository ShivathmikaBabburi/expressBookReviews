const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let user={};


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(validusers.length > 0){
  return true;
} else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 360 * 3600 });

    req.session.authorization = {
      accessToken,username
  }
  user={"username":username,"password":password};
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  isbn=req.params.isbn;
  review=req.body.review;
  //Write your code here
  for(const key in books)
  {
    if(key==isbn)
    {
      books[key].reviews={"username":user.username,"review":review};
    }
  }
  
  return res.send("review added by user "+user.username);
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  isbn=req.params.isbn;
  for(const key in books)
  {
    if(key==isbn)
    {
      let reviews=books[key].reviews;
      if(reviews.username==user.username)
      {
        
        delete(books[key].reviews);
        books[key].reviews={};
        return res.send("deleted review for isbn "+isbn+"by user "+user.username);
      }
      else{
        return res.send("cannot delete review of another user");
      }
      
      
    }
  }

});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

