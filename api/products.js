const express = require('express');

const productsRouter = express.Router();

const { requireUser } = require('./utils');

// Required Functions:
// getAllProducts
// getProductById
// getProductByName
// createProduct
// editProduct
// deleteProduct

//const { 
    // getAllProducts,
    // getProductById,
    // getProductByName,
    // createProduct,
    // editProduct,
    // deleteProduct
// } = require('../db');

// Get all products
productsRouter.get('/', async (req, res) => {
    
})

// Get products by ID
productsRouter.get('/:productId', async (req, res) => {
    
})

// Create new product
productsRouter.post('/', requireUser, async (req, res, next) => {

})

// update product by ID
productsRouter.patch('/:productId', requireUser, async (req, res, next) => {

})

// delete product by ID
productsRouter.delete('/:productId', requireUser, async (req, res, next) => {
})

module.exports = productsRouter;