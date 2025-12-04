const express = require('express');
const router = express.Router();
const { getFeed, createPost, toggleLike, addComment, getPost, searchPosts } = require('../controllers/postController');

// GET /api/posts/search - Search posts
router.get('/search', searchPosts);

// GET /api/posts/feed - Get feed posts
router.get('/feed', getFeed);

// POST /api/posts - Create a new post
router.post('/', createPost);

// GET /api/posts/:id - Get single post
router.get('/:id', getPost);

// PUT /api/posts/:id/like - Toggle like on a post
router.put('/:id/like', toggleLike);

// POST /api/posts/:id/comment - Add comment to a post
router.post('/:id/comment', addComment);

module.exports = router;