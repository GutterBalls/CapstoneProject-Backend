const client = require("./client");
const bcrypt = require("bcrypt");

// Create a user.
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
  
      return user;
    } catch (error) {
      throw error;
    };
  };

// Get user by userId
async function getUserById(id) {
    try {
        const { rows: [ user ]} = await client.query(`
            SELECT id, username
            FROM users
            WHERE id=$1;
        `, [id]);

        if (!user) {
            res.send({
                name: "UserNotFound",
                message: "Please create an account."
            });
        };

        console.log("DB getUser Function user", user);
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


module.exports = {
    createUser,
    getUserByUsername,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
}