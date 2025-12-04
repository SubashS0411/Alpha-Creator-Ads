const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Instagram Models
const Post = require('./instagram/models/Post');
const Reel = require('./instagram/models/Reel');
const User = require('./instagram/models/User');

// YouTube Models
const YouTubeVideo = require('./youtube/models/YouTubeVideo');
const YouTubeChannel = require('./youtube/models/YouTubeChannel');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Sample video metadata
const videoMetadata = [
  {
    title: "Beautiful Nature Walk",
    description: "A peaceful walk through the forest capturing amazing nature views",
    caption: "Nature therapy 🌲✨ #nature #peace #forest",
    category: "All",
    tags: ["nature", "forest", "peaceful", "relaxing"],
    duration: 30
  },
  {
    title: "City Life Vibes",
    description: "Exploring the bustling city streets and urban architecture", 
    caption: "City vibes hitting different 🏙️ #citylife #urban #vibes",
    category: "All",
    tags: ["city", "urban", "architecture", "lifestyle"],
    duration: 25
  },
  {
    title: "Food Preparation",
    description: "Making delicious homemade food step by step",
    caption: "Cooking up something special! 👨‍🍳 #cooking #food #homemade",
    category: "Food",
    tags: ["cooking", "food", "recipe", "kitchen"],
    duration: 45
  },
  {
    title: "Workout Motivation",
    description: "High-energy workout routine for fitness enthusiasts",
    caption: "No excuses, just results! 💪 #fitness #workout #motivation",
    category: "Sports",
    tags: ["fitness", "workout", "health", "motivation"],
    duration: 60
  },
  {
    title: "Tech Review",
    description: "Latest gadget review and tech tips",
    caption: "This tech is incredible! 🔥 #tech #gadgets #review",
    category: "Technology",
    tags: ["technology", "gadgets", "review", "innovation"],
    duration: 180
  },
  {
    title: "Music Performance",
    description: "Live acoustic performance of popular songs",
    caption: "Music heals the soul 🎵 #music #acoustic #live",
    category: "Music",
    tags: ["music", "acoustic", "performance", "live"],
    duration: 120
  },
  {
    title: "Gaming Highlights",
    description: "Epic gaming moments and pro tips",
    caption: "GG! That was insane 🎮 #gaming #highlights #pro",
    category: "Gaming",
    tags: ["gaming", "highlights", "esports", "tips"],
    duration: 90
  },
  {
    title: "Educational Content",
    description: "Learning something new every day",
    caption: "Knowledge is power! 📚 #education #learning #facts",
    category: "Education",
    tags: ["education", "learning", "knowledge", "facts"],
    duration: 150
  },
  {
    title: "Comedy Sketch",
    description: "Hilarious moments that will make you laugh",
    caption: "Laugh till your stomach hurts 😂 #comedy #funny #humor",
    category: "Comedy",
    tags: ["comedy", "funny", "humor", "entertainment"],
    duration: 40
  },
  {
    title: "Travel Adventure",
    description: "Amazing travel destinations and experiences",
    caption: "Wanderlust activated ✈️ #travel #adventure #explore",
    category: "All",
    tags: ["travel", "adventure", "explore", "destination"],
    duration: 75
  },
  {
    title: "Art Creation",
    description: "Step by step art creation process",
    caption: "Creating magic with colors 🎨 #art #creative #drawing",
    category: "All",
    tags: ["art", "creative", "drawing", "painting"],
    duration: 200
  },
  {
    title: "Fashion Style",
    description: "Latest fashion trends and styling tips",
    caption: "Style is a way to express yourself 👗 #fashion #style #outfit",
    category: "All",
    tags: ["fashion", "style", "outfit", "trends"],
    duration: 35
  },
  {
    title: "Pet Fun",
    description: "Adorable pets doing funny and cute things",
    caption: "Pets make everything better 🐕 #pets #cute #funny",
    category: "All",
    tags: ["pets", "cute", "animals", "funny"],
    duration: 20
  },
  {
    title: "Dance Performance",
    description: "Amazing dance choreography and moves",
    caption: "Dance like nobody's watching 💃 #dance #performance #moves",
    category: "All",
    tags: ["dance", "performance", "choreography", "music"],
    duration: 55
  },
  {
    title: "Motivational Speech",
    description: "Inspiring words for personal growth",
    caption: "You've got this! 🔥 #motivation #inspiration #growth",
    category: "Education",
    tags: ["motivation", "inspiration", "growth", "mindset"],
    duration: 100
  },
  {
    title: "DIY Project",
    description: "Creative do-it-yourself project tutorial",
    caption: "Made this myself! 🔨 #DIY #creative #handmade",
    category: "Education",
    tags: ["DIY", "creative", "handmade", "tutorial"],
    duration: 180
  },
  {
    title: "Sports Highlights",
    description: "Best moments from recent sports events",
    caption: "What a game! ⚽ #sports #highlights #amazing",
    category: "Sports",
    tags: ["sports", "highlights", "competition", "athletic"],
    duration: 80
  },
  {
    title: "News Update",
    description: "Latest news and current events coverage",
    caption: "Stay informed 📰 #news #updates #current",
    category: "News",
    tags: ["news", "updates", "current", "information"],
    duration: 120
  },
  {
    title: "Lifestyle Vlog",
    description: "Daily life moments and experiences",
    caption: "Living my best life 🌟 #lifestyle #vlog #daily",
    category: "All",
    tags: ["lifestyle", "vlog", "daily", "personal"],
    duration: 95
  }
];

// Sample user data for Instagram
const instagramUsers = [
  {
    username: "naturelover123",
    fullName: "Nature Enthusiast",
    bio: "🌲 Nature photographer & adventurer",
    profilePictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isVerified: true
  },
  {
    username: "cityexplorer",
    fullName: "Urban Explorer",
    bio: "🏙️ City life & architecture lover",
    profilePictureUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    isVerified: false
  },
  {
    username: "foodielife",
    fullName: "Chef Master",
    bio: "👨‍🍳 Sharing delicious recipes daily",
    profilePictureUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isVerified: true
  },
  {
    username: "fitnessfreak",
    fullName: "Fitness Trainer", 
    bio: "💪 Your daily dose of motivation",
    profilePictureUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    isVerified: false
  },
  {
    username: "techguru",
    fullName: "Tech Reviewer",
    bio: "📱 Latest tech reviews & tips",
    profilePictureUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    isVerified: true
  }
];

// YouTube Channels data (will be created with users)
const youtubeChannelsData = [
  {
    name: "Nature & Wildlife",
    handle: "@naturewildlife",
    description: "Exploring the beauty of nature and wildlife",
    avatarUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop",
    subscriberCount: 125000,
    videoCount: 0,
    verified: true
  },
  {
    name: "City Life Channel",
    handle: "@citylife",
    description: "Urban lifestyle and city adventures",
    avatarUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=150&h=150&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=200&fit=crop",
    subscriberCount: 89000,
    videoCount: 0,
    verified: false
  },
  {
    name: "Culinary Masters",
    handle: "@culinarymasters",
    description: "Professional cooking and food preparation",
    avatarUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=200&fit=crop",
    subscriberCount: 234000,
    videoCount: 0,
    verified: true
  },
  {
    name: "Fitness & Health",
    handle: "@fitnesshealth",
    description: "Workout routines and healthy living tips",
    avatarUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=200&fit=crop",
    subscriberCount: 156000,
    videoCount: 0,
    verified: true
  },
  {
    name: "Tech Innovations",
    handle: "@techinnovations",
    description: "Latest technology reviews and innovations",
    avatarUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=150&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=200&fit=crop",
    subscriberCount: 445000,
    videoCount: 0,
    verified: true
  }
];

async function createUsers() {
  try {
    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    
    const users = [];
    for (const userData of instagramUsers) {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        users.push(user);
        console.log(`Created Instagram user: ${userData.username}`);
      } else {
        users.push(existingUser);
        console.log(`Instagram user already exists: ${userData.username}`);
      }
    }
    return users;
  } catch (error) {
    console.error('Error creating users:', error);
    throw error;
  }
}

async function createChannels(users) {
  try {
    const channels = [];
    for (let i = 0; i < youtubeChannelsData.length; i++) {
      const channelData = youtubeChannelsData[i];
      const user = users[i % users.length]; // Assign channel to a user
      
      const existingChannel = await YouTubeChannel.findOne({ handle: channelData.handle });
      if (!existingChannel) {
        const channel = new YouTubeChannel({
          ...channelData,
          userId: user._id
        });
        await channel.save();
        channels.push(channel);
        console.log(`Created YouTube channel: ${channelData.name}`);
      } else {
        channels.push(existingChannel);
        console.log(`YouTube channel already exists: ${channelData.name}`);
      }
    }
    return channels;
  } catch (error) {
    console.error('Error creating channels:', error);
    throw error;
  }
}

async function seedInstagramContent(users) {
  try {
    const videosDir = path.join(__dirname, '../assests/samplevideos');
    const videoFiles = fs.readdirSync(videosDir).filter(file => file.endsWith('.mp4'));
    
    console.log(`Found ${videoFiles.length} video files`);
    
    for (let i = 0; i < Math.min(videoFiles.length, videoMetadata.length); i++) {
      const videoFile = videoFiles[i];
      const metadata = videoMetadata[i];
      const user = users[i % users.length]; // Cycle through users
      
      const videoUrl = `/assests/samplevideos/${videoFile}`;
      
      // Create Instagram Post (for longer videos) 
      if (metadata.duration > 60) {
        const existingPost = await Post.findOne({ mediaUrl: videoUrl });
        if (!existingPost) {
          const post = new Post({
            author: user._id,
            type: 'video',
            mediaUrl: videoUrl,
            thumbnailUrl: videoUrl,
            caption: metadata.caption,
            location: 'Sample Location',
            aspectRatio: '9:16',
            duration: metadata.duration,
            likes: [],
            comments: []
          });
          
          await post.save();
          console.log(`Created Instagram post: ${metadata.title}`);
        } else {
          console.log(`Instagram post already exists for: ${videoFile}`);
        }
      }
      
      // Create Instagram Reel (for shorter videos or all videos)
      const existingReel = await Reel.findOne({ videoUrl: videoUrl });
      if (!existingReel) {
        const reel = new Reel({
          user: user._id,
          videoUrl: videoUrl,
          thumbnailUrl: videoUrl,
          caption: metadata.caption,
          duration: Math.min(metadata.duration, 60), // Reels are typically max 60 seconds
          audioInfo: {
            title: 'Original Audio',
            artist: user.fullName
          },
          likes: [],
          comments: [],
          views: Math.floor(Math.random() * 10000) + 1000,
          shares: Math.floor(Math.random() * 100) + 10
        });
        
        await reel.save();
        console.log(`Created Instagram reel: ${metadata.title}`);
      } else {
        console.log(`Instagram reel already exists for: ${videoFile}`);
      }
    }
  } catch (error) {
    console.error('Error seeding Instagram content:', error);
    throw error;
  }
}

async function seedYouTubeContent(channels) {
  try {
    const videosDir = path.join(__dirname, '../assests/samplevideos');
    const videoFiles = fs.readdirSync(videosDir).filter(file => file.endsWith('.mp4'));
    
    console.log(`Creating YouTube videos from ${videoFiles.length} files`);
    
    for (let i = 0; i < Math.min(videoFiles.length, videoMetadata.length); i++) {
      const videoFile = videoFiles[i];
      const metadata = videoMetadata[i];
      const channel = channels[i % channels.length]; // Cycle through channels
      
      const videoUrl = `/assests/samplevideos/${videoFile}`;
      
      const existingVideo = await YouTubeVideo.findOne({ videoUrl: videoUrl });
      if (!existingVideo) {
        const video = new YouTubeVideo({
          title: metadata.title,
          description: metadata.description,
          videoUrl: videoUrl,
          thumbnailUrl: videoUrl, // In real app, generate thumbnail
          duration: metadata.duration,
          channelId: channel._id,
          views: Math.floor(Math.random() * 100000) + 5000,
          likes: Math.floor(Math.random() * 5000) + 100,
          dislikes: Math.floor(Math.random() * 100) + 10,
          category: metadata.category,
          tags: metadata.tags,
          isShort: metadata.duration <= 60,
          visibility: 'public',
          uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          commentCount: Math.floor(Math.random() * 500) + 50,
          likedBy: [],
          dislikedBy: []
        });
        
        await video.save();
        console.log(`Created YouTube video: ${metadata.title}`);
        
        // Update channel video count
        await YouTubeChannel.findByIdAndUpdate(channel._id, {
          $inc: { videoCount: 1 }
        });
        
      } else {
        console.log(`YouTube video already exists for: ${videoFile}`);
      }
    }
  } catch (error) {
    console.error('Error seeding YouTube content:', error);
    throw error;
  }
}

async function main() {
  try {
    await connectDB();
    
    console.log('🚀 Starting to seed sample videos...\n');
    
    // Create users and channels
    console.log('📝 Creating users and channels...');
    const users = await createUsers();
    const channels = await createChannels(users);
    
    // Seed Instagram content
    console.log('\n📸 Seeding Instagram content...');
    await seedInstagramContent(users);
    
    // Seed YouTube content  
    console.log('\n🎥 Seeding YouTube content...');
    await seedYouTubeContent(channels);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Instagram Users: ${users.length}`);
    console.log(`   - YouTube Channels: ${channels.length}`);
    console.log(`   - Sample Videos Processed: ${fs.readdirSync(path.join(__dirname, '../assests/samplevideos')).filter(f => f.endsWith('.mp4')).length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };