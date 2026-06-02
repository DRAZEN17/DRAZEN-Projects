import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

async function run() {
  try {
    await connectDB(process.env.MONGO_URI);
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('No admin user found');
      process.exit(1);
    }

    admin.email = 'drazen90sea@gmail.com';
    admin.password = 'draxly1790';
    await admin.save();
    console.log('Admin credentials updated:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
