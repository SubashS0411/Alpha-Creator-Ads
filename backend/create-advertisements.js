const mongoose = require('mongoose');
const Advertisement = require('./models/Advertisement');
const YouTubeVideo = require('./youtube/models/YouTubeVideo');
const Reel = require('./instagram/models/Reel');
require('dotenv').config();

async function addVideoAdvertisements() {
  try {
    const mongoURI = `mongodb://naresh:123456789@localhost:27017/clone?authSource=admin`;
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get the WhatsApp videos we just added
    const whatsappVideos = await YouTubeVideo.find({ 
      videoUrl: { $regex: /WhatsApp Video 2025-12-05/ } 
    });
    
    console.log(`🎥 Found ${whatsappVideos.length} WhatsApp videos to convert to advertisements`);

    // Clear existing advertisements first
    await Advertisement.deleteMany({});
    console.log('🧹 Cleared existing advertisements');

    const advertisementData = [
      {
        title: 'Premium Laptop - Ultimate Performance',
        description: 'Experience the future of computing with our latest premium laptop. Featuring cutting-edge processors, stunning 4K displays, and all-day battery life. Perfect for professionals, creators, and gamers alike.',
        videoUrl: '/assests/samplevideos/WhatsApp Video 2025-12-05 at 09.30.14_ce12ef72.mp4',
        thumbnailUrl: 'https://picsum.photos/1280/720?laptop1',
        duration: 30,
        advertiser: {
          name: 'TechPro Solutions',
          logoUrl: 'https://picsum.photos/100/100?logo1',
          websiteUrl: 'https://techpro-solutions.com'
        },
        category: 'Technology',
        tags: ['laptop', 'technology', 'performance', 'business', 'premium', 'computing'],
        targetAudience: {
          ageRange: {
            min: 18,
            max: 55
          },
          interests: ['technology', 'business', 'productivity', 'gaming', 'design'],
          locations: ['US', 'UK', 'Canada', 'Australia', 'India']
        },
        budget: {
          dailyBudget: 500,
          totalBudget: 15000,
          costPerView: 0.05
        },
        performance: {
          views: Math.floor(Math.random() * 10000) + 5000,
          clicks: Math.floor(Math.random() * 500) + 250,
          conversions: Math.floor(Math.random() * 50) + 25,
          impressions: Math.floor(Math.random() * 50000) + 25000
        },
        adSettings: {
          skipAfter: 5,
          isSkippable: true,
          showShopNow: true,
          shopNowUrl: 'https://techpro-solutions.com/premium-laptop',
          shopNowText: 'Shop Now - 20% Off!'
        },
        scheduling: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          isActive: true
        },
        placement: {
          platforms: ['youtube'],
          position: 'pre-roll',
          frequency: 3
        }
      },
      {
        title: 'Revolutionary Laptop Experience',
        description: 'Transform your digital workflow with our revolutionary laptop series. Advanced AI features, lightning-fast SSD storage, and professional-grade graphics. Elevate your productivity to new heights.',
        videoUrl: '/assests/samplevideos/WhatsApp Video 2025-12-05 at 09.30.15_c7228351.mp4',
        thumbnailUrl: 'https://picsum.photos/1280/720?laptop2',
        duration: 30,
        advertiser: {
          name: 'Digital Innovation Corp',
          logoUrl: 'https://picsum.photos/100/100?logo2',
          websiteUrl: 'https://digital-innovation.com'
        },
        category: 'Technology',
        tags: ['laptop', 'innovation', 'AI', 'productivity', 'professional', 'digital'],
        targetAudience: {
          ageRange: {
            min: 22,
            max: 45
          },
          interests: ['technology', 'innovation', 'AI', 'business', 'creativity'],
          locations: ['US', 'UK', 'Germany', 'Japan', 'Singapore']
        },
        budget: {
          dailyBudget: 750,
          totalBudget: 22500,
          costPerView: 0.07
        },
        performance: {
          views: Math.floor(Math.random() * 15000) + 8000,
          clicks: Math.floor(Math.random() * 800) + 400,
          conversions: Math.floor(Math.random() * 80) + 40,
          impressions: Math.floor(Math.random() * 75000) + 40000
        },
        adSettings: {
          skipAfter: 5,
          isSkippable: true,
          showShopNow: true,
          shopNowUrl: 'https://digital-innovation.com/revolutionary-laptop',
          shopNowText: 'Get Yours Today!'
        },
        scheduling: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
          isActive: true
        },
        placement: {
          platforms: ['youtube'],
          position: 'pre-roll',
          frequency: 2
        }
      }
    ];

    // Create advertisements
    console.log('📺 Creating advertisements...');
    const createdAds = await Advertisement.insertMany(advertisementData);
    console.log(`✅ Successfully created ${createdAds.length} advertisements`);

    // Calculate CTR for each ad
    createdAds.forEach(ad => {
      ad.performance.clickThroughRate = (ad.performance.clicks / ad.performance.views) * 100;
      ad.save();
    });

    // Display summary
    console.log('\n📊 Created Advertisements Summary:');
    createdAds.forEach((ad, index) => {
      console.log(`${index + 1}. "${ad.title}"`);
      console.log(`   Advertiser: ${ad.advertiser.name}`);
      console.log(`   Duration: ${ad.duration}s (Skip after ${ad.adSettings.skipAfter}s)`);
      console.log(`   Performance: ${ad.performance.views.toLocaleString()} views, ${ad.performance.clicks.toLocaleString()} clicks`);
      console.log(`   CTR: ${ad.performance.clickThroughRate.toFixed(2)}%`);
      console.log(`   Shop Now: "${ad.adSettings.shopNowText}" → ${ad.adSettings.shopNowUrl}`);
      console.log(`   Budget: $${ad.budget.dailyBudget}/day, $${ad.budget.totalBudget} total`);
      console.log('');
    });

    console.log('🎯 Advertisement Features:');
    console.log('   • Skippable after 5 seconds');
    console.log('   • "Shop Now" button appears during playback');
    console.log('   • Pre-roll position (plays before main video)');
    console.log('   • YouTube platform targeting');
    console.log('   • Performance tracking (views, clicks, CTR)');
    console.log('   • Audience targeting by age, interests, location');

  } catch (error) {
    console.error('❌ Error creating advertisements:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the script
addVideoAdvertisements();