/**
 * Ad Routes
 */

import { Router } from 'express';
import adController from '../controllers/ad.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createAdSchema,
  updateAdSchema,
  aiGenerateAdSchema,
  getAdsQuerySchema,
} from '../validations/adValidation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Ad routes
router.get('/', validate(getAdsQuerySchema), adController.getAds);
router.post('/', validate(createAdSchema), adController.createAd);
router.post('/generate', validate(aiGenerateAdSchema), adController.generateAIAd);
router.get('/campaign/:campaignId', adController.getAdsByCampaign);
router.get('/:id', adController.getAdById);
router.get('/:id/performance', adController.getAdPerformance);
router.put('/:id', validate(updateAdSchema), adController.updateAd);
router.delete('/:id', adController.deleteAd);
router.patch('/:id/status', adController.updateAdStatus);

export default router;
