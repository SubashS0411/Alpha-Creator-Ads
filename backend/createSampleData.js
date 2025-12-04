// Simple data creation script that uses HTTP requests to the API
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const createSampleData = async () => {
  try {
    console.log('Creating sample users and posts via API...');

    // Sample users data
    const users = [
      {
        username: 'siddahmed',
        fullName: 'Sidd Ahmed',
        bio: 'Travel enthusiast 🌍 | Photography lover 📸',
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'mkce_family',
        fullName: 'MKCE Family',
        bio: 'Official MKCE College page 🎓 | Engineering excellence',
        profilePictureUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=150&h=150&fit=crop&crop=face'
      },
      {
        username: 'nature_lover',
        fullName: 'Nature Explorer',
        bio: 'Exploring the beauty of nature 🌿',
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616c66eb1a8?w=150&h=150&fit=crop&crop=face'
      }
    ];

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      try {
        const response = await axios.post(`${BASE_URL}/users`, userData);
        createdUsers.push(response.data);
        console.log(`Created user: ${userData.username}`);
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
          console.log(`User ${userData.username} already exists, fetching existing user...`);
          // Get all users and find this one
          try {
            const allUsersResponse = await axios.get(`${BASE_URL}/users`);
            const existingUser = allUsersResponse.data.find(u => u.username === userData.username);
            if (existingUser) {
              createdUsers.push(existingUser);
            }
          } catch (getError) {
            console.log(`Could not fetch existing user ${userData.username}:`, getError.message);
          }
        } else {
          console.log(`Failed to create user ${userData.username}:`, error.response?.data?.message || error.message);
        }
      }
    }

    if (createdUsers.length === 0) {
      console.log('No users available to create posts');
      return;
    }

    // Sample posts data
    const posts = [
      {
        author: createdUsers[0]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
        caption: 'Amazing mountain view from today\'s adventure! 🏔️ #nature #mountains #hiking',
        type: 'image'
      },
      {
        author: createdUsers[1]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
        caption: 'Perfect sunset drive today! 🌅🚗 Life is beautiful when you take time to enjoy the little moments.',
        type: 'image'
      },
      {
        author: createdUsers[2]._id,
        mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop',
        caption: 'Lost in the forest, found myself 🌲✨ #forest #nature #peaceful',
        type: 'image'
      }
    ];

    // Create posts
    for (const postData of posts) {
      try {
        const response = await axios.post(`${BASE_URL}/posts`, postData);
        console.log(`Created post: ${postData.caption.substring(0, 30)}...`);
      } catch (error) {
        console.log(`Failed to create post: ${error.response?.data?.message || error.message}`);
      }
    }

    console.log('Sample data creation completed!');

  } catch (error) {
    console.error('Error creating sample data:', error.message);
  }
};

// Run the script
createSampleData();