const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./instagram/models/Post');
const Reel = require('./instagram/models/Reel');
const Story = require('./instagram/models/Story');
require('dotenv').config();

const sampleUsers = [
  {
    _id: new mongoose.Types.ObjectId('6743c123456789012345678a'),
    username: 'john_doe',
    fullName: 'John Doe',
    email: 'john@example.com',
    profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    isVerified: true
  },
  {
    _id: new mongoose.Types.ObjectId('6743c123456789012345678b'),
    username: 'jane_smith',
    fullName: 'Jane Smith', 
    email: 'jane@example.com',
    profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    isVerified: false
  },
  {
    _id: new mongoose.Types.ObjectId('6743c123456789012345678c'),
    username: 'travel_lover',
    fullName: 'Travel Lover',
    email: 'travel@example.com', 
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isVerified: true
  }
];

const samplePosts = [
  {
    author: new mongoose.Types.ObjectId('6743c123456789012345678a'),
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
    caption: 'Beautiful sunset at the beach 🌅 #nature #sunset',
    location: 'Malibu Beach',
    aspectRatio: '1:1',
    likes: [
      new mongoose.Types.ObjectId('6743c123456789012345678b'),
      new mongoose.Types.ObjectId('6743c123456789012345678c')
    ],
    comments: [
      {
        author: new mongoose.Types.ObjectId('6743c123456789012345678b'),
        text: 'Amazing shot! 📸'
      }
    ]
  },
  {
    author: new mongoose.Types.ObjectId('6743c123456789012345678b'),
    type: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
    caption: 'Check out this cool video! 🎬 #video #content',
    location: 'Los Angeles',
    aspectRatio: '9:16',
    duration: 30,
    likes: [new mongoose.Types.ObjectId('6743c123456789012345678a')],
    comments: []
  },
  {
    author: new mongoose.Types.ObjectId('6743c123456789012345678c'),
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
    caption: 'Mountain adventures await! 🏔️ #mountains #hiking #adventure',
    location: 'Rocky Mountains',
    aspectRatio: '4:5',
    likes: [
      new mongoose.Types.ObjectId('6743c123456789012345678a'),
      new mongoose.Types.ObjectId('6743c123456789012345678b')
    ],
    comments: [
      {
        author: new mongoose.Types.ObjectId('6743c123456789012345678a'),
        text: 'Love the view!'
      },
      {
        author: new mongoose.Types.ObjectId('6743c123456789012345678b'), 
        text: 'Where exactly is this? 🤔'
      }
    ]
  }
];

const sampleReels = [
  {
    user: new mongoose.Types.ObjectId('6743c123456789012345678a'),
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=500',
    caption: 'Quick workout routine! 💪 #fitness #workout',
    duration: 15,
    audioInfo: {
      title: 'Workout Beat',
      artist: 'FitnessMusic'
    },
    likes: [new mongoose.Types.ObjectId('6743c123456789012345678b')],
    comments: [
      {
        user: new mongoose.Types.ObjectId('6743c123456789012345678b'),
        text: 'Great routine!'
      }
    ],
    views: 1250
  },
  {
    user: new mongoose.Types.ObjectId('6743c123456789012345678b'),
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=500',
    caption: 'Cooking something delicious 🍳 #cooking #food',
    duration: 30,
    audioInfo: {
      title: 'Original Audio',
      artist: 'jane_smith'
    },
    likes: [
      new mongoose.Types.ObjectId('6743c123456789012345678a'),
      new mongoose.Types.ObjectId('6743c123456789012345678c')
    ],
    comments: [],
    views: 890
  }
];

const sampleStories = [
  {
    user: new mongoose.Types.ObjectId('6743c123456789012345678a'),
    mediaUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
    type: 'image',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    viewers: [new mongoose.Types.ObjectId('6743c123456789012345678b')]
  },
  {
    user: new mongoose.Types.ObjectId('6743c123456789012345678c'),
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    duration: 10,
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours from now
    viewers: []
  }
];

async function createSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/appclone', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data (skip if authentication fails)
    try {
      await User.deleteMany({});
      await Post.deleteMany({});
      await Reel.deleteMany({});
      await Story.deleteMany({});
      console.log('Cleared existing data');
    } catch (error) {
      console.log('Skip clearing data (auth issue):', error.message);
    }

    // Create sample users
    await User.insertMany(sampleUsers);
    console.log('Created sample users');

    // Create sample posts
    await Post.insertMany(samplePosts);
    console.log('Created sample posts');

    // Create sample reels
    await Reel.insertMany(sampleReels);
    console.log('Created sample reels');

    // Create sample stories
    await Story.insertMany(sampleStories);
    console.log('Created sample stories');

    console.log('✅ Sample data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    process.exit(1);
  }
}

createSampleData();