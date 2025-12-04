const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    // Connect to MongoDB - using clone database
    await mongoose.connect('mongodb://127.0.0.1:27018/clone');
    console.log('Connected to MongoDB - clone database');
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`\nDatabase: ${dbName}`);

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Collections in database:');
    
    if (collections.length === 0) {
      console.log('   No collections found');
    } else {
      for (const collection of collections) {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        console.log(`   ✓ ${collection.name} (${count} documents)`);
      }
    }

    // Show database stats
    const stats = await mongoose.connection.db.stats();
    console.log('\n📊 Database Statistics:');
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Documents: ${stats.objects}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`   Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);

    process.exit(0);

  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase();