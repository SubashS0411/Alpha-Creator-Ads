const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  getAllUsers, 
  createUser, 
  searchUsers, 
  toggleFollow,
  updateUserProfile 
} = require('../controllers/userController');

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/search - Search users
router.get('/search', searchUsers);

// POST /api/users - Create a new user
router.post('/', createUser);

// POST /api/users/follow - Follow/unfollow user
router.post('/follow', toggleFollow);

// GET /api/users/:id - Get user profile and posts
router.get('/:id', getUserProfile);

// PUT /api/users/:id - Update user profile
router.put('/:id', updateUserProfile);

module.exports = router;