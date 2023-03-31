const client = require('./client');

// Required Functions:
// getAllOrders//
// getOrderById//
// getOrderByName
// createOrder//
// editOrder//
// deleteOrder//

// Create an order.
async function createOrder({ order_date, order_status }) {
    try {
        console.log("staring createProducts");
        const { rows } = await client.query(`
            INSERT INTO orders(order_date, order_status)
            VALUES ($1, $2)
            RETURNING *;
        `, [order_date, order_status]);

        console.log("finished createOrder");
        return rows;
    } catch (error) {
        throw "Error w/ createOrder", error;
    };
};

async function getOrderById(id) {
    try {
        const { rows: [ order ]} = await client.query(`
            SELECT *
            FROM orders
            WHERE id=$1;
        `, [id]);

        if (!order) {
            return ({
                name: "OrderNotFound",
                message: "Order Not Found."
            });
        };

        console.log(order);
        return order;

    } catch (error) {
        throw "Error w/ getOrderById", error;
    };
};

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

async function deleteOrder(id) {
    try {
        await client.query(`
            DELETE FROM orders
            WHERE id=$1;
        `, [id]);
        
        return `Deleted order id: ${id}`
    } catch (error) {
        throw "Error w/ deleteOrder", error;
    };
};

async function editOrder(id, fields={}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if(setString.length === 0) {
        return;
    };

    try {
        const { rows: [ order ] } = await client.query(`
            UPDATE orders
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));

        return order;

    } catch (error) {
        throw "Error w/ editOrder", error;
    }
}

// async function getProductByName(name) {
//     try {
//     const { rows: [product] } = await client.query(`
//         SELECT *
//         FROM products
//         WHERE name=$1;
//     `, [name]);

//     return product;
//     } catch (error) {
//     throw error;
//     };
// };

module.exports = {
    getAllOrders,
    getOrderById,
    getOrderByUserId,
    getOrderByName,
    createOrder,
    editOrder,
    deleteOrder
}