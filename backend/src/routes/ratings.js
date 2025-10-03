const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');

// Submit/update rating
router.post('/:storeId', auth(['USER']), async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user._id;

  try {
    const updated = await Rating.findOneAndUpdate(
      { store: storeId, user: userId },
      { rating },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
