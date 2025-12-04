const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    setupCollections();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function setupCollections() {
  try {
    // Clear existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of collections) {
      if (!collection.name.startsWith('system.')) {
        await mongoose.connection.db.collection(collection.name).drop().catch(() => {});
        console.log(`Dropped collection: ${collection.name}`);
      }
    }

    // Create Users collection with sample data
    const User = mongoose.model('User', new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      email: { type: String, unique: true, sparse: true },
      fullName: String,
      profilePicture: String,
      bio: String,
      followers: { type: Number, default: 0 },
      following: { type: Number, default: 0 },
      posts: { type: Number, default: 0 },
      isVerified: { type: Boolean, default: false },
      isPrivate: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }));

    const sampleUsers = [
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
        isPrivate: false
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
        isPrivate: false
      },
      {
        username: 'mike_wilson',
        email: 'mike@example.com',
        fullName: 'Mike Wilson',
        profilePicture: 'https://picsum.photos/200/200?random=3',
        bio: 'Fitness trainer 💪 Motivational speaker',
        followers: 5670,
        following: 234,
        posts: 78,
        isVerified: true,
        isPrivate: false
      }
    ];

    await User.insertMany(sampleUsers);
    console.log('✅ Users collection created with sample data');

    // Create Posts collection with sample data
    const Post = mongoose.model('Post', new mongoose.Schema({
      userId: { type: String, required: true },
      username: { type: String, required: true },
      userProfilePicture: String,
      imageUrl: { type: String, required: true },
      caption: String,
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      location: String,
      hashtags: [String],
      createdAt: { type: Date, default: Date.now }
    }));

    const samplePosts = [
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
        hashtags: ['#sunset', '#photography', '#nature']
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
        hashtags: ['#coffee', '#travel', '#local']
      },
      {
        userId: 'mike_wilson',
        username: 'mike_wilson',
        userProfilePicture: 'https://picsum.photos/200/200?random=3',
        imageUrl: 'https://picsum.photos/400/400?random=12',
        caption: 'Morning workout complete! 💪 #NoExcuses',
        likes: 234,
        comments: 45,
        shares: 12,
        location: 'Los Angeles, CA',
        hashtags: ['#fitness', '#workout', '#motivation']
      },
      {
        userId: 'john_doe',
        username: 'john_doe',
        userProfilePicture: 'https://picsum.photos/200/200?random=1',
        imageUrl: 'https://picsum.photos/400/400?random=13',
        caption: 'Exploring new places 🗺️',
        likes: 67,
        comments: 8,
        shares: 2,
        location: 'Central Park, NY',
        hashtags: ['#explore', '#adventure', '#photography']
      }
    ];

    await Post.insertMany(samplePosts);
    console.log('✅ Posts collection created with sample data');

    // Create Reels collection with sample data
    const Reel = mongoose.model('Reel', new mongoose.Schema({
      userId: { type: String, required: true },
      username: { type: String, required: true },
      userProfilePicture: String,
      videoUrl: String,
      thumbnailUrl: String,
      title: String,
      description: String,
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      duration: Number,
      hashtags: [String],
      createdAt: { type: Date, default: Date.now }
    }));

    const sampleReels = [
      {
        userId: 'jane_smith',
        username: 'jane_smith',
        userProfilePicture: 'https://picsum.photos/200/200?random=2',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
        thumbnailUrl: 'https://picsum.photos/300/400?random=20',
        title: 'Quick travel tips!',
        description: 'How to pack light for your next adventure ✈️',
        likes: 567,
        comments: 89,
        shares: 23,
        views: 12450,
        duration: 30,
        hashtags: ['#travel', '#tips', '#packing']
      },
      {
        userId: 'mike_wilson',
        username: 'mike_wilson',
        userProfilePicture: 'https://picsum.photos/200/200?random=3',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4',
        thumbnailUrl: 'https://picsum.photos/300/400?random=21',
        title: '5-minute workout',
        description: 'Quick morning routine to start your day right 💪',
        likes: 890,
        comments: 156,
        shares: 45,
        views: 23670,
        duration: 45,
        hashtags: ['#fitness', '#workout', '#morning']
      }
    ];

    await Reel.insertMany(sampleReels);
    console.log('✅ Reels collection created with sample data');

    // Create Conversations collection with sample data
    const Conversation = mongoose.model('Conversation', new mongoose.Schema({
      participants: [String],
      lastMessage: {
        senderId: String,
        content: String,
        timestamp: { type: Date, default: Date.now },
        type: { type: String, default: 'text' }
      },
      unreadCount: mongoose.Schema.Types.Mixed,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }));

    const sampleConversations = [
      {
        participants: ['john_doe', 'jane_smith'],
        lastMessage: {
          senderId: 'jane_smith',
          content: 'Hey! Love your latest post 📸',
          timestamp: new Date(),
          type: 'text'
        },
        unreadCount: { 'john_doe': 1, 'jane_smith': 0 }
      },
      {
        participants: ['john_doe', 'mike_wilson'],
        lastMessage: {
          senderId: 'mike_wilson',
          content: 'Great shot! What camera did you use?',
          timestamp: new Date(),
          type: 'text'
        },
        unreadCount: { 'john_doe': 0, 'mike_wilson': 0 }
      }
    ];

    await Conversation.insertMany(sampleConversations);
    console.log('✅ Conversations collection created with sample data');

    // Create Messages collection with sample data
    const Message = mongoose.model('Message', new mongoose.Schema({
      conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
      senderId: { type: String, required: true },
      receiverId: { type: String, required: true },
      content: { type: String, required: true },
      type: { type: String, default: 'text' },
      timestamp: { type: Date, default: Date.now },
      isRead: { type: Boolean, default: false }
    }));

    const conversations = await Conversation.find();
    const sampleMessages = [
      {
        conversationId: conversations[0]._id,
        senderId: 'jane_smith',
        receiverId: 'john_doe',
        content: 'Hey! Love your latest post 📸',
        type: 'text',
        isRead: false
      },
      {
        conversationId: conversations[1]._id,
        senderId: 'mike_wilson',
        receiverId: 'john_doe',
        content: 'Great shot! What camera did you use?',
        type: 'text',
        isRead: true
      }
    ];

    await Message.insertMany(sampleMessages);
    console.log('✅ Messages collection created with sample data');

    // Create AnalyticEvents collection (empty but with proper schema)
    const AnalyticEvent = mongoose.model('AnalyticEvent', new mongoose.Schema({
      userId: String,
      eventType: {
        type: String,
        enum: ['search', 'post_view', 'profile_view', 'like', 'comment', 'share', 'story_view']
      },
      data: mongoose.Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now }
    }));

    console.log('✅ AnalyticEvents collection created');

    // Show final stats
    const stats = {
      users: await User.countDocuments(),
      posts: await Post.countDocuments(),
      reels: await Reel.countDocuments(),
      conversations: await Conversation.countDocuments(),
      messages: await Message.countDocuments(),
      analyticEvents: await AnalyticEvent.countDocuments()
    };

    console.log('\n📊 Database Setup Complete!');
    console.log('Collection counts:');
    Object.entries(stats).forEach(([collection, count]) => {
      console.log(`  ${collection}: ${count}`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database connection closed successfully');
    
  } catch (error) {
    console.error('❌ Error setting up collections:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}