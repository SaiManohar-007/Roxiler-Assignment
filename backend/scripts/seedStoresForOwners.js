require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Store = require('../src/models/Store');

const seedStoresForOwners = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Fetch all users with role OWNER
    const owners = await User.find({ role: 'OWNER' });
    if (!owners.length) {
      console.log('No store owners found');
      return mongoose.disconnect();
    }

    for (const owner of owners) {
      const existingStore = await Store.findOne({ owner: owner._id });
      if (existingStore) {
        console.log(`Store already exists for owner: ${owner.name}`);
        continue;
      }

      // Create a store for this owner
      const store = new Store({
        name: `${owner.name}'s Store`,
        email: `${owner.email}`, // or generate a store-specific email if needed
        address: `Default address for ${owner.name}`,
        owner: owner._id,
      });
      await store.save();
      console.log(`Created store for owner: ${owner.name}`);
    }

    console.log('✅ Store seeding completed');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding stores:', err.message);
  }
};

seedStoresForOwners();
