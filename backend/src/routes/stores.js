const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const auth = require('../middleware/auth');

// Get all stores
router.get('/', auth(), async (req, res) => {
  const stores = await Store.find().populate('owner', 'name email');
  res.json(stores);
});

// Create new store (ADMIN only)
router.post('/', auth(['ADMIN']), async (req, res) => {
  const { name, email, address, owner } = req.body;
  try {
    const store = new Store({ name, email, address, owner });
    await store.save();
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
