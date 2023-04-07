const client = require('./client');
const bcrypt = require("bcrypt");

// Create payment
async function createPayment( {user_id, cardnum, exp, cvv, name, address, city, state, zip_code} ) {
    try {
        console.log("starting db createPayment");
        let saltRounds = 10;
        let hashCardnum = await bcrypt.hash(cardnum.toString(), saltRounds);
        let hashExp = await bcrypt.hash(exp.toString(), saltRounds);
        let hashCvv = await bcrypt.hash(cvv.toString(), saltRounds);
        let hashName = await bcrypt.hash(name, saltRounds);
        let hashAddress = await bcrypt.hash(address, saltRounds);
        let hashCity = await bcrypt.hash(city, saltRounds);
        let hashState = await bcrypt.hash(state, saltRounds);
        let hashZip = await bcrypt.hash(zip_code.toString(), saltRounds);

        const { rows } = await client.query(`
            INSERT INTO payment(user_id, cardnum, exp, cvv, name, address, city, state, zip_code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `, [user_id, hashCardnum, hashExp, hashCvv, hashName, hashAddress, hashCity, hashState, hashZip]);


        console.log("finished db createPayment");
        return rows[0];
    } catch (error) {
        throw "Error w/ db createPayment", error;
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