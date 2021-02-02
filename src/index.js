require("dotenv/config");
const express = require("express");
const cookie_parser = require("cookie-parser");
const cors = require("cors");
const {verify} = require("jsonwebtoken");
const {hash, compare} = require("bcryptjs");

/**
 * We have to create endpoints
 */

 // 1. Register a User

 // 2. Login a User

 // 3. Logout a User

 // 4. Setup a protected Route

 // 5. Get a new access token with a refresh token 

 // 6. Revoke a Refresh token (Homework)


 //We initiate the express server

 const server = express();

 //We use the cookie parser on server requests

 server.use(cookie_parser);

 //We set the cors
 server.use(
     cors({
        origin: "http://localhost:3000",
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

//We initialize our server 

server.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT);
});
