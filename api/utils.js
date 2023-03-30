const express = require('express');

function requireUser(req, res, next) {
    console.log("Utils requireUser", req.user)
    if (!req.user) {
    res.send({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
    });
    }

    next();
};

// function requireAdmin(req, res, next) {
//     if (!req)
// }

module.exports = {
    requireUser
}