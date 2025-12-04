const express = require('express');
const router = express.Router();
const YouTubeComment = require('../models/YouTubeComment');
const YouTubeChannel = require('../models/YouTubeChannel');
const YouTubeVideo = require('../models/YouTubeVideo');

// Get video comments
router.get('/video/:videoId', async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'top' } = req.query;
    const skip = (page - 1) * limit;

    let sortQuery = {};
    if (sortBy === 'top') {
      sortQuery = { likes: -1, createdAt: -1 };
    } else {
      sortQuery = { createdAt: -1 };
    }

    const comments = await YouTubeComment.find({
      videoId: req.params.videoId,
      parentCommentId: null // Only top-level comments
    })
      .populate('channelId', 'name handle avatarUrl verified')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get comment replies
router.get('/:commentId/replies', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const replies = await YouTubeComment.find({
      parentCommentId: req.params.commentId
    })
      .populate('channelId', 'name handle avatarUrl verified')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

// Add comment
router.post('/', async (req, res) => {
  try {
    const { videoId, channelId, content, parentCommentId = null } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const comment = new YouTubeComment({
      videoId,
      channelId,
      content: content.trim(),
      parentCommentId
    });

    await comment.save();

    // Populate the comment with channel info
    const populatedComment = await YouTubeComment.findById(comment._id)
      .populate('channelId', 'name handle avatarUrl verified');

    // Update parent comment reply count if it's a reply
    if (parentCommentId) {
      await YouTubeComment.findByIdAndUpdate(
        parentCommentId,
        { $inc: { replyCount: 1 } }
      );
    } else {
      // Update video comment count if it's a top-level comment
      await YouTubeVideo.findByIdAndUpdate(
        videoId,
        { $inc: { commentCount: 1 } }
      );
    }

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Like/Unlike comment
router.post('/:commentId/like', async (req, res) => {
  try {
    const { action } = req.body; // 'like' or 'unlike'
    const comment = await YouTubeComment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (action === 'like') {
      comment.likes += 1;
    } else if (action === 'unlike') {
      comment.likes = Math.max(0, comment.likes - 1);
    }

    await comment.save();
    res.json({ likes: comment.likes, dislikes: comment.dislikes });
  } catch (error) {
    console.error('Error updating comment likes:', error);
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

// Dislike comment
router.post('/:commentId/dislike', async (req, res) => {
  try {
    const { action } = req.body; // 'dislike' or 'remove_dislike'
    const comment = await YouTubeComment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (action === 'dislike') {
      comment.dislikes += 1;
    } else if (action === 'remove_dislike') {
      comment.dislikes = Math.max(0, comment.dislikes - 1);
    }

    await comment.save();
    res.json({ likes: comment.likes, dislikes: comment.dislikes });
  } catch (error) {
    console.error('Error updating comment dislikes:', error);
    res.status(500).json({ error: 'Failed to update dislikes' });
  }
});

// Pin/Unpin comment (for video owners)
router.post('/:commentId/pin', async (req, res) => {
  try {
    const { action, channelId } = req.body; // 'pin' or 'unpin'
    const comment = await YouTubeComment.findById(req.params.commentId)
      .populate('videoId');

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if the requesting channel owns the video
    if (comment.videoId.channelId.toString() !== channelId) {
      return res.status(403).json({ error: 'Only video owner can pin comments' });
    }

    if (action === 'pin') {
      // Unpin any other pinned comments on this video
      await YouTubeComment.updateMany(
        { videoId: comment.videoId._id, pinned: true },
        { pinned: false }
      );
      comment.pinned = true;
    } else {
      comment.pinned = false;
    }

    await comment.save();
    res.json({ pinned: comment.pinned });
  } catch (error) {
    console.error('Error updating comment pin status:', error);
    res.status(500).json({ error: 'Failed to update pin status' });
  }
});

module.exports = router;