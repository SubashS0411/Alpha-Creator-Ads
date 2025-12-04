const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Import Post model
let Post;
try {
  Post = require('../models/Post');
} catch (error) {
  try {
    Post = mongoose.model('Post');
  } catch (error) {
    const postSchema = new mongoose.Schema({
      userId: String,
      username: String,
      userProfilePicture: String,
      imageUrl: String,
      caption: String,
      likes: Number,
      comments: Number,
      shares: Number,
      location: String,
      hashtags: [String],
      createdAt: Date
    });
    Post = mongoose.model('Post', postSchema);
  }
}

// Get all posts for home feed
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get posts for explore/search
router.get('/explore', async (req, res) => {
  try {
    // Return posts in random order for explore
    const posts = await Post.aggregate([
      { $sample: { size: 50 } }
    ]);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get posts by user
router.get('/user/:username', async (req, res) => {
  try {
    const posts = await Post.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search posts by hashtag
router.get('/hashtag/:tag', async (req, res) => {
  try {
    const posts = await Post.find({ 
      hashtags: { $regex: req.params.tag, $options: 'i' } 
    }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;