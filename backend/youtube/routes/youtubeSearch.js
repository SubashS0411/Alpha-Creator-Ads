const express = require('express');
const router = express.Router();
const YouTubeVideo = require('../models/YouTubeVideo');
const YouTubeChannel = require('../models/YouTubeChannel');
const YouTubeAnalytics = require('../models/YouTubeAnalytics');

// Search videos and channels
router.get('/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { type = 'all', limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let results = { videos: [], channels: [], totalResults: 0 };

    if (type === 'all' || type === 'videos') {
      // Search videos
      const videos = await YouTubeVideo.find({
        visibility: 'public',
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      })
        .populate('channelId', 'name handle avatarUrl verified')
        .sort({ views: -1, uploadDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      results.videos = videos;
    }

    if (type === 'all' || type === 'channels') {
      // Search channels
      const channels = await YouTubeChannel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { handle: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
        .sort({ subscriberCount: -1 })
        .limit(10);

      results.channels = channels;
    }

    results.totalResults = results.videos.length + results.channels.length;

    res.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get search suggestions/autocomplete
router.get('/suggestions/:query', async (req, res) => {
  try {
    const { query } = req.params;

    // Get top search terms from analytics
    const searchTerms = await YouTubeAnalytics.find({
      sessionType: 'search',
      searchTerm: { $regex: query, $options: 'i' }
    })
      .select('searchTerm')
      .limit(10)
      .sort({ createdAt: -1 });

    // Get video titles that match
    const videoTitles = await YouTubeVideo.find({
      visibility: 'public',
      title: { $regex: query, $options: 'i' }
    })
      .select('title')
      .limit(5)
      .sort({ views: -1 });

    const suggestions = [
      ...searchTerms.map(item => item.searchTerm),
      ...videoTitles.map(item => item.title)
    ];

    // Remove duplicates and limit
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 10);

    res.json(uniqueSuggestions);
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// Get trending searches
router.get('/trending/searches', async (req, res) => {
  try {
    const trendingSearches = await YouTubeAnalytics.aggregate([
      {
        $match: {
          sessionType: 'search',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        }
      },
      {
        $group: {
          _id: '$searchTerm',
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

    res.json(trendingSearches.map(item => item._id));
  } catch (error) {
    console.error('Error getting trending searches:', error);
    res.status(500).json({ error: 'Failed to get trending searches' });
  }
});

module.exports = router;