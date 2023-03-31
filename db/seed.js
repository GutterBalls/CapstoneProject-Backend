const {
    createUser,
    createCategory,
    createProduct
} = require('./')

const client = require('./client');

// Dropping tables, if they exist to repopulate with test data.
async function dropTables() {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS product_category;
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
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            "isAdmin" BOOLEAN DEFAULT false
            );
            CREATE TABLE product_category(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
            );
            CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            image TEXT NOT NULL,
            brand VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            price FLOAT NOT NULL,
            sale BOOLEAN DEFAULT false,
            clearance BOOLEAN DEFAULT false,
            category_id INTEGER REFERENCES product_category(id)
            );
            CREATE TABLE orders(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            order_date DATE,
            order_status VARCHAR(255)
            );

        `);
        console.log("Finished building tables!");

        } catch (error) {
            console.error("Error building tables!");
        throw error; 
    }
}

// Creating dummy data for users table.
async function createInitialUsers() {
    try {
        console.log("Starting to create users...");
        const dummyUsers = [
            { username: "albert", password: "bertie99", email: "albert@heyyyy.com", isAdmin: false },
            { username: "sandra", password: "sandra123", email: "sandy@thebest.com", isAdmin: false },
            { username: "glamgal", password: "glamgal123", email: "josh@glamorous.com", isAdmin: false },
            { username: "admin", password: "password", email: "admin@gutter-balls.com", isAdmin: true }
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

// Creating dummy data for product_category table
async function createInitialCategory() {
    try {
        console.log("Starting to create product categories...");
        const dummyCategories = [
            "balls",
            "bags",
            "shoes",
            "accessories"
        ];
        console.log("createCategory", createCategory);
        const categories = await Promise.all(dummyCategories.map(createCategory));

        console.log("categories created:");
        console.log(categories)
        console.log("Finished creating categories!");

    } catch (error) {
        console.error("Error creating product category")
        throw error;
    };
};

// Creating dummy data for products table
async function createInitialProducts() {
    try {
        console.log("Starting to create products...");
        const dummyProducts = [
            { image: "https://cdn.shopify.com/s/files/1/0079/4928/7522/products/TrackTundraFireBall_1200x.png?v=1679441506", brand: "Track", name: "Tundra Fire", description: "Extraordinary recovery and backend motion", price: 167.95, sale: false, clearance: false, category_id: 1 },
            { image: "https://cdn.shopify.com/s/files/1/0079/4928/7522/products/PurpleSolidReactiveImage2_2000x.png?v=1677947819", brand: "Hammer", name: "Purple Solid", description: "Strong and angular backend motion", price: 149.95, sale: false, clearance: false, category_id: 1 },
            { image: "https://cdn.shopify.com/s/files/1/0079/4928/7522/products/EliteBasicDoubleRollerBlackBagFull_2000x.jpg?v=1677947759", brand: "Elite", name: "Basic 2-ball Roller", description: "Simple design holding 2 bowling balls and 1 pair of shoes", price: 79.95, sale: false, clearance: false, category_id: 2 },
            { image: "https://cdn.shopify.com/s/files/1/0079/4928/7522/products/storm-streamline-4-ball-roller-blacksilverbowling-bag_2000x.jpg?v=1619049544", brand: "Storm", name: "Streamline 4-ball roller", description: "Elegant design holding 4 bowling balls and 1 pair of shoes", price: 279.95, sale: false, clearance: false, category_id: 2 },
            { image: "https://cdn.shopify.com/s/files/1/0079/4928/7522/products/dexter-mens-sst-8-power-frame-boa-camo-bowling-shoes_eaf815a8-b29f-4318-8e67-d07edb04afbb_2000x.jpg?v=1677947359", brand: "Dexter", name: "SST 8 Camo", description: "Durable shoe with interchangable soles and heels for multiple approaches", price: 139.95, sale: false, clearance: false, category_id: 3 },
            { image: "https://cdn.shopify.com/s/files/1/0079/4928/7522/products/dexter-womens-kerrie-grey-twill-bowling-shoes_3b5fbc1e-3566-4284-bea7-a4385a1b280c_2000x.jpg?v=1644969820", brand: "Dexter", name: "Womens Kerrie Grey Twill", description: "Lightweight, stylish basic shoe", price: 69.95, sale: false, clearance: false, category_id: 3 }
        ];

        const products = await Promise.all(dummyProducts.map(createProduct));

        console.log("products created:");
        console.log(products)
        console.log("Finished creating products!");

    } catch (error) {
        console.error("Error creating products");
        throw error;
    };
};

// Create dummy data for orders table
async function createInitialOrders() {
    try {
        console.log("Starting to create orders");
        const dummyOrders = [
            { user_id: 1, order_date: new Date, order_status: "pending"},
            { user_id: 2, order_date: new Date, order_status: "shipped"},
            { user_id: 3, order_date: new Date, order_status: "delivered"},
            { user_id: 1, order_date: new Date}
        ];

        const orders = await Promise.all(dummyOrders.map(createOrder));

        console.log("orders created:");
        console.log(orders)
        console.log("Finished creating orders!");

    } catch (error) {
        console.error("Error creating orders");
        throw error;
    }
}
async function rebuildDB() {
    try {
    client.connect();
    
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialCategory();
    await createInitialProducts();
    // await createInitialOrders();



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