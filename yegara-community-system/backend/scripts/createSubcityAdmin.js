const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const ADMIN_USER = {
  fullName: 'Sofiya Yasin',
  email: 'sofiyasin190@gmail.com',
  password: 'Yegara@123',
  role: 'subcity_admin',
  isActive: true
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const existing = await User.findOne({ email: ADMIN_USER.email });
    if (existing) {
      console.error('User already exists. No changes were made.');
      process.exit(1);
    }

    await User.create(ADMIN_USER);
    console.log('Subcity admin user created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create subcity admin user:', error.message);
    process.exit(1);
  }
};

run();
