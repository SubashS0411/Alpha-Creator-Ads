const express = require('express');
const router = express.Router();
const YouTubeChannel = require('../models/YouTubeChannel');
const YouTubeVideo = require('../models/YouTubeVideo');
const YouTubeSubscription = require('../models/YouTubeSubscription');

// Get channel details
router.get('/:channelId', async (req, res) => {
  try {
    const channel = await YouTubeChannel.findById(req.params.channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    console.error('Error fetching channel:', error);
    res.status(500).json({ error: 'Failed to fetch channel' });
  }
});

// Get channel videos
router.get('/:channelId/videos', async (req, res) => {
  try {
    const { page = 1, limit = 20, type = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = { 
      channelId: req.params.channelId, 
      visibility: 'public' 
    };

    if (type === 'shorts') {
      query.isShort = true;
    } else if (type === 'videos') {
      query.isShort = false;
    }

    const videos = await YouTubeVideo.find(query)
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(videos);
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    res.status(500).json({ error: 'Failed to fetch channel videos' });
  }
});

// Subscribe to channel
router.post('/:channelId/subscribe', async (req, res) => {
  try {
    const { subscriberChannelId } = req.body;

    // Check if already subscribed
    const existingSubscription = await YouTubeSubscription.findOne({
      subscriberId: subscriberChannelId,
      subscribedToId: req.params.channelId
    });

    if (existingSubscription) {
      return res.status(400).json({ error: 'Already subscribed' });
    }

    // Create subscription
    const subscription = new YouTubeSubscription({
      subscriberId: subscriberChannelId,
      subscribedToId: req.params.channelId
    });

    await subscription.save();

    // Update subscriber count
    const channel = await YouTubeChannel.findById(req.params.channelId);
    if (channel) {
      channel.subscriberCount += 1;
      await channel.save();
    }

    res.json({ 
      subscribed: true, 
      subscriberCount: channel ? channel.subscriberCount : null 
    });
  } catch (error) {
    console.error('Error subscribing to channel:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Unsubscribe from channel
router.post('/:channelId/unsubscribe', async (req, res) => {
  try {
    const { subscriberChannelId } = req.body;

    const subscription = await YouTubeSubscription.findOneAndDelete({
      subscriberId: subscriberChannelId,
      subscribedToId: req.params.channelId
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Update subscriber count
    const channel = await YouTubeChannel.findById(req.params.channelId);
    if (channel) {
      channel.subscriberCount = Math.max(0, channel.subscriberCount - 1);
      await channel.save();
    }

    res.json({ 
      subscribed: false, 
      subscriberCount: channel ? channel.subscriberCount : null 
    });
  } catch (error) {
    console.error('Error unsubscribing from channel:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Get user's subscribed channels
router.get('/user/:userId/subscriptions', async (req, res) => {
  try {
    const subscriptions = await YouTubeSubscription.find({
      subscriberId: req.params.userId
    })
      .populate('subscribedToId', 'name handle avatarUrl subscriberCount verified')
      .sort({ createdAt: -1 });

    const channels = subscriptions.map(sub => sub.subscribedToId);
    res.json(channels);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Search channels
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    const channels = await YouTubeChannel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { handle: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
      .sort({ subscriberCount: -1 })
      .limit(parseInt(limit));

    res.json(channels);
  } catch (error) {
    console.error('Error searching channels:', error);
    res.status(500).json({ error: 'Failed to search channels' });
  }
});

module.exports = router;