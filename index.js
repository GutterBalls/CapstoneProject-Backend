// IMPORTS
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const client = require('./db/client');
const server = express();
const cors = require('cors');

// MIDDLEWARE
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());

// API ROUTER
const apiRouter = require('./api');
server.use('/api', apiRouter);

server.use((req, res, next) => {

    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");

    next();
});

// CONNECT CLIENT
client.connect(); 

// SERVER START UP
server.listen(1337, () => {
    console.log("The server is up on port 1337");
});
