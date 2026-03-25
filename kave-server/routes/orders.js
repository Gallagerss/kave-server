const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateStatus } = require('../controllers/orderController');

router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id/status', updateStatus);

module.exports = router;