const mongoose = require('mongoose');
require('dotenv').config();

// Import YouTube models
const YouTubeVideo = require('./youtube/models/YouTubeVideo');
const YouTubeChannel = require('./youtube/models/YouTubeChannel');
const YouTubeComment = require('./youtube/models/YouTubeComment');
const YouTubePlaylist = require('./youtube/models/YouTubePlaylist');
const YouTubeSubscription = require('./youtube/models/YouTubeSubscription');
const YouTubeAnalytics = require('./youtube/models/YouTubeAnalytics');

const sampleYouTubeData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/appclone');
    console.log('Connected to MongoDB');

    // Skip clearing data due to authentication issues
    console.log('Skipping data clearing - will insert new data');

    // Sample user IDs for the channels from existing users
    const sampleUserId1 = new mongoose.Types.ObjectId('6927256c128758739450df40'); // john_doe
    const sampleUserId2 = new mongoose.Types.ObjectId('6927256c128758739450df41'); // jane_smith
    const sampleUserId3 = new mongoose.Types.ObjectId('69272753a93a6a6720978bf7'); // sarah_travels

    // Create sample channels using upsert to avoid duplicates
    const channelData = [
      {
        channelId: 'channel_001',
        handle: '@TechReview',
        name: 'Tech Review Hub',
        description: 'Latest tech reviews and unboxings',
        avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDQwODAiLz4KPHRLEHAEDD0iMjAiIHk9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UQzwvdGV4dD4KPC9zdmc+',
        bannerUrl: '/assests/tech-channel-banner.jpg',
        subscriberCount: 1250000,
        videoCount: 342,
        verified: true,
        createdDate: new Date('2019-03-15'),
        userId: sampleUserId1
      },
      {
        channelId: 'channel_002',
        handle: '@GamingPro',
        name: 'Gaming Pro Max',
        description: 'Epic gaming content and live streams',
        avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4MDIwNDAiLz4KPHRLEHAEDD0iMjAiIHk9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HRzwvdGV4dD4KPC9zdmc+',
        bannerUrl: '/assests/gaming-channel-banner.jpg',
        subscriberCount: 3500000,
        videoCount: 1205,
        verified: true,
        createdDate: new Date('2017-08-22'),
        userId: sampleUserId2
      },
      {
        channelId: 'channel_003',
        handle: '@MusicVibes',
        name: 'Music Vibes Official',
        description: 'Your daily dose of amazing music',
        avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MDQwODAiLz4KPHRLEHAEDD0iMjAiIHk9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NVjwvdGV4dD4KPC9zdmc+',
        subscriberCount: 850000,
        videoCount: 156,
        verified: false,
        createdDate: new Date('2020-01-10'),
        userId: sampleUserId3
      },
      {
        channelId: 'channel_004',
        handle: '@CookingMaster',
        name: 'Cooking Master Chef',
        description: 'Easy recipes for everyone',
        avatarUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM4MDQwMjAiLz4KPHRLEHAEDD0iMjAiIHk9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DTTwvdGV4dD4KPC9zdmc+',
        subscriberCount: 920000,
        videoCount: 278,
        verified: true,
        createdDate: new Date('2018-06-05'),
        userId: sampleUserId1
      }
    ];

    // Create channels using upsert
    const channels = [];
    for (const channelInfo of channelData) {
      // Remove channelId field as it's not in schema
      const { channelId, ...cleanChannelInfo } = channelInfo;
      const channel = await YouTubeChannel.findOneAndUpdate(
        { handle: channelInfo.handle },
        cleanChannelInfo,
        { upsert: true, new: true }
      );
      channels.push(channel);
    }

    console.log('Created/updated sample channels');

    // Create sample videos using upsert
    const videoData = [
      {
        videoId: 'video_001',
        title: 'iPhone 15 Pro Max Review - Is It Worth The Upgrade?',
        description: 'Complete review of the iPhone 15 Pro Max covering camera, performance, battery life and more.',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: 892, // 14 min 52 sec
        channelId: channels[0]._id,
        category: 'Technology',
        tags: ['iPhone', 'Apple', 'Smartphone', 'Review', 'Tech'],
        views: 1250000,
        likes: 125000,
        dislikes: 3200,
        commentCount: 15600,
        uploadDate: new Date('2024-11-20'),
        visibility: 'public',
        isShort: false
      },
      {
        videoId: 'video_002',
        title: 'Epic Gaming Moments That Will Blow Your Mind!',
        description: 'Check out these incredible gaming moments from the latest AAA games.',
        thumbnailUrl: 'https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: 45, // 45 seconds - Short
        channelId: channels[1]._id,
        category: 'Gaming',
        tags: ['Gaming', 'Moments', 'Epic', 'Funny'],
        views: 850000,
        likes: 75000,
        dislikes: 1200,
        commentCount: 8500,
        uploadDate: new Date('2024-11-22'),
        visibility: 'public',
        isShort: true
      },
      {
        videoId: 'video_003',
        title: 'Top 10 Songs of the Week - Music Mix 2024',
        description: 'The best music hits of this week compiled in one amazing playlist.',
        thumbnailUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: 3600, // 1 hour
        channelId: channels[2]._id,
        category: 'Music',
        tags: ['Music', 'Mix', 'Playlist', 'Hits', '2024'],
        views: 2100000,
        likes: 180000,
        dislikes: 5600,
        commentCount: 25000,
        uploadDate: new Date('2024-11-18'),
        visibility: 'public',
        isShort: false
      },
      {
        videoId: 'video_004',
        title: '30-Second Chocolate Cake Recipe',
        description: 'Quick and easy chocolate cake you can make in just 30 seconds!',
        thumbnailUrl: 'https://img.youtube.com/vi/aqz-KE-bpKQ/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: 30, // 30 seconds - Short
        channelId: channels[3]._id,
        category: 'Food',
        tags: ['Recipe', 'Chocolate', 'Cake', 'Quick', 'Easy'],
        views: 650000,
        likes: 55000,
        dislikes: 800,
        commentCount: 4200,
        uploadDate: new Date('2024-11-21'),
        visibility: 'public',
        isShort: true,
        language: 'en'
      },
      {
        videoId: 'video_005',
        title: 'Best Gaming Setup 2024 - Ultimate Guide',
        description: 'Everything you need to know about building the perfect gaming setup in 2024.',
        thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        duration: 1248, // 20 min 48 sec
        channelId: channels[1]._id,
        category: 'Gaming',
        tags: ['Gaming', 'Setup', 'Guide', 'PC', 'Build'],
        views: 945000,
        likes: 89000,
        dislikes: 2100,
        commentCount: 12300,
        uploadDate: new Date('2024-11-15'),
        visibility: 'public',
        isShort: false,
        language: 'en'
      },
      {
        videoId: 'video_006',
        title: 'Pasta Masterclass - Perfect Every Time',
        description: 'Learn the secrets to making perfect pasta with this comprehensive guide.',
        thumbnailUrl: 'https://img.youtube.com/vi/Tup4lxKB6vw/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        duration: 1856, // 30 min 56 sec
        channelId: channels[3]._id,
        category: 'Food',
        tags: ['Pasta', 'Cooking', 'Tutorial', 'Italian', 'Recipe'],
        views: 780000,
        likes: 67000,
        dislikes: 1800,
        commentCount: 9500,
        uploadDate: new Date('2024-11-12'),
        visibility: 'public',
        isShort: false,
        language: 'en'
      },
      // Additional Shorts for continuous playback
      {
        videoId: 'short_001',
        title: 'Amazing Coding Tips in 60 Seconds',
        description: 'Quick coding tips that will blow your mind! #coding #programming #shorts',
        thumbnailUrl: 'https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        duration: 60,
        channelId: channels[0]._id,
        category: 'Programming',
        tags: ['Coding', 'Tips', 'Programming', 'Quick'],
        views: 1250000,
        likes: 125000,
        dislikes: 3200,
        commentCount: 15600,
        uploadDate: new Date('2024-11-25'),
        visibility: 'public',
        isShort: true
      },
      {
        videoId: 'short_002',
        title: 'Quick Recipe: 30 Second Pasta Hack',
        description: 'Transform your pasta game with this incredible 30-second hack! #cooking #food #pasta',
        thumbnailUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        duration: 30,
        channelId: channels[3]._id,
        category: 'Food',
        tags: ['Recipe', 'Pasta', 'Hack', 'Quick', 'Cooking'],
        views: 850000,
        likes: 75000,
        dislikes: 1200,
        commentCount: 8500,
        uploadDate: new Date('2024-11-26'),
        visibility: 'public',
        isShort: true
      },
      {
        videoId: 'short_003',
        title: 'Insane Gaming Clutch Moment!',
        description: 'You won\'t believe this clutch moment! Epic gaming short #gaming #clutch #epic',
        thumbnailUrl: 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
        duration: 45,
        channelId: channels[1]._id,
        category: 'Gaming',
        tags: ['Gaming', 'Clutch', 'Epic', 'Moments'],
        views: 2100000,
        likes: 180000,
        dislikes: 5600,
        commentCount: 25000,
        uploadDate: new Date('2024-11-27'),
        visibility: 'public',
        isShort: true
      },
      {
        videoId: 'short_004',
        title: 'Mind-Blowing Tech Fact!',
        description: 'This tech fact will change how you think about smartphones forever! #tech #facts #mind blown',
        thumbnailUrl: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        duration: 55,
        channelId: channels[0]._id,
        category: 'Technology',
        tags: ['Tech', 'Facts', 'Smartphone', 'Innovation'],
        views: 950000,
        likes: 89000,
        dislikes: 2100,
        commentCount: 12300,
        uploadDate: new Date('2024-11-28'),
        visibility: 'public',
        isShort: true
      },
      {
        videoId: 'short_005',
        title: 'Perfect Coffee in 20 Seconds',
        description: 'Barista-quality coffee in just 20 seconds! #coffee #barista #quick #morning',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        duration: 20,
        channelId: channels[3]._id,
        category: 'Food',
        tags: ['Coffee', 'Barista', 'Quick', 'Morning'],
        views: 780000,
        likes: 67000,
        dislikes: 1800,
        commentCount: 9500,
        uploadDate: new Date('2024-11-29'),
        visibility: 'public',
        isShort: true
      }
    ];

    // Create videos using upsert
    const videos = [];
    for (const videoInfo of videoData) {
      // Remove videoId field as it's not in schema, and fix channelId reference
      const { videoId, ...cleanVideoInfo } = videoInfo;
      const video = await YouTubeVideo.findOneAndUpdate(
        { title: videoInfo.title },
        cleanVideoInfo,
        { upsert: true, new: true }
      );
      videos.push(video);
    }

    console.log('Created/updated sample videos');

    // Create sample comments using upsert (simple approach - skip if they exist)
    const existingComments = await YouTubeComment.find({});
    let comments = existingComments;
    
    if (existingComments.length === 0) {
      comments = await YouTubeComment.create([
        {
          videoId: videos[0]._id,
          channelId: channels[0]._id,
          content: 'Great review! Really helpful for deciding whether to upgrade.',
          likes: 245,
          dislikes: 2,
          isHearted: true,
          isPinned: false,
          createdAt: new Date('2024-11-20T10:30:00Z')
        },
        {
          videoId: videos[0]._id,
          channelId: channels[1]._id,
          content: 'The camera quality comparison was amazing! Thanks for the detailed analysis.',
          likes: 89,
          dislikes: 1,
          isHearted: false,
          isPinned: false,
          createdAt: new Date('2024-11-20T11:45:00Z')
        },
        {
          videoId: videos[1]._id,
          channelId: channels[2]._id,
          content: 'That last clip was insane! 🔥🔥🔥',
          likes: 156,
          dislikes: 3,
          isHearted: true,
          isPinned: false,
          createdAt: new Date('2024-11-22T15:20:00Z')
        }
      ]);
    }

    console.log('Created/updated sample comments');

    // Skip analytics for now - requires complex user references
    console.log('Skipped sample analytics data (requires user ObjectIds)');

    // Skip subscriptions for now - requires user ObjectIds
    console.log('Skipped sample subscriptions (requires user ObjectIds)');

    console.log('✅ YouTube sample data created successfully!');
    console.log(`Created ${channels.length} channels, ${videos.length} videos, ${comments.length} comments`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    process.exit(1);
  }
};

sampleYouTubeData();