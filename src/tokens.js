const {sign} = require("jsonwebtoken");

const createAccessToken = user_id => {
    return sign({
        user_id
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

const createRefreshToken = user_id => {
    return sign({
        user_id
    }, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: "7d",
    });
};

const sendAccessToken = (res, req, access_token) => {
    res.send({
        access_token,
        email: req.body.email
    });
};

const sendRefreshToken = (res, refesh_token) => {
    res.cookie('refresh_token', refesh_token, {
        httpOnly: true,
        path: '/refresh_token'
    }); //se podria llamar un poco mas ofuscado y seguro
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
} ;