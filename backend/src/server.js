const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Auth routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
async function startServer() {
    try {
        // Test database connection
        console.log('🔄 Testing database connection...');
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.log('⚠️  Starting server anyway, but database connection failed');
        }

        // Start listening
        app.listen(PORT, '0.0.0.0', () => {
            console.log('=================================');
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 API URL: http://localhost:${PORT}/api`);
            console.log('=================================');
            console.log('Available endpoints:');
            console.log(`  GET  /api/health`);
            console.log(`  POST /api/auth/register`);
            console.log(`  POST /api/auth/login`);
            console.log('=================================');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing server');
    process.exit(0);
});
