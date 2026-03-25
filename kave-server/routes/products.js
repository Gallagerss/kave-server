const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getAll);
router.get('/featured', productController.getFeatured);
router.get('/:id', productController.getOne);

// Protected routes (owner, manager only)
router.post('/', authMiddleware, authorize('owner', 'manager'), productController.create);
router.put('/:id', authMiddleware, authorize('owner', 'manager'), productController.update);
router.delete('/:id', authMiddleware, authorize('owner', 'manager'), productController.delete);

module.exports = router;