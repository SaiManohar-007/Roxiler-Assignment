// models/Store.js
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true },
  address: { type: String, maxlength: 400, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Store', storeSchema);
