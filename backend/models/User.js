const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return password by default in queries
    },
    role: {
      type: String,
      enum: ['customer', 'admin'], // this is your RBAC field
      default: 'customer',
    },
  },
  { timestamps: true } // auto-adds createdAt / updatedAt fields
);

module.exports = mongoose.model('User', userSchema);