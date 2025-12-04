/**
 * Campaign Service
 */

import Campaign, { ICampaign } from '../models/Campaign';
import { CreateCampaignInput, UpdateCampaignInput, GetCampaignsQuery } from '../validations/campaignValidation';

interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class CampaignService {
  /**
   * Create new campaign
   */
  async createCampaign(userId: string, campaignData: CreateCampaignInput): Promise<ICampaign> {
    const campaign = new Campaign({
      userId,
      ...campaignData,
      status: 'draft',
    });

    await campaign.save();
    console.log(`✅ Campaign created: ${campaign.name} (ID: ${campaign._id})`);

    return campaign;
  }

  /**
   * Get campaigns for a user
   */
  async getCampaigns(userId: string, query: GetCampaignsQuery): Promise<PaginationResult<ICampaign>> {
    const { status, platform, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    // Build filter
    const filter: any = { userId };
    if (status) filter.status = status;
    if (platform) filter.platform = platform;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [campaigns, total] = await Promise.all([
      Campaign.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Campaign.countDocuments(filter),
    ]);

    return {
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single campaign by ID
   */
  async getCampaignById(campaignId: string, userId: string): Promise<ICampaign> {
    const campaign = await Campaign.findOne({ _id: campaignId, userId });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    return campaign;
  }

  /**
   * Update campaign
   */
  async updateCampaign(campaignId: string, userId: string, updateData: UpdateCampaignInput): Promise<ICampaign> {
    const campaign = await Campaign.findOne({ _id: campaignId, userId });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Update fields
    Object.assign(campaign, updateData);
    await campaign.save();

    console.log(`✅ Campaign updated: ${campaign.name} (ID: ${campaign._id})`);
    return campaign;
  }

  /**
   * Delete campaign
   */
  async deleteCampaign(campaignId: string, userId: string): Promise<{ message: string }> {
    const campaign = await Campaign.findOneAndDelete({ _id: campaignId, userId });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    console.log(`🗑️ Campaign deleted: ${campaign.name} (ID: ${campaign._id})`);
    return { message: 'Campaign deleted successfully' };
  }

  /**
   * Update campaign status
   */
  async updateCampaignStatus(
    campaignId: string,
    userId: string,
    status: 'active' | 'paused' | 'draft' | 'completed'
  ): Promise<ICampaign> {
    const campaign = await Campaign.findOne({ _id: campaignId, userId });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    campaign.status = status;
    await campaign.save();

    console.log(`✅ Campaign status updated: ${campaign.name} -> ${status}`);
    return campaign;
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(userId: string): Promise<any> {
    const stats = await Campaign.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSpent: { $sum: '$budget.spent' },
          totalImpressions: { $sum: '$metrics.impressions' },
          totalClicks: { $sum: '$metrics.clicks' },
          totalConversions: { $sum: '$metrics.conversions' },
        },
      },
    ]);

    // Calculate overall stats
    const overall = {
      totalCampaigns: 0,
      totalSpent: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      avgCTR: 0,
      avgCPC: 0,
    };

    stats.forEach((stat) => {
      overall.totalCampaigns += stat.count;
      overall.totalSpent += stat.totalSpent;
      overall.totalImpressions += stat.totalImpressions;
      overall.totalClicks += stat.totalClicks;
      overall.totalConversions += stat.totalConversions;
    });

    if (overall.totalImpressions > 0) {
      overall.avgCTR = (overall.totalClicks / overall.totalImpressions) * 100;
    }

    if (overall.totalClicks > 0) {
      overall.avgCPC = overall.totalSpent / overall.totalClicks;
    }

    return {
      byStatus: stats,
      overall,
    };
  }
}

export default new CampaignService();
