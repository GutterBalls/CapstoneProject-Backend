const express = require('express');

const paymentRouter = express.Router();

const { requireUser, requireAdmin } = require('./utils');

const { 
    createPayment,
    getAllPayments,
    getPaymentById,
    deletePayment,
    updatePayment,
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
            const getUserOrders = await getOrderByUserId(req.user.id)
            console.log("getUsersOrders", getUserOrders);
            const grabFalseOrder = getUserOrders.filter((order) => order.order_status === false)
            console.log("grabFalseOrder", grabFalseOrder);
            const editedOrder = await editOrder({id: grabFalseOrder[0].id, order_status: true})
            const newOrder = await createOrder({user_id: req.user.id, order_date: new Date});
            console.log(editedOrder);
            console.log(newOrder);
        };

    } catch (error) {
        throw("Error w/ api create payment",error);
    };
});

// Get all payments
paymentRouter.get('/', async (req, res) => {
    const payments = await getAllPayments();

    res.send(
        payments
    );
});

// Get payment by ID
paymentRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const paymentById = await getPaymentById(id);
        res.send(
            paymentById
        );
        
    } catch (error) {
        throw error;
    };
});

// Delete Payment by ID
paymentRouter.delete('/:id', async (req, res) => {
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
        throw(error);
    };
});

// Edit/Update payment by ID
paymentRouter.patch('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const { user_id, address, city, state, zip_code } = req.body;

        const updatedPayment = await updatePayment(id, { user_id, address, city, state, zip_code });

        res.send(
            updatedPayment
        );

    } catch (error) {
        throw(error);
    };
});

module.exports = paymentRouter;