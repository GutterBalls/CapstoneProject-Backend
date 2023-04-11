const client = require('./client');
const bcrypt = require("bcrypt");

// Create payment
async function createPayment( {user_id, cardnum, exp, cvv, name, address, city, state, zip_code} ) {

    try {
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


        
        return rows[0];
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



module.exports = {
    createPayment,
    deletePayment
}