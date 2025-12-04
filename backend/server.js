const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./instagram/routes/userRoutes');
const instagramPostRoutes = require('./instagram/routes/postRoutes');
const reelRoutes = require('./instagram/routes/reelRoutes');
const analyticsRoutes = require('./instagram/routes/analyticsRoutes');
const uploadRoutes = require('./instagram/routes/uploadRoutes');
// Instagram API routes
const usersApiRoutes = require('./instagram/routes/users');
const postsApiRoutes = require('./instagram/routes/posts');
const reelsApiRoutes = require('./instagram/routes/reels');
const messagesApiRoutes = require('./instagram/routes/messages');
const newAnalyticsRoutes = require('./instagram/routes/analytics');
// YouTube API routes
const youtubeVideos = require('./youtube/routes/youtubeVideos');
const youtubeChannels = require('./youtube/routes/youtubeChannels');
const youtubeSearch = require('./youtube/routes/youtubeSearch');
const youtubeComments = require('./youtube/routes/youtubeComments');
const youtubeAnalytics = require('./youtube/routes/youtubeAnalytics');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve sample videos and assets statically
app.use('/assests', express.static(path.join(__dirname, '../assests')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', instagramPostRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/analytics', newAnalyticsRoutes);
app.use('/api/media', uploadRoutes);

// New API routes for real data
app.use('/api/db/users', usersApiRoutes);
app.use('/api/db/posts', postsApiRoutes);
app.use('/api/db/reels', reelsApiRoutes);
app.use('/api/db/messages', messagesApiRoutes);

// YouTube API routes
app.use('/api/youtube/videos', youtubeVideos);
app.use('/api/youtube/channels', youtubeChannels);
app.use('/api/youtube/search', youtubeSearch);
app.use('/api/youtube/comments', youtubeComments);
app.use('/api/youtube/analytics', youtubeAnalytics);

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clone';
mongoose.connect(mongoURI)
  .then(() => console.log(`Connected to MongoDB - ${mongoURI.split('/').pop()} database`))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Continuing without database - using mock data for development');
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`YouTube upload endpoint: http://localhost:${PORT}/api/youtube/videos/upload`);
  console.log(`Instagram upload endpoint: http://localhost:${PORT}/api/media/upload`);
});