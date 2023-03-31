const client = require('./client');

// Create a category.
async function createCategory(name) {
    try {
        console.log("starting createCategory");
        const { rows: [category] } = await client.query(`
            INSERT INTO product_category(name)
            VALUES ($1)
            RETURNING *;
        `, [name]);

        console.log("finished createCategory");
        return category;

    } catch (error) {
        throw error;
    };
};

// Create a product.
async function createProducts({image, brand, name, description, price, sale, clearance, category_id}) {
    try {
        console.log("staring createProducts");
        const { rows } = await client.query(`
            INSERT INTO products(image, brand, name, description, price, sale, clearance, category_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `, [image, brand, name, description, price, sale, clearance, category_id]);

        console.log("finished createProducts");
        return rows;
    } catch (error) {
        throw error;
    };
};

module.exports = {
    createCategory,
    createProducts
}