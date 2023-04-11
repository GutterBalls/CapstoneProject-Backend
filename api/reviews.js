const express = require('express');

const reviewsRouter = express.Router();

const { requireUser } = require('./utils');

const {
    getAllReviews,
    createReview
} = require('../db/reviews');

// POST a review.
reviewsRouter.post('/', requireUser, async (req, res) => {
    try {
        const { username, product_id, product_brand, product_name, rating, review}  = req.body;
        
        const productReview = await createReview({username, product_id, product_brand, product_name, rating, review});
        res.send(
            productReview
        );

    } catch (error) {
        throw error;
    };
});

// GET all reviews. 
reviewsRouter.get('/', async (req, res) => {
    try {
        const allReviews = await getAllReviews();

        res.send(
            allReviews
        );

    } catch (error) {
        throw error;
    };
});

module.exports = reviewsRouter;