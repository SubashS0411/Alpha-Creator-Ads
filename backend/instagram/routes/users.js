const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Import User model
let User;
try {
  User = require('../models/User');
} catch (error) {
  try {
    User = mongoose.model('User');
  } catch (error) {
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      fullName: String,
      profilePicture: String,
      bio: String,
      followers: Number,
      following: Number,
      posts: Number,
      isVerified: Boolean,
      isPrivate: Boolean,
      createdAt: Date
    });
    User = mongoose.model('User', userSchema);
  }
}

// Get all users for search
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).sort({ followers: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;