const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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



// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let getAllBooks = new Promise((resolve,reject)=>{
        try{
            let data = books;
            res.send(JSON.stringify({data},null,4));
            console.log("Promise resolved");
            resolve("OK");
        }catch(err){
            console.log("Promise rejected");
            reject("ERR");
        };
    });    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let getBookIsbn = new Promise((resolve,reject)=>{
        try{
            let data = books;
            const ISBN =  parseInt(req.params.isbn);
            res.send(data[ISBN]);
            console.log("Promise resolved");
            resolve("OK");
        }catch(err){
            console.log("Promise rejected");
            reject("ERR");
        };
    });      
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let getBookAuthor = new Promise((resolve,reject)=>{
        try{
            const author = req.params.author;
            let filtered_books = [];
            let data = books;
            for (const key of Object.keys(data)) {
                if(data[key].author === author){
                    filtered_books.push(data[key]);
                }
            }
            res.send(JSON.stringify({filtered_books},null,4));
            console.log("Promise resolved");
            resolve("OK");
        }catch(err){
            console.log("Promise rejected");
            reject("ERR");
        };
    }); 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let getBookTitle = new Promise((resolve,reject)=>{
        try{
            const title = req.params.title;
            let filtered_books = [];           
            let data = books;
            for (const key of Object.keys(data)) {
                if(data[key].title === title){
                    filtered_books.push(data[key]);
                }
            }
            res.send(JSON.stringify({filtered_books},null,4));
            console.log("Promise resolved");
            resolve("OK");
        }catch(err){
            console.log("Promise rejected");
            reject("ERR");
        };
    });    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const review = books[isbn].review;
    //res.send( books[isbn].review);
    res.send(JSON.stringify({review},null,4)); 
});

module.exports.general = public_users;
