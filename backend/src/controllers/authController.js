const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Generate JWT token
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
}

// Register new user
async function register(req, res) {
    try {
        let { name, email, password } = req.body;

        console.log('📝 Registration attempt:', { name, email: email?.substring(0, 3) + '***' });

        // Trim input values
        name = name ? name.trim() : '';
        email = email ? email.trim().toLowerCase() : '';

        // Validation
        if (!name || !email || !password) {
            console.log('❌ Validation failed: Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Validation failed: Invalid email format');
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        if (password.length < 6) {
            console.log('❌ Validation failed: Password too short');
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user exists
        console.log('🔍 Checking if user exists...');
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            console.log('⚠️  Email already registered:', email);
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        console.log('💾 Inserting new user into database...');
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // Get created user
        console.log('📥 Retrieving created user...');
        const [newUser] = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [result.insertId]
        );

        console.log(`✅ New user registered successfully: ${email} (ID: ${result.insertId})`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser[0]
        });

    } catch (error) {
        console.error('❌ Register error:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error code:', error.code);

        // Check for specific database errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
            return res.status(503).json({
                success: false,
                message: 'Database connection error. Please try again later.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Login user
async function login(req, res) {
    try {
        let { email, password } = req.body;

        console.log('🔐 Login attempt:', { email: email?.substring(0, 3) + '***' });

        // Trim and normalize email
        email = email ? email.trim().toLowerCase() : '';

        // Validation
        if (!email || !password) {
            console.log('❌ Validation failed: Missing credentials');
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Validation failed: Invalid email format');
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Find user
        console.log('🔍 Looking up user in database...');
        const [users] = await pool.query(
            'SELECT id, name, email, password, is_active FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            console.log('⚠️  User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];
        console.log('✓ User found:', user.id);

        // Check if user is active
        if (!user.is_active) {
            console.log('⚠️  Account disabled:', email);
            return res.status(403).json({
                success: false,
                message: 'Account is disabled'
            });
        }

        // Check password
        console.log('🔑 Verifying password...');
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            console.log('❌ Invalid password for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        console.log('📝 Updating last login...');
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        // Generate token
        console.log('🎫 Generating JWT token...');
        const token = generateToken(user);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        console.log(`✅ User logged in successfully: ${email} (ID: ${user.id})`);

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('❌ Login error:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error code:', error.code);

        if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
            return res.status(503).json({
                success: false,
                message: 'Database connection error. Please try again later.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { register, login };
