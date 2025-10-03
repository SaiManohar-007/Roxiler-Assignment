require("dotenv").config();
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");

const sampleTransactions = [
  {
    title: "Laptop",
    description: "Gaming laptop",
    price: 1200,
    dateOfSale: new Date("2025-09-15"),
    category: "Electronics",
    sold: true,
  },
  {
    title: "Shoes",
    description: "Running shoes",
    price: 80,
    dateOfSale: new Date("2025-09-20"),
    category: "Fashion",
    sold: false,
  },
  {
    title: "Headphones",
    description: "Wireless Bluetooth headphones",
    price: 150,
    dateOfSale: new Date("2025-09-10"),
    category: "Electronics",
    sold: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Transaction.deleteMany();
    await Transaction.insertMany(sampleTransactions);

    console.log("🌱 Transactions seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
