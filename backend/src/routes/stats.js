// routes/stats.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');

// Admin dashboard stats
router.get('/', auth(['ADMIN']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    // Optional: average rating across all stores
    const ratings = await Rating.find();
    const avgRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
      : 0;

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
      averageRating: avgRating.toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
