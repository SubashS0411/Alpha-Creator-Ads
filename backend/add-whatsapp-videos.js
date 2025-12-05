const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const YouTubeVideo = require('./youtube/models/YouTubeVideo');
const YouTubeChannel = require('./youtube/models/YouTubeChannel');
const Reel = require('./instagram/models/Reel');
const User = require('./instagram/models/User');
require('dotenv').config();

async function addWhatsAppVideos() {
  try {
    const mongoURI = `mongodb://naresh:123456789@localhost:27017/clone?authSource=admin`;
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get existing channels for YouTube
    const channels = await YouTubeChannel.find();
    console.log(`📺 Found ${channels.length} YouTube channels`);

    // Get existing users for Instagram
    const users = await User.find();
    console.log(`👤 Found ${users.length} users for Instagram`);

    if (channels.length === 0) {
      console.log('❌ No YouTube channels found. Please run setup scripts first.');
      return;
    }

    if (users.length === 0) {
      console.log('❌ No users found. Please run setup scripts first.');
      return;
    }

    // Define the two WhatsApp videos
    const whatsappVideos = [
      {
        filename: 'WhatsApp Video 2025-12-05 at 09.30.14_ce12ef72.mp4',
        title: 'Premium Laptop Advertisement - Latest Technology Features',
        description: 'Discover the latest laptop with cutting-edge technology, sleek design, and powerful performance. Perfect for professionals, students, and gaming enthusiasts. Experience lightning-fast processing, stunning display quality, and all-day battery life.',
        category: 'Technology',
        tags: ['laptop', 'advertisement', 'technology', 'computer', 'performance', 'business'],
        duration: 30, // Estimated duration in seconds
        instagramCaption: '💻 Check out this amazing laptop! Perfect for work and play ✨ #laptop #tech #advertisement #technology #performance'
      },
      {
        filename: 'WhatsApp Video 2025-12-05 at 09.30.15_c7228351.mp4',
        title: 'Laptop Commercial - Transform Your Digital Experience',
        description: 'Transform your digital experience with our premium laptop collection. Featuring advanced processors, crystal-clear displays, and innovative design. Ideal for productivity, creativity, and entertainment.',
        category: 'Technology',
        tags: ['laptop', 'advertisement', 'commercial', 'digital', 'productivity', 'innovation'],
        duration: 30, // Estimated duration in seconds
        instagramCaption: '🚀 Elevate your digital experience with cutting-edge laptop technology! #laptop #innovation #advertisement #tech #digital'
      }
    ];

    console.log('\n📹 Adding videos to YouTube...');
    
    // Add videos to YouTube
    for (let i = 0; i < whatsappVideos.length; i++) {
      const video = whatsappVideos[i];
      const channelIndex = i % channels.length;
      
      const youtubeVideoData = {
        title: video.title,
        description: video.description,
        videoUrl: `/assests/samplevideos/${video.filename}`,
        thumbnailUrl: `https://picsum.photos/1280/720?random=${Date.now() + i}`,
        duration: video.duration,
        channelId: channels[channelIndex]._id,
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 1000) + 100,
        dislikes: Math.floor(Math.random() * 50) + 5,
        category: video.category,
        tags: video.tags,
        isShort: false,
        visibility: 'public',
        commentCount: Math.floor(Math.random() * 500) + 50
      };

      const createdYouTubeVideo = await YouTubeVideo.create(youtubeVideoData);
      console.log(`✅ Added to YouTube: "${createdYouTubeVideo.title}"`);
    }

    console.log('\n📱 Adding videos to Instagram as Reels...');
    
    // Add videos to Instagram as Reels
    for (let i = 0; i < whatsappVideos.length; i++) {
      const video = whatsappVideos[i];
      const userIndex = i % users.length;
      
      const reelData = {
        user: users[userIndex]._id,
        videoUrl: `/assests/samplevideos/${video.filename}`,
        thumbnailUrl: `https://picsum.photos/1080/1920?random=${Date.now() + i + 100}`,
        caption: video.instagramCaption,
        duration: video.duration,
        audioInfo: {
          title: 'Original Audio',
          artist: users[userIndex].fullName || users[userIndex].username
        },
        likes: [],
        comments: [],
        hashtags: video.tags,
        isPublic: true,
        allowComments: true,
        allowSharing: true
      };

      // Add some random likes
      const randomLikeCount = Math.floor(Math.random() * 100) + 20;
      for (let j = 0; j < Math.min(randomLikeCount, users.length); j++) {
        const randomUserIndex = Math.floor(Math.random() * users.length);
        if (!reelData.likes.includes(users[randomUserIndex]._id)) {
          reelData.likes.push(users[randomUserIndex]._id);
        }
      }

      const createdReel = await Reel.create(reelData);
      console.log(`✅ Added to Instagram: Reel with caption "${createdReel.caption.substring(0, 50)}..."`);
    }

    console.log('\n🎉 Successfully added WhatsApp videos to both YouTube and Instagram!');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log('📺 YouTube Videos:');
    const youtubeVideos = await YouTubeVideo.find({ 
      videoUrl: { $regex: /WhatsApp Video 2025-12-05/ } 
    }).populate('channelId', 'name');
    
    youtubeVideos.forEach((video, index) => {
      console.log(`  ${index + 1}. "${video.title}" - ${video.views.toLocaleString()} views`);
      console.log(`     Channel: ${video.channelId.name}`);
      console.log(`     Category: ${video.category}`);
    });

    console.log('\n📱 Instagram Reels:');
    const instagramReels = await Reel.find({ 
      videoUrl: { $regex: /WhatsApp Video 2025-12-05/ } 
    }).populate('user', 'username fullName');
    
    instagramReels.forEach((reel, index) => {
      console.log(`  ${index + 1}. "${reel.caption.substring(0, 50)}..." - ${reel.likes.length} likes`);
      console.log(`     User: @${reel.user.username} (${reel.user.fullName || 'No full name'})`);
      console.log(`     Duration: ${reel.duration}s`);
    });

    console.log('\n📁 Video file paths:');
    whatsappVideos.forEach((video, index) => {
      console.log(`  ${index + 1}. /assests/samplevideos/${video.filename}`);
    });

  } catch (error) {
    console.error('❌ Error adding WhatsApp videos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
addWhatsAppVideos();