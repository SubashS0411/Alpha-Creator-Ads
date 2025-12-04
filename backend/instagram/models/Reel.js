const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // Duration in seconds
    required: true
  },
  audioInfo: {
    title: {
      type: String,
      default: 'Original Audio'
    },
    artist: {
      type: String,
      default: ''
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
reelSchema.index({ createdAt: -1 });
reelSchema.index({ user: 1 });
reelSchema.index({ views: -1 });

module.exports = mongoose.model('Reel', reelSchema);