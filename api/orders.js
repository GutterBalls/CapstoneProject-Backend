const express = require('express');

const ordersRouter = express.Router();

const { requireUser, requireAdmin } = require('./utils');

const { 
    getAllOrders,
    getOrderByUserId,
    createOrder,
    editOrder,
    deleteOrder
} = require('../db');

// Get all orders
ordersRouter.get('/', requireAdmin, async (req, res) => {

    const allOrders = await getAllOrders();

    res.send(
        allOrders
    );
    
});

// // Get order by userId - User or Admin
ordersRouter.get('/me', requireUser, async (req, res) => {
    
    const orderByUserId = await getOrderByUserId(req.user.id);
    
    res.send(
        orderByUserId
    );
    
});

// Create new order - User
ordersRouter.post('/', requireUser, async (req, res, next) => {
    try{
        const { user_id, order_date, order_status } = req.body;

        const createdOrder = await createOrder( {user_id, order_date, order_status} );
        
        res.send(
            createdOrder
        );

    } catch (error) {
        throw error;
    };
});

// Update order by ID - Admin only
ordersRouter.patch('/:id', requireAdmin, async (req, res, next) => {
    try{
        const { id } = req.params;
        const { order_status } = req.body;

        const updatedOrderStatus = await editOrder(id, { order_status });

        res.send(
            updatedOrderStatus
        );

    } catch (error) {
        throw("Error updating order status",error);
    };
});

// delete order by ID - Admin only
ordersRouter.delete('/:id', requireAdmin, async (req, res, next) => {
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