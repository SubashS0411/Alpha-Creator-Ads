const AnalyticsEvent = require('../models/AnalyticsEvent');

// Track view duration for posts/reels
const trackViewDuration = async (req, res) => {
  try {
    const { postId, postType, durationMs } = req.body;
    const userId = req.body.userId || '6743c123456789012345678a'; // Hardcoded user for no-auth

    const analyticsEvent = new AnalyticsEvent({
      userId,
      eventType: 'view_duration',
      postId,
      postType,
      durationMs
    });

    await analyticsEvent.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error tracking view duration:', error);
    res.status(500).json({ error: 'Failed to track view duration' });
  }
};

// Track user interactions (like, comment, save, share)
const trackInteraction = async (req, res) => {
  try {
    const { postId, postType, actionType } = req.body;
    const userId = req.body.userId || '6743c123456789012345678a'; // Hardcoded user for no-auth

    const analyticsEvent = new AnalyticsEvent({
      userId,
      eventType: 'interaction',
      postId,
      postType,
      actionType
    });

    await analyticsEvent.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error tracking interaction:', error);
    res.status(500).json({ error: 'Failed to track interaction' });
  }
};

// Track search queries
const trackSearchQuery = async (req, res) => {
  try {
    const { queryText } = req.body;
    const userId = req.body.userId || '6743c123456789012345678a'; // Hardcoded user for no-auth

    const analyticsEvent = new AnalyticsEvent({
      userId,
      eventType: 'search_query',
      queryText
    });

    await analyticsEvent.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error tracking search query:', error);
    res.status(500).json({ error: 'Failed to track search query' });
  }
};

// Get analytics data (for admin/analysis)
const getAnalytics = async (req, res) => {
  try {
    const { eventType, startDate, endDate, limit = 100 } = req.query;
    
    let query = {};
    if (eventType) query.eventType = eventType;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const analytics = await AnalyticsEvent.find(query)
      .populate('userId', 'username')
      .populate('postId')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

module.exports = {
  trackViewDuration,
  trackInteraction,
  trackSearchQuery,
  getAnalytics
};