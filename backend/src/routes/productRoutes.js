const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getUserProducts
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', getProducts); // Get all products (timeline/feed)
router.get('/:id', getProductById); // Get single product

// Protected routes (require authentication)
router.post('/', authenticateToken, createProduct); // Create new product
router.put('/:id', authenticateToken, updateProduct); // Update product
router.delete('/:id', authenticateToken, deleteProduct); // Delete product
router.get('/user/my-products', authenticateToken, getUserProducts); // Get user's products

module.exports = router;
