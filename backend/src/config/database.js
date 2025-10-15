const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'apppassword',
    database: process.env.DB_NAME || 'loginapp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

module.exports = { pool, testConnection };
