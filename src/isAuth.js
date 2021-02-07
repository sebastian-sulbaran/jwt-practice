const {verify} = require('jsonwebtoken');

const isAuth = (req) => {
    const authorization = req.header("Authorization");
    console.log(req.header("Authorization"));
    if (!authorization)
        throw new Error("You must be logged in!");

    const token = authorization.split(" ")[1]; //this is beacuse authorization heades looks like "Bearer 123d233f3..." where the second part is the token.
    try{

        const {user_id} = verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(verify(token, process.env.ACCESS_TOKEN_SECRET), user_id);
        return user_id;

    } catch(error) {
        console.log(error.message);
        throw new Error(error.message);
    }
    

};

module.exports = {
    isAuth
};