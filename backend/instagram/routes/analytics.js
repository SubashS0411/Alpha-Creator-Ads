const express = require('express');
const router = express.Router();
const AnalyticsEvent = require('../models/AnalyticsEvent');

// Track search queries
router.post('/search', async (req, res) => {
  try {
    const { queryText, userId, sessionId } = req.body;
    
    const analyticsEvent = new AnalyticsEvent({
      userId: userId || null,
      eventType: 'search_query',
      queryText,
      sessionId,
      deviceInfo: {
        userAgent: req.get('User-Agent'),
        platform: req.get('Platform') || 'web'
      },
      ipAddress: req.ip
    });

    await analyticsEvent.save();
    
    res.json({ success: true, message: 'Search tracked successfully' });
  } catch (error) {
    console.error('Error tracking search:', error);
    res.status(500).json({ success: false, message: 'Failed to track search' });
  }
});

// Track user interactions (likes, comments, saves, views)
router.post('/interaction', async (req, res) => {
  try {
    const { postId, actionType, userId, sessionId } = req.body;
    
    const analyticsEvent = new AnalyticsEvent({
      userId: userId || null,
      postId,
      eventType: 'interaction',
      actionType,
      sessionId,
      deviceInfo: {
        userAgent: req.get('User-Agent'),
        platform: req.get('Platform') || 'web'
      },
      ipAddress: req.ip
    });

    await analyticsEvent.save();
    
    res.json({ success: true, message: 'Interaction tracked successfully' });
  } catch (error) {
    console.error('Error tracking interaction:', error);
    res.status(500).json({ success: false, message: 'Failed to track interaction' });
  }
});

// Track view duration (for videos and reels)
router.post('/view-duration', async (req, res) => {
  try {
    const { postId, durationMs, userId, sessionId } = req.body;
    
    // Only track views longer than 1 second
    if (durationMs < 1000) {
      return res.json({ success: true, message: 'View too short to track' });
    }
    
    const analyticsEvent = new AnalyticsEvent({
      userId: userId || null,
      postId,
      eventType: 'view_duration',
      durationMs,
      sessionId,
      deviceInfo: {
        userAgent: req.get('User-Agent'),
        platform: req.get('Platform') || 'web'
      },
      ipAddress: req.ip
    });

    await analyticsEvent.save();
    
    res.json({ success: true, message: 'View duration tracked successfully' });
  } catch (error) {
    console.error('Error tracking view duration:', error);
    res.status(500).json({ success: false, message: 'Failed to track view duration' });
  }
});

// Get analytics data (for admin/dashboard)
router.get('/data', async (req, res) => {
  try {
    const { eventType, startDate, endDate, limit = 100 } = req.query;
    
    let query = {};
    
    if (eventType) {
      query.eventType = eventType;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const events = await AnalyticsEvent
      .find(query)
      .populate('postId', 'caption imageUrl')
      .populate('userId', 'username')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics data' });
  }
});

// Get analytics summary/stats
router.get('/stats', async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    // Aggregate stats
    const stats = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          avgDuration: { 
            $avg: { $ifNull: ['$durationMs', 0] } 
          }
        }
      }
    ]);
    
    // Get popular search queries
    const popularSearches = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'search_query',
          timestamp: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: '$queryText',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Get most engaged posts
    const topPosts = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'interaction',
          postId: { $exists: true },
          timestamp: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: '$postId',
          engagements: { $sum: 1 },
          likes: {
            $sum: {
              $cond: [{ $eq: ['$actionType', 'like'] }, 1, 0]
            }
          },
          comments: {
            $sum: {
              $cond: [{ $eq: ['$actionType', 'comment'] }, 1, 0]
            }
          },
          saves: {
            $sum: {
              $cond: [{ $eq: ['$actionType', 'save'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { engagements: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    res.json({
      success: true,
      data: {
        period,
        stats,
        popularSearches,
        topPosts
      }
    });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics stats' });
  }
});

module.exports = router;