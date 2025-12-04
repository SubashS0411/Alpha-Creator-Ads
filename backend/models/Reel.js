const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  author: {
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
    maxlength: 2200
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  audioName: {
    type: String,
    default: 'Original Audio'
  },
  audioUrl: {
    type: String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    text: {
      type: String,
      required: true,
      maxlength: 500
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  hashtags: [String],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Virtual for likes count
reelSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
reelSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Ensure virtual fields are serialized
reelSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Reel', reelSchema);