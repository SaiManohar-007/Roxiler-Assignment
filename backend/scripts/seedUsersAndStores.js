require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

const usersData = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password@123',
    address: '123 Main Street, City',
    role: 'USER',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'Password@123',
    address: '456 Oak Avenue, City',
    role: 'USER',
  },
];

const storeOwnersData = [
  {
    name: 'Store One',
    email: 'store1@example.com',
    password: 'Password@123',
    address: '789 Market Road, City',
    role: 'OWNER',
  },
  {
    name: 'Store Two',
    email: 'store2@example.com',
    password: 'Password@123',
    address: '101 Industrial Area, City',
    role: 'OWNER',
  },
];

const seedUsersAndStores = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const createUserIfNotExists = async (userData) => {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`⚠️ User ${userData.email} already exists`);
        return;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await User.create({
        name: userData.name,
        email: userData.email,
        address: userData.address,
        password: hashedPassword,
        role: userData.role,
      });

      console.log(`✅ Created user: ${userData.email}`);
    };

    for (const u of usersData) await createUserIfNotExists(u);
    for (const s of storeOwnersData) await createUserIfNotExists(s);

    console.log('✅ Seeding of users & store owners done');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding users:', err.message);
  }
};

seedUsersAndStores();
