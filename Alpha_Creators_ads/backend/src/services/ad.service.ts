/**
 * Ad Service
 */

import Ad, { IAd } from '../models/Ad';
import Campaign from '../models/Campaign';
import { CreateAdInput, UpdateAdInput, AIGenerateAdInput, GetAdsQuery } from '../validations/adValidation';

interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class AdService {
  /**
   * Create new ad
   */
  async createAd(userId: string, adData: CreateAdInput): Promise<IAd> {
    const { campaignId, ...restData } = adData;

    // Verify campaign exists and belongs to user
    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const ad = new Ad({
      userId,
      campaignId,
      ...restData,
      status: 'draft',
    });

    await ad.save();
    console.log(`✅ Ad created: ${ad.name} (ID: ${ad._id})`);

    return ad;
  }

  /**
   * Get ads for a user
   */
  async getAds(userId: string, query: GetAdsQuery): Promise<PaginationResult<IAd>> {
    const { campaignId, status, type, aiGenerated, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    // Build filter
    const filter: any = { userId };
    if (campaignId) filter.campaignId = campaignId;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (aiGenerated !== undefined) filter.aiGenerated = aiGenerated;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [ads, total] = await Promise.all([
      Ad.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('campaignId', 'name platform'),
      Ad.countDocuments(filter),
    ]);

    return {
      data: ads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single ad by ID
   */
  async getAdById(adId: string, userId: string): Promise<IAd> {
    const ad = await Ad.findOne({ _id: adId, userId }).populate('campaignId', 'name platform');

    if (!ad) {
      throw new Error('Ad not found');
    }

    return ad;
  }

  /**
   * Update ad
   */
  async updateAd(adId: string, userId: string, updateData: UpdateAdInput): Promise<IAd> {
    const ad = await Ad.findOne({ _id: adId, userId });

    if (!ad) {
      throw new Error('Ad not found');
    }

    // Update fields
    Object.assign(ad, updateData);
    await ad.save();

    console.log(`✅ Ad updated: ${ad.name} (ID: ${ad._id})`);
    return ad;
  }

  /**
   * Delete ad
   */
  async deleteAd(adId: string, userId: string): Promise<{ message: string }> {
    const ad = await Ad.findOneAndDelete({ _id: adId, userId });

    if (!ad) {
      throw new Error('Ad not found');
    }

    console.log(`🗑️ Ad deleted: ${ad.name} (ID: ${ad._id})`);
    return { message: 'Ad deleted successfully' };
  }

  /**
   * Update ad status
   */
  async updateAdStatus(adId: string, userId: string, status: 'active' | 'paused' | 'draft'): Promise<IAd> {
    const ad = await Ad.findOne({ _id: adId, userId });

    if (!ad) {
      throw new Error('Ad not found');
    }

    ad.status = status;
    await ad.save();

    console.log(`✅ Ad status updated: ${ad.name} -> ${status}`);
    return ad;
  }

  /**
   * Generate ad using AI
   */
  async generateAIAd(userId: string, aiData: AIGenerateAdInput): Promise<IAd> {
    const { campaignId, prompt, platform, adType, style, tone, targetAudience } = aiData;

    // Verify campaign exists and belongs to user
    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // TODO: Integrate with OpenAI API for actual generation
    // This is a placeholder implementation
    const generatedContent = {
      headline: `AI Generated Headline for ${platform}`,
      description: `This is an AI-generated ad description based on: ${prompt}`,
      callToAction: 'Learn More',
      mediaUrl: 'https://placeholder.com/800x600',
      thumbnailUrl: 'https://placeholder.com/200x150',
    };

    const ad = new Ad({
      userId,
      campaignId,
      name: `AI Ad - ${new Date().toISOString()}`,
      type: adType,
      content: generatedContent,
      aiGenerated: true,
      aiModel: 'gpt-4',
      aiPrompt: prompt,
      status: 'draft',
    });

    await ad.save();
    console.log(`✅ AI Ad generated: ${ad.name} (ID: ${ad._id})`);

    return ad;
  }

  /**
   * Get ad performance metrics
   */
  async getAdPerformance(adId: string, userId: string): Promise<any> {
    const ad = await Ad.findOne({ _id: adId, userId });

    if (!ad) {
      throw new Error('Ad not found');
    }

    const { metrics } = ad;

    // Calculate additional metrics
    const ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
    const conversionRate = metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0;

    return {
      adId: ad._id,
      adName: ad.name,
      metrics: {
        ...metrics,
        ctr,
        conversionRate,
      },
      performance: ad.performance,
    };
  }

  /**
   * Get ads by campaign
   */
  async getAdsByCampaign(campaignId: string, userId: string): Promise<IAd[]> {
    // Verify campaign exists and belongs to user
    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const ads = await Ad.find({ campaignId, userId });
    return ads;
  }
}

export default new AdService();
