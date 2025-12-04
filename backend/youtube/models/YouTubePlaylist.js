const mongoose = require('mongoose');

const youtubePlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 150
  },
  description: {
    type: String,
    maxLength: 5000
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YouTubeChannel',
    required: true
  },
  videos: [{
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'YouTubeVideo',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    position: {
      type: Number,
      required: true
    }
  }],
  thumbnailUrl: String,
  visibility: {
    type: String,
    enum: ['public', 'unlisted', 'private'],
    default: 'private'
  },
  playlistType: {
    type: String,
    enum: ['custom', 'watch_later', 'liked_videos', 'history'],
    default: 'custom'
  },
  totalViews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
youtubePlaylistSchema.index({ channelId: 1 });
youtubePlaylistSchema.index({ playlistType: 1, channelId: 1 });

module.exports = mongoose.model('YouTubePlaylist', youtubePlaylistSchema);