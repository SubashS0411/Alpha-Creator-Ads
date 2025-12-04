const mongoose = require('mongoose');

const youtubeChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100
  },
  handle: {
    type: String,
    required: true,
    unique: true,
    match: /^@[a-zA-Z0-9_]{1,30}$/
  },
  description: {
    type: String,
    maxLength: 1000
  },
  avatarUrl: {
    type: String,
    required: true
  },
  bannerUrl: {
    type: String
  },
  subscriberCount: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  videoCount: {
    type: Number,
    default: 0
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for search and performance
youtubeChannelSchema.index({ name: 'text', description: 'text' });
youtubeChannelSchema.index({ handle: 1 });
youtubeChannelSchema.index({ subscriberCount: -1 });

module.exports = mongoose.model('YouTubeChannel', youtubeChannelSchema);