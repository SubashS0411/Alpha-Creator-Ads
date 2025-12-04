/**
 * Analytics Routes
 */

import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Analytics routes
router.get('/overview', analyticsController.getUserOverview);
router.get('/platform-comparison', analyticsController.getPlatformComparison);
router.get('/trending', analyticsController.getTrendingMetrics);
router.get('/campaign/:campaignId', analyticsController.getCampaignAnalytics);
router.get('/ad/:adId', analyticsController.getAdAnalytics);

export default router;
