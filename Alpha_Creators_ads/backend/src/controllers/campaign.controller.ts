/**
 * Campaign Controller
 */

import { Request, Response, NextFunction } from 'express';
import campaignService from '../services/campaign.service';

class CampaignController {
  /**
   * Create new campaign
   */
  async createCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const campaign = await campaignService.createCampaign(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Campaign created successfully',
        data: { campaign },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get campaigns for user
   */
  async getCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const result = await campaignService.getCampaigns(userId, req.query);

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
   * Get campaign by ID
   */
  async getCampaignById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const campaign = await campaignService.getCampaignById(id, userId);

      res.status(200).json({
        success: true,
        data: { campaign },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update campaign
   */
  async updateCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const campaign = await campaignService.updateCampaign(id, userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Campaign updated successfully',
        data: { campaign },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const result = await campaignService.deleteCampaign(id, userId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update campaign status
   */
  async updateCampaignStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      const { status } = req.body;
      const campaign = await campaignService.updateCampaignStatus(id, userId, status);

      res.status(200).json({
        success: true,
        message: 'Campaign status updated successfully',
        data: { campaign },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const stats = await campaignService.getCampaignStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CampaignController();
