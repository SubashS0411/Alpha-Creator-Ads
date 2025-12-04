/**
 * Main Router - API v1
 */

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import campaignRoutes from './campaign.routes.js';
import adRoutes from './ad.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/ads', adRoutes);
router.use('/analytics', analyticsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
