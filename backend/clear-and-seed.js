const mongoose = require('mongoose');
require('dotenv').config();

// Import YouTube models
const YouTubeVideo = require('./youtube/models/YouTubeVideo');
const YouTubeChannel = require('./youtube/models/YouTubeChannel');

const clearAndSeed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/appclone');
    console.log('Connected to MongoDB');

    // Clear existing YouTube data
    console.log('Clearing existing YouTube data...');
    await YouTubeVideo.deleteMany({});
    await YouTubeChannel.deleteMany({});
    console.log('Cleared existing data');

    // Run the seeding script
    console.log('Running seeding script...');
    require('./seed-youtube-sample-data');

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

clearAndSeed();