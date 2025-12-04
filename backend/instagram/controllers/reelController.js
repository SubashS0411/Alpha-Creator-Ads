const Reel = require('../models/Reel');
const User = require('../models/User');
const AnalyticsEvent = require('../models/AnalyticsEvent');

// Get all reels for the feed (infinite scroll)
const getReelsFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reels = await Reel.find({ isActive: true })
      .populate('user', 'username avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(reels);
  } catch (error) {
    console.error('Error fetching reels:', error);
    res.status(500).json({ error: 'Failed to fetch reels' });
  }
};

// Create a new reel
const createReel = async (req, res) => {
  try {
    const { caption, duration, audioTitle } = req.body;
    const userId = req.body.userId || '6743c123456789012345678a'; // Hardcoded user for no-auth

    // In a real app, you'd handle file upload here
    // For now, we'll use placeholder URLs
    const videoUrl = req.body.videoUrl || '/uploads/videos/sample-reel.mp4';
    const thumbnailUrl = req.body.thumbnailUrl || '/uploads/thumbnails/sample-thumb.jpg';

    const reel = new Reel({
      user: userId,
      videoUrl,
      thumbnailUrl,
      caption: caption || '',
      duration: duration || 15,
      audioInfo: {
        title: audioTitle || 'Original Audio',
        artist: 'User'
      }
    });

    await reel.save();
    await reel.populate('user', 'username avatar');

    res.status(201).json(reel);
  } catch (error) {
    console.error('Error creating reel:', error);
    res.status(500).json({ error: 'Failed to create reel' });
  }
};

// Get single reel
const getReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate('comments.user', 'username avatar');
    
    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    // Increment view count
    reel.views += 1;
    await reel.save();

    res.json(reel);
  } catch (error) {
    console.error('Error fetching reel:', error);
    res.status(500).json({ error: 'Failed to fetch reel' });
  }
};

// Toggle like on a reel
const toggleReelLike = async (req, res) => {
  try {
    const reelId = req.params.id;
    const userId = req.body.userId || '6743c123456789012345678a'; // Hardcoded user for no-auth

    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    const isLiked = reel.likes.includes(userId);
    
    if (isLiked) {
      reel.likes.pull(userId);
    } else {
      reel.likes.push(userId);
    }

    await reel.save();

    // Track interaction
    const analyticsEvent = new AnalyticsEvent({
      userId,
      eventType: 'interaction',
      postId: reelId,
      postType: 'Reel',
      actionType: 'like'
    });
    await analyticsEvent.save();

    res.json({ 
      liked: !isLiked, 
      likesCount: reel.likes.length 
    });
  } catch (error) {
    console.error('Error toggling reel like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

// Add comment to reel
const addReelComment = async (req, res) => {
  try {
    const reelId = req.params.id;
    const { text } = req.body;
    const userId = req.body.userId || '6743c123456789012345678a'; // Hardcoded user for no-auth

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    const comment = {
      user: userId,
      text: text.trim()
    };

    reel.comments.push(comment);
    await reel.save();
    await reel.populate('comments.user', 'username avatar');

    // Track interaction
    const analyticsEvent = new AnalyticsEvent({
      userId,
      eventType: 'interaction',
      postId: reelId,
      postType: 'Reel',
      actionType: 'comment'
    });
    await analyticsEvent.save();

    const newComment = reel.comments[reel.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment to reel:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

module.exports = {
  getReelsFeed,
  createReel,
  getReel,
  toggleReelLike,
  addReelComment
};