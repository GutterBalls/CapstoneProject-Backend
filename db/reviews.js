const client = require('./client');

// CREATE a review.
async function createReview({username, product_id, product_brand, product_name, rating, review}) {

    try {

        const { rows: [singleReview]} = await client.query(`
            INSERT INTO reviews(username, product_id, product_brand, product_name, rating, review)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [username, product_id, product_brand, product_name, rating, review]);

        return singleReview;

    } catch (error) {
        throw error;
    };
};

// GET all reviews.
async function getAllReviews () {

    try {

        const { rows } = await client.query(`
            SELECT *
            FROM reviews;
        `);

        return rows;
        
    } catch (error) {
        throw error;
    };
};

module.exports = {
    createReview,
    getAllReviews
}