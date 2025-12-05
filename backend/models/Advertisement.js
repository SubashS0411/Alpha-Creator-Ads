const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  description: {
    type: String,
    maxLength: 1000
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
  advertiser: {
    name: {
      type: String,
      required: true
    },
    logoUrl: {
      type: String
    },
    websiteUrl: {
      type: String
    }
  },
  category: {
    type: String,
    enum: ['Technology', 'Fashion', 'Food', 'Automotive', 'Healthcare', 'Education', 'Entertainment', 'Sports', 'Travel', 'Finance'],
    required: true
  },
  tags: [{
    type: String
  }],
  targetAudience: {
    ageRange: {
      min: {
        type: Number,
        default: 13
      },
      max: {
        type: Number,
        default: 65
      }
    },
    interests: [{
      type: String
    }],
    locations: [{
      type: String
    }]
  },
  budget: {
    dailyBudget: {
      type: Number,
      default: 0
    },
    totalBudget: {
      type: Number,
      default: 0
    },
    costPerView: {
      type: Number,
      default: 0.01
    }
  },
  performance: {
    views: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    impressions: {
      type: Number,
      default: 0
    },
    clickThroughRate: {
      type: Number,
      default: 0
    }
  },
  adSettings: {
    skipAfter: {
      type: Number,
      default: 5 // seconds after which skip button appears
    },
    isSkippable: {
      type: Boolean,
      default: true
    },
    showShopNow: {
      type: Boolean,
      default: true
    },
    shopNowUrl: {
      type: String
    },
    shopNowText: {
      type: String,
      default: 'Shop Now'
    }
  },
  scheduling: {
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  placement: {
    platforms: [{
      type: String,
      enum: ['youtube', 'instagram'],
      default: ['youtube']
    }],
    position: {
      type: String,
      enum: ['pre-roll', 'mid-roll', 'post-roll'],
      default: 'pre-roll'
    },
    frequency: {
      type: Number,
      default: 1 // How many times to show per user per day
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
advertisementSchema.index({ 'scheduling.isActive': 1 });
advertisementSchema.index({ 'placement.platforms': 1 });
advertisementSchema.index({ category: 1 });
advertisementSchema.index({ 'targetAudience.interests': 1 });

// Method to increment views
advertisementSchema.methods.incrementViews = function() {
  this.performance.views += 1;
  return this.save();
};

// Method to increment clicks
advertisementSchema.methods.incrementClicks = function() {
  this.performance.clicks += 1;
  this.performance.clickThroughRate = (this.performance.clicks / this.performance.views) * 100;
  return this.save();
};

// Static method to get active ads for platform
advertisementSchema.statics.getActiveAdsForPlatform = function(platform, category = null) {
  const query = {
    'scheduling.isActive': true,
    'placement.platforms': platform,
    'scheduling.startDate': { $lte: new Date() },
    $or: [
      { 'scheduling.endDate': { $gte: new Date() } },
      { 'scheduling.endDate': null }
    ]
  };
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query);
};

module.exports = mongoose.model('Advertisement', advertisementSchema);