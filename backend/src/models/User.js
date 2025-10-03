const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,  // ✅ allow shorter names now
      maxlength: 60,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: /.+\@.+\..+/,
    },
    address: {
      type: String,
      required: true,
      maxlength: 400,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      // ✅ no maxLength because bcrypt hashes are always ~60 chars
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER', 'OWNER'],
      default: 'USER',
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
