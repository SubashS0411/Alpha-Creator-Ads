const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const YouTubeVideo = require('../models/YouTubeVideo');
const YouTubeChannel = require('../models/YouTubeChannel');
const YouTubeComment = require('../models/YouTubeComment');
const YouTubeAnalytics = require('../models/YouTubeAnalytics');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && id.length === 24;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'youtube-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Get home feed videos with category filter
router.get('/home', async (req, res) => {
  try {
    const { category = 'All', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = { visibility: 'public', isShort: false };
    if (category !== 'All') {
      query.category = category;
    }

    const videos = await YouTubeVideo.find(query)
      .populate('channelId', 'name handle avatarUrl subscriberCount verified')
      .sort({ uploadDate: -1, views: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(videos);
  } catch (error) {
    console.error('Error fetching home videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get shorts feed
router.get('/shorts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const shorts = await YouTubeVideo.find({ 
      visibility: 'public', 
      isShort: true 
    })
      .populate('channelId', 'name handle avatarUrl subscriberCount verified')
      .sort({ uploadDate: -1, views: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(shorts);
  } catch (error) {
    console.error('Error fetching shorts:', error);
    res.status(500).json({ error: 'Failed to fetch shorts' });
  }
});

// Get single video details
router.get('/:videoId', async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query params if provided
    
    // Check if videoId is valid ObjectId
    if (!isValidObjectId(req.params.videoId)) {
      console.log(`Invalid video ID: ${req.params.videoId}, returning empty response`);
      return res.status(200).json(null);
    }

    const video = await YouTubeVideo.findById(req.params.videoId)
      .populate('channelId', 'name handle avatarUrl subscriberCount verified description');

    if (!video) {
      console.log(`Video not found: ${req.params.videoId}, returning empty response`);
      return res.status(200).json(null);
    }

    // Increment view count
    video.views += 1;
    await video.save();

    // Add user interaction status if userId provided
    const videoData = video.toObject();
    if (userId) {
      videoData.isLikedByUser = video.likedBy && video.likedBy.includes(userId);
      videoData.isDislikedByUser = video.dislikedBy && video.dislikedBy.includes(userId);
    }

    res.json(videoData);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// Get video recommendations
router.get('/:videoId/recommendations', async (req, res) => {
  try {
    // Check if videoId is valid ObjectId
    if (!isValidObjectId(req.params.videoId)) {
      console.log(`Invalid video ID for recommendations: ${req.params.videoId}, returning empty array`);
      return res.status(200).json([]);
    }

    const currentVideo = await YouTubeVideo.findById(req.params.videoId);
    if (!currentVideo) {
      console.log(`Video not found for recommendations: ${req.params.videoId}, returning empty array`);
      return res.status(200).json([]);
    }

    const recommendations = await YouTubeVideo.find({
      _id: { $ne: req.params.videoId },
      visibility: 'public',
      $or: [
        { category: currentVideo.category },
        { tags: { $in: currentVideo.tags } },
        { channelId: currentVideo.channelId }
      ]
    })
      .populate('channelId', 'name handle avatarUrl verified')
      .sort({ views: -1 })
      .limit(20);

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Like/Unlike video
router.post('/:videoId/like', async (req, res) => {
  try {
    const { action, userId } = req.body; // 'like' or 'unlike'
    const video = await YouTubeVideo.findById(req.params.videoId);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Initialize user interactions arrays if they don't exist
    if (!video.likedBy) video.likedBy = [];
    if (!video.dislikedBy) video.dislikedBy = [];

    const userIndex = video.likedBy.indexOf(userId);
    const dislikeIndex = video.dislikedBy.indexOf(userId);

    if (action === 'like') {
      if (userIndex === -1) {
        // User hasn't liked yet, add like
        video.likedBy.push(userId);
        video.likes = Math.max(0, video.likes + 1);
        // Remove from disliked if previously disliked
        if (dislikeIndex !== -1) {
          video.dislikedBy.splice(dislikeIndex, 1);
          video.dislikes = Math.max(0, video.dislikes - 1);
        }
      }
    } else if (action === 'unlike') {
      if (userIndex !== -1) {
        // User has liked, remove like
        video.likedBy.splice(userIndex, 1);
        video.likes = Math.max(0, video.likes - 1);
      }
    }

    await video.save();
    res.json({ 
      success: true,
      likes: video.likes, 
      dislikes: video.dislikes,
      action: action
    });
  } catch (error) {
    console.error('Error updating video likes:', error);
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

// Dislike/Remove dislike video
router.post('/:videoId/dislike', async (req, res) => {
  try {
    const { action, userId } = req.body; // 'dislike' or 'undislike'
    const video = await YouTubeVideo.findById(req.params.videoId);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Initialize user interactions arrays if they don't exist
    if (!video.likedBy) video.likedBy = [];
    if (!video.dislikedBy) video.dislikedBy = [];

    const userIndex = video.dislikedBy.indexOf(userId);
    const likeIndex = video.likedBy.indexOf(userId);

    if (action === 'dislike') {
      if (userIndex === -1) {
        // User hasn't disliked yet, add dislike
        video.dislikedBy.push(userId);
        video.dislikes = Math.max(0, video.dislikes + 1);
        // Remove from liked if previously liked
        if (likeIndex !== -1) {
          video.likedBy.splice(likeIndex, 1);
          video.likes = Math.max(0, video.likes - 1);
        }
      }
    } else if (action === 'undislike') {
      if (userIndex !== -1) {
        // User has disliked, remove dislike
        video.dislikedBy.splice(userIndex, 1);
        video.dislikes = Math.max(0, video.dislikes - 1);
      }
    }

    await video.save();
    res.json({ 
      success: true,
      likes: video.likes, 
      dislikes: video.dislikes,
      action: action
    });
  } catch (error) {
    console.error('Error updating video dislikes:', error);
    res.status(500).json({ error: 'Failed to update dislikes' });
  }
});

// Upload new video
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { title, description, isShort, channelId, category, tags, visibility } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Get video file path relative to uploads directory
    const videoPath = `/uploads/videos/${req.file.filename}`;
    
    // Generate a simple thumbnail (in production, extract frame from video)
    const thumbnailUrl = `https://via.placeholder.com/480x270/FF0000/FFFFFF?text=${encodeURIComponent(title.substring(0, 20))}`;
    
    // Create new video document
    const newVideo = new YouTubeVideo({
      title: title,
      description: description,
      videoUrl: videoPath,
      thumbnailUrl: thumbnailUrl,
      channelId: channelId,
      duration: isShort === 'true' ? Math.floor(Math.random() * 60) + 15 : Math.floor(Math.random() * 600) + 60,
      views: 0,
      likes: 0,
      dislikes: 0,
      commentCount: 0,
      category: category,
      tags: JSON.parse(tags || '[]'),
      visibility: visibility,
      isShort: isShort === 'true',
      uploadDate: new Date()
    });

    const savedVideo = await newVideo.save();
    res.json({ 
      success: true, 
      message: 'Video uploaded successfully',
      video: savedVideo
    });

  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Get liked videos for a user
router.get('/user/:userId/liked', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const likedVideos = await YouTubeVideo.find({ 
      likedBy: userId,
      visibility: 'public'
    })
      .populate('channelId', 'name handle avatarUrl subscriberCount verified')
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(likedVideos);
  } catch (error) {
    console.error('Error fetching liked videos:', error);
    res.status(500).json({ error: 'Failed to fetch liked videos' });
  }
});

// Get disliked videos for a user
router.get('/user/:userId/disliked', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const dislikedVideos = await YouTubeVideo.find({ 
      dislikedBy: userId,
      visibility: 'public'
    })
      .populate('channelId', 'name handle avatarUrl subscriberCount verified')
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(dislikedVideos);
  } catch (error) {
    console.error('Error fetching disliked videos:', error);
    res.status(500).json({ error: 'Failed to fetch disliked videos' });
  }
});

module.exports = router;