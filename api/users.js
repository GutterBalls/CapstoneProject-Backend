const express = require('express');

const usersRouter = express.Router();


usersRouter.get('/', async (req, res) => {
    
}) 

usersRouter.post('/login', async (req, res, next) => {

})

usersRouter.post('/register', async (req, res, next) => {

})

// usersRouter.delete('/:userId', requireUser, async (req, res, next) => {
// })


module.exports = usersRouter;