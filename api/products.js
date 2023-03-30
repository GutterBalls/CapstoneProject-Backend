const express = require('express');

const productsRouter = express.Router();

const { requireUser } = require('./utils');

// Required Functions:
// getAllProducts
// getProductById
// getProductByName
// createProduct
// updateProduct
// deleteProduct

const { 
    getAllProducts,
    getProductById,
    // getProductByName,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../db');

// Get all products
productsRouter.get('/', async (req, res) => {
    const products = await getAllProducts();

    res.send({
        products
    });
})

// Get products by ID
productsRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    // console.log("Req params", id)
    const product = await getProductById(id);

    res.send(
        product
    );
}) ;

// Create new product
productsRouter.post('/', async (req, res) => {
    try{
        const { } = req.body;
        const productData = {};

        // if(){

        // }

        const createdProduct = await createProduct();

        res.send(
            createdProduct
        )
    } catch (error) {
        throw(error);
    }
})

// update product by ID
productsRouter.patch('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const {  } = req.body;
        const updatedProduct = await updateProduct(id, { });

        res.send(updatedProduct)
    } catch (error) {
        throw(error);
    }
})

// delete product by ID
productsRouter.delete('/:id', async (req, res) => {
    try{
        const product = await getProductById(req.params.id);
        // const { id } = req.params;
        if(product.id){
            const deletedProduct = await deleteProduct(id);
            
                res.send(deletedProduct);
        } else {
            res.send(product ? { 
                name: "UnauthorizedProductError",
                message: "You cannot delete a product"
            } : {
                name: "ProductNotFoundError",
                message: "That product does not exist"
            });
        }
    } catch (error) {
        throw(error);
    }
})

module.exports = productsRouter;