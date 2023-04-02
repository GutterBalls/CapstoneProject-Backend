const express = require('express');

const paymentRouter = express.Router();

const { requireUser, requireAdmin } = require('./utils');

const { 
    createPayment,
    getAllPayments,
    getPaymentById,
    deletePayment,
    updatePayment

} = require('../db');

// Create payment - 
paymentRouter.post('/', async (req, res) => {
    try{
        const { user_id, address, city, state, zip_code} = req.body;

        const createdPayment = await createPayment({user_id, address, city, state, zip_code});

        res.send(
            createdPayment
        );

    } catch (error) {
        throw(error);
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