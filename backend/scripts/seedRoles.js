require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../src/models/Role');

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const roles = ['ADMIN', 'USER', 'OWNER'];

    for (const role of roles) {
      const existing = await Role.findOne({ name: role });
      if (existing) {
        console.log(`Role ${role} already exists`);
      } else {
        await Role.create({ name: role });
        console.log(`Role ${role} created`);
      }
    }

    console.log('✅ Role seeding done');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding roles:', err.message);
  }
};

seedRoles();
