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
        
    const user = await getUserById(req.user.id);
    console.log("users /me", user)

    res.send(
        user
    );
});

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
        const user = await getUserByUsername(username); 
        
        if (user && user.isActive === true) {  
            const areTheyTheSame = await bcrypt.compare(password, user.password); 
            
            if (areTheyTheSame) {
                const token = jwt.sign({ 
                    id: user.id, 
                    username
                }, process.env.JWT_SECRET, { 
                    expiresIn: "1w" 
                });
    
                res.send({
                    message: "You are now logged in!", 
                    token: token,
                    id: user.id
                });
            } else {
                res.send({
                    name: "Incorrect Credentials!",
                    message: "Username or password is incorrect!"
                }).status(403);
            }
        } else {
            res.send({
                name: "Incorrect Credentials!",
                message: "Username or password is incorrect!"
            }).status(403);
        }
    } catch(error) {
        throw error;
    };
});


// Register a new user
usersRouter.post('/register', async (req, res, next) => {
    const { username, password, email, isAdmin, isActive } = req.body;
    
    try {
        const _user = await getUserByUsername(username);
        
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
        
        // Creating a new order (cart) for a new user upon signing up.
        const newOrder = await createOrder({user_id: user.id, order_date: new Date});
        
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
        throw error;
    };
});

// Edit user information.
usersRouter.patch('/:id', requireUser || requireAdmin, async (req, res) => {
    try{
        const { id } = req.params;
        const { username, password, email } = req.body;
        let saltRounds = 10;
        let hashPassword = await bcrypt.hash(password, saltRounds);
        let hashEmail = await bcrypt.hash(email, saltRounds);
        
        const updatedUser = await updateUser(id, {username, password: hashPassword, email: hashEmail});

        res.send(updatedUser);
    } catch (error) {
        throw error;
    };
});

// // Set user Inactive by user ID
usersRouter.delete('/:id', requireUser || requireAdmin, async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);

        if (user.id === req.user.id || req.user.isAdmin === true) {
    
            if(user.isActive === true){
                const disableUser = await updateUser(user.id, { isActive: false });
                res.send(disableUser);
            } else{
                const enableUser = await updateUser(user.id, { isActive: true });
                res.send(enableUser);
            }

        } else {
                res.send(user ? { 
                name: "UnauthorizedUserError",
                message: "You cannot delete a user which is not yours"
            } : {
                name: "UserNotFoundError",
                message: "That user does not exist"
            });
        };

    } catch (error) {
        throw error;
    };
});

// // Admin - Set users as admin by user ID
usersRouter.patch('/admin/:id', requireAdmin, async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);

        if (req.user.isAdmin === true) {
    
            if(user.isAdmin === true){
                const disableAdminUser = await updateUser(user.id, { isAdmin: false });
                res.send(disableAdminUser);
            } else{
                const enableAdminUser = await updateUser(user.id, { isAdmin: true });
                res.send(enableAdminUser);
            }

        } else {
                res.send(user ? { 
                name: "UnauthorizedUserError",
                message: "You cannot make this user admin"
            } : {
                name: "UserNotFoundError",
                message: "That user does not exist"
            });
        };

    } catch (error) {
        throw error;
    };
});


module.exports = usersRouter;