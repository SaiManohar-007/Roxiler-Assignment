// scripts/seedRatings.js
require('dotenv').config();
const mongoose = require('mongoose');
const Rating = require('../src/models/Rating');
const Store = require('../src/models/Store');
const User = require('../src/models/User');

const seedRatings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const stores = await Store.find({});
    const users = await User.find({ role: 'USER' });

    if (!stores.length || !users.length) {
      console.log('❌ Stores or Users not found. Seed them first!');
      return process.exit(1);
    }

    for (const store of stores) {
      for (const user of users) {
        // Random rating 1-5
        const score = Math.floor(Math.random() * 5) + 1;

        // Check if rating already exists
        const existing = await Rating.findOne({ store: store._id, user: user._id });
        if (existing) continue;

        const rating = new Rating({
          store: store._id,
          user: user._id,
          score,
        });
        await rating.save();
        console.log(`✅ Rating by ${user.name} for store ${store.name} saved`);
      }
    }

    console.log('✅ All ratings seeded successfully');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding ratings:', err.message);
    mongoose.disconnect();
  }
};

seedRatings();
