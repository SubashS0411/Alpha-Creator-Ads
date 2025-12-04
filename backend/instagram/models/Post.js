const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'carousel'],
    default: 'image'
  },
  mediaUrl: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String // For backward compatibility
  },
  thumbnailUrl: {
    type: String // For video posts
  },
  duration: {
    type: Number // Duration in seconds for video posts
  },
  aspectRatio: {
    type: String,
    enum: ['1:1', '4:5', '1.91:1', '9:16'],
    default: '1:1'
  },
  caption: {
    type: String,
    trim: true,
    maxlength: 2200
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema]
}, {
  timestamps: true
});

// Virtual for likes count
postSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
postSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Ensure virtual fields are serialized
postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);