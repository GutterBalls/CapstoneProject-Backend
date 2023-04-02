const client = require('./client');

// Create payment
async function createPayment( {user_id, address, city, state, zip_code} ) {
    
    try {
        console.log("starting createPayment");
        const { rows: [ payment ] } = await client.query(`
            INSERT INTO payment(user_id, address, city, state, zip_code)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [user_id, address, city, state, zip_code]);


        console.log("finished createPayment");
        return payment;
    } catch (error) {
        throw "Error w/ createPayment", error;
    };
};

// Get all Payments
async function getAllPayments() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM payment;
        `);

        return rows;
    } catch (error) {
        throw error;
    };
};

// Get Payment by ID
async function getPaymentById(id) {
    try {
        const { rows: [ payment ]} = await client.query(`
            SELECT *
            FROM payment
            WHERE id=$1;
        `, [id]);

        if (!payment) {
            return ({
                name: "PaymentNotFound",
                message: "Payment Not Found."
            });
        };

        console.log(payment);
        return payment;

    } catch (error) {
        throw error;
    };
};

// Delete payment by ID
async function deletePayment(id) {
    try {
        await client.query(`
            DELETE FROM payment
            WHERE id=$1;
        `, [id]);
        
        return `Deleted payment id: ${id}`
    } catch (error) {
        throw error;
    };
};

// Edit/Update payment by ID
async function updatePayment(id, fields = { }) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if(setString.length === 0) {
        return;
    };

    try {
        const { rows: [ payment ] } = await client.query(`
            UPDATE payment
            SET ${ setString }
            WHERE id = ${id}
            RETURNING *;
        `, Object.values(fields));

        return payment;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    deletePayment,
    updatePayment
}