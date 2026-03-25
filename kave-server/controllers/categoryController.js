const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM products WHERE category_id = c.id) as product_count
      FROM categories c 
      WHERE c.is_active = TRUE 
      ORDER BY c.sort_order ASC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, image_url, sort_order } = req.body;

    const [result] = await db.query(
      'INSERT INTO categories (name, description, image_url, sort_order) VALUES (?, ?, ?, ?)',
      [name, description, image_url, sort_order || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { id: result.insertId, ...req.body }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category'
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, sort_order, is_active } = req.body;

    await db.query(
      'UPDATE categories SET name = ?, description = ?, image_url = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [name, description, image_url, sort_order, is_active, id]
    );

    res.json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cannot delete category with existing products'
    });
  }
};