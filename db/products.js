const client = require('./client');

// Create a category
async function createCategory(name) {

    try {
        const { rows: [category] } = await client.query(`
            INSERT INTO product_category(name)
            VALUES ($1)
            RETURNING *;
        `, [name]);

        return category;

    } catch (error) {
        throw error;
    };
};

// Create a product.
async function createProduct({image, brand, name, description, price, sale, clearance, category_id}) {

    try {
        const { rows } = await client.query(`
            INSERT INTO products(image, brand, name, description, price, sale, clearance, category_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `, [image, brand, name, description, price, sale, clearance, category_id]);

        
        return rows;
    } catch (error) {
        throw error;
    };
};

// GET product by id.
async function getProductById(id) {

    try {

        const { rows: [ product ]} = await client.query(`
            SELECT *
            FROM products
            WHERE id=$1;
        `, [id]);

        if (!product) {
            return ({
                name: "ProductNotFound",
                message: "Product Not Found."
            });
        };

        return product;

    } catch (error) {
        throw error;
    };
};

// GET all products.
async function getAllProducts() {

    try {

        const { rows } = await client.query(`
            SELECT *
            FROM products;
        `);

        return rows;

    } catch (error) {
        throw error;
    };
};

// DELETE product by id.
async function deleteProduct(id) {

    try {

        const { rows } = await client.query(`
            DELETE FROM products
            WHERE id=$1;
        `, [id]);
        
        return rows;

    } catch (error) {
        throw error;
    };
};

// UPDATE product by id.
async function updateProduct(id, fields={}) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');

    if(setString.length === 0) {
        return;
    };

    try {
        const { rows: [product] } = await client.query(`
            UPDATE products
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));

        return product;

    } catch (error) {
        throw error;
    };
};

// GET product by name. 
async function getProductByName(name) {
    
    try {
        
        const { rows: [product] } = await client.query(`
            SELECT *
            FROM products
            WHERE name=$1;
        `, [name]);
        
        return product;

    } catch (error) {
    throw error;
    };
};

module.exports = {
    createCategory,
    createProduct,
    getProductById,
    getAllProducts,
    deleteProduct,
    updateProduct,
    getProductByName
}