const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventType: {
    type: String,
    enum: ['view_duration', 'interaction', 'search_query'],
    required: true
  },
  // For view duration tracking
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'postType'
  },
  postType: {
    type: String,
    enum: ['Post', 'Reel'],
    required: function() {
      return this.eventType === 'view_duration' || this.eventType === 'interaction';
    }
  },
  durationMs: {
    type: Number,
    required: function() {
      return this.eventType === 'view_duration';
    }
  },
  // For interaction tracking
  actionType: {
    type: String,
    enum: ['like', 'comment', 'save', 'share'],
    required: function() {
      return this.eventType === 'interaction';
    }
  },
  // For search queries
  queryText: {
    type: String,
    required: function() {
      return this.eventType === 'search_query';
    }
  },
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
analyticsEventSchema.index({ userId: 1, eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ postId: 1, eventType: 1 });
analyticsEventSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);