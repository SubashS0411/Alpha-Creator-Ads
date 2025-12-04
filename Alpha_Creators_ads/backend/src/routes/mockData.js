/**
 * Mock Data Routes
 */

import express from 'express';
import {
  getCampaigns,
  getCampaignById,
  getAnalytics,
  getNotifications,
  markNotificationRead
} from '../controllers/mockDataController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All mock data routes require authentication
router.use(authenticate);

// Campaign routes
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:id', getCampaignById);

// Analytics routes
router.get('/analytics', getAnalytics);

// Notification routes
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;
