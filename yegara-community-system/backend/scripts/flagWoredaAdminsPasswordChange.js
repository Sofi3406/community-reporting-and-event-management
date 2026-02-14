const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const result = await User.updateMany(
      { role: 'woreda_admin' },
      { $set: { mustChangePassword: true } }
    );

    console.log(`Updated ${result.modifiedCount || 0} woreda admin(s).`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to update woreda admins:', error.message);
    process.exit(1);
  }
};

run();
