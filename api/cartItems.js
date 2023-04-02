const express = require('express');

const cartItemsRouter = express.Router();

const { requireUser, requireAdmin } = require('./utils');

const { 
    createCartItem,
    getAllCartItems,
    getCartItemById,
    deleteCartItem,
    updateCartItem

} = require('../db');

// Create Cart Item - 
cartItemsRouter.post('/', async (req, res) => {
    try{
        const { user_id, order_id, product_id, qty, price } = req.body;

        const createdCartItem = await createCartItem({user_id, order_id, product_id, qty, price});

        res.send(
            createdCartItem
        );

    } catch (error) {
        throw(error);
    };
});

// Get all Cart Items
cartItemsRouter.get('/', async (req, res) => {
    const cartItems = await getAllCartItems();

    res.send(
        cartItems
    );
});

// Get Cart Items by ID
cartItemsRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cartItemsById = await getCartItemById(id);
        res.send(
            cartItemsById
        );
        
    } catch (error) {
        throw error;
    };
});

// Delete Cart Items by ID
cartItemsRouter.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const cartItem = await getCartItemById(id);
        if(cartItem.id){
            const deletedCartItem = await deleteCartItem(id);
                res.send(
                    deletedCartItem
                );
        } else {
            res.send(cartItem ? {
                name: "UnauthorizedCartItemError",
                message: "You cannot delete a Cart Item"
            } : {
                name: "CartItemNotFoundError",
                message: "Cart Item ID does not exist"
            });
        };

    } catch (error) {
        throw(error);
    };
});

// Edit/Update Cart Items by ID
cartItemsRouter.patch('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const { user_id, order_id, product_id, qty, price } = req.body;

        const updatedCartItem = await updateCartItem(id, { user_id, order_id, product_id, qty, price });

        res.send(
            updatedCartItem
        );

    } catch (error) {
        throw(error);
    };
});

module.exports = cartItemsRouter;

