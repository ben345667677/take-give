-- Use the database
USE loginapp;

-- Insert test user
-- Password is '123456' (in production, use bcrypt hash!)
INSERT INTO users (name, email, password)
VALUES ('Test User', 'test@test.com', '123456')
ON DUPLICATE KEY UPDATE name = name;

-- Show test user inserted
SELECT 'Test user inserted successfully!' AS message;
SELECT id, name, email, created_at FROM users WHERE email = 'test@test.com';
