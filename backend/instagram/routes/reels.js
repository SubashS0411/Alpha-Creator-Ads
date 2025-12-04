const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Import Reel model
let Reel;
try {
  Reel = require('../models/Reel');
} catch (error) {
  try {
    Reel = mongoose.model('Reel');
  } catch (error) {
    const reelSchema = new mongoose.Schema({
      userId: String,
      username: String,
      userProfilePicture: String,
      videoUrl: String,
      thumbnailUrl: String,
      title: String,
      description: String,
      likes: Number,
      comments: Number,
      shares: Number,
      views: Number,
      duration: Number,
      hashtags: [String],
      createdAt: Date
    });
    Reel = mongoose.model('Reel', reelSchema);
  }
}

// Get all reels
router.get('/', async (req, res) => {
  try {
    const reels = await Reel.find({}).sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reels by user
router.get('/user/:username', async (req, res) => {
  try {
    const reels = await Reel.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;