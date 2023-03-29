const { 
    client
} = require('./index');

async function dropTables() {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
            DROP TABLE IF EXISTS _____;
            `);
            console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error; 
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`


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
    
    // await createUser({ username: 'albert', password: 'bertie99'});


        console.log("Finished creating users!");

    } catch(error) {
        console.error("Error creating users!");
    throw error;
    }
}


async function rebuildDB() {
    try {
    client.connect();
    
    await dropTables();
    await createTables();


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