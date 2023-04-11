const express = require('express');

const productsRouter = express.Router();

const { requireAdmin } = require('./utils');


const { 
    getAllProducts,
    getProductById,
    getProductByName,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../db');

// Get all products
productsRouter.get('/', async (req, res, next) => {
    const products = await getAllProducts();

    res.send(
        products
    );
});

// Get products by ID or name.
productsRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        let idNumber = isNaN(Number(id)) ? id : Number(id)
        
        if ( typeof idNumber  === "string") { 
            const productByName = await getProductByName(id);
            res.send(
                productByName
            );
            
        } else {
            const productById = await getProductById(id);
            res.send(
                productById
            );
        };
    } catch (error) {
        throw error;
    };
});


// Create new product - Admin only
productsRouter.post('/', requireAdmin, async (req, res) => {
    try{
        const { image, brand, name, description, price, sale, clearance, category_id } = req.body;

        const createdProduct = await createProduct({image, brand, name, description, price, sale, clearance, category_id});
        res.send(
            createdProduct
        );

    } catch (error) {
        throw error;
    };
});

// Update product by ID - Admin only
productsRouter.patch('/:id', requireAdmin, async (req, res) => {
    try{
        const { id } = req.params;
        const { image, brand, name, description, price, sale, clearance, category_id } = req.body;

        const updatedProduct = await updateProduct(id, { image, brand, name, description, price, sale, clearance, category_id });

        res.send(
            updatedProduct
        );

    } catch (error) {
        throw error;
    };
});

// Delete product by ID - Admin only
productsRouter.delete('/:id', requireAdmin, async (req, res) => {
    try{
        const { id } = req.params;
        const product = await getProductById(id);
        if(product.id){
            const deletedProduct = await deleteProduct(id);
                res.send(
                    deletedProduct
                );
        } else {
            res.send(product ? {
                name: "UnauthorizedProductError",
                message: "You cannot delete a product"
            } : {
                name: "ProductNotFoundError",
                message: "That product does not exist"
            });
        };

    } catch (error) {
        throw error;
    };
});

module.exports = productsRouter;