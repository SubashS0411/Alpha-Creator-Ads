const express = require('express');
const router = express.Router();
const {
  getReelsFeed,
  createReel,
  getReel,
  toggleReelLike,
  addReelComment
} = require('../controllers/reelController');

// GET /api/reels/feed - Get reels feed for infinite scroll
router.get('/feed', getReelsFeed);

// POST /api/reels - Create a new reel
router.post('/', createReel);

// GET /api/reels/:id - Get single reel
router.get('/:id', getReel);

// PUT /api/reels/:id/like - Toggle like on a reel
router.put('/:id/like', toggleReelLike);

// POST /api/reels/:id/comment - Add comment to a reel
router.post('/:id/comment', addReelComment);

module.exports = router;