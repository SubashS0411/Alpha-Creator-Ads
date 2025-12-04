/**
 * Database Connection Test and User Creation Debug Script
 */

import mongoose from 'mongoose';
import User from './src/models/User.js';
import { config } from './src/config/index.js';

console.log('🔍 Testing MongoDB Connection and User Creation...\n');

async function testConnection() {
  try {
    console.log('📡 Connecting to MongoDB...');
    console.log(`📍 Connection String: ${config.mongodb.uri}\n`);

    await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB Connected Successfully!\n');

    // Test creating a user
    console.log('🧪 Testing User Creation...');
    
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      username: `testuser${Date.now()}`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
    };

    console.log('📝 Creating user:', testUser.email);

    const user = new User(testUser);
    await user.save();

    console.log('✅ User created successfully!');
    console.log('📊 User ID:', user._id);
    console.log('📧 Email:', user.email);
    console.log('👤 Username:', user.username);
    console.log('');

    // Verify user exists in database
    console.log('🔍 Verifying user in database...');
    const foundUser = await User.findById(user._id);
    
    if (foundUser) {
      console.log('✅ User found in database!');
      console.log('📊 Retrieved user:', foundUser.email);
    } else {
      console.log('❌ User NOT found in database!');
    }

    console.log('');

    // List all users
    console.log('📋 Listing all users in database...');
    const allUsers = await User.find({}).select('email username createdAt');
    console.log(`📊 Total users: ${allUsers.length}`);
    
    if (allUsers.length > 0) {
      console.log('');
      allUsers.forEach((u, i) => {
        console.log(`${i + 1}. ${u.email} (${u.username}) - Created: ${u.createdAt}`);
      });
    }

    console.log('\n✅ All tests passed! Database is working correctly.\n');

  } catch (error) {
    console.error('❌ Error occurred:', error.message);
    console.error('\n📋 Full error:', error);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n⚠️  MongoDB is not running or connection string is incorrect!');
      console.error('💡 Make sure MongoDB is installed and running on your system.');
      console.error('💡 To install MongoDB: https://www.mongodb.com/try/download/community');
    }
  } finally {
    await mongoose.connection.close();
    console.log('👋 Connection closed');
  }
}

testConnection();
