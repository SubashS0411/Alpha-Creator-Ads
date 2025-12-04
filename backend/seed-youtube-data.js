const mongoose = require('mongoose');
require('dotenv').config();

// Import YouTube models
const YouTubeVideo = require('./models/YouTubeVideo');
const YouTubeChannel = require('./models/YouTubeChannel');
const YouTubeComment = require('./models/YouTubeComment');
const YouTubeSubscription = require('./models/YouTubeSubscription');
const YouTubeAnalytics = require('./models/YouTubeAnalytics');
const YouTubePlaylist = require('./models/YouTubePlaylist');

// Sample YouTube data
const sampleChannels = [
  {
    name: 'TechMaster Pro',
    handle: '@techmaster',
    description: 'Latest technology reviews and tutorials. Programming, gadgets, and tech news.',
    avatarUrl: 'https://via.placeholder.com/120x120/FF0000/ffffff?text=TMP',
    bannerUrl: 'https://via.placeholder.com/1920x480/FF0000/ffffff?text=TechMaster+Pro',
    subscriberCount: 1250000,
    totalViews: 25000000,
    videoCount: 145,
    verified: true,
    userId: new mongoose.Types.ObjectId()
  },
  {
    name: 'Gaming Universe',
    handle: '@gaminguniv',
    description: 'Epic gaming content, reviews, and live streams. Join the gaming community!',
    avatarUrl: 'https://via.placeholder.com/120x120/00FF00/ffffff?text=GU',
    bannerUrl: 'https://via.placeholder.com/1920x480/00FF00/ffffff?text=Gaming+Universe',
    subscriberCount: 890000,
    totalViews: 18500000,
    videoCount: 203,
    verified: true,
    userId: new mongoose.Types.ObjectId()
  },
  {
    name: 'Music Vibes',
    handle: '@musicvibes',
    description: 'Discover new music, covers, and original compositions. Music for every mood.',
    avatarUrl: 'https://via.placeholder.com/120x120/0000FF/ffffff?text=MV',
    bannerUrl: 'https://via.placeholder.com/1920x480/0000FF/ffffff?text=Music+Vibes',
    subscriberCount: 2100000,
    totalViews: 45000000,
    videoCount: 89,
    verified: true,
    userId: new mongoose.Types.ObjectId()
  },
  {
    name: 'CodeWith Alex',
    handle: '@codewithalex',
    description: 'Learn programming from scratch. Tutorials, tips, and coding challenges.',
    avatarUrl: 'https://via.placeholder.com/120x120/FFA500/ffffff?text=CWA',
    bannerUrl: 'https://via.placeholder.com/1920x480/FFA500/ffffff?text=CodeWith+Alex',
    subscriberCount: 567000,
    totalViews: 8900000,
    videoCount: 67,
    verified: false,
    userId: new mongoose.Types.ObjectId()
  },
  {
    name: 'Fitness Journey',
    handle: '@fitnessjourney',
    description: 'Transform your body and mind. Workouts, nutrition, and wellness tips.',
    avatarUrl: 'https://via.placeholder.com/120x120/FF69B4/ffffff?text=FJ',
    bannerUrl: 'https://via.placeholder.com/1920x480/FF69B4/ffffff?text=Fitness+Journey',
    subscriberCount: 734000,
    totalViews: 12300000,
    videoCount: 134,
    verified: false,
    userId: new mongoose.Types.ObjectId()
  }
];

const createSampleVideos = (channels) => [
  // Regular Videos
  {
    title: 'iPhone 15 Pro Max COMPLETE Review - Is It Worth The Upgrade?',
    description: 'In this comprehensive review, we dive deep into the iPhone 15 Pro Max. From the new titanium design to the revolutionary Action Button, we cover everything you need to know before making your purchase decision. Camera tests, battery life, performance benchmarks, and real-world usage scenarios.',
    videoUrl: 'https://sample-videos.com/iphone-15-review.mp4',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/1E40AF/ffffff?text=iPhone+15+Pro+Review',
    duration: 1247, // 20:47
    channelId: null, // Will be set after channels are created
    views: 2456789,
    likes: 89234,
    dislikes: 2341,
    category: 'Programming',
    tags: ['iphone', 'apple', 'review', 'technology', 'mobile'],
    isShort: false,
    commentCount: 12459
  },
  {
    title: 'React 18 Complete Tutorial - Build Modern Web Apps',
    description: 'Master React 18 with this complete tutorial covering hooks, context, suspense, and concurrent features. Perfect for beginners and intermediate developers.',
    videoUrl: 'https://sample-videos.com/react-tutorial.mp4',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/61DAFB/000000?text=React+18+Tutorial',
    duration: 3421, // 57:01
    channelId: null,
    views: 1234567,
    likes: 45678,
    dislikes: 1234,
    category: 'Programming',
    tags: ['react', 'javascript', 'web development', 'tutorial', 'frontend'],
    isShort: false,
    commentCount: 8923
  },
  {
    title: 'Cyberpunk 2077 Phantom Liberty DLC - Full Walkthrough Part 1',
    description: 'Experience the thrilling new expansion with our complete walkthrough. All secrets, side quests, and endings covered!',
    videoUrl: 'https://sample-videos.com/cyberpunk-dlc.mp4',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/FFFF00/000000?text=Cyberpunk+2077+DLC',
    duration: 2856, // 47:36
    channelId: null,
    views: 3456789,
    likes: 125678,
    dislikes: 3456,
    category: 'Gaming',
    tags: ['cyberpunk', 'gaming', 'walkthrough', 'dlc', 'rpg'],
    isShort: false,
    commentCount: 15789
  },
  {
    title: 'Lo-Fi Hip Hop Mix 2024 - Study & Chill Beats',
    description: 'Perfect background music for studying, working, or relaxing. 2 hours of carefully curated lo-fi beats.',
    videoUrl: 'https://sample-videos.com/lofi-mix.mp4',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/9333EA/ffffff?text=Lo-Fi+Mix+2024',
    duration: 7200, // 2:00:00
    channelId: null,
    views: 987654,
    likes: 67890,
    dislikes: 234,
    category: 'Music',
    tags: ['lofi', 'hip hop', 'study music', 'chill', 'beats'],
    isShort: false,
    commentCount: 4567
  },
  {
    title: 'Python for Beginners - Variables and Data Types Explained',
    description: 'Learn Python programming basics in this beginner-friendly tutorial. We cover variables, data types, and basic operations.',
    videoUrl: 'https://sample-videos.com/python-basics.mp4',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/3776AB/ffffff?text=Python+Basics',
    duration: 1567, // 26:07
    channelId: null,
    views: 567890,
    likes: 23456,
    dislikes: 567,
    category: 'Programming',
    tags: ['python', 'programming', 'tutorial', 'beginners', 'coding'],
    isShort: false,
    commentCount: 3456
  },
  {
    title: '30-Minute Full Body HIIT Workout - No Equipment Needed',
    description: 'Burn calories and build strength with this intense 30-minute HIIT workout. Perfect for home fitness!',
    videoUrl: 'https://sample-videos.com/hiit-workout.mp4',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/DC2626/ffffff?text=HIIT+Workout',
    duration: 1800, // 30:00
    channelId: null,
    views: 890123,
    likes: 34567,
    dislikes: 892,
    category: 'Sports',
    tags: ['fitness', 'hiit', 'workout', 'exercise', 'health'],
    isShort: false,
    commentCount: 5678
  },
  
  // YouTube Shorts
  {
    title: 'iPhone 15 vs Android - Speed Test',
    description: 'Quick speed comparison between iPhone 15 and latest Android flagships! #TechShorts #iPhone15',
    videoUrl: 'https://sample-videos.com/iphone-speed-test.mp4',
    thumbnailUrl: 'https://via.placeholder.com/720x1280/EF4444/ffffff?text=Speed+Test+Short',
    duration: 45, // 0:45
    channelId: null,
    views: 5678901,
    likes: 234567,
    dislikes: 5678,
    category: 'Programming',
    tags: ['iphone', 'android', 'speedtest', 'tech', 'shorts'],
    isShort: true,
    commentCount: 23456
  },
  {
    title: 'CSS Flexbox in 60 seconds',
    description: 'Master CSS Flexbox in just one minute! Quick tutorial for web developers. #WebDev #CSS #Shorts',
    videoUrl: 'https://sample-videos.com/css-flexbox-short.mp4',
    thumbnailUrl: 'https://via.placeholder.com/720x1280/3B82F6/ffffff?text=CSS+Flexbox',
    duration: 58, // 0:58
    channelId: null,
    views: 1234567,
    likes: 67890,
    dislikes: 1234,
    category: 'Programming',
    tags: ['css', 'flexbox', 'webdev', 'tutorial', 'shorts'],
    isShort: true,
    commentCount: 8901
  },
  {
    title: 'Epic Gaming Moment - Clutch Victory!',
    description: 'Insane clutch moment in ranked game! Can\'t believe this happened 🔥 #Gaming #Clutch #Epic',
    videoUrl: 'https://sample-videos.com/gaming-clutch.mp4',
    thumbnailUrl: 'https://via.placeholder.com/720x1280/10B981/ffffff?text=Epic+Clutch',
    duration: 30, // 0:30
    channelId: null,
    views: 2345678,
    likes: 156789,
    dislikes: 2345,
    category: 'Gaming',
    tags: ['gaming', 'clutch', 'epic', 'shorts', 'victory'],
    isShort: true,
    commentCount: 12345
  }
];

async function seedYouTubeData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/clone');
    console.log('✅ Connected to MongoDB');

    // Skip clearing data due to authentication requirements
    console.log('⏭️ Skipping data cleanup (will add to existing data)...');

    // Create channels
    console.log('📺 Creating YouTube channels...');
    const createdChannels = await YouTubeChannel.insertMany(sampleChannels);
    console.log(`✅ Created ${createdChannels.length} channels`);

    // Create videos and assign to channels
    console.log('🎥 Creating YouTube videos...');
    const sampleVideos = createSampleVideos(createdChannels);
    
    // Assign videos to channels (distribute evenly)
    sampleVideos.forEach((video, index) => {
      video.channelId = createdChannels[index % createdChannels.length]._id;
    });

    const createdVideos = await YouTubeVideo.insertMany(sampleVideos);
    console.log(`✅ Created ${createdVideos.length} videos (${createdVideos.filter(v => v.isShort).length} shorts)`);

    // Update channel video counts
    for (const channel of createdChannels) {
      const videoCount = createdVideos.filter(v => v.channelId.toString() === channel._id.toString()).length;
      await YouTubeChannel.findByIdAndUpdate(channel._id, { 
        videoCount: videoCount,
        totalViews: createdVideos
          .filter(v => v.channelId.toString() === channel._id.toString())
          .reduce((sum, v) => sum + v.views, 0)
      });
    }

    // Create sample comments
    console.log('💬 Creating sample comments...');
    const sampleComments = [];
    const commentTexts = [
      'Great video! Really helpful content.',
      'Thanks for explaining this so clearly!',
      'First! Love your content!',
      'This helped me so much with my project.',
      'Can you make a tutorial on advanced topics?',
      'Amazing quality as always! 🔥',
      'I\'ve been waiting for this video!',
      'Super useful, subscribed!',
      'Best explanation I\'ve found on YouTube.',
      'More content like this please!'
    ];

    for (let i = 0; i < 50; i++) {
      const randomVideo = createdVideos[Math.floor(Math.random() * createdVideos.length)];
      const randomChannel = createdChannels[Math.floor(Math.random() * createdChannels.length)];
      
      sampleComments.push({
        videoId: randomVideo._id,
        channelId: randomChannel._id,
        content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        likes: Math.floor(Math.random() * 1000),
        dislikes: Math.floor(Math.random() * 50)
      });
    }

    await YouTubeComment.insertMany(sampleComments);
    console.log(`✅ Created ${sampleComments.length} comments`);

    // Create sample subscriptions
    console.log('👥 Creating sample subscriptions...');
    const sampleSubscriptions = [];
    
    for (let i = 0; i < createdChannels.length; i++) {
      for (let j = 0; j < createdChannels.length; j++) {
        if (i !== j && Math.random() > 0.5) { // 50% chance of subscription
          sampleSubscriptions.push({
            subscriberId: createdChannels[i]._id,
            subscribedToId: createdChannels[j]._id
          });
        }
      }
    }

    if (sampleSubscriptions.length > 0) {
      await YouTubeSubscription.insertMany(sampleSubscriptions);
      console.log(`✅ Created ${sampleSubscriptions.length} subscriptions`);
    }

    // Create sample playlists
    console.log('📋 Creating sample playlists...');
    const samplePlaylists = [
      {
        name: 'Tech Reviews 2024',
        description: 'Latest technology reviews and unboxings',
        channelId: createdChannels[0]._id,
        videos: createdVideos
          .filter(v => v.channelId.toString() === createdChannels[0]._id.toString() && !v.isShort)
          .slice(0, 3)
          .map((video, index) => ({
            videoId: video._id,
            position: index + 1
          })),
        visibility: 'public',
        playlistType: 'custom'
      },
      {
        name: 'Gaming Highlights',
        description: 'Best gaming moments and tutorials',
        channelId: createdChannels[1]._id,
        videos: createdVideos
          .filter(v => v.channelId.toString() === createdChannels[1]._id.toString())
          .slice(0, 2)
          .map((video, index) => ({
            videoId: video._id,
            position: index + 1
          })),
        visibility: 'public',
        playlistType: 'custom'
      }
    ];

    await YouTubePlaylist.insertMany(samplePlaylists);
    console.log(`✅ Created ${samplePlaylists.length} playlists`);

    console.log('\n🎉 YouTube sample data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`• ${createdChannels.length} channels`);
    console.log(`• ${createdVideos.length} videos (${createdVideos.filter(v => !v.isShort).length} regular, ${createdVideos.filter(v => v.isShort).length} shorts)`);
    console.log(`• ${sampleComments.length} comments`);
    console.log(`• ${sampleSubscriptions.length} subscriptions`);
    console.log(`• ${samplePlaylists.length} playlists`);

  } catch (error) {
    console.error('❌ Error seeding YouTube data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the seed function
if (require.main === module) {
  seedYouTubeData();
}

module.exports = seedYouTubeData;