const express = require('express');

const itemsPurchasedRouter = express.Router();

const { requireUser, requireAdmin } = require('./utils');

const { 
    createItemsPurchased,
    getAllItemsPurchased,
    getItemsPurchasedById,
    deleteItemsPurchased,
    updateItemPurchased

} = require('../db');

// Create itemsPurchased - 
itemsPurchasedRouter.post('/', async (req, res) => {
    try{
        const { product_id, order_id, purchasedPrice } = req.body;

        const createdItemsPurchased = await createItemsPurchased({product_id, order_id, purchasedPrice});

        res.send(
            createdItemsPurchased
        );

    } catch (error) {
        throw(error);
    };
});

// Get all itemsPurchased
itemsPurchasedRouter.get('/', async (req, res) => {
    const itemsPurchased = await getAllItemsPurchased();

    res.send(
        itemsPurchased
    );
});

// Get itemsPurchased by ID
itemsPurchasedRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const itemsPurchasedById = await getItemsPurchasedById(id);
        res.send(
            itemsPurchasedById
        );
        
    } catch (error) {
        throw error;
    };
});

// Delete itemsPurchased by ID
itemsPurchasedRouter.delete('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const itemPurchased = await getItemsPurchasedById(id);
        if(itemPurchased.id){
            const deletedItemPurchased = await deleteItemsPurchased(id);
                res.send(
                    deletedItemPurchased
                );
        } else {
            res.send(itemPurchased ? {
                name: "UnauthorizedItemPurchasedError",
                message: "You cannot delete a ItemPurchased"
            } : {
                name: "ItemPurchasedNotFoundError",
                message: "ItemPurchased ID does not exist"
            });
        };

    } catch (error) {
        throw(error);
    };
});

// Edit/Update itemsPurchased by ID
itemsPurchasedRouter.patch('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const { product_id, order_id, purchasedPrice  } = req.body;

        const updatedItemPurchased = await updateItemPurchased(id, { product_id, order_id, purchasedPrice });

        res.send(
            updatedItemPurchased
        );

    } catch (error) {
        throw(error);
    };
});

module.exports = itemsPurchasedRouter;