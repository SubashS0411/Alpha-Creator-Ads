require('dotenv').config();
const mongoose = require('mongoose');
const Advertisement = require('./models/Advertisement');

// MongoDB connection
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

async function updateAdvertisementVideos() {
  try {
    console.log('🔄 Updating advertisement video URLs to working sources...');
    
    // Update all advertisements to use working video URLs
    const updateResult = await Advertisement.updateMany(
      {}, // Update all advertisements
      {
        $set: {
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
          duration: 30 // Set to 30 seconds for a proper ad duration
        }
      }
    );
    
    console.log(`✅ Updated ${updateResult.modifiedCount} advertisements with working video URLs`);
    
    // Display current advertisements
    const ads = await Advertisement.find({});
    console.log('\n📺 Current Advertisements:');
    ads.forEach((ad, index) => {
      console.log(`${index + 1}. "${ad.title}"`);
      console.log(`   Advertiser: ${ad.advertiser.name}`);
      console.log(`   Video URL: ${ad.videoUrl}`);
      console.log(`   Duration: ${ad.duration}s (Skip after ${ad.adSettings.skipAfter}s)`);
      console.log(`   Shop Now: "${ad.adSettings.shopNowText}" → ${ad.adSettings.shopNowUrl}`);
      console.log('');
    });
    
    console.log('🎯 Advertisement videos updated successfully!');
    console.log('💡 Your ads will now play properly with working video sources.');
    
  } catch (error) {
    console.error('❌ Error updating advertisements:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

async function main() {
  await connectDB();
  await updateAdvertisementVideos();
}

main();