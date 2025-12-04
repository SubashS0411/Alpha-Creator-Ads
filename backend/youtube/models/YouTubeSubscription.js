const mongoose = require('mongoose');

const youtubeSubscriptionSchema = new mongoose.Schema({
  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YouTubeChannel',
    required: true
  },
  subscribedToId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YouTubeChannel',
    required: true
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate subscriptions
youtubeSubscriptionSchema.index({ subscriberId: 1, subscribedToId: 1 }, { unique: true });

module.exports = mongoose.model('YouTubeSubscription', youtubeSubscriptionSchema);