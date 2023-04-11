const express = require('express');

const paymentRouter = express.Router();

const { requireUser, requireAdmin } = require('./utils');

const { 
    createPayment,
    getPaymentById,
    deletePayment,
    createOrder,
    editOrder,
    getOrderByUserId

} = require('../db');

// Create payment - 
paymentRouter.post('/', requireUser, async (req, res) => {
    try{
        const {user_id, cardnum, exp, cvv, name, address, city, state, zip_code} = req.body;

        const createdPayment = await createPayment({user_id, cardnum, exp, cvv, name, address, city, state, zip_code});

        res.send(
            createdPayment
        );

        if (createdPayment) {
            const getUserOrders = await getOrderByUserId(req.user.id);
            const grabFalseOrder = getUserOrders.filter((order) => order.order_status === false);
            const editedOrder = await editOrder({id: grabFalseOrder[0].id, order_status: true});
            const newOrder = await createOrder({user_id: req.user.id, order_date: new Date});
        };

    } catch (error) {
        throw error;
    };
});

// Delete Payment by ID
paymentRouter.delete('/:id', requireAdmin, async (req, res) => {
    try{
        const { id } = req.params;
        const payment = await getPaymentById(id);
        if(payment.id){
            const deletedPayment = await deletePayment(id);
                res.send(
                    deletedPayment
                );
        } else {
            res.send(payment ? {
                name: "UnauthorizedPaymentError",
                message: "You cannot delete a payment"
            } : {
                name: "PaymentNotFoundError",
                message: "Payment ID does not exist"
            });
        };

    } catch (error) {
        throw error;
    };
});

module.exports = paymentRouter;