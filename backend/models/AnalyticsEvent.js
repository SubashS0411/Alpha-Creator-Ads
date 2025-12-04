const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous tracking
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: false
  },
  eventType: {
    type: String,
    enum: ['view_duration', 'interaction', 'search_query'],
    required: true
  },
  // For view duration events
  durationMs: {
    type: Number,
    required: function() { return this.eventType === 'view_duration'; }
  },
  // For interaction events
  actionType: {
    type: String,
    enum: ['like', 'comment', 'save', 'view', 'share'],
    required: function() { return this.eventType === 'interaction'; }
  },
  // For search events
  queryText: {
    type: String,
    required: function() { return this.eventType === 'search_query'; }
  },
  // Additional context
  deviceInfo: {
    userAgent: String,
    viewport: {
      width: Number,
      height: Number
    },
    platform: String
  },
  sessionId: String,
  ipAddress: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
analyticsEventSchema.index({ eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ userId: 1, timestamp: -1 });
analyticsEventSchema.index({ postId: 1, eventType: 1 });
analyticsEventSchema.index({ timestamp: -1 });

// Check if model already exists
let AnalyticsEvent;
try {
  AnalyticsEvent = mongoose.model('AnalyticsEvent');
} catch (error) {
  AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
}

module.exports = AnalyticsEvent;