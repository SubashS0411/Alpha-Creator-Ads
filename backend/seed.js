const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-clone');
    console.log('Connected to MongoDB');

    // Skip clearing data and just add new data
    console.log('Skipping data clearing due to authentication requirements');

    // Check if demo user already exists
    const existingUser = await User.findOne({ username: 'demo_user' });
    if (existingUser) {
      console.log('Demo data already exists');
      process.exit(0);
    }

    // Create demo users
    const users = [
      {
        _id: new mongoose.Types.ObjectId('64a1b2c3d4e5f6789012345a'),
        username: 'demo_user',
        fullName: 'Demo User',
        bio: 'Welcome to my Instagram clone! 📸',
        profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'nature_lover',
        fullName: 'Nature Explorer',
        bio: 'Capturing the beauty of nature 🌿',
        profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'foodie_pics',
        fullName: 'Food Photographer',
        bio: 'Delicious food photography 🍕',
        profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'travel_diaries',
        fullName: 'Travel Blogger',
        bio: 'Exploring the world one place at a time ✈️',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'art_gallery',
        fullName: 'Digital Artist',
        bio: 'Creating digital art and illustrations 🎨',
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created demo users');

    // Create demo posts
    const posts = [
      {
        author: createdUsers[0]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
        caption: 'Beautiful mountain landscape 🏔️ #nature #mountains',
        location: 'Swiss Alps',
        aspectRatio: '1:1'
      },
      {
        author: createdUsers[1]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop',
        caption: 'Lost in the forest 🌲 #adventure #hiking',
        location: 'Pacific Northwest',
        aspectRatio: '1:1'
      },
      {
        author: createdUsers[2]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=800&fit=crop',
        caption: 'Delicious homemade pizza! 🍕 Recipe in bio',
        location: 'My Kitchen',
        aspectRatio: '1:1'
      },
      {
        author: createdUsers[3]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
        caption: 'Sunset at the beach 🌅 Perfect end to a perfect day',
        location: 'Malibu Beach',
        aspectRatio: '4:5'
      },
      {
        author: createdUsers[4]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop',
        caption: 'New digital artwork completed! ✨ #digitalart #creativity',
        aspectRatio: '1:1'
      },
      {
        author: createdUsers[0]._id,
        type: 'video',
        mediaUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        caption: 'Coffee brewing time lapse ☕ #coffee #timelapse',
        location: 'Local Cafe',
        aspectRatio: '1.91:1'
      },
      {
        author: createdUsers[1]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1520637836862-4d197d17c11a?w=800&h=800&fit=crop',
        caption: 'Morning fog in the mountains 🌫️',
        location: 'Rocky Mountains',
        aspectRatio: '1:1'
      },
      {
        author: createdUsers[3]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1000&fit=crop',
        caption: 'City lights at night ✨ #cityscape #nightphotography',
        location: 'New York City',
        aspectRatio: '4:5'
      }
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log('Created demo posts');

    // Add some likes and comments
    for (const post of createdPosts) {
      // Add random likes
      const likers = createdUsers.slice(0, Math.floor(Math.random() * 4) + 1);
      post.likes = likers.map(user => user._id);

      // Add random comments
      const comments = [
        { text: 'Amazing photo! 😍', author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id },
        { text: 'Love this! 💕', author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id },
        { text: 'So beautiful!', author: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id }
      ];
      
      post.comments = comments.slice(0, Math.floor(Math.random() * 3) + 1);
      await post.save();
    }

    console.log('Added likes and comments');
    console.log('Seed data created successfully!');

    // Log demo user info
    console.log('\n--- Demo User Info ---');
    console.log('Main user ID (for frontend):', createdUsers[0]._id.toString());
    console.log('Username: demo_user');
    console.log('Use this ID in your frontend authSlice as currentUser._id');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();