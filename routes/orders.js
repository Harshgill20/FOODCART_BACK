const express = require('express');
const Order = require('../models/Order');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();
router.use(requireAuth); // every order route needs a logged-in user

// POST /api/orders  -> place an order (total is calculated on the server)
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, address, items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    const total = items.reduce((s, i) => s + Number(i.price) * Number(i.qty), 0);
    const order = await Order.create({ user: req.userId, customerName, phone, address, items, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(err.name === 'ValidationError' ? 400 : 500).json({ error: err.message });
  }
});

// GET /api/orders -> the logged-in user's orders (newest first)
router.get('/', async (req, res) => {
  try {
    res.json(await Order.find({ user: req.userId }).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
