const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryBySlug,
    getSubcategories
} = require('../controllers/categoryController');

// Get all categories with subcategories
router.get('/', getAllCategories);

// Get category by slug
router.get('/:slug', getCategoryBySlug);

// Get subcategories for a specific category
router.get('/:categoryId/subcategories', getSubcategories);

module.exports = router;
