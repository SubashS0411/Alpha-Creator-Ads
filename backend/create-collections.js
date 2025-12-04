const mongoose = require('mongoose');
require('dotenv').config();

// Import models to create collections
const User = require('./models/User');
const Reel = require('./models/Reel');
const { Message, Conversation } = require('./models/Message');
const Post = require('./models/Post');

async function createCollections() {
  try {
    // Connect to MongoDB - using clone database
    await mongoose.connect('mongodb://127.0.0.1:27017/clone');
    console.log('Connected to MongoDB - clone database');

    // Drop existing collections to start fresh
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of collections) {
      await mongoose.connection.db.collection(collection.name).drop();
      console.log(`Dropped existing ${collection.name} collection`);
    }

    // Create collections by inserting sample data
    console.log('Creating collections...');

    // Create Users collection with sample user
    const sampleUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      fullName: 'Test User',
      profilePicture: 'https://via.placeholder.com/150',
      bio: 'Sample user for testing',
      followers: [],
      following: [],
      posts: []
    });
    await sampleUser.save();
    console.log('✓ Users collection created');

    // Create Reels collection with sample reel
    const sampleReel = new Reel({
      author: sampleUser._id,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnailUrl: 'https://via.placeholder.com/300x400/000000/FFFFFF?text=Video+Thumbnail',
      caption: 'Sample reel for testing',
      duration: 15,
      likes: [],
      comments: [],
      views: 0
    });
    await sampleReel.save();
    console.log('✓ Reels collection created');

    // Create Conversations and Messages collections
    const sampleConversation = new Conversation({
      participants: [sampleUser._id]
    });
    await sampleConversation.save();
    
    const sampleMessage = new Message({
      conversationId: sampleConversation._id,
      sender: sampleUser._id,
      text: 'Sample message for testing',
      messageType: 'text'
    });
    await sampleMessage.save();
    console.log('✓ Conversations and Messages collections created');

    // Create Posts collection with sample post
    const samplePost = new Post({
      user: sampleUser._id,
      caption: 'Sample post for testing',
      imageUrl: 'https://via.placeholder.com/600x600/000000/FFFFFF?text=Sample+Post',
      tags: ['sample', 'test'],
      analytics: {
        views: 0,
        impressions: 0,
        engagements: 0
      }
    });
    await samplePost.save();
    console.log('✓ Posts collection created');

    // List all collections
    const finalCollections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCreated collections:');
    finalCollections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    console.log('\nDatabase setup complete!');
    process.exit(0);

  } catch (error) {
    console.error('Error creating collections:', error);
    process.exit(1);
  }
}

createCollections();