const client = require("./client");
const bcrypt = require("bcrypt");
const { getProductById } = require("./products");

// Create a user.
async function createUser({ username, password, email, isAdmin, isActive }) {
    try {
    // console.log("starting createUser");
    let saltRounds = 10;
    let hashPassword = await bcrypt.hash(password, saltRounds);
    let hashEmail = await bcrypt.hash(email, saltRounds);
    
    const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password, email, "isAdmin", "isActive")
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
    `, [username, hashPassword, hashEmail, isAdmin, isActive]);

        // console.log("finished createUser");
    return user;

    } catch (error) {
    console.log(error);
    throw error;
    };
};

// Get a user by username.
async function getUserByUsername(username) {
    try {
    const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE username=$1;
    `, [username]);

    //   if (!user) {
    //     return ({
    //         name: "UserNotFound",
    //         message: "Please create an account."
    //     });
    // };

    return user;
    } catch (error) {
    throw error;
    };
};

// Get user by userId
async function getUserById(id) {
    try {
        const { rows: [ user ]} = await client.query(`
            SELECT id, username, "isAdmin", "isActive"
            FROM users
            WHERE id=$1;
        `, [id]);

        if (!user) {
            return ({
                name: "UserNotFound",
                message: "Please create an account."
            });
        };

        // console.log("DB getUser Function user", user);
        return user;

    } catch (error) {
        throw error;
    };
};

// Get all users (admin only)
async function getAllUsers() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM users;
        `);

        return rows;
    } catch (error) {
        throw error;
    };
};

// Update User
async function updateUser(id, fields={}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if(setString.length === 0) {
        return;
    };

    try {
        const { rows: [user] } = await client.query(`
            UPDATE users
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));

        return user;

    } catch (error) {
        throw error;
    }
}

// Delete a user (admin & user)
async function deleteUser(id) {
    try {
        await client.query(`
            DELETE FROM users
            WHERE id=$1;
        `, [id]);
        
        return `Deleted user id: ${id}`
    } catch (error) {
        throw error;
    };
};




module.exports = {
    createUser,
    getUserByUsername,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser
};