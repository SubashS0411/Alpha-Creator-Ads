const mongoose = require('mongoose');
require('dotenv').config();

const YouTubeVideo = require('./youtube/models/YouTubeVideo');
const YouTubeChannel = require('./youtube/models/YouTubeChannel');

async function createVideoData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get existing channels
    const channels = await YouTubeChannel.find({}).limit(4);
    console.log(`📺 Found ${channels.length} channels`);

    if (channels.length === 0) {
      console.log('❌ No channels found! Please run the channel seeding script first.');
      return;
    }

    // Create sample videos
    const videos = [
      {
        title: 'iPhone 15 Pro Max Complete Review - Worth the Upgrade?',
        description: 'In-depth review covering camera, performance, battery life, and new features of the iPhone 15 Pro Max.',
        videoUrl: 'https://example.com/video1.mp4',
        thumbnailUrl: 'https://picsum.photos/1280/720?random=1',
        duration: 892, // 14:52
        channelId: channels[0]._id,
        views: 1250000,
        likes: 125000,
        dislikes: 3200,
        category: 'Programming',
        tags: ['iPhone', 'Apple', 'Review', 'Tech'],
        isShort: false,
        visibility: 'public',
        commentCount: 8945
      },
      {
        title: 'React 18 Complete Guide - New Features Explained',
        description: 'Learn about React 18\'s new features including concurrent rendering, automatic batching, and suspense improvements.',
        videoUrl: 'https://example.com/video2.mp4',
        thumbnailUrl: 'https://picsum.photos/1280/720?random=2',
        duration: 2145, // 35:45
        channelId: channels[1]._id,
        views: 890000,
        likes: 67000,
        dislikes: 1200,
        category: 'Programming',
        tags: ['React', 'JavaScript', 'Web Development', 'Tutorial'],
        isShort: false,
        visibility: 'public',
        commentCount: 5234
      },
      {
        title: 'Epic Gaming Montage 2024',
        description: 'Best gaming moments compilation featuring top games of 2024.',
        videoUrl: 'https://example.com/video3.mp4',
        thumbnailUrl: 'https://picsum.photos/1280/720?random=3',
        duration: 456, // 7:36
        channelId: channels[2]._id,
        views: 2100000,
        likes: 185000,
        dislikes: 5400,
        category: 'Gaming',
        tags: ['Gaming', 'Montage', '2024', 'Epic'],
        isShort: false,
        visibility: 'public',
        commentCount: 12456
      },
      {
        title: 'Quick Cooking Tip #1',
        description: 'Learn this amazing knife technique in just 30 seconds!',
        videoUrl: 'https://example.com/short1.mp4',
        thumbnailUrl: 'https://picsum.photos/1080/1920?random=10',
        duration: 28,
        channelId: channels[3]._id,
        views: 45000,
        likes: 3200,
        dislikes: 45,
        category: 'Education',
        tags: ['Cooking', 'Tips', 'Quick'],
        isShort: true,
        visibility: 'public',
        commentCount: 234
      },
      {
        title: 'Amazing Nature Documentary - Wildlife Photography',
        description: 'Stunning wildlife photography techniques and behind-the-scenes footage from our latest expedition.',
        videoUrl: 'https://example.com/video4.mp4',
        thumbnailUrl: 'https://picsum.photos/1280/720?random=4',
        duration: 1834, // 30:34
        channelId: channels[0]._id,
        views: 650000,
        likes: 45000,
        dislikes: 890,
        category: 'Education',
        tags: ['Nature', 'Photography', 'Documentary', 'Wildlife'],
        isShort: false,
        visibility: 'public',
        commentCount: 3456
      },
      {
        title: 'JavaScript ES2024 New Features',
        description: 'Exploring the latest JavaScript features and syntax improvements in ES2024.',
        videoUrl: 'https://example.com/video5.mp4',
        thumbnailUrl: 'https://picsum.photos/1280/720?random=5',
        duration: 1245, // 20:45
        channelId: channels[1]._id,
        views: 320000,
        likes: 28000,
        dislikes: 567,
        category: 'Programming',
        tags: ['JavaScript', 'ES2024', 'Programming', 'Web Dev'],
        isShort: false,
        visibility: 'public',
        commentCount: 1890
      }
    ];

    // Insert videos
    const createdVideos = await YouTubeVideo.insertMany(videos);
    console.log(`✅ Created ${createdVideos.length} YouTube videos successfully!`);

    // Show summary
    console.log('\n📊 Video Summary:');
    createdVideos.forEach((video, index) => {
      console.log(`${index + 1}. "${video.title}" - ${video.views.toLocaleString()} views - ${video.isShort ? 'Short' : 'Video'}`);
    });

  } catch (error) {
    console.error('❌ Error creating videos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

createVideoData();