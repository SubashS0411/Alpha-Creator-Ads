const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  description: {
    type: String,
    maxLength: 5000
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YouTubeChannel',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['All', 'Gaming', 'Music', 'Live', 'Mixes', 'Programming', 'Sports', 'News', 'Comedy', 'Education', 'Technology', 'Food', 'Entertainment'],
    default: 'All'
  },
  tags: [{
    type: String
  }],
  isShort: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['public', 'unlisted', 'private'],
    default: 'public'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  commentCount: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String, // User IDs who liked this video
    default: []
  }],
  dislikedBy: [{
    type: String, // User IDs who disliked this video
    default: []
  }]
}, {
  timestamps: true
});

// Index for better search performance
youtubeVideoSchema.index({ title: 'text', description: 'text', tags: 'text' });
youtubeVideoSchema.index({ category: 1 });
youtubeVideoSchema.index({ channelId: 1 });
youtubeVideoSchema.index({ uploadDate: -1 });
youtubeVideoSchema.index({ views: -1 });

module.exports = mongoose.model('YouTubeVideo', youtubeVideoSchema);