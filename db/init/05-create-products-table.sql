-- Use the database
USE loginapp;

-- Create products table (טבלת מוצרים)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    subcategory_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'ILS',
    condition_state ENUM('new', 'like_new', 'good', 'fair', 'for_parts') DEFAULT 'good',
    location_city VARCHAR(100),
    location_area VARCHAR(100),
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    is_negotiable BOOLEAN DEFAULT TRUE,
    is_trade_allowed BOOLEAN DEFAULT FALSE,
    trade_description TEXT,
    status ENUM('active', 'sold', 'inactive', 'pending') DEFAULT 'active',
    views_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id),
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_subcategory_id (subcategory_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_price (price),
    INDEX idx_location_city (location_city),
    FULLTEXT idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create product images table (תמונות מוצרים)
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_image_order (image_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create product favorites table (מועדפים)
CREATE TABLE IF NOT EXISTS product_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create trade offers table (הצעות החלפה)
CREATE TABLE IF NOT EXISTS trade_offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_user_id INT NOT NULL,
    to_user_id INT NOT NULL,
    target_product_id INT NOT NULL,
    offered_product_id INT,
    offer_text TEXT,
    status ENUM('pending', 'accepted', 'rejected', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (target_product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (offered_product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_from_user (from_user_id),
    INDEX idx_to_user (to_user_id),
    INDEX idx_target_product (target_product_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Products, Images, Favorites, and Trade Offers tables created successfully!' AS message;
