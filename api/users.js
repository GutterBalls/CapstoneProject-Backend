require('dotenv').config();
const express = require('express');

const bcrypt = require('bcrypt');

const usersRouter = express.Router();

const jwt = require('jsonwebtoken');

const { requireUser, requireAdmin } = require('./utils');

const { 
    createUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUser,
    createOrder
} = require('../db');


// Get all users - admin only
usersRouter.get('/', requireAdmin, async (req, res) => {
    const users = await getAllUsers();

    res.send(
        users
    );
}) 

// Get user by ID
usersRouter.get('/me', requireUser, async (req, res) => {
    
    console.log("Req user", req.user);
    
    const user = await getUserById(req.user.id);

    res.send(
        user
    );
}) ;

// Login
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    console.log("user api:" + req.body);
    if (!username || !password) {
        next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUserByUsername(username); 
        console.log("User..");
        console.log(user); 
        const areTheyTheSame = await bcrypt.compare(password, user.password); 
        if (user && areTheyTheSame) {  
            const token = jwt.sign({ 
                id: user.id, 
                username
            }, process.env.JWT_SECRET, { 
                expiresIn: "1w" 
            });

            res.send({
                message: "You are now logged in!", 
                token: token 
            });
        } else {
            res.send({
                name: "Incorrect Credentials!",
                message: "Username or password is incorrect!"
            });
        }
    } catch(error) {
        console.log(error);
        next(error);
    }
});


// Register
usersRouter.post('/register', async (req, res, next) => {
    const { username, password, email, isAdmin, isActive } = req.body;
    console.log("req body", req.body)
    try {
        const _user = await getUserByUsername(username);
        console.log("User from getUser function", _user)
        if (_user) {
            res.send({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            });
        } else if (password.length < 8) {
            res.send({
                name: "PasswordTooShort",
                message: "Password must be a minimum of 8 characters."
            });
        } else {
        const user = await createUser({
            username,
            password,
            email,
            isAdmin,
            isActive
        });
        
        const newOrder = await createOrder({user_id: user.id, order_date: new Date});
        console.log("New account order", newOrder)
            if (user.id) {
                const token = jwt.sign({ 
                    id: user.id, 
                    username,
                    isActive
                }, process.env.JWT_SECRET, {
                    expiresIn: '1w'
                }); res.send({ 
                    message: "thank you for signing up",
                    token 
                })};
        };
    } catch (error) {
        throw(error);
    };
});

// Edit username and password
usersRouter.patch('/:id', requireUser || requireAdmin, async (req, res, next) => {
    try{
        const { id } = req.params;
        const { username, password, email } = req.body;
        let saltRounds = 10;
        let hashPassword = await bcrypt.hash(password, saltRounds);
        let hashEmail = await bcrypt.hash(email, saltRounds);
        
// Update user in DB
        const updatedUser = await updateUser(id, {username, password: hashPassword, email: hashEmail});

        // const areTheyTheSame = await bcrypt.compare(password, updatedUser.password); 
        // if (updatedUser && areTheyTheSame) {  
        //     const token = jwt.sign({ 
        //         id: updatedUser.id, 
        //         username 
        //     }, process.env.JWT_SECRET, { 
        //         expiresIn: "1w" 
        //     });

        //     res.send({
        //         message: "You are now logged in!", 
        //         token: token 
        //     });
        // }
// Send updated user response
        res.send(updatedUser);
    } catch (error) {
        throw(error);
    }
});

// // Set user Inactive by user ID
usersRouter.delete('/:id', requireUser || requireAdmin, async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);

        if (user.id === req.user.id || req.user.isAdmin == true) {
            const disableUser = await updateUser(user.id, { isActive: false });
            
            res.send(disableUser);

        } else {
                res.send(user ? { 
                name: "UnauthorizedUserError",
                message: "You cannot delete a user which is not yours"
            } : {
                name: "UserNotFoundError",
                message: "That user does not exist"
            });
        }

    } catch (error) {
        throw(error);
    }
})


module.exports = usersRouter;