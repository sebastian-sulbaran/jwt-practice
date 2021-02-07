require("dotenv/config");
const express = require("express");
const cookie_parser = require("cookie-parser");
const cors = require("cors");
const {verify} = require("jsonwebtoken");
const {hash, compare} = require("bcryptjs");
const {fake_db} = require("./fakeDB.js");
const {isAuth} = require("./isAuth");
const {
    createAccessToken, 
    createRefreshToken, 
    sendAccessToken, 
    sendRefreshToken
} = require("./tokens");

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

server.post("/login", async (req, res) => {

    const {email, password} = req.body; //el body o es el json que se envia en el request o los que van en url encoded
    try{

        // 1. Find user un array
        const user = fake_db.find(user => user.email === email);
        
        if(!user) 
            throw new Error("User doesnt exists!");

        // 2. Compared crypted password and see if match, send error if not
        const validate_password = await compare(password, user.password);

        if(!validate_password)

            throw new Error("Credential does not match!");

        // 3. Create or refresh (Refresh Token has long time duration) access token (Access Tokens has short time duration)

        const access_token = createAccessToken(user.id);
        const refresh_token = createRefreshToken(user.id);

        // 4. Cuando debemos usar el refresh token y cuando debemos usar el access token?

        user.refresh_token = refresh_token;

        console.log(fake_db);

        // 5. Send tokens

        sendRefreshToken(res, refresh_token);

        sendAccessToken(res, req, access_token);


    } catch(error) {
        res.send(error.message);
    } 

}); 


server.listen(process.env.PORT, (err) => {
    if (err) return console.log(err);
     console.log("Server listening on port " + process.env.PORT);
});


// 3. Logout a User

server.post("/logout", async (_req, res) => {
    res.clearCookie('refresh_token',{
        path: '/refresh_token'
    });
    return res.send({
        message: "logout"
    });
});

// 4. Setup a protected Route

server.post("/protected", async (req, res) => {

    try{

        const user_id = isAuth(req);
        console.log(user_id);
        if (user_id !== null) {
            res.send({
                data: "This is a protected response"
            });
        }

    } catch(error) {
        res.send({
            error: error.message
        });
    }

});


 // 5. Get a new access token with a refresh token 

 server.post("/refresh_token", async (req, res) => {
    const token = req.cookies.refresh_token;
    // If we dont have the token in our request

    if (!token)
        //throw new Error("");
        return res.send({
            access_token: ''
        });
    
    //We have a token, verify

    let payload;

    try{

        payload = verify(token, process.env.REFRESH_TOKEN_SECRET);

    } catch (error) {
        return res.send({
            access_token: '',
            message: error.message
        });
    }

    //we know the token is valid, check if user exist

    const user = fake_db.find(user => user.id === payload.user_id);

    if (!user) 
        return res.send({
            access_token: ''
        });

    // if user exist, check if tokens match

    if (user.refresh_token !== token)
        return res.send({
            access_token: ''
        });

    //token exist, create new pair of tokens

    const access_token = createAccessToken(user.id);
    const refresh_token = createRefreshToken(user.id);
    
    user.refresh_token = refresh_token;

    sendRefreshToken(res, refresh_token);

    sendAccessToken(res, req, access_token);

    return res.send({
        access_token
    });

 });

 // 6. Revoke a Refresh token (Homework)