const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const YouTubeVideo = require('./youtube/models/YouTubeVideo');
const YouTubeChannel = require('./youtube/models/YouTubeChannel');
require('dotenv').config();

async function addSampleVideos() {
  try {
    const mongoURI = `mongodb://naresh:123456789@localhost:27017/clone?authSource=admin`;
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get existing channels
    const channels = await YouTubeChannel.find();
    console.log(`📺 Found ${channels.length} channels`);

    const videoPath = path.join(__dirname, '../assests/samplevideos/agile project videos');
    const videoFiles = fs.readdirSync(videoPath).filter(file => file.endsWith('.mp4'));
    console.log(`🎥 Found ${videoFiles.length} video files`);

    // Clear existing videos first
    await YouTubeVideo.deleteMany({});
    console.log('🧹 Cleared existing videos');

    // Sample video metadata for each file
    const videoMetadata = [
      {
        title: "Complete React Tutorial - Build Modern Web Apps",
        description: "Learn React from scratch in this comprehensive tutorial. We'll cover components, hooks, state management, and build a real-world application together.",
        category: "Programming",
        tags: ["React", "JavaScript", "Web Development", "Tutorial", "Frontend"],
        duration: 1847, // 30:47
        views: 125000,
        likes: 8500,
        dislikes: 120
      },
      {
        title: "Amazing Wildlife Documentary - Life in the Savanna",
        description: "Explore the incredible wildlife of the African savanna in this breathtaking documentary. Witness lions, elephants, and zebras in their natural habitat.",
        category: "Education", 
        tags: ["Nature", "Wildlife", "Documentary", "Africa", "Animals"],
        duration: 2156, // 35:56
        views: 89000,
        likes: 5200,
        dislikes: 78
      },
      {
        title: "Epic Gaming Montage - Best Moments 2024",
        description: "The most epic gaming moments compilation from the best games of 2024. Featuring incredible gameplay and amazing victories.",
        category: "Gaming",
        tags: ["Gaming", "Montage", "Epic Moments", "Compilation", "2024"],
        duration: 892, // 14:52
        views: 245000,
        likes: 18400,
        dislikes: 580
      },
      {
        title: "Cooking Masterclass - Italian Pasta Secrets",
        description: "Learn authentic Italian pasta making techniques from a professional chef. Master the art of perfect pasta from scratch.",
        category: "Education",
        tags: ["Cooking", "Italian", "Pasta", "Recipe", "Chef"],
        duration: 1534, // 25:34
        views: 67000,
        likes: 4200,
        dislikes: 45
      },
      {
        title: "Electronic Music Festival 2024 - Best Sets",
        description: "The best electronic music sets from the biggest festival of 2024. Non-stop beats and incredible drops.",
        category: "Music",
        tags: ["Electronic", "Music", "Festival", "EDM", "Dance"],
        duration: 3421, // 57:01
        views: 156000,
        likes: 12800,
        dislikes: 320
      },
      {
        title: "Fitness Workout - Full Body HIIT Training",
        description: "High-intensity interval training workout for full body fitness. No equipment needed, perfect for home workouts.",
        category: "Education",
        tags: ["Fitness", "Workout", "HIIT", "Health", "Exercise"],
        duration: 1247, // 20:47
        views: 98000,
        likes: 7200,
        dislikes: 89
      },
      {
        title: "Travel Vlog - Exploring Tokyo Streets",
        description: "Join me as I explore the vibrant streets of Tokyo, discovering hidden gems, amazing food, and incredible culture.",
        category: "Education",
        tags: ["Travel", "Tokyo", "Japan", "Vlog", "Culture"],
        duration: 1678, // 27:58
        views: 134000,
        likes: 9800,
        dislikes: 156
      },
      {
        title: "Tech Review - Latest Smartphone Comparison",
        description: "Comprehensive comparison of the latest flagship smartphones. Which one offers the best value for money?",
        category: "Programming",
        tags: ["Tech", "Smartphone", "Review", "Technology", "Comparison"],
        duration: 1143, // 19:03
        views: 187000,
        likes: 11200,
        dislikes: 287
      },
      {
        title: "Comedy Sketch - Office Life Parody",
        description: "Hilarious parody of office life situations that everyone can relate to. Guaranteed to make you laugh!",
        category: "Comedy",
        tags: ["Comedy", "Sketch", "Office", "Funny", "Parody"],
        duration: 567, // 9:27
        views: 78000,
        likes: 6500,
        dislikes: 123
      },
      {
        title: "Live Concert - Acoustic Music Session",
        description: "Intimate acoustic music session recorded live. Beautiful melodies and soulful performances.",
        category: "Music", 
        tags: ["Live", "Acoustic", "Concert", "Music", "Performance"],
        duration: 2234, // 37:14
        views: 45000,
        likes: 3200,
        dislikes: 67
      },
      {
        title: "Quick Tutorial - JavaScript Tips & Tricks",
        description: "Essential JavaScript tips and tricks that every developer should know. Boost your coding skills in just 15 minutes!",
        category: "Programming",
        tags: ["JavaScript", "Programming", "Tips", "Tutorial", "Coding"],
        duration: 934, // 15:34
        views: 156000,
        likes: 13400,
        dislikes: 234
      },
      {
        title: "Nature Sounds - Relaxing Forest Ambience",
        description: "Peaceful forest sounds for relaxation, meditation, or study. High-quality nature ambience recorded in pristine forests.",
        category: "Music",
        tags: ["Nature", "Relaxation", "Ambient", "Forest", "Meditation"],
        duration: 3600, // 60:00
        views: 234000,
        likes: 15600,
        dislikes: 123
      }
    ];

    // Create videos with actual file paths
    const videosData = videoFiles.map((file, index) => {
      const metadata = videoMetadata[index] || videoMetadata[0]; // Fallback to first metadata
      const channelIndex = index % channels.length;
      
      return {
        title: metadata.title,
        description: metadata.description,
        videoUrl: `/assests/samplevideos/agile project videos/${file}`,
        thumbnailUrl: `https://picsum.photos/1280/720?random=${index + 100}`,
        duration: metadata.duration,
        channelId: channels[channelIndex]._id,
        views: metadata.views + Math.floor(Math.random() * 1000), // Add some randomness
        likes: metadata.likes,
        dislikes: metadata.dislikes,
        category: metadata.category,
        tags: metadata.tags,
        isShort: false, // These are regular videos
        visibility: 'public',
        commentCount: Math.floor(Math.random() * 1000) + 100
      };
    });

    // Insert videos into database
    console.log('📹 Creating YouTube videos with real file paths...');
    const createdVideos = await YouTubeVideo.insertMany(videosData);
    console.log(`✅ Successfully created ${createdVideos.length} videos`);

    // Display summary
    console.log('\n📊 Created Videos Summary:');
    createdVideos.forEach((video, index) => {
      console.log(`${index + 1}. "${video.title}" - ${video.views.toLocaleString()} views`);
    });

    console.log('\n🎉 Sample videos added successfully with real file paths!');
    console.log(`📁 Videos are accessible at: /assests/samplevideos/agile project videos/`);

  } catch (error) {
    console.error('❌ Error adding sample videos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

addSampleVideos();