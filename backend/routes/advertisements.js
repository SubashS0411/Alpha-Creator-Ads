const express = require('express');
const Advertisement = require('../models/Advertisement');
const router = express.Router();

// Get advertisements for a specific platform
router.get('/ads/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const { category, userId } = req.query;
    
    // Get active advertisements for the platform
    const ads = await Advertisement.getActiveAdsForPlatform(platform, category);
    
    // Simple random selection for now (can be enhanced with user targeting)
    const randomAds = ads.sort(() => 0.5 - Math.random()).slice(0, 1);
    
    if (randomAds.length === 0) {
      return res.json({ ad: null, message: 'No ads available' });
    }
    
    const selectedAd = randomAds[0];
    
    // Increment impressions
    selectedAd.performance.impressions += 1;
    await selectedAd.save();
    
    res.json({
      ad: {
        id: selectedAd._id,
        title: selectedAd.title,
        description: selectedAd.description,
        videoUrl: selectedAd.videoUrl,
        thumbnailUrl: selectedAd.thumbnailUrl,
        duration: selectedAd.duration,
        advertiser: selectedAd.advertiser,
        adSettings: selectedAd.adSettings,
        skipAfter: selectedAd.adSettings.skipAfter,
        isSkippable: selectedAd.adSettings.isSkippable,
        showShopNow: selectedAd.adSettings.showShopNow,
        shopNowUrl: selectedAd.adSettings.shopNowUrl,
        shopNowText: selectedAd.adSettings.shopNowText
      }
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ error: 'Failed to fetch advertisements' });
  }
});

// Track ad view
router.post('/ads/:adId/view', async (req, res) => {
  try {
    const { adId } = req.params;
    const ad = await Advertisement.findById(adId);
    
    if (!ad) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }
    
    await ad.incrementViews();
    
    res.json({ 
      success: true, 
      views: ad.performance.views 
    });
  } catch (error) {
    console.error('Error tracking ad view:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Track ad click/shop now click
router.post('/ads/:adId/click', async (req, res) => {
  try {
    const { adId } = req.params;
    const { type } = req.body; // 'shop_now', 'advertiser_click', etc.
    
    const ad = await Advertisement.findById(adId);
    
    if (!ad) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }
    
    await ad.incrementClicks();
    
    res.json({ 
      success: true, 
      clicks: ad.performance.clicks,
      clickThroughRate: ad.performance.clickThroughRate 
    });
  } catch (error) {
    console.error('Error tracking ad click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Track ad completion
router.post('/ads/:adId/complete', async (req, res) => {
  try {
    const { adId } = req.params;
    const { watchTime, wasSkipped } = req.body;
    
    const ad = await Advertisement.findById(adId);
    
    if (!ad) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }
    
    // Track completion metrics
    if (!wasSkipped) {
      ad.performance.conversions += 1;
    }
    
    await ad.save();
    
    res.json({ 
      success: true,
      wasSkipped,
      watchTime,
      completions: ad.performance.conversions
    });
  } catch (error) {
    console.error('Error tracking ad completion:', error);
    res.status(500).json({ error: 'Failed to track completion' });
  }
});

// Get advertisement analytics
router.get('/ads/:adId/analytics', async (req, res) => {
  try {
    const { adId } = req.params;
    const ad = await Advertisement.findById(adId);
    
    if (!ad) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }
    
    res.json({
      id: ad._id,
      title: ad.title,
      advertiser: ad.advertiser.name,
      performance: ad.performance,
      budget: ad.budget,
      isActive: ad.scheduling.isActive
    });
  } catch (error) {
    console.error('Error fetching ad analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get all advertisements (admin)
router.get('/ads', async (req, res) => {
  try {
    const { page = 1, limit = 10, platform, category, active } = req.query;
    
    let query = {};
    if (platform) query['placement.platforms'] = platform;
    if (category) query.category = category;
    if (active !== undefined) query['scheduling.isActive'] = active === 'true';
    
    const ads = await Advertisement.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Advertisement.countDocuments(query);
    
    res.json({
      ads,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching all ads:', error);
    res.status(500).json({ error: 'Failed to fetch advertisements' });
  }
});

module.exports = router;