// routes/stores.js
const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');

// Get all stores with average rating
router.get('/', auth(), async (req, res) => {
  try {
    const stores = await Store.find().populate('owner', 'name email');

    // Calculate average rating for each store
    const storesWithRatings = await Promise.all(stores.map(async (store) => {
      const ratings = await Rating.find({ store: store._id });
      const avgRating = ratings.length 
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : null;
      return {
        ...store.toObject(),
        averageRating: avgRating,
      };
    }));

    res.json(storesWithRatings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
