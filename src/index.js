require("dotenv/config");
const express = require("express");
const cookie_parser = require("cookie-parser");
const cors = require("cors");
const {verify} = require("jsonwebtoken");
const {hash, compare} = require("bcryptjs");
const {fake_db} = require("./fakeDB.js");

//We initiate the express server

 const server = express();

 //We use the cookie parser on server requests

 server.use(cookie_parser());

 //We set the cors
 server.use(
     cors({
        origin: "http://localhost:4444",
        credentials: true,
     })
 );

 //We configure our express server to read json encoded bodies and be able to ready body data

 server.use(express.json());

 //We configure our server to support url encoded bodies
 server.use(
     express.urlencoded({
         extended: true
     })
 );

 
 server.listen(process.env.PORT, (err) => {
    if (err) return console.log(err);
     console.log("Server listening on port " + process.env.PORT);
});


/**
 * We have to create endpoints
 */
//We initialize our server 
// 1. Register a User

server.post("/register", async (req, res) => {
    const {email, password} = req.body;

    try{

        const user  = fake_db.find(user => user.email === email); //homework implement this witha database
        //1. Check if user is already registered
        if (user) {
            throw new Error("User already exist!");
        }
        //2. else hash the password
        const hashed_password = await hash(password, 10);
        //3. Save into a database
        fake_db.push({
            id: fake_db.length,
            email: email,
            password: hashed_password
        });
        res.send({message: "User created"});
        console.log(fake_db);
    } catch (err) {
        res.send({
            error: err.message
        });
       console.log(err);
    }

});

server.get('/', function (req, res) {
    res.send('Hello World');
  })


 // 2. Login a User

 // 3. Logout a User

 // 4. Setup a protected Route

 // 5. Get a new access token with a refresh token 

 // 6. Revoke a Refresh token (Homework)