const { pool } = require('../config/database');

// Get all categories with subcategories
const getAllCategories = async (req, res) => {
    try {
        // Get all active categories
        const [categories] = await pool.query(
            'SELECT * FROM categories WHERE is_active = true ORDER BY display_order ASC'
        );

        // Get all active subcategories
        const [subcategories] = await pool.query(
            'SELECT * FROM subcategories WHERE is_active = true ORDER BY display_order ASC'
        );

        // Organize subcategories under their parent categories
        const categoriesWithSubs = categories.map(cat => ({
            ...cat,
            subcategories: subcategories.filter(sub => sub.category_id === cat.id)
        }));

        res.json({
            success: true,
            data: categoriesWithSubs
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        });
    }
};

// Get single category by slug
const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const [categories] = await pool.query(
            'SELECT * FROM categories WHERE slug = ? AND is_active = true',
            [slug]
        );

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const category = categories[0];

        // Get subcategories for this category
        const [subcategories] = await pool.query(
            'SELECT * FROM subcategories WHERE category_id = ? AND is_active = true ORDER BY display_order ASC',
            [category.id]
        );

        res.json({
            success: true,
            data: {
                ...category,
                subcategories
            }
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch category'
        });
    }
};

// Get subcategories for a category
const getSubcategories = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const [subcategories] = await pool.query(
            'SELECT * FROM subcategories WHERE category_id = ? AND is_active = true ORDER BY display_order ASC',
            [categoryId]
        );

        res.json({
            success: true,
            data: subcategories
        });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subcategories'
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryBySlug,
    getSubcategories
};
