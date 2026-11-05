const express = require('express');
const Food = require('../models/Food');
const router = express.Router();

// GET /api/foods  (optional ?search=pizza)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) {
      const safe = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = new RegExp(safe, 'i');
    }
    res.json(await Food.find(filter).sort({ name: 1 }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

// POST /api/foods  -> add a dish
router.post('/', async (req, res) => {
  try {
    res.status(201).json(await Food.create(req.body));
  } catch (err) {
    res.status(err.name === 'ValidationError' || err.code === 11000 ? 400 : 500).json({ error: err.message });
  }
});

module.exports = router;
