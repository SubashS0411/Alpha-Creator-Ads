/**
 * Campaign Routes
 */

import { Router } from 'express';
import campaignController from '../controllers/campaign.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createCampaignSchema,
  updateCampaignSchema,
  getCampaignsQuerySchema,
} from '../validations/campaignValidation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Campaign routes
router.get('/', validate(getCampaignsQuerySchema), campaignController.getCampaigns);
router.post('/', validate(createCampaignSchema), campaignController.createCampaign);
router.get('/stats', campaignController.getCampaignStats);
router.get('/:id', campaignController.getCampaignById);
router.put('/:id', validate(updateCampaignSchema), campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);
router.patch('/:id/status', campaignController.updateCampaignStatus);

export default router;
