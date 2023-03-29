const express = require('express');

const usersRouter = express.Router();

const jwt = require('jsonwebtoken');

const { requireUser } = require('./utils');

// Required Functions:
// createUser
// getAllUsers 
// getUsersById
// getUserByUsername

const { 
    // createUser,
    // getAllUsers,
    // getUsersById,
    // getUserByUsername
} = require('../db');

// Get all users
usersRouter.get('/', async (req, res) => {
    // const users = await getAllUsers();

    res.send({
        // users
    });
}) 

// Get user by ID
usersRouter.get('/:userId', requireUser, async (req, res) => {
    
}) 

// Login
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
        });
    }

    try {
        // const user = await getUserByUsername(username);
    
        if (user && user.password == password) {
// create token & return to user
            const token = jwt.sign(user, process.env.JWT_SECRET);
            res.send({ message: "you're logged in!" , token: `${ token }`});
            console.log(token);
        } else {
            next({ 
                name: 'IncorrectCredentialsError', 
                message: 'Username or password is incorrect'
            });
        }
    } catch(error) {
        console.log(error);
        next(error);
    }
});

// Register
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
    // const _user = await getUserByUsername(username);

    // if (_user) {
    //     next({
    //         name: 'UserExistsError',
    //         message: 'A user by that username already exists'
    //     });
    // }

    // const user = await createUser({
    //     username,
    //     password
    // });

    const token = jwt.sign({ 
        id: user.id, 
        username
    }, process.env.JWT_SECRET, {
        expiresIn: '1w'
    });

    res.send({ 
        message: "thank you for signing up",
        token 
    });
    } catch ({ name, message }) {
        next({ name, message })
    } 
});

// Edit User (Patch Route)
usersRouter.patch('/:userId', requireUser, async (req, res, next) => {
    try{
        const { userId } = req.params;
        const { username, password } = req.body;
// Update user in DB
        const updatedUser = await updateUser(userId, {username, password});
// Send updated user response
        res.send(updatedUser);
    } catch ({ name, message }) {
        next({ name, message })
    }
});

// // Delete user by ID
usersRouter.delete('/:userId', requireUser, async (req, res, next) => {
    // try {
    //     const user = await getUserById(req.params.userId);

    //     if (user.id === req.user.id) {
    //         const updatedUser = await updatedUser(user.id, { active: false });
            
    //         res.send({ user: updatedUser });

    //     } else {
    //             next(user ? { 
    //             name: "UnauthorizedUserError",
    //             message: "You cannot delete a user which is not yours"
    //         } : {
    //             name: "UserNotFoundError",
    //             message: "That user does not exist"
    //         });
    //     }

    // } catch ({ name, message }) {
    //     next({ name, message })
    // }
})


module.exports = usersRouter;