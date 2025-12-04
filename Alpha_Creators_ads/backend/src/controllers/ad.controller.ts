/**
 * Ad Controller
 */

import { Request, Response, NextFunction } from 'express';
import adService from '../services/ad.service';

class AdController {
  /**
   * Create new ad
   */
  async createAd(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const ad = await adService.createAd(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Ad created successfully',
        data: { ad },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ads for user
   */
  async getAds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const result = await adService.getAds(userId, req.query);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ad by ID
   */
  async getAdById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const ad = await adService.getAdById(id, userId);

      res.status(200).json({
        success: true,
        data: { ad },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update ad
   */
  async updateAd(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const ad = await adService.updateAd(id, userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Ad updated successfully',
        data: { ad },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete ad
   */
  async deleteAd(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await adService.deleteAd(id, userId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update ad status
   */
  async updateAdStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const { status } = req.body;
      const ad = await adService.updateAdStatus(id, userId, status);

      res.status(200).json({
        success: true,
        message: 'Ad status updated successfully',
        data: { ad },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate AI ad
   */
  async generateAIAd(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const ad = await adService.generateAIAd(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'AI ad generated successfully',
        data: { ad },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ad performance
   */
  async getAdPerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const performance = await adService.getAdPerformance(id, userId);

      res.status(200).json({
        success: true,
        data: performance,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ads by campaign
   */
  async getAdsByCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { campaignId } = req.params;
      const ads = await adService.getAdsByCampaign(campaignId, userId);

      res.status(200).json({
        success: true,
        data: { ads },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdController();
