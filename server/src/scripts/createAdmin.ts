/**
 * Setup Script: Create First Admin User
 * 
 * Run this script to create your first admin user.
 * Usage: npx ts-node src/scripts/createAdmin.ts
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import readline from 'readline';
import User from '../models/User';
import { UserRole } from '../types/rbac';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve));
};

async function createAdminUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/rishi-portfolio';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get user input
    const name = await question('Admin Name: ');
    const email = await question('Admin Email: ');
    const password = await question('Admin Password: ');

    // Validate input
    if (!name || !email || !password) {
      console.error('❌ All fields are required');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('\n⚠️  User already exists with this email.');
      const updateRole = await question('Do you want to promote this user to admin? (yes/no): ');
      
      if (updateRole.toLowerCase() === 'yes' || updateRole.toLowerCase() === 'y') {
        existingUser.role = UserRole.ADMIN;
        await existingUser.save();
        console.log('✅ User promoted to admin successfully!');
        console.log(`\nAdmin User Details:`);
        console.log(`Name: ${existingUser.name}`);
        console.log(`Email: ${existingUser.email}`);
        console.log(`Role: ${existingUser.role}`);
      } else {
        console.log('❌ Operation cancelled');
      }
      
      rl.close();
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create new admin user
    const adminUser = new User({
      name,
      email,
      password,
      role: UserRole.ADMIN,
      emailVerified: true // Auto-verify admin users
    });

    await adminUser.save();

    console.log('\n✅ Admin user created successfully!');
    console.log(`\nAdmin User Details:`);
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`Email Verified: ${adminUser.emailVerified}`);

    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    rl.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Handle Ctrl+C
process.on('SIGINT', async () => {
  console.log('\n\n❌ Operation cancelled by user');
  rl.close();
  await mongoose.disconnect();
  process.exit(0);
});

// Run the script
console.log('='.repeat(50));
console.log('Create Admin User Script');
console.log('='.repeat(50));
console.log('\nThis script will create a new admin user.');
console.log('Press Ctrl+C to cancel at any time.\n');

createAdminUser();
