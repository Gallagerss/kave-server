const db = require('../config/database');

// Generate order number
const generateOrderNumber = async () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const [result] = await db.query(
    'SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()'
  );
  const count = result[0].count + 1;
  return `KV-${date}-${count.toString().padStart(4, '0')}`;
};

// Create order
exports.create = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { items, customer_name, table_number, notes, payment_method } = req.body;
    const cashier_id = req.user?.id || null;

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      const [products] = await connection.query('SELECT price, stock, is_available FROM products WHERE id = ?', [item.product_id]);
      
      if (products.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }
      
      if (!products[0].is_available) {
        throw new Error(`Product ${item.product_id} is not available`);
      }

      subtotal += products[0].price * item.quantity;
    }

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    const order_number = await generateOrderNumber();

    // Create order
    const [orderResult] = await connection.query(`
      INSERT INTO orders (order_number, cashier_id, subtotal, tax, total, notes, customer_name, table_number, payment_method, status, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid')
    `, [order_number, cashier_id, subtotal, tax, total, notes, customer_name, table_number, payment_method]);

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      const [products] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      const unitPrice = products[0].price;
      const itemSubtotal = unitPrice * item.quantity;

      await connection.query(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [orderId, item.product_id, item.quantity, unitPrice, itemSubtotal, item.notes]);

      // Update stock
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    // Create transaction record
    await connection.query(`
      INSERT INTO transactions (order_id, amount, payment_method, status)
      VALUES (?, ?, ?, 'pending')
    `, [orderId, total, payment_method || 'cash']);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order_id: orderId,
        order_number,
        subtotal,
        tax,
        total,
        status: 'pending'
      }
    });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  } finally {
    connection.release();
  }
};

// Get all orders
exports.getAll = async (req, res) => {
  try {
    const { status, date, limit = 50 } = req.query;
    
    let query = `
      SELECT o.*, 
        u.name as cashier_name,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o 
      LEFT JOIN users u ON o.cashier_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND DATE(o.created_at) = ?';
      params.push(date);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const [orders] = await db.query(query, params);

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Get order details
exports.getOne = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.name as cashier_name 
      FROM orders o 
      LEFT JOIN users u ON o.cashier_id = u.id
      WHERE o.id = ?
    `, [req.params.id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const [items] = await db.query(`
      SELECT oi.*, p.name as product_name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json({
      success: true,
      data: {
        ...orders[0],
        items
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// Update order status
exports.updateStatus = async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    const { id } = req.params;

    let query = 'UPDATE orders SET ';
    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
      
      if (status === 'completed') {
        updates.push('completed_at = NOW()');
      }
    }

    if (payment_status) {
      updates.push('payment_status = ?');
      values.push(payment_status);
    }

    query += updates.join(', ') + ' WHERE id = ?';
    values.push(id);

    await db.query(query, values);

    // Update transaction if payment completed
    if (payment_status === 'paid') {
      await db.query('UPDATE transactions SET status = "success" WHERE order_id = ?', [id]);
    }

    res.json({
      success: true,
      message: 'Order status updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order'
    });
  }
};

// Get sales report
exports.getSalesReport = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const [sales] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_orders,
        SUM(total) as total_revenue,
        SUM(subtotal) as total_subtotal,
        SUM(tax) as total_tax
      FROM orders
      WHERE status = 'completed'
        AND DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [start_date, end_date]);

    const [summary] = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total) as total_revenue,
        AVG(total) as average_order
      FROM orders
      WHERE status = 'completed'
        AND DATE(created_at) BETWEEN ? AND ?
    `, [start_date, end_date]);

    res.json({
      success: true,
      data: {
        daily: sales,
        summary: summary[0]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
};