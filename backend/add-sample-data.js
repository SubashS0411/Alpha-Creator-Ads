const mongoose = require('mongoose');
require('dotenv').config();

// Update the connection string
const mongoUri = 'mongodb://naresh:123456789@localhost:27017/clone';

console.log('Adding more sample data...');

mongoose.connect(mongoUri, {
  authSource: 'admin',
  authMechanism: 'SCRAM-SHA-1'
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    addMoreSampleData();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    
    // Try without auth
    mongoose.connect('mongodb://localhost:27017/clone')
      .then(() => {
        console.log('✅ Connected without authentication');
        addMoreSampleData();
      })
      .catch(err2 => {
        console.error('❌ Both connection attempts failed');
        process.exit(1);
      });
  });

async function addMoreSampleData() {
  try {
    // Define schemas since models don't exist yet
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      fullName: String,
      profilePicture: String,
      bio: String,
      followers: Number,
      following: Number,
      posts: Number,
      isVerified: Boolean,
      isPrivate: Boolean,
      createdAt: Date
    });

    const postSchema = new mongoose.Schema({
      userId: String,
      username: String,
      userProfilePicture: String,
      imageUrl: String,
      caption: String,
      likes: Number,
      comments: Number,
      shares: Number,
      location: String,
      hashtags: [String],
      createdAt: Date
    });

    const reelSchema = new mongoose.Schema({
      userId: String,
      username: String,
      userProfilePicture: String,
      videoUrl: String,
      thumbnailUrl: String,
      title: String,
      description: String,
      likes: Number,
      comments: Number,
      shares: Number,
      views: Number,
      duration: Number,
      hashtags: [String],
      createdAt: Date
    });

    // Get or create models
    let User, Post, Reel;
    try {
      User = mongoose.model('User');
    } catch {
      User = mongoose.model('User', userSchema);
    }
    
    try {
      Post = mongoose.model('Post');
    } catch {
      Post = mongoose.model('Post', postSchema);
    }
    
    try {
      Reel = mongoose.model('Reel');
    } catch {
      Reel = mongoose.model('Reel', reelSchema);
    }

    // Add more users
    const newUsers = [
      {
        username: 'sarah_travels',
        email: 'sarah@example.com',
        fullName: 'Sarah Wilson',
        profilePicture: 'https://picsum.photos/200/200?random=4',
        bio: '✈️ Travel blogger | 📍Currently in Bali',
        followers: 5420,
        following: 167,
        posts: 89,
        isVerified: true,
        isPrivate: false,
        createdAt: new Date()
      },
      {
        username: 'alex_fitness',
        email: 'alex@example.com',
        fullName: 'Alex Johnson',
        profilePicture: 'https://picsum.photos/200/200?random=5',
        bio: '💪 Personal trainer | 🏃‍♂️ Marathon runner',
        followers: 3280,
        following: 445,
        posts: 156,
        isVerified: false,
        isPrivate: false,
        createdAt: new Date()
      },
      {
        username: 'foodie_emma',
        email: 'emma@example.com',
        fullName: 'Emma Chen',
        profilePicture: 'https://picsum.photos/200/200?random=6',
        bio: '🍕 Food lover | 👩‍🍳 Chef | Recipe creator',
        followers: 7890,
        following: 234,
        posts: 234,
        isVerified: true,
        isPrivate: false,
        createdAt: new Date()
      }
    ];

    await User.insertMany(newUsers);
    console.log('✅ Added more users');

    // Add more posts
    const newPosts = [
      {
        userId: 'sarah_travels',
        username: 'sarah_travels',
        userProfilePicture: 'https://picsum.photos/200/200?random=4',
        imageUrl: 'https://picsum.photos/400/400?random=14',
        caption: 'Sunset in Bali is absolutely magical! 🌅 #bali #sunset #travel',
        likes: 456,
        comments: 34,
        shares: 12,
        location: 'Bali, Indonesia',
        hashtags: ['#bali', '#sunset', '#travel', '#paradise'],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        userId: 'alex_fitness',
        username: 'alex_fitness',
        userProfilePicture: 'https://picsum.photos/200/200?random=5',
        imageUrl: 'https://picsum.photos/400/400?random=15',
        caption: 'Just finished an amazing 10K run! 🏃‍♂️ Who else is training today?',
        likes: 234,
        comments: 28,
        shares: 8,
        location: 'Central Park, NY',
        hashtags: ['#running', '#fitness', '#10k', '#training'],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        userId: 'foodie_emma',
        username: 'foodie_emma',
        userProfilePicture: 'https://picsum.photos/200/200?random=6',
        imageUrl: 'https://picsum.photos/400/400?random=16',
        caption: 'Homemade pasta with fresh basil 🍝 Recipe in my stories!',
        likes: 678,
        comments: 89,
        shares: 23,
        location: 'My Kitchen',
        hashtags: ['#pasta', '#homemade', '#italian', '#cooking'],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        userId: 'john_doe',
        username: 'john_doe',
        userProfilePicture: 'https://picsum.photos/200/200?random=1',
        imageUrl: 'https://picsum.photos/400/400?random=17',
        caption: 'Golden hour photography session 📸',
        likes: 345,
        comments: 45,
        shares: 15,
        location: 'Brooklyn Bridge',
        hashtags: ['#photography', '#goldenhour', '#brooklyn'],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
      },
      {
        userId: 'jane_smith',
        username: 'jane_smith',
        userProfilePicture: 'https://picsum.photos/200/200?random=2',
        imageUrl: 'https://picsum.photos/400/400?random=18',
        caption: 'Morning coffee vibes ☕ Starting the day right!',
        likes: 187,
        comments: 21,
        shares: 6,
        location: 'Local Coffee Shop',
        hashtags: ['#coffee', '#morning', '#vibes'],
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000)
      }
    ];

    await Post.insertMany(newPosts);
    console.log('✅ Added more posts');

    // Add more reels
    const newReels = [
      {
        userId: 'sarah_travels',
        username: 'sarah_travels',
        userProfilePicture: 'https://picsum.photos/200/200?random=4',
        thumbnailUrl: 'https://picsum.photos/300/400?random=22',
        title: 'Bali morning routine',
        description: 'How I start my day in paradise 🏝️',
        likes: 1234,
        comments: 167,
        shares: 45,
        views: 28540,
        duration: 45,
        hashtags: ['#bali', '#morningroutine', '#travel'],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        userId: 'alex_fitness',
        username: 'alex_fitness',
        userProfilePicture: 'https://picsum.photos/200/200?random=5',
        thumbnailUrl: 'https://picsum.photos/300/400?random=23',
        title: '10-minute HIIT workout',
        description: 'Quick and effective full body workout 💪',
        likes: 2345,
        comments: 234,
        shares: 78,
        views: 45670,
        duration: 60,
        hashtags: ['#hiit', '#workout', '#fitness'],
        createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000)
      }
    ];

    await Reel.insertMany(newReels);
    console.log('✅ Added more reels');

    // Show final counts
    const counts = {
      users: await User.countDocuments(),
      posts: await Post.countDocuments(),
      reels: await Reel.countDocuments()
    };

    console.log('\n📊 Updated Database Stats:');
    console.log('Collection counts:');
    Object.entries(counts).forEach(([collection, count]) => {
      console.log(`  ${collection}: ${count}`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database updated successfully');

  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
  }
}