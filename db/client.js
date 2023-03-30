require('dotenv').config();
const { Client } = require('pg'); 

const connectionString = process.env.DATABASE_URL || `postgrest://localhost:5432/gutterBalls`

const client = new Client({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false }: undefined,
});

module.exports = client;