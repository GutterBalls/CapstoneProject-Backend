const client = require('./client');

// Create an order.
async function createOrder( {user_id, order_date} ) {
    
    console.log("Order date", order_date)
    try {
        console.log("staring createProducts");
        const { rows: [order] } = await client.query(`
            INSERT INTO orders(user_id, order_date)
            VALUES ($1, $2)
            RETURNING *;
        `, [user_id, order_date]);

        console.log("finished createOrder");
        return order;
    } catch (error) {
        throw "Error w/ createOrder", error;
    };
};

// Get all orders.
async function getAllOrders() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM orders;
        `);

        return rows;
    } catch (error) {
        throw "Error w/ getAllOrders", error;
    };
};

// Delete an order by order id.
async function deleteOrder(id) {
    try {
        await client.query(`
            DELETE FROM orders
            WHERE id=$1;
        `, [id]);
        
        return `Deleted order id: ${id}`;
    } catch (error) {
        throw "Error w/ deleteOrder", error;
    };
};

// Update an order by order id.
async function editOrder( {id, order_status}) {
    try {
        const { rows: [ order ] } = await client.query(`
            UPDATE orders
            SET order_status=$2
            WHERE id=$1
            RETURNING *;
        `, [id, order_status]);

        return order;

    } catch (error) {
        throw "Error w/ editOrder", error;
    };
};

async function getOrderByUserId(user_id) {
    try {
        console.log("db70- User_id:", user_id);
        const { rows } = await client.query(`
            SELECT id, user_id, order_date, order_status 
            FROM orders
            WHERE user_id=$1;
            
        `, [user_id]);

        if (!rows) {
            return ({
                name: "OrderNotFound",
                message: "Order Not Found."
            });
        };

        console.log("DB85- rows:", rows);
        return rows;

    } catch (error) {
        throw error;
    };
};

module.exports = {
    getAllOrders,
    getOrderByUserId,
    createOrder,
    editOrder,
    deleteOrder
}