require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      address: 'HQ - Central Office',
      password: hashedPassword,
      role: 'ADMIN',
    });

    console.log('✅ Admin user created');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  }
};

seedAdmin();
