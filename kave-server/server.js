const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');

// Import database
const db = require('./config/database');

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ==================== INITIALIZE DATABASE ====================
const initDatabase = async () => {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('owner', 'manager', 'cashier', 'customer') NOT NULL DEFAULT 'customer',
        name VARCHAR(100),
        phone VARCHAR(20),
        avatar VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `);

    // Categories table
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category_id INT,
        image_url VARCHAR(255),
        stock INT DEFAULT 0,
        is_available BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        preparation_time INT DEFAULT 5,
        calories INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);

    // Orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(20) NOT NULL UNIQUE,
        customer_id INT,
        cashier_id INT,
        status ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
        payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
        payment_method ENUM('cash', 'card', 'e-wallet', 'qris') DEFAULT 'cash',
        subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
        tax DECIMAL(10, 2) DEFAULT 0,
        discount DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(12, 2) NOT NULL DEFAULT 0,
        notes TEXT,
        customer_name VARCHAR(100),
        table_number INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Order items table
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_price DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(12, 2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Transactions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        payment_method ENUM('cash', 'card', 'e-wallet', 'qris') NOT NULL,
        payment_reference VARCHAR(100),
        status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
        processed_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Daily sales summary
    await db.query(`
      CREATE TABLE IF NOT EXISTS daily_sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sale_date DATE NOT NULL UNIQUE,
        total_orders INT DEFAULT 0,
        total_revenue DECIMAL(12, 2) DEFAULT 0,
        total_tax DECIMAL(10, 2) DEFAULT 0,
        total_discount DECIMAL(10, 2) DEFAULT 0,
        cash_sales DECIMAL(12, 2) DEFAULT 0,
        card_sales DECIMAL(12, 2) DEFAULT 0,
        ewallet_sales DECIMAL(12, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All tables created/verified successfully');

    // Insert demo data
    await insertDemoData();

  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
};

// Demo data
const insertDemoData = async () => {
  const bcrypt = require('bcryptjs');
  
  // Check if demo data exists
  const [users] = await db.query('SELECT COUNT(*) as count FROM users');
  if (users[0].count > 0) return;

  console.log('📝 Inserting demo data...');

  // Demo users
  const hashedPassword = await bcrypt.hash('demo123', 10);
  await db.query(`
    INSERT INTO users (username, email, password, role, name, phone) VALUES
    ('owner', 'owner@kave.com', ?, 'owner', 'Café Owner', '+6281234567890'),
    ('manager', 'manager@kave.com', ?, 'manager', 'Store Manager', '+6281234567891'),
    ('cashier', 'cashier@kave.com', ?, 'cashier', 'John Cashier', '+6281234567892'),
    ('cashier123', 'cashier123@kave.com', ?, 'cashier', 'Jane Cashier', '+6281234567893')
  `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword]);

  // Categories
  await db.query(`
    INSERT INTO categories (name, description, sort_order) VALUES
    ('Coffee', 'Premium coffee beverages', 1),
    ('Special Collection', 'Signature and seasonal drinks', 2),
    ('Non-Coffee', 'Tea and other beverages', 3),
    ('Food', 'Snacks and meals', 4)
  `);

  // Products
  await db.query(`
    INSERT INTO products (name, description, price, category_id, stock, is_featured, calories) VALUES
    ('Americano', 'Rich and bold espresso with hot water', 38000, 1, 100, TRUE, 15),
    ('Cappuccino', 'Espresso with steamed milk foam', 42000, 1, 100, TRUE, 120),
    ('Latte', 'Smooth espresso with creamy steamed milk', 45000, 1, 100, TRUE, 150),
    ('Butterscotch Latte', 'Sweet butterscotch blended with latte', 48000, 2, 50, TRUE, 280),
    ('Aren Latte', 'Natural palm sugar latte', 45000, 2, 50, TRUE, 200),
    ('Matcha Latte', 'Japanese matcha with steamed milk', 52000, 2, 50, TRUE, 180),
    ('Avocado Latte', 'Creamy avocado coffee fusion', 48000, 2, 30, FALSE, 250),
    ('Hot Chocolate', 'Rich Belgian chocolate', 40000, 3, 80, FALSE, 280),
    ('Croissant', 'Freshly baked butter croissant', 25000, 4, 20, FALSE, 300),
    ('Cheesecake', 'New York style cheesecake', 35000, 4, 15, FALSE, 400)
  `);

  console.log('✅ Demo data inserted successfully');
};

// Initialize DB on startup
initDatabase();

// ==================== ROUTES ====================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Kave Café API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Server running on port ${PORT}
  🌐 Environment: ${process.env.NODE_ENV || 'development'}
  📊 API: http://localhost:${PORT}
  `);
});