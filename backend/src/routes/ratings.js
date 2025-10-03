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

// GET average rating for a store
router.get('/average/:storeId', auth(), async (req, res) => {
  const { storeId } = req.params;
  try {
    const result = await Rating.aggregate([
      { $match: { store: new mongoose.Types.ObjectId(storeId) } },
      { $group: { _id: '$store', average: { $avg: '$score' } } }
    ]);

    const average = result[0]?.average || 0;
    res.json({ storeId, average });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
