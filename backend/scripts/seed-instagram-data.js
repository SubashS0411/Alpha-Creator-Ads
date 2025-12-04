const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('../instagram/models/User');
require('../instagram/models/Post');
require('../instagram/models/Reel');
require('../instagram/models/Story');
require('../instagram/models/AnalyticsEvent');

const User = mongoose.model('User');
const Post = mongoose.model('Post'); 
const Reel = mongoose.model('Reel');
const Story = mongoose.model('Story');

const seedInstagramData = async () => {
  try {
    // Load environment variables
    require('dotenv').config({ path: '../.env' });
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://naresh:123456789@localhost:27017/clone?authSource=admin');

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Reel.deleteMany({});
    await Story.deleteMany({});
    
    console.log('Cleared existing Instagram data');

    // Create sample users
    const users = [
      {
        username: 'demo_user',
        email: 'demo@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Demo User',
        profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        bio: 'Photography enthusiast 📸\nNature lover 🌿\nLiving life to the fullest ✨',
        isVerified: true,
        followersCount: 1234,
        followingCount: 567,
        postsCount: 0
      },
      {
        username: 'nature_explorer',
        email: 'nature@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Nature Explorer',
        profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        bio: 'Adventure seeker 🏔️\n📍Currently in: Swiss Alps\nCapturing moments in nature',
        isVerified: false,
        followersCount: 892,
        followingCount: 234,
        postsCount: 0
      },
      {
        username: 'foodie_pics',
        email: 'foodie@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Chef Marina',
        profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: '👩‍🍳 Professional Chef\n🍕 Homemade Italian cuisine\nRecipes & cooking tips ⬇️',
        isVerified: true,
        followersCount: 2156,
        followingCount: 89,
        postsCount: 0
      },
      {
        username: 'urban_artist',
        email: 'artist@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Alex Kim',
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: '🎨 Digital Artist\n✨ Creating visual stories\nCommissions open 💌',
        isVerified: false,
        followersCount: 654,
        followingCount: 432,
        postsCount: 0
      },
      {
        username: 'travel_soul',
        email: 'travel@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Sarah Williams',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: '✈️ Travel blogger\n🌍 50 countries & counting\nNext stop: Tokyo 🇯🇵',
        isVerified: true,
        followersCount: 3421,
        followingCount: 156,
        postsCount: 0
      },
      {
        username: 'fitness_coach',
        email: 'fitness@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Marcus Johnson',
        profilePictureUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
        bio: '💪 Personal Trainer\n🏋️‍♂️ Transform your body\nFree workout guide in bio',
        isVerified: false,
        followersCount: 1876,
        followingCount: 267,
        postsCount: 0
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created users:', createdUsers.length);

    // Create sample posts
    const posts = [
      {
        author: createdUsers[0]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1080&fit=crop',
        aspectRatio: '1:1',
        caption: 'Golden hour in the mountains 🏔️ There\'s nothing quite like watching the sun paint the peaks in warm hues. This moment reminded me why I love adventure travel so much.\n\n#mountains #goldenhour #nature #photography #adventure #sunset #peaceful #wanderlust',
        location: 'Swiss Alps, Switzerland',

        likesCount: 47,
        commentsCount: 12,
        viewsCount: 234
      },
      {
        author: createdUsers[1]._id,
        type: 'video',
        mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        aspectRatio: '1.91:1',
        caption: 'Nature documentary vibes 🎬 Spent the day filming in the forest and captured this amazing wildlife footage. Sometimes the best stories are told without words.\n\n#nature #documentary #wildlife #filming #forest #storytelling #video #cinematography',
        location: 'Redwood National Forest',

        likesCount: 89,
        commentsCount: 16,
        viewsCount: 445
      },
      {
        author: createdUsers[1]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&h=1080&fit=crop',
        aspectRatio: '1:1',
        caption: 'Lost in the emerald forest 🌲✨ Sometimes the best therapy is a long walk among the trees. The forest has a way of putting everything into perspective.\n\n#forest #nature #hiking #therapy #green #peaceful #mindfulness #explore',
        location: 'Pacific Northwest Forest',

        likesCount: 93,
        commentsCount: 8,
        viewsCount: 456
      },
      {
        author: createdUsers[2]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1080&h=1080&fit=crop',
        aspectRatio: '1:1',
        caption: 'Homemade Margherita perfection! 🍕 Nothing beats the satisfaction of making pizza from scratch. The secret? Let the dough rest for at least 24 hours and use the best San Marzano tomatoes you can find.\n\nRecipe link in bio! Who wants to try this at home?\n\n#pizza #homemade #italian #cooking #foodie #margherita #recipe #delicious',
        location: 'My Kitchen',

        likesCount: 156,
        commentsCount: 23,
        viewsCount: 789
      },
      {
        author: createdUsers[3]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1080&h=1080&fit=crop',
        aspectRatio: '1:1',
        caption: 'City lights and digital dreams 🌃✨ Working on a new piece inspired by the contrast between nature and urban life. The interplay of organic and geometric forms fascinates me.\n\n#digitalart #cityscape #art #design #creative #inspiration #urban #lights',
        location: 'Downtown Arts District',

        likesCount: 78,
        commentsCount: 15,
        viewsCount: 345
      },
      {
        author: createdUsers[4]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1080&h=1080&fit=crop',
        aspectRatio: '1:1',
        caption: 'Serene morning at the lake 🏞️ Sometimes you need to wake up early to catch moments like these. The mist rising from the water, the complete silence... pure magic.\n\n#travel #lake #morning #serenity #nature #reflection #peaceful #wanderlust',
        location: 'Lake Bled, Slovenia',

        likesCount: 124,
        commentsCount: 19,
        viewsCount: 567
      },
      {
        author: createdUsers[5]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1080&fit=crop',
        aspectRatio: '1:1',
        caption: 'Consistency beats perfection 💪 It\'s not about having the perfect workout every day. It\'s about showing up, even when you don\'t feel like it. Small steps lead to big changes.\n\nWhat\'s your fitness goal for this month? 👇\n\n#fitness #motivation #consistency #gym #workout #progress #mindset #health',
        location: 'City Fitness Center',

        likesCount: 89,
        commentsCount: 31,
        viewsCount: 423
      },
      {
        author: createdUsers[2]._id,
        type: 'video',
        mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        aspectRatio: '1.91:1',
        caption: 'Cooking experiment gone RIGHT! 👨‍🍳 Trying out this new pasta technique I learned from my nonna. The secret is in the timing and the love you put into it.\n\nRecipe in my stories! 🍝\n\n#cooking #pasta #italian #recipe #homemade #foodie #chef #kitchen #delicious',
        location: 'Home Kitchen',

        likesCount: 156,
        commentsCount: 28,
        viewsCount: 612
      },
      {
        author: createdUsers[0]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&h=1080&fit=crop',
        aspectRatio: '1:1',
        caption: 'Chasing waterfalls and finding peace 💫 There\'s something magical about the sound of rushing water and the mist on your face. This hidden gem was worth every step of the hike.\n\n#waterfall #nature #hiking #adventure #hidden #peaceful #sound #mist',
        location: 'Hidden Falls Trail',

        likesCount: 67,
        commentsCount: 9,
        viewsCount: 298
      },
      {
        author: createdUsers[2]._id,
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1080&h=1080&fit=crop',
        aspectRatio: '1:1',
        caption: 'Fresh pasta, made with love ❤️ Sunday tradition: making everything from scratch. The smell of garlic, basil, and simmering tomatoes filling the kitchen... pure happiness.\n\nWhat\'s your favorite comfort food?\n\n#pasta #homemade #sunday #tradition #comfort #italian #fresh #love',
        location: 'Home Kitchen',

        likesCount: 112,
        commentsCount: 18,
        viewsCount: 445
      }
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log('Created posts:', createdPosts.length);

    // Update user post counts
    for (let user of createdUsers) {
      const userPostCount = createdPosts.filter(post => post.author.toString() === user._id.toString()).length;
      await User.findByIdAndUpdate(user._id, { postsCount: userPostCount });
    }

    // Create sample reels (video posts) - Expanded collection
    const reels = [
      {
        user: createdUsers[4]._id,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1080&h=1920&fit=crop',
        duration: 15,
        caption: 'Quick travel tip: Always pack light and pack smart! ✈️ #traveltips #packing #adventure',
        audioInfo: {
          title: 'Original Audio',
          artist: 'sarah_williams'
        },
        views: 1234,
        shares: 12
      },
      {
        user: createdUsers[5]._id,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1080&h=1920&fit=crop',
        duration: 30,
        caption: '30-second full body workout you can do anywhere! 💪 #fitness #workout #quickworkout',
        audioInfo: {
          title: 'Motivational Beat',
          artist: 'FitnessBeats'
        },
        views: 2345,
        shares: 23
      },
      {
        user: createdUsers[1]._id,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&h=1920&fit=crop',
        duration: 20,
        caption: 'The forest is calling... 🌲 Who else needs this peaceful energy today?',
        audioInfo: {
          title: 'Nature Sounds',
          artist: 'NaturalWorld'
        },
        views: 987,
        shares: 8
      },
      {
        user: createdUsers[2]._id,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1080&h=1920&fit=crop',
        duration: 25,
        caption: 'Cooking hack that will change your life! 🍳 Who knew making pasta could be this easy?',
        audioInfo: {
          title: 'Kitchen Vibes',
          artist: 'CookingChannel'
        },
        views: 3456,
        shares: 34
      },
      {
        user: createdUsers[0]._id,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1920&fit=crop',
        duration: 18,
        caption: 'Mountain sunset time-lapse ⛰️ Nature never ceases to amaze me',
        audioInfo: {
          title: 'Cinematic Ambient',
          artist: 'MountainEcho'
        },
        views: 5678,
        shares: 56
      },
      {
        user: createdUsers[3]._id,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1080&h=1920&fit=crop',
        duration: 22,
        caption: 'City life aesthetic 🌃 These nights hit different when you\'re living your dreams',
        audioInfo: {
          title: 'Urban Nights',
          artist: 'CityBeats'
        },
        views: 4321,
        shares: 43
      },
      {
        user: createdUsers[4]._id,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1080&h=1920&fit=crop',
        duration: 35,
        caption: 'Travel vlog from my latest adventure! ✈️ Can\'t wait to show you more',
        audioInfo: {
          title: 'Adventure Awaits',
          artist: 'TravelVibes'
        },
        views: 2109,
        shares: 21
      },
      {
        user: createdUsers[5]._id,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1080&h=1920&fit=crop',
        duration: 28,
        caption: 'HIIT workout for busy mornings! 🔥 No equipment needed - let\'s get sweaty!',
        audioInfo: {
          title: 'Pump It Up',
          artist: 'FitnessFuel'
        },
        views: 6789,
        shares: 67
      },
      {
        user: createdUsers[1]._id,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1080&h=1920&fit=crop',
        duration: 14,
        caption: 'Peaceful forest sounds for your soul 🌿 Take a moment to breathe',
        audioInfo: {
          title: 'Forest Meditation',
          artist: 'NatureSounds'
        },
        views: 1876,
        shares: 18
      },
      {
        user: createdUsers[2]._id,
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1080&h=1920&fit=crop',
        duration: 31,
        caption: 'Secret ingredient revealed! 🤫 This will make your dishes restaurant quality',
        audioInfo: {
          title: 'Chef\'s Special',
          artist: 'CulinaryArts'
        },
        views: 3210,
        shares: 32
      }
    ];

    const createdReels = await Reel.insertMany(reels);
    console.log('Created reels:', createdReels.length);

    // Create sample stories
    const stories = [
      {
        author: createdUsers[0]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1920&fit=crop',
        mediaType: 'image',
        duration: 5,
        caption: 'Beautiful morning vibes ☀️',
        viewsCount: 123,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      },
      {
        author: createdUsers[1]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&h=1920&fit=crop',
        mediaType: 'image',
        duration: 5,
        caption: 'Forest therapy session 🌿',
        viewsCount: 89,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        author: createdUsers[2]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1080&h=1920&fit=crop',
        mediaType: 'image',
        duration: 5,
        caption: 'Pizza prep time! 🍕',
        viewsCount: 156,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        author: createdUsers[4]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1080&h=1920&fit=crop',
        mediaType: 'image',
        duration: 5,
        caption: 'Lake morning magic ✨',
        viewsCount: 234,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    ];

    const createdStories = await Story.insertMany(stories);
    console.log('Created stories:', createdStories.length);

    // Create some sample comments for posts
    const sampleComments = [
      { text: 'Absolutely stunning! 😍', author: createdUsers[1]._id },
      { text: 'This is amazing! Where exactly is this?', author: createdUsers[2]._id },
      { text: 'Goals! 🔥', author: createdUsers[3]._id },
      { text: 'Beautiful shot! 📸', author: createdUsers[4]._id },
      { text: 'Love this! 💕', author: createdUsers[5]._id },
      { text: 'Incredible view!', author: createdUsers[0]._id },
      { text: 'This makes me want to travel more! ✈️', author: createdUsers[1]._id },
      { text: 'Perfect timing for this shot!', author: createdUsers[2]._id }
    ];

    // Add comments to posts
    for (let i = 0; i < createdPosts.length; i++) {
      const post = createdPosts[i];
      const numComments = Math.floor(Math.random() * 4) + 1; // 1-4 comments per post
      const postComments = [];
      
      for (let j = 0; j < numComments; j++) {
        const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        postComments.push({
          text: randomComment.text,
          author: randomComment.author,
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Random time in last 24h
        });
      }
      
      await Post.findByIdAndUpdate(post._id, {
        comments: postComments,
        commentsCount: postComments.length
      });
    }

    console.log('Added comments to posts');

    // Create follow relationships (mock some user relationships)
    await User.findByIdAndUpdate(createdUsers[0]._id, {
      following: [createdUsers[1]._id, createdUsers[2]._id, createdUsers[4]._id],
      followingCount: 3
    });

    await User.findByIdAndUpdate(createdUsers[1]._id, {
      followers: [createdUsers[0]._id],
      following: [createdUsers[2]._id, createdUsers[3]._id],
      followingCount: 2
    });

    await User.findByIdAndUpdate(createdUsers[2]._id, {
      followers: [createdUsers[0]._id, createdUsers[1]._id],
      following: [createdUsers[3]._id],
      followingCount: 1
    });

    console.log('Created user relationships');

    console.log('Instagram seed data created successfully!');
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdPosts.length} posts`);
    console.log(`Created ${createdReels.length} reels`);
    console.log(`Created ${createdStories.length} stories`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding Instagram data:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedInstagramData();
}

module.exports = seedInstagramData;