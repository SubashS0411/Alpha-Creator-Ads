const express = require('express');
const router = express.Router();
const {
  trackViewDuration,
  trackInteraction,
  trackSearchQuery,
  getAnalytics
} = require('../controllers/analyticsController');

// POST /api/analytics/view-duration - Track how long user viewed content
router.post('/view-duration', trackViewDuration);

// POST /api/analytics/interaction - Track user interactions (like, comment, save, share)
router.post('/interaction', trackInteraction);

// POST /api/analytics/search - Track search queries
router.post('/search', trackSearchQuery);

// GET /api/analytics - Get analytics data (for admin/analysis)
router.get('/', getAnalytics);

module.exports = router;