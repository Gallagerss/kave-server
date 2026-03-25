const db = require('../config/database');

// Get all products
exports.getAll = async (req, res) => {
  try {
    const { category, search, available } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (available !== undefined) {
      query += ' AND p.is_available = ?';
      params.push(available === 'true');
    }

    query += ' ORDER BY p.created_at DESC';

    const [products] = await db.query(query, params);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Get single product
exports.getOne = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [req.params.id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: products[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
};

// Create product
exports.create = async (req, res) => {
  try {
    const { name, description, price, category_id, stock, image_url, is_available, is_featured, preparation_time, calories } = req.body;

    const [result] = await db.query(`
      INSERT INTO products (name, description, price, category_id, stock, image_url, is_available, is_featured, preparation_time, calories)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, description, price, category_id, stock || 0, image_url, is_available ?? true, is_featured ?? false, preparation_time, calories]);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
};

// Update product
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];

    Object.keys(req.body).forEach(key => {
      if (['name', 'description', 'price', 'category_id', 'stock', 'image_url', 'is_available', 'is_featured', 'preparation_time', 'calories'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(id);
    await db.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};

// Delete product
exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
};

// Get featured products
exports.getFeatured = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_featured = TRUE AND p.is_available = TRUE
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products'
    });
  }
};