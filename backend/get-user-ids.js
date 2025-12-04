const mongoose = require('mongoose');
require('dotenv').config();

async function getUserIds() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    
    // Get existing users
    const users = await mongoose.connection.db.collection('users').find({}).limit(5).toArray();
    console.log('\n📋 Available users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}, Username: ${user.username}, Email: ${user.email}`);
    });
    
    if (users.length > 0) {
      console.log(`\n✅ First user ID to use: ${users[0]._id}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

getUserIds();