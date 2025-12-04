const mongoose = require('mongoose');
require('dotenv').config();

// Update the connection string to use your authentication
const mongoUri = 'mongodb://naresh:123456789@localhost:27017/clone';

console.log('Attempting to connect to MongoDB...');

// Connect to MongoDB with auth options
mongoose.connect(mongoUri, {
  authSource: 'admin',
  authMechanism: 'SCRAM-SHA-1'
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    createSampleData();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('Trying alternative connection...');
    
    // Try without auth
    mongoose.connect('mongodb://localhost:27017/clone')
      .then(() => {
        console.log('✅ Connected without authentication');
        createSampleData();
      })
      .catch(err2 => {
        console.error('❌ Both connection attempts failed');
        process.exit(1);
      });
  });

async function createSampleData() {
  try {
    console.log('Creating collections and sample data...');

    // Define schemas
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

    const conversationSchema = new mongoose.Schema({
      participants: [String],
      lastMessage: mongoose.Schema.Types.Mixed,
      unreadCount: mongoose.Schema.Types.Mixed,
      createdAt: Date,
      updatedAt: Date
    });

    const messageSchema = new mongoose.Schema({
      conversationId: String,
      senderId: String,
      receiverId: String,
      content: String,
      type: String,
      timestamp: Date,
      isRead: Boolean
    });

    // Create models
    const User = mongoose.model('User', userSchema);
    const Post = mongoose.model('Post', postSchema);
    const Reel = mongoose.model('Reel', reelSchema);
    const Conversation = mongoose.model('Conversation', conversationSchema);
    const Message = mongoose.model('Message', messageSchema);

    // Sample data
    const users = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        fullName: 'John Doe',
        profilePicture: 'https://picsum.photos/200/200?random=1',
        bio: 'Photography enthusiast 📸',
        followers: 1250,
        following: 345,
        posts: 23,
        isVerified: false,
        isPrivate: false,
        createdAt: new Date()
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        fullName: 'Jane Smith',
        profilePicture: 'https://picsum.photos/200/200?random=2',
        bio: 'Travel blogger ✈️ Coffee lover ☕',
        followers: 2890,
        following: 123,
        posts: 45,
        isVerified: true,
        isPrivate: false,
        createdAt: new Date()
      }
    ];

    const posts = [
      {
        userId: 'john_doe',
        username: 'john_doe',
        userProfilePicture: 'https://picsum.photos/200/200?random=1',
        imageUrl: 'https://picsum.photos/400/400?random=10',
        caption: 'Beautiful sunset today! 🌅',
        likes: 125,
        comments: 23,
        shares: 5,
        location: 'New York, NY',
        hashtags: ['#sunset', '#photography', '#nature'],
        createdAt: new Date()
      },
      {
        userId: 'jane_smith',
        username: 'jane_smith',
        userProfilePicture: 'https://picsum.photos/200/200?random=2',
        imageUrl: 'https://picsum.photos/400/400?random=11',
        caption: 'Amazing coffee at this local cafe ☕',
        likes: 89,
        comments: 12,
        shares: 3,
        location: 'Seattle, WA',
        hashtags: ['#coffee', '#travel', '#local'],
        createdAt: new Date()
      }
    ];

    // Insert data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Reel.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});

    await User.insertMany(users);
    console.log('✅ Users created');

    await Post.insertMany(posts);
    console.log('✅ Posts created');

    // Create a simple reel
    await Reel.create({
      userId: 'jane_smith',
      username: 'jane_smith',
      userProfilePicture: 'https://picsum.photos/200/200?random=2',
      thumbnailUrl: 'https://picsum.photos/300/400?random=20',
      title: 'Quick travel tips!',
      description: 'How to pack light for your next adventure ✈️',
      likes: 567,
      comments: 89,
      shares: 23,
      views: 12450,
      duration: 30,
      hashtags: ['#travel', '#tips', '#packing'],
      createdAt: new Date()
    });
    console.log('✅ Reels created');

    // Create conversation and message
    const conversation = await Conversation.create({
      participants: ['john_doe', 'jane_smith'],
      lastMessage: {
        senderId: 'jane_smith',
        content: 'Hey! Love your latest post 📸',
        timestamp: new Date(),
        type: 'text'
      },
      unreadCount: { 'john_doe': 1, 'jane_smith': 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Conversations created');

    await Message.create({
      conversationId: conversation._id.toString(),
      senderId: 'jane_smith',
      receiverId: 'john_doe',
      content: 'Hey! Love your latest post 📸',
      type: 'text',
      timestamp: new Date(),
      isRead: false
    });
    console.log('✅ Messages created');

    // Show final counts
    const counts = {
      users: await User.countDocuments(),
      posts: await Post.countDocuments(),
      reels: await Reel.countDocuments(),
      conversations: await Conversation.countDocuments(),
      messages: await Message.countDocuments()
    };

    console.log('\n📊 Database Setup Complete!');
    console.log('Collection counts:');
    Object.entries(counts).forEach(([collection, count]) => {
      console.log(`  ${collection}: ${count}`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
  }
}