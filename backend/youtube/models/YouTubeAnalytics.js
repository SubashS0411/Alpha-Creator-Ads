const mongoose = require('mongoose');

const youtubeAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  sessionType: {
    type: String,
    enum: ['watch', 'short', 'search', 'interaction'],
    required: true
  },
  // Watch Session specific fields
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  pausedDuration: {
    type: Number, // in seconds
    default: 0
  },
  actualWatchDuration: {
    type: Number, // in seconds
    default: 0
  },
  completed: {
    type: Boolean,
    default: false // true if watched >90% of video
  },
  // Interaction fields
  interactionType: {
    type: String,
    enum: ['like', 'dislike', 'subscribe', 'unsubscribe', 'comment', 'share']
  },
  interactionValue: {
    type: String // 'like', 'unlike', 'dislike', 'undislike', etc.
  },
  source: {
    type: String,
    enum: ['home', 'search', 'watch', 'shorts', 'channel', 'unknown']
  },
  // Search specific fields
  searchTerm: String,
  searchResultPosition: Number, // which result was clicked
  // Category tracking
  category: String,
  // Device/Session info
  deviceType: {
    type: String,
    default: 'mobile'
  },
  location: {
    country: String,
    city: String
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
youtubeAnalyticsSchema.index({ userId: 1, createdAt: -1 });
youtubeAnalyticsSchema.index({ videoId: 1 });
youtubeAnalyticsSchema.index({ channelId: 1 });
youtubeAnalyticsSchema.index({ sessionType: 1 });
youtubeAnalyticsSchema.index({ searchTerm: 'text' });

module.exports = mongoose.model('YouTubeAnalytics', youtubeAnalyticsSchema);