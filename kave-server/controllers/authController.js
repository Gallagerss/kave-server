const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Login
exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check role if specified
    if (role && user.role !== role && user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied for this role'
      });
    }

    // Update last login
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Register (untuk customer)
exports.register = async (req, res) => {
  try {
    const { username, email, password, name, phone } = req.body;

    // Check existing user
    const [existing] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, name, phone, role) VALUES (?, ?, ?, ?, ?, "customer")',
      [username, email, hashedPassword, name, phone]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId, username, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: { id: result.insertId, username, email, name, role: 'customer' }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, name, role, phone, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Social login (simplified)
exports.socialLogin = async (req, res) => {
  try {
    const { provider, socialId, email, name } = req.body;
    
    // Check if user exists
    let [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      // Create new customer
      const username = email.split('@')[0] + '_' + Date.now();
      await db.query(
        'INSERT INTO users (username, email, name, role, password) VALUES (?, ?, ?, "customer", ?)',
        [username, email, name, await bcrypt.hash(Math.random().toString(36), 10)]
      );
      
      [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    }

    const user = users[0];
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: { token, user: { id: user.id, username: user.username, name: user.name, role: user.role } }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Social login failed' });
  }
};