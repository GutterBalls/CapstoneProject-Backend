const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../db/users')

function requireUser(req, res, next) {
    console.log("Utils requireUser", req.user)
    if (!req.user) {
    res.send({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
    });
    }

    // const userToken = req.headers.authorization.split(" ")[1];
    // const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);       
    // const user = async() => await getUserByUsername(decryptedUserToken.username);
    // if (user.username == decryptedUserToken.username) {
    //     res.send({
    //         user: user.id,
    //         username: username,
    //         message: "User is logged in"
    //     })
    // }
    next();
};

function requireAdmin(req, res, next) {
    console.log("Req user", req.user);
    if (req.user.isAdmin !== true){
        res.send({
            message: "Error, you are not an admin."
        });
    };
    next();
};

module.exports = {
    requireUser,
    requireAdmin
}