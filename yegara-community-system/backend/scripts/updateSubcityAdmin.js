const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const ADMIN_UPDATE = {
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

    const user = await User.findOne({ email: ADMIN_UPDATE.email }).select('+password');
    if (!user) {
      console.error('User not found. No changes were made.');
      process.exit(1);
    }

    user.fullName = ADMIN_UPDATE.fullName;
    user.role = ADMIN_UPDATE.role;
    user.isActive = ADMIN_UPDATE.isActive;
    user.password = ADMIN_UPDATE.password;

    await user.save();
    console.log('Subcity admin user updated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to update subcity admin user:', error.message);
    process.exit(1);
  }
};

run();
