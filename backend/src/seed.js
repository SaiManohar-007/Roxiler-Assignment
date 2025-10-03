require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Role = require("./models/Role");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/store_ratings";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Seed roles
    const roleNames = ["ADMIN", "USER", "MODERATOR"];
    const roleIds = {};

    for (const name of roleNames) {
      let role = await Role.findOne({ name });
      if (!role) {
        role = await Role.create({ name });
        console.log(` Role ${name} created`);
      } else {
        console.log(`⚠️ Role ${name} already exists`);
      }
      roleIds[name] = role._id;
    }

    // Seed admin user
    const adminEmail = "admin@example.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin = await User.create({
        username: "admin",
        email: adminEmail,
        password: hashedPassword,
        roles: [roleIds["ADMIN"]],
      });
      console.log(`✅ Admin user created: ${adminEmail} / admin123`);
    } else {
      console.log("⚠️ Admin user already exists");
    }

    console.log("🌱 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
