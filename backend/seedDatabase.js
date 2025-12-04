const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/instagram-clone');
    console.log('Connected to MongoDB');

    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Data already exists, skipping seed');
      process.exit(0);
    }

    // Create users
    const users = await User.create([
      {
        username: 'siddahmed',
        fullName: 'Sidd Ahmed',
        bio: 'Travel enthusiast 🌍 | Photography lover 📸',
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'mkce_family',
        fullName: 'MKCE Family',
        bio: 'Official MKCE College page 🎓 | Engineering excellence',
        profilePictureUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'nature_lover',
        fullName: 'Nature Explorer',
        bio: 'Exploring the beauty of nature 🌿',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616c66eb1a8?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'photo_enthusiast',
        fullName: 'Photo Expert',
        bio: 'Capturing moments 📷 | Professional photographer',
        profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'adventure_seeker',
        fullName: 'Adventure Lover',
        bio: 'Always on an adventure 🏔️ | Mountain climber',
        profilePictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      }
    ]);

    console.log('Created users:', users.map(u => u.username));

    // Create posts
    const posts = await Post.create([
      {
        author: users[0]._id, // siddahmed
        mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop', // backward compatibility
        caption: 'Amazing mountain view from today\'s adventure! 🏔️ #nature #mountains #hiking',
        likes: [users[1]._id, users[2]._id, users[3]._id],
        comments: [
          {
            text: 'Wow! What a beautiful view 😍',
            author: users[2]._id // nature_lover
          },
          {
            text: 'Absolutely stunning! Where is this?',
            author: users[3]._id // photo_enthusiast
          }
        ]
      },
      {
        author: users[1]._id, // mkce_family
        mediaUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
        caption: 'Perfect sunset drive today! 🌅🚗 Life is beautiful when you take time to enjoy the little moments.',
        likes: [users[0]._id, users[2]._id, users[4]._id],
        comments: [
          {
            text: 'Beautiful shot! 📸',
            author: users[3]._id // photo_enthusiast
          }
        ]
      },
      {
        author: users[2]._id, // nature_lover
        mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop',
        caption: 'Lost in the forest, found myself 🌲✨ #forest #nature #peaceful',
        likes: [users[0]._id, users[1]._id, users[3]._id, users[4]._id],
        comments: [
          {
            text: 'So peaceful! I need to visit a place like this',
            author: users[0]._id // siddahmed
          },
          {
            text: 'Nature therapy at its finest 🌿',
            author: users[4]._id // adventure_seeker
          }
        ]
      },
      {
        author: users[3]._id, // photo_enthusiast
        mediaUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500&h=500&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500&h=500&fit=crop',
        caption: 'Golden hour magic ✨ There\'s something special about this light that makes everything look like a dream.',
        likes: [users[0]._id, users[1]._id, users[2]._id],
        comments: [
          {
            text: 'The lighting is perfect! 🌅',
            author: users[1]._id // mkce_family
          }
        ]
      },
      {
        author: users[4]._id, // adventure_seeker
        mediaUrl: 'https://images.unsplash.com/photo-1464822759844-d150b343c725?w=500&h=500&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1464822759844-d150b343c725?w=500&h=500&fit=crop',
        caption: 'Conquered another peak! 🏔️💪 The view from the top is always worth the climb. #mountaineering #adventure #goals',
        likes: [users[0]._id, users[1]._id, users[2]._id, users[3]._id],
        comments: [
          {
            text: 'Incredible achievement! How long did it take?',
            author: users[0]._id // siddahmed
          },
          {
            text: 'Inspiring! Adding this to my bucket list 📝',
            author: users[2]._id // nature_lover
          }
        ]
      }
    ]);

    console.log('Created posts:', posts.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();