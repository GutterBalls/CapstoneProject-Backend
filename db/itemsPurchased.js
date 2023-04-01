const client = require('./client');

// Create itemsPurchased
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

// Get all itemsPurchased
async function getAllItemsPurchased() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM items_purchased;
        `);

        return rows;
    } catch (error) {
        throw error;
    };
};

// Get itemsPurchased by ID
async function getItemsPurchasedById(id) {
    try {
        const { rows: [ itemPurchased ]} = await client.query(`
            SELECT *
            FROM items_purchased
            WHERE id=$1;
        `, [id]);

        if (!itemPurchased) {
            return ({
                name: "itemPurchasedNotFound",
                message: "itemPurchased Not Found."
            });
        };

        console.log(itemPurchased);
        return itemPurchased;

    } catch (error) {
        throw error;
    };
};

// Delete itemsPurchased by ID
async function deleteItemsPurchased(id) {
    try {
        await client.query(`
            DELETE FROM items_purchased
            WHERE id=$1;
        `, [id]);
        
        return `Deleted itemPurchased id: ${id}`
    } catch (error) {
        throw error;
    };
};

// Edit/Update itemsPurchased by ID
async function updateItemPurchased(id, fields = { }) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if(setString.length === 0) {
        return;
    };

    try {
        const { rows: [ itemPurchased ] } = await client.query(`
            UPDATE items_purchased
            SET ${ setString }
            WHERE id = ${id}
            RETURNING *;
        `, Object.values(fields));

        return itemPurchased;

    } catch (error) {
        throw error;
    }
}



module.exports = {
    createItemsPurchased,
    getAllItemsPurchased,
    getItemsPurchasedById,
    deleteItemsPurchased,
    updateItemPurchased
    
}