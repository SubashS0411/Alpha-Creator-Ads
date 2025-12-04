const mongoose = require('mongoose');

const youtubeCommentSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YouTubeVideo',
    required: true
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YouTubeChannel',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxLength: 10000
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YouTubeComment',
    default: null // null means it's a top-level comment
  },
  replyCount: {
    type: Number,
    default: 0
  },
  pinned: {
    type: Boolean,
    default: false
  },
  heartedByCreator: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for performance
youtubeCommentSchema.index({ videoId: 1, createdAt: -1 });
youtubeCommentSchema.index({ parentCommentId: 1 });
youtubeCommentSchema.index({ channelId: 1 });

module.exports = mongoose.model('YouTubeComment', youtubeCommentSchema);