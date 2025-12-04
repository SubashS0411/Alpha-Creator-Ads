const express = require('express');
const router = express.Router();
const YouTubeAnalytics = require('../models/YouTubeAnalytics');
const YouTubeVideo = require('../models/YouTubeVideo');
const YouTubeChannel = require('../models/YouTubeChannel');

// Track watch session start
router.post('/watch/start', async (req, res) => {
  try {
    const { userId, videoId, channelId, source = 'unknown', category } = req.body;

    const analytics = new YouTubeAnalytics({
      userId,
      videoId,
      channelId,
      sessionType: 'watch',
      source,
      category,
      startTime: new Date()
    });

    await analytics.save();
    res.json({ sessionId: analytics._id });
  } catch (error) {
    console.error('Error starting watch session:', error);
    res.status(500).json({ error: 'Failed to start watch session' });
  }
});

// Track watch session end
router.post('/watch/end', async (req, res) => {
  try {
    const { sessionId, pausedDuration = 0, actualWatchDuration = 0 } = req.body;

    const session = await YouTubeAnalytics.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.endTime = new Date();
    session.pausedDuration = pausedDuration;
    session.actualWatchDuration = actualWatchDuration;

    // Get video duration to calculate if completed
    const video = await YouTubeVideo.findById(session.videoId);
    if (video) {
      session.completed = actualWatchDuration >= (video.duration * 0.9);
    }

    await session.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error ending watch session:', error);
    res.status(500).json({ error: 'Failed to end watch session' });
  }
});

// Track interactions (like, dislike, subscribe, etc.)
router.post('/interaction', async (req, res) => {
  try {
    const { 
      userId, 
      videoId, 
      channelId, 
      interactionType,
      interactionValue,
      source = 'unknown' 
    } = req.body;

    const analytics = new YouTubeAnalytics({
      userId,
      videoId,
      channelId,
      sessionType: 'interaction',
      interactionType,
      interactionValue,
      source
    });

    await analytics.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking interaction:', error);
    res.status(500).json({ error: 'Failed to track interaction' });
  }
});

// Track search
router.post('/search', async (req, res) => {
  try {
    const { userId, searchTerm, searchResultPosition } = req.body;

    const analytics = new YouTubeAnalytics({
      userId,
      sessionType: 'search',
      searchTerm,
      searchResultPosition
    });

    await analytics.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking search:', error);
    res.status(500).json({ error: 'Failed to track search' });
  }
});

// Get user analytics summary
router.get('/user/:userId/summary', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total watch time
    const totalWatchTime = await YouTubeAnalytics.aggregate([
      {
        $match: {
          userId,
          sessionType: 'watch',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalTime: { $sum: '$actualWatchDuration' },
          totalSessions: { $sum: 1 },
          completedSessions: { 
            $sum: { $cond: ['$completed', 1, 0] } 
          }
        }
      }
    ]);

    // Most watched categories
    const topCategories = await YouTubeAnalytics.aggregate([
      {
        $match: {
          userId,
          sessionType: 'watch',
          createdAt: { $gte: startDate },
          category: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalTime: { $sum: '$actualWatchDuration' }
        }
      },
      {
        $sort: { totalTime: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Most watched channels
    const topChannels = await YouTubeAnalytics.aggregate([
      {
        $match: {
          userId,
          sessionType: 'watch',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$channelId',
          count: { $sum: 1 },
          totalTime: { $sum: '$actualWatchDuration' }
        }
      },
      {
        $sort: { totalTime: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'youtubechannels',
          localField: '_id',
          foreignField: '_id',
          as: 'channel'
        }
      },
      {
        $unwind: '$channel'
      },
      {
        $project: {
          channelName: '$channel.name',
          channelHandle: '$channel.handle',
          count: 1,
          totalTime: 1
        }
      }
    ]);

    const summary = {
      totalWatchTime: totalWatchTime[0]?.totalTime || 0,
      totalSessions: totalWatchTime[0]?.totalSessions || 0,
      completedSessions: totalWatchTime[0]?.completedSessions || 0,
      topCategories,
      topChannels,
      period: `${days} days`
    };

    res.json(summary);
  } catch (error) {
    console.error('Error getting user analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Get watch history
router.get('/user/:userId/history', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const history = await YouTubeAnalytics.find({
      userId,
      sessionType: 'watch'
    })
      .populate('videoId', 'title thumbnailUrl duration views')
      .populate('channelId', 'name handle avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(history);
  } catch (error) {
    console.error('Error getting watch history:', error);
    res.status(500).json({ error: 'Failed to get watch history' });
  }
});

// Get user watch history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    const history = await YouTubeAnalytics.find({
      userId,
      sessionType: 'watch',
      endTime: { $exists: true }
    })
      .populate('videoId', 'title thumbnailUrl channelId duration')
      .populate({
        path: 'videoId',
        populate: {
          path: 'channelId',
          select: 'name handle avatarUrl'
        }
      })
      .sort({ startTime: -1 })
      .limit(parseInt(limit));

    // Transform data to include watchedAt timestamp
    const historyData = history.map(session => ({
      videoId: session.videoId,
      watchedAt: session.startTime,
      watchDuration: session.actualWatchDuration || 0,
      completed: session.completed || false
    }));

    res.json(historyData);
  } catch (error) {
    console.error('Error fetching watch history:', error);
    res.status(500).json({ error: 'Failed to fetch watch history' });
  }
});

// Get user analytics stats
router.get('/user-stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get total watch time and video count
    const watchStats = await YouTubeAnalytics.aggregate([
      {
        $match: {
          userId,
          sessionType: 'watch',
          endTime: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalWatchTime: { $sum: '$actualWatchDuration' },
          videosWatched: { $sum: 1 },
          avgWatchTime: { $avg: '$actualWatchDuration' }
        }
      }
    ]);

    // Get favorite categories
    const categoryStats = await YouTubeAnalytics.aggregate([
      {
        $match: {
          userId,
          sessionType: 'watch',
          endTime: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get peak activity hours
    const hourlyStats = await YouTubeAnalytics.aggregate([
      {
        $match: {
          userId,
          sessionType: 'watch',
          startTime: { $exists: true }
        }
      },
      {
        $group: {
          _id: { $hour: '$startTime' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 3
      }
    ]);

    const stats = watchStats[0] || {
      totalWatchTime: 0,
      videosWatched: 0,
      avgWatchTime: 0
    };

    const favoriteCategories = categoryStats.map(cat => ({
      name: cat._id || 'Uncategorized',
      count: cat.count
    }));

    const peakHours = hourlyStats.map(hour => hour._id);

    res.json({
      totalWatchTime: Math.round(stats.totalWatchTime || 0),
      videosWatched: stats.videosWatched || 0,
      avgWatchTime: Math.round(stats.avgWatchTime || 0),
      favoriteCategories,
      peakHours
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

module.exports = router;