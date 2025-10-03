// models/Rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, min: 1, max: 5, required: true },
});

module.exports = mongoose.model('Rating', ratingSchema);
