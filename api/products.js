const express = require('express');

const productsRouter = express.Router();

const { requireAdmin } = require('./utils');


const { 
    getAllProducts,
    getProductById,
    getProductByName,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../db');

// Get all products
productsRouter.get('/', async (req, res, next) => {
    const products = await getAllProducts();

    res.send(
        products
    );
    next();
});

// Get products by ID
productsRouter.get('/id/:id', async (req, res, next) => {
    const { id } = req.params;
    // console.log("Req params", id)
    const productById = await getProductById(id);

    res.send(
        productById
    );
    next();
});

// Get products by name
productsRouter.get('/name/:name', async (req, res, next) => {
    const { name } = req.params;
    const product = await getProductByName(name);
    res.send(
        product
    );
    next();
});







// Create new product - Admin only
productsRouter.post('/', requireAdmin, async (req, res) => {
    try{
        const { image, brand, name, description, price, sale, clearance, category_id } = req.body;
        const productData = {};

        const createdProduct = await createProduct({image, brand, name, description, price, sale, clearance, category_id});
        res.send(
            createdProduct
        );

    } catch (error) {
        throw(error);
    };
});

// update product by ID - Admin only
productsRouter.patch('/:id', requireAdmin, async (req, res) => {
    try{
        const { id } = req.params;
        const { image, brand, name, description, price, sale, clearance, category_id } = req.body;

        const updatedProduct = await updateProduct(id, { image, brand, name, description, price, sale, clearance, category_id });

        res.send(
            updatedProduct
        );

    } catch (error) {
        throw(error);
    };
});

// delete product by ID - Admin only
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
        throw(error);
    };
});


module.exports = productsRouter;