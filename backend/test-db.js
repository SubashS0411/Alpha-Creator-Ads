const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test basic operations
    const testCollection = mongoose.connection.db.collection('test');
    
    // Insert test document
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Insert operation successful');
    
    // Find test document
    const doc = await testCollection.findOne({ test: true });
    console.log('✅ Find operation successful:', doc);
    
    // Count documents
    const count = await testCollection.countDocuments();
    console.log('✅ Count operation successful:', count);
    
    console.log('🎉 Database connection and operations working perfectly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await mongoose.connection.close();
  }
};

testConnection();