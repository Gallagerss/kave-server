const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

// Public
router.get('/', categoryController.getAll);

// Protected
router.post('/', authMiddleware, authorize('owner', 'manager'), categoryController.create);
router.put('/:id', authMiddleware, authorize('owner', 'manager'), categoryController.update);
router.delete('/:id', authMiddleware, authorize('owner'), categoryController.delete);

module.exports = router;