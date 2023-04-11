const express = require('express');

const cartItemsRouter = express.Router();

const { requireUser } = require('./utils');

const { 
    createCartItem,
    getCartItemById,
    deleteCartItem,
    getCartWithOrdersAndProducts,
    updateCartItem
} = require('../db');

// Create Cart Item - 
cartItemsRouter.post('/', requireUser, async (req, res) => {
    try{
        const { user_id, order_id, product_id, qty } = req.body;
        const currentUsersCart = await getCartWithOrdersAndProducts(user_id);
        const hasProduct = currentUsersCart.some(product => product.product_id === product_id);
        if (hasProduct) {
            res.send("Product already exists in cart error.")
        } else {
            const createdCartItem = await createCartItem({user_id, order_id, product_id, qty});
            res.send(
                createdCartItem
            );
        };
       
    } catch (error) {
        throw error;
    };
});

// Get all Cart Items
cartItemsRouter.get('/:userId', requireUser, async (req, res) => {
    
    const cartItems = await getCartWithOrdersAndProducts(req.params.userId);
    res.send(
        cartItems
    );
});


// Get Cart Join table
cartItemsRouter.get('/:cartId/join', async (req, res, next) => {
    const {cartId} = req.params;
    try {
        const getCart = await getCartWithOrdersAndProducts(cartId);
        res.send(
            getCart
        );
        
    } catch (error) {
        throw error;
    };
});

// Delete Cart Items by ID
cartItemsRouter.delete('/:id', requireUser, async (req, res) => {
    try{
        const { id } = req.params;
        const cartItem = await getCartItemById(id);
        if(cartItem.id == id){
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
        const { order_id, product_id, qty, price } = req.body;

        const updatedCartItem = await updateCartItem(id, { order_id, product_id, qty, price });

        res.send(
            updatedCartItem
        );

    } catch (error) {
        throw error;
    };
});

module.exports = cartItemsRouter;

