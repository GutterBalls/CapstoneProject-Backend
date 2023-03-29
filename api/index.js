const express = require('express');

const apiRouter = express.Router();


apiRouter.use((req, res, next) => {
    if (req.user) {
        console.log("User is set:", req.user);
    }

    next();
});

apiRouter.use((error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message
    });
});

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);





module.exports = apiRouter;