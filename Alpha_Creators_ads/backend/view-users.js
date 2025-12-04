/**
 * View All Users in Database
 * Simple script to list all registered users
 */

import mongoose from 'mongoose';
import User from './src/models/User.js';
import { config } from './src/config/index.js';

async function viewUsers() {
  try {
    console.log('\n🔍 Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected!\n');

    const users = await User.find({})
      .select('email username firstName lastName isEmailVerified createdAt lastLogin')
      .sort({ createdAt: -1 });

    console.log('═══════════════════════════════════════════════════════');
    console.log(`📊 Total Users in Database: ${users.length}`);
    console.log('═══════════════════════════════════════════════════════\n');

    if (users.length === 0) {
      console.log('⚠️  No users found in database.');
      console.log('💡 Try registering a user through the API.\n');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. 📧 ${user.email}`);
        console.log(`   👤 Username: ${user.username}`);
        if (user.firstName || user.lastName) {
          console.log(`   🏷️  Name: ${user.firstName || ''} ${user.lastName || ''}`.trim());
        }
        console.log(`   ✉️  Email Verified: ${user.isEmailVerified ? '✅' : '❌'}`);
        console.log(`   📅 Created: ${user.createdAt.toLocaleString()}`);
        if (user.lastLogin) {
          console.log(`   🕐 Last Login: ${user.lastLogin.toLocaleString()}`);
        }
        console.log('   ' + '─'.repeat(50));
      });
    }

    console.log('\n✅ Query complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n⚠️  Cannot connect to MongoDB!');
      console.error('💡 Make sure MongoDB is running: mongod');
    }
  } finally {
    await mongoose.connection.close();
  }
}

viewUsers();
