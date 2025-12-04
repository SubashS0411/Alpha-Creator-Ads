const User = require('../models/User');
const Post = require('../models/Post');

// Get user profile and their posts
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find user and populate posts count
    const user = await User.findById(id).populate('postsCount');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find user's posts
    const posts = await Post.find({ author: id })
      .populate('author', 'username profilePictureUrl')
      .sort({ createdAt: -1 });

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        profilePictureUrl: user.profilePictureUrl,
        website: user.website,
        isVerified: user.isVerified,
        isPrivate: user.isPrivate,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        postsCount: posts.length
      },
      posts
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } }
      ]
    })
    .select('username fullName profilePictureUrl isVerified')
    .limit(20);

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Follow/unfollow user
const toggleFollow = async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    
    if (userId === targetUserId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      user.following = user.following.filter(id => !id.equals(targetUserId));
      targetUser.followers = targetUser.followers.filter(id => !id.equals(userId));
    } else {
      // Follow
      user.following.push(targetUserId);
      targetUser.followers.push(userId);
    }

    await user.save();
    await targetUser.save();

    res.json({ 
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length
    });
  } catch (error) {
    console.error('Error toggling follow:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (for development/testing)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-followers -following');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new user (for development/testing)
const createUser = async (req, res) => {
  try {
    const { username, fullName, email, bio, profilePictureUrl, website } = req.body;
    
    const user = new User({
      username,
      fullName,
      email,
      bio: bio || '',
      profilePictureUrl: profilePictureUrl || 'https://via.placeholder.com/150/000000/FFFFFF/?text=User',
      website: website || ''
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Username or email already exists' });
    } else {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, bio, website, profilePictureUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { fullName, bio, website, profilePictureUrl },
      { new: true, runValidators: true }
    ).select('-followers -following');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  getAllUsers,
  createUser,
  searchUsers,
  toggleFollow,
  updateUserProfile
};