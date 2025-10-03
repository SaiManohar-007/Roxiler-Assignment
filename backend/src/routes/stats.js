const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');

// Admin stats
router.get('/', auth(['ADMIN']), async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalStores = await Store.countDocuments();
  const totalRatings = await Rating.countDocuments();
  res.json({ totalUsers, totalStores, totalRatings });
});

module.exports = router;
