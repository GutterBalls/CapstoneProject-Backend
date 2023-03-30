const client = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
    try {
    console.log("starting createUser");
    let saltRounds = 10;
    let hashPassword = await bcrypt.hash(password, saltRounds);
    
    const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
    `, [username, hashPassword]);

        console.log("finished createUser");
    return user;

    } catch (error) {
    console.log(error);
    throw error;
    }
}

module.exports = {
    createUser
}