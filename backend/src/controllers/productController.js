const { pool } = require('../config/database');

// Create new product
const createProduct = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            category_id,
            subcategory_id,
            title,
            description,
            price,
            currency,
            condition_state,
            location_city,
            location_area,
            contact_name,
            contact_phone,
            contact_email,
            is_negotiable,
            is_trade_allowed,
            trade_description,
            images
        } = req.body;

        const user_id = req.user.id; // From auth middleware

        // Insert product
        const [result] = await connection.query(
            `INSERT INTO products (
                user_id, category_id, subcategory_id, title, description,
                price, currency, condition_state, location_city, location_area,
                contact_name, contact_phone, contact_email,
                is_negotiable, is_trade_allowed, trade_description, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
            [
                user_id, category_id, subcategory_id, title, description,
                price, currency, condition_state, location_city, location_area,
                contact_name, contact_phone, contact_email,
                is_negotiable, is_trade_allowed, trade_description
            ]
        );

        const product_id = result.insertId;

        // Insert images if provided
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                await connection.query(
                    'INSERT INTO product_images (product_id, image_url, image_order, is_primary) VALUES (?, ?, ?, ?)',
                    [product_id, images[i], i, i === 0]
                );
            }
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product_id }
        });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product'
        });
    } finally {
        connection.release();
    }
};

// Get products (timeline/feed)
const getProducts = async (req, res) => {
    try {
        const {
            category_id,
            subcategory_id,
            search,
            location_city,
            min_price,
            max_price,
            condition_state,
            page = 1,
            limit = 20
        } = req.query;

        const offset = (page - 1) * limit;

        let query = `
            SELECT
                p.*,
                u.name as user_name,
                c.name_he as category_name,
                s.name_he as subcategory_name,
                (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image,
                (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) as images_count
            FROM products p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            WHERE p.status = 'active'
        `;

        const params = [];

        if (category_id) {
            query += ' AND p.category_id = ?';
            params.push(category_id);
        }

        if (subcategory_id) {
            query += ' AND p.subcategory_id = ?';
            params.push(subcategory_id);
        }

        if (search) {
            query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (location_city) {
            query += ' AND p.location_city = ?';
            params.push(location_city);
        }

        if (min_price) {
            query += ' AND p.price >= ?';
            params.push(min_price);
        }

        if (max_price) {
            query += ' AND p.price <= ?';
            params.push(max_price);
        }

        if (condition_state) {
            query += ' AND p.condition_state = ?';
            params.push(condition_state);
        }

        query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [products] = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE p.status = "active"';
        const countParams = [];

        if (category_id) {
            countQuery += ' AND p.category_id = ?';
            countParams.push(category_id);
        }

        if (subcategory_id) {
            countQuery += ' AND p.subcategory_id = ?';
            countParams.push(subcategory_id);
        }

        if (search) {
            countQuery += ' AND (p.title LIKE ? OR p.description LIKE ?)';
            countParams.push(`%${search}%`, `%${search}%`);
        }

        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Increment view count
        await pool.query(
            'UPDATE products SET views_count = views_count + 1 WHERE id = ?',
            [id]
        );

        // Get product details
        const [products] = await pool.query(
            `SELECT
                p.*,
                u.name as user_name,
                u.email as user_email,
                c.name_he as category_name,
                c.slug as category_slug,
                s.name_he as subcategory_name,
                s.slug as subcategory_slug
            FROM products p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            WHERE p.id = ?`,
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const product = products[0];

        // Get all images
        const [images] = await pool.query(
            'SELECT * FROM product_images WHERE product_id = ? ORDER BY image_order ASC',
            [id]
        );

        product.images = images;

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product'
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        // Check if product belongs to user
        const [products] = await pool.query(
            'SELECT * FROM products WHERE id = ? AND user_id = ?',
            [id, user_id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or unauthorized'
            });
        }

        const {
            title,
            description,
            price,
            condition_state,
            location_city,
            location_area,
            is_negotiable,
            is_trade_allowed,
            trade_description,
            status
        } = req.body;

        await pool.query(
            `UPDATE products SET
                title = ?, description = ?, price = ?, condition_state = ?,
                location_city = ?, location_area = ?, is_negotiable = ?,
                is_trade_allowed = ?, trade_description = ?, status = ?
            WHERE id = ?`,
            [
                title, description, price, condition_state,
                location_city, location_area, is_negotiable,
                is_trade_allowed, trade_description, status, id
            ]
        );

        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product'
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        // Check if product belongs to user
        const [products] = await pool.query(
            'SELECT * FROM products WHERE id = ? AND user_id = ?',
            [id, user_id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or unauthorized'
            });
        }

        await pool.query('DELETE FROM products WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product'
        });
    }
};

// Get user's products
const getUserProducts = async (req, res) => {
    try {
        const user_id = req.user.id;

        const [products] = await pool.query(
            `SELECT
                p.*,
                c.name_he as category_name,
                s.name_he as subcategory_name,
                (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC`,
            [user_id]
        );

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching user products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user products'
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getUserProducts
};
