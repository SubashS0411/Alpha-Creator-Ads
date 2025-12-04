/**
 * API Routes Index
 */

import express from 'express';
import authRoutes from './auth.js';
import mockDataRoutes from './mockData.js';

const router = express.Router();

/**
 * API Status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Alpha Creator Ads API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Mount route modules
 */
router.use('/auth', authRoutes);
router.use('/data', mockDataRoutes);

export default router;
