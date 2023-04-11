const express = require('express');

function requireUser(req, res, next) {
    
    if (!req.user) {
        res.send({
            name: "MissingUserError",
            message: "You must be logged in to perform this action"
        });
    }

    next();
};

function requireAdmin(req, res, next) {
    
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