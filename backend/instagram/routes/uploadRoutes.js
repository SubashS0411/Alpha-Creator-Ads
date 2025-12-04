const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const Post = require('../models/Post');
const Reel = require('../models/Reel');
const path = require('path');

// Upload media files (images/videos)
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { caption, location, type, duration, audioTitle } = req.body;
    const userId = req.body.userId || '6743c123456789012345678a'; // Hardcoded user for no-auth

    const mediaUrl = `/uploads/${req.file.mimetype.startsWith('video/') ? 'videos' : 'images'}/${req.file.filename}`;
    const isVideo = req.file.mimetype.startsWith('video/');

    if (type === 'reel' || (isVideo && !type)) {
      // Create a reel
      const reel = new Reel({
        user: userId,
        videoUrl: mediaUrl,
        thumbnailUrl: mediaUrl, // In real app, generate thumbnail
        caption: caption || '',
        duration: duration || 15,
        audioInfo: {
          title: audioTitle || 'Original Audio',
          artist: 'User'
        }
      });

      await reel.save();
      await reel.populate('user', 'username avatar');
      
      res.status(201).json({ 
        type: 'reel',
        data: reel,
        mediaUrl 
      });
    } else {
      // Create a regular post
      const post = new Post({
        author: userId,
        type: isVideo ? 'video' : 'image',
        mediaUrl,
        caption: caption || '',
        location: location || '',
        aspectRatio: isVideo ? '9:16' : '1:1',
        duration: isVideo ? (duration || 15) : undefined,
        thumbnailUrl: isVideo ? mediaUrl : undefined
      });

      await post.save();
      await post.populate('author', 'username fullName profilePictureUrl');

      res.status(201).json({
        type: 'post', 
        data: post,
        mediaUrl
      });
    }
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
};

// Single file upload
router.post('/upload', upload.single('media'), uploadMedia);

module.exports = router;