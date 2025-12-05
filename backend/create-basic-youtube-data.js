const mongoose = require('mongoose');
require('dotenv').config();

const YouTubeVideo = require('./youtube/models/YouTubeVideo');
const YouTubeChannel = require('./youtube/models/YouTubeChannel');

async function createBasicYouTubeData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    const mongoURI = `mongodb://naresh:123456789@localhost:27017/clone?authSource=admin`;
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existingVideos = await YouTubeVideo.countDocuments();
    const existingChannels = await YouTubeChannel.countDocuments();
    
    console.log(`📊 Current data: ${existingChannels} channels, ${existingVideos} videos`);

    // Create basic channels if they don't exist
    let channels = await YouTubeChannel.find();
    
    if (channels.length === 0) {
      console.log('📺 Creating basic YouTube channels...');
      
      const sampleChannels = [
        {
          name: 'TechReview Pro',
          handle: '@techreviewpro',
          description: 'Latest technology reviews and tutorials',
          avatarUrl: 'https://picsum.photos/150/150?random=1',
          bannerUrl: 'https://picsum.photos/1920/480?random=1',
          subscriberCount: 125000,
          totalViews: 2500000,
          videoCount: 45,
          verified: true,
          userId: new mongoose.Types.ObjectId()
        },
        {
          name: 'Creative Studio',
          handle: '@creativestudio',
          description: 'Creative content and tutorials',
          avatarUrl: 'https://picsum.photos/150/150?random=2',
          bannerUrl: 'https://picsum.photos/1920/480?random=2',
          subscriberCount: 87000,
          totalViews: 1800000,
          videoCount: 32,
          verified: false,
          userId: new mongoose.Types.ObjectId()
        },
        {
          name: 'Entertainment Hub',
          handle: '@entertainmenthub',
          description: 'Fun and entertaining videos',
          avatarUrl: 'https://picsum.photos/150/150?random=3',
          bannerUrl: 'https://picsum.photos/1920/480?random=3',
          subscriberCount: 234000,
          totalViews: 4200000,
          videoCount: 78,
          verified: true,
          userId: new mongoose.Types.ObjectId()
        }
      ];

      channels = await YouTubeChannel.insertMany(sampleChannels);
      console.log(`✅ Created ${channels.length} channels`);
    }

    // Create basic videos if they don't exist
    if (existingVideos === 0) {
      console.log('🎥 Creating basic YouTube videos...');
      
      const sampleVideos = [
        {
          title: 'Amazing Technology Review - Must Watch!',
          description: 'In this comprehensive review, we dive deep into the latest technology trends and showcase amazing innovations that will change your life.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnailUrl: 'https://picsum.photos/1280/720?random=10',
          channelId: channels[0]._id,
          duration: 600,
          views: 125000,
          likes: 8900,
          dislikes: 234,
          category: 'Technology',
          tags: ['tech', 'review', 'innovation', 'gadgets'],
          visibility: 'public',
          isShort: false,
          uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
        },
        {
          title: 'Creative Tutorial: From Beginner to Pro',
          description: 'Learn professional creative techniques in this step-by-step tutorial. Perfect for beginners and intermediate users.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          thumbnailUrl: 'https://picsum.photos/1280/720?random=11',
          channelId: channels[1]._id,
          duration: 840,
          views: 67000,
          likes: 4200,
          dislikes: 89,
          category: 'Education',
          tags: ['tutorial', 'creative', 'design', 'education'],
          visibility: 'public',
          isShort: false,
          uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          title: 'Hilarious Comedy Compilation 2024',
          description: 'The best comedy moments from 2024! Get ready to laugh out loud with this amazing compilation.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnailUrl: 'https://picsum.photos/1280/720?random=12',
          channelId: channels[2]._id,
          duration: 720,
          views: 342000,
          likes: 23400,
          dislikes: 567,
          category: 'Entertainment',
          tags: ['comedy', 'funny', 'compilation', 'entertainment'],
          visibility: 'public',
          isShort: false,
          uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          title: 'Quick Life Hack #Shorts',
          description: 'Amazing life hack in 60 seconds! #lifehack #shorts #viral',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          thumbnailUrl: 'https://picsum.photos/720/1280?random=13',
          channelId: channels[0]._id,
          duration: 58,
          views: 567000,
          likes: 45000,
          dislikes: 890,
          category: 'Lifestyle',
          tags: ['lifehack', 'shorts', 'viral', 'quick'],
          visibility: 'public',
          isShort: true,
          uploadDate: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          title: 'Gaming Highlights - Epic Moments',
          description: 'Watch the most epic gaming moments and highlights from popular games. Incredible skills and amazing plays!',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          thumbnailUrl: 'https://picsum.photos/1280/720?random=14',
          channelId: channels[2]._id,
          duration: 480,
          views: 189000,
          likes: 12300,
          dislikes: 234,
          category: 'Gaming',
          tags: ['gaming', 'highlights', 'epic', 'gameplay'],
          visibility: 'public',
          isShort: false,
          uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          title: 'Music Vibes Short #Shorts',
          description: 'Perfect music for your mood! 🎵 #music #vibes #shorts',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          thumbnailUrl: 'https://picsum.photos/720/1280?random=15',
          channelId: channels[1]._id,
          duration: 45,
          views: 723000,
          likes: 67000,
          dislikes: 1200,
          category: 'Music',
          tags: ['music', 'vibes', 'shorts', 'mood'],
          visibility: 'public',
          isShort: true,
          uploadDate: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        }
      ];

      const videos = await YouTubeVideo.insertMany(sampleVideos);
      console.log(`✅ Created ${videos.length} videos (${videos.filter(v => v.isShort).length} shorts)`);

      // Update channel video counts
      for (const channel of channels) {
        const videoCount = videos.filter(v => v.channelId.toString() === channel._id.toString()).length;
        await YouTubeChannel.findByIdAndUpdate(channel._id, { videoCount });
      }
      console.log('✅ Updated channel video counts');
    }

    console.log('\n🎉 Basic YouTube data setup complete!');
    console.log('📊 Summary:');
    console.log(`   - Channels: ${channels.length}`);
    console.log(`   - Videos: ${existingVideos || (await YouTubeVideo.countDocuments())}`);
    console.log('\n🌐 You can now test the YouTube functionality!');
    
  } catch (error) {
    console.error('❌ Error creating YouTube data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
createBasicYouTubeData();