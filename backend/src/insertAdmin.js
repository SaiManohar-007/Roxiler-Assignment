const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const { DataTypes } = require('sequelize');

// Define Role model
const Role = sequelize.define('Role', {
  name: { type: DataTypes.STRING, unique: true },
}, { tableName: 'roles', timestamps: false });

// Define User model
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  address: DataTypes.STRING,
  password: DataTypes.STRING,
  role_id: DataTypes.INTEGER,
}, { tableName: 'users', timestamps: true });

async function insertAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    // Get ADMIN role id
    const adminRole = await Role.findOne({ where: { name: 'ADMIN' } });
    if (!adminRole) throw new Error('ADMIN role not found');

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await User.create({
      name: 'Platform Administrator',
      email: 'admin@example.com',
      address: 'Headquarters',
      password: hashedPassword,
      role_id: adminRole.id,
    });

    console.log('✅ Admin user created successfully');
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

insertAdmin();
