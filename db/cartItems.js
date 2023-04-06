const client = require('./client');

// Create Cart Item
async function createCartItem( {order_id, product_id, qty} ) {
    try {
        console.log("starting createCartItem");
        const { rows: [cartItem] } = await client.query(`
            INSERT INTO cart_items(order_id, product_id, qty, price)
            SELECT $1, $2, $3, products.price
            FROM products
            WHERE products.id = $2
            RETURNING *;
        `, [order_id, product_id, qty]);



        console.log("finished createCartItem");
        return cartItem;
    } catch (error) {
        throw "Error w/ createCartItem", error;
    };
};

// Get all Cart Items
async function getAllCartItems() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM cart_items;
        `);

        return rows;
    } catch (error) {
        throw error;
    };
};

// Get Cart Item by ID
async function getCartItemById(id) {
    try {
        const { rows: [ cartItem ]} = await client.query(`
            SELECT *
            FROM cart_items
            WHERE id=$1;
        `, [id]);

        if (!cartItem) {
            return ({
                name: "CartItemNotFound",
                message: "Cart Item ID Not Found."
            });
        };

        console.log(cartItem);
        return cartItem;

    } catch (error) {
        throw error;
    };
};

// Delete Cart Item by ID
async function deleteCartItem(id) {
    try {
        await client.query(`
            DELETE FROM cart_items
            WHERE id=$1;
        `, [id]);
        
        return `Deleted cart_item id: ${id}`
    } catch (error) {
        throw error;
    };
};

// Edit/Update Cart Item by ID
async function updateCartItem(id, fields = { }) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if(setString.length === 0) {
        return;
    };

    try {
        const { rows: [ cartItem ] } = await client.query(`
            UPDATE cart_items
            SET ${ setString }
            WHERE id = ${id}
            RETURNING *;
        `, Object.values(fields));

        return cartItem;

    } catch (error) {
        throw error;
    }
};

// Join table with Products / Orders / Cart Items
async function getCartWithOrdersAndProducts(userId) {
    try {
        const { rows } = await client.query(`
        SELECT cart_items.id FROM cart_items
        JOIN products
        ON cart_items.product_id = products.id
        JOIN orders
        ON cart_items.order_id = orders.id
        WHERE orders.user_id=$1 AND orders.order_status=false;
        `, [userId]);
        console.log("rows 112")
        console.log(rows)
        return rows;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    createCartItem,
    getAllCartItems,
    getCartItemById,
    deleteCartItem,
    updateCartItem,
    getCartWithOrdersAndProducts
}