const mongoose = require('mongoose');
require('dotenv').config();

async function exploreDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clone';
    console.log(`Connecting to: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📁 Database name: ${dbName}`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📊 Found ${collections.length} collections:`);
    
    for (const collection of collections) {
      console.log(`\n🗂️  Collection: ${collection.name}`);
      
      // Get document count
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`   📄 Document count: ${count}`);
      
      if (count > 0) {
        // Get sample document
        const sample = await mongoose.connection.db.collection(collection.name).findOne();
        console.log(`   📝 Sample document structure:`, Object.keys(sample || {}));
      }
    }
    
    // Try to find YouTube-related collections
    const youtubeCollections = collections.filter(c => 
      c.name.toLowerCase().includes('youtube') || 
      c.name.toLowerCase().includes('video') ||
      c.name.toLowerCase().includes('channel')
    );
    
    if (youtubeCollections.length > 0) {
      console.log(`\n🎥 YouTube-related collections found:`);
      for (const collection of youtubeCollections) {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        console.log(`   - ${collection.name}: ${count} documents`);
      }
    }
    
    console.log('\n✅ Database exploration completed!');
    
  } catch (error) {
    console.error('❌ Error exploring database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

exploreDatabase();