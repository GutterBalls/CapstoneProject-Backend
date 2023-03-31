const express = require('express');

const ordersRouter = express.Router();

const { requireUser, requireAdmin } = require('./utils');

// Required Functions:
// getAllOrders
// getOrderById
// getOrderByName
// createOrder
// editOrder
// deleteOrder

const { 
    getAllOrders,
    getOrderById,
    getOrderByUserId,
    getOrderByName,
    createOrder,
    editOrder,
    deleteOrder
} = require('../db');

// Get all orders
ordersRouter.get('/', requireAdmin, async (req, res, next) => {
    const allOrders = await getAllOrders();

    res.send(
        allOrders
    );
    next();
})

// Get order by ID - User or Admin
ordersRouter.get('/orderId/:orderId', requireUser || requireAdmin, async (req, res, next) => {
    const { id } = req.params;
    const orderById = await getOrderById(id);

    res.send(
        orderById
    );
    next();
})

// Get order by userId - User or Admin
ordersRouter.get('/userId/:userId', requireUser || requireAdmin, async (req, res, next) => {
    const { id } = req.params;
    const orderByUserId = await getOrderByUserId(id);

    res.send(
        orderByUserId
    );
    next();
})

// Create new order - User
ordersRouter.post('/', requireUser, async (req, res, next) => {
    try{
        const { orderDate, orderStatus } = req.body;

        const createdOrder = await createOrder( req.user.id, { orderDate, orderStatus });
        res.send(
            createdOrder
        );

    } catch (error) {
        throw("Error creating an order", error);
    };
})

// update order by ID - Admin only
ordersRouter.patch('/:orderId', requireAdmin, async (req, res, next) => {
    try{
        const { id } = req.params;
        const { orderStatus } = req.body;

        const updatedOrderStatus = await editOrder(id, { orderStatus });

        res.send(
            updatedOrderStatus
        );

    } catch (error) {
        throw("Error updating order status",error);
    };
})

// delete order by ID - Admin only
ordersRouter.delete('/:orderId', requireAdmin, async (req, res, next) => {
    try{
        const { id } = req.params;
        const order = await getOrderById(id);
        if(order.id){
            const deletedOrder = await deleteOrder(id);
                res.send(
                    deletedOrder
                );
        } else {
            res.send(order ? {
                name: "UnauthorizedOrderError",
                message: "You cannot delete an order"
            } : {
                name: "OrderNotFoundError",
                message: "That order does not exist"
            });
        };

    } catch (error) {
        throw("Error deleting order", error);
    };
})

module.exports = ordersRouter;