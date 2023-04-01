const client = require('./client');

// Create an itemsPurchased.
async function createItemsPurchased( {product_id, order_id, purchasedPrice} ) {
    
    try {
        console.log("starting createItemsPurchased");
        const { rows: [ itemPurchased ] } = await client.query(`
            INSERT INTO items_purchased(product_id, order_id, "purchasedPrice")
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [product_id, order_id, purchasedPrice]);

        console.log("finished createItemsPurchased");
        return itemPurchased;
    } catch (error) {
        throw "Error w/ createItemsPurchased", error;
    };
};




module.exports = {
    createItemsPurchased
}