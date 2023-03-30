const {
    createUser
} = require('./')

const { 
    client
} = require('./client');

// Dropping tables, if they exist to repopulate with test data.
async function dropTables() {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
            DROP TABLE IF EXISTS users;
            `);
            console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error; 
    };
};

// Creating tables in gutterBalls database.
async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
            CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
            );


        `);
        console.log("Finished building tables!");

        } catch (error) {
            console.error("Error building tables!");
        throw error; 
    }
}

async function createInitialUsers() {
    try {
        console.log("Starting to create users...");
        const dummyUsers = [
            { username: "albert", password: "bertie99" },
            { username: "sandra", password: "sandra123" },
            { username: "glamgal", password: "glamgal123" },
        ];
        const users = await Promise.all(dummyUsers.map(createUser));
    
        console.log("Users create:")
        console.log(users)
        console.log("Finished creating users!");

    } catch(error) {
        console.error("Error creating users!");
    throw error;
    };
};


async function rebuildDB() {
    try {
    client.connect();
    
    await dropTables();
    await createTables();
    await createInitialUsers();


    } catch (error) {
        console.log("Error during rebuildDB")
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...");


        console.log("Finished database tests!");
    } catch (error) {
        console.error("Error during testDB!");
        throw error;
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());