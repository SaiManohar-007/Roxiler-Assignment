// scripts/seedTransactions.js
require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('../src/models/Transaction');
const Store = require('../src/models/Store');

const categories = ['Electronics', 'Groceries', 'Clothing', 'Books', 'Toys', 'Furniture'];

const generateRandomTransactions = (storeId, count = 5) => {
  const transactions = [];
  for (let i = 0; i < count; i++) {
    transactions.push({
      title: `Transaction ${i + 1}`,
      description: `Description for transaction ${i + 1}`,
      price: Math.floor(Math.random() * 5000) + 100, // random price 100-5000
      category: categories[Math.floor(Math.random() * categories.length)],
      dateOfSale: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // random date in last 30 days
      sold: Math.random() < 0.8, // 80% chance sold
      store: storeId,
    });
  }
  return transactions;
};

const seedTransactions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const stores = await Store.find({});
    if (!stores.length) {
      console.log('❌ No stores found. Seed stores first!');
      return process.exit(1);
    }

    for (const store of stores) {
      const transactions = generateRandomTransactions(store._id, 5);
      await Transaction.insertMany(transactions);
      console.log(`✅ Seeded 5 transactions for store: ${store.name}`);
    }

    console.log('✅ All transactions seeded successfully');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding transactions:', err.message);
    mongoose.disconnect();
  }
};

seedTransactions();
