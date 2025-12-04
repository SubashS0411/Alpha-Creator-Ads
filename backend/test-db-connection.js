const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = 'mongodb://127.0.0.1:27017';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test database access
    const db = client.db('appclone');
    
    // Try to list collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test insert without authentication
    try {
      const testCollection = db.collection('test');
      const result = await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
      console.log('✅ Insert test successful:', result.insertedId);
      
      // Clean up test document
      await testCollection.deleteOne({ _id: result.insertedId });
      console.log('🧹 Cleaned up test document');
      
    } catch (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      console.log('💡 MongoDB requires authentication. Need to configure auth or disable it.');
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  } finally {
    await client.close();
  }
}

testConnection();