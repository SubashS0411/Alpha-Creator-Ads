const { MongoClient } = require('mongodb');

const uri = 'mongodb://naresh:123456789@localhost:27017/clone';
const client = new MongoClient(uri);

async function createCollectionsWithData() {
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');

    const db = client.db('clone');

    // Create Users collection with sample data
    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true, sparse: true });
    
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
        isPrivate: false,
        createdAt: new Date()
      }
    ];
    
    await usersCollection.insertMany(sampleUsers);
    console.log('Users collection created with sample data');

    // Create Posts collection with sample data
    const postsCollection = db.collection('posts');
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
        timestamp: new Date(),
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
        timestamp: new Date(),
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
        timestamp: new Date(),
        hashtags: ['#fitness', '#workout', '#motivation']
      }
    ];
    
    await postsCollection.insertMany(samplePosts);
    console.log('Posts collection created with sample data');

    // Create Reels collection with sample data
    const reelsCollection = db.collection('reels');
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
        timestamp: new Date(),
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
        timestamp: new Date(),
        hashtags: ['#fitness', '#workout', '#morning']
      }
    ];
    
    await reelsCollection.insertMany(sampleReels);
    console.log('Reels collection created with sample data');

    // Create Conversations collection with sample data
    const conversationsCollection = db.collection('conversations');
    const sampleConversations = [
      {
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
      },
      {
        participants: ['john_doe', 'mike_wilson'],
        lastMessage: {
          senderId: 'mike_wilson',
          content: 'Great shot! What camera did you use?',
          timestamp: new Date(),
          type: 'text'
        },
        unreadCount: { 'john_doe': 0, 'mike_wilson': 0 },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await conversationsCollection.insertMany(sampleConversations);
    console.log('Conversations collection created with sample data');

    // Create Messages collection with sample data
    const messagesCollection = db.collection('messages');
    const sampleMessages = [
      {
        conversationId: null, // Will be updated with actual conversation ID
        senderId: 'jane_smith',
        receiverId: 'john_doe',
        content: 'Hey! Love your latest post 📸',
        type: 'text',
        timestamp: new Date(),
        isRead: false
      },
      {
        conversationId: null,
        senderId: 'mike_wilson',
        receiverId: 'john_doe',
        content: 'Great shot! What camera did you use?',
        type: 'text',
        timestamp: new Date(),
        isRead: true
      }
    ];
    
    await messagesCollection.insertMany(sampleMessages);
    console.log('Messages collection created with sample data');

    // Create AnalyticEvents collection for tracking
    const analyticsCollection = db.collection('analyticEvents');
    await analyticsCollection.createIndex({ userId: 1 });
    await analyticsCollection.createIndex({ timestamp: -1 });
    await analyticsCollection.createIndex({ eventType: 1 });
    
    console.log('AnalyticEvents collection created with indexes');

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\nCreated collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Count documents in each collection
    console.log('\nDocument counts:');
    console.log(`Users: ${await usersCollection.countDocuments()}`);
    console.log(`Posts: ${await postsCollection.countDocuments()}`);
    console.log(`Reels: ${await reelsCollection.countDocuments()}`);
    console.log(`Conversations: ${await conversationsCollection.countDocuments()}`);
    console.log(`Messages: ${await messagesCollection.countDocuments()}`);
    console.log(`Analytics: ${await analyticsCollection.countDocuments()}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createCollectionsWithData();