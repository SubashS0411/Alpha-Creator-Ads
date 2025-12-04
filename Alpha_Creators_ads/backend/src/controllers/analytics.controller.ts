/**
 * Analytics Controller
 */

import { Request, Response, NextFunction } from 'express';
import analyticsService from '../services/analytics.service';

class AnalyticsController {
  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { campaignId } = req.params;
      const { startDate, endDate } = req.query;

      const dateRange = {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      };

      const analytics = await analyticsService.getCampaignAnalytics(campaignId, userId, dateRange);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ad analytics
   */
  async getAdAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { adId } = req.params;
      const { startDate, endDate } = req.query;

      const dateRange = {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      };

      const analytics = await analyticsService.getAdAnalytics(adId, userId, dateRange);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user overview
   */
  async getUserOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { startDate, endDate } = req.query;

      const dateRange = {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      };

      const overview = await analyticsService.getUserOverview(userId, dateRange);

      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get platform comparison
   */
  async getPlatformComparison(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { startDate, endDate } = req.query;

      const dateRange = {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      };

      const comparison = await analyticsService.getPlatformComparison(userId, dateRange);

      res.status(200).json({
        success: true,
        data: comparison,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get trending metrics
   */
  async getTrendingMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { startDate, endDate } = req.query;

      const dateRange = {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      };

      const trends = await analyticsService.getTrendingMetrics(userId, dateRange);

      res.status(200).json({
        success: true,
        data: trends,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();
