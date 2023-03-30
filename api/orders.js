const express = require('express');

const ordersRouter = express.Router();

const { requireUser } = require('./utils');

// Required Functions:
// getAllOrders
// getOrderById
// getOrderByName
// createOrder
// editOrder
// deleteOrder

//const { 
    // getAllOrders,
    // getOrderById,
    // getOrderByName,
    // createOrder,
    // editOrder,
    // deleteOrder
// } = require('../db');

// Get all orders
ordersRouter.get('/', async (req, res) => {
    
})

// Get order by ID
ordersRouter.get('/:orderId', async (req, res) => {
    
})

// Create new order
ordersRouter.post('/', requireUser, async (req, res, next) => {

})

// update order by ID
ordersRouter.patch('/:orderId', requireUser, async (req, res, next) => {

})

// delete order by ID
ordersRouter.delete('/:orderId', requireUser, async (req, res, next) => {
})

module.exports = ordersRouter;