/**
 * Analytics Service
 */

import Analytics, { IAnalytics } from '../models/Analytics';
import Campaign from '../models/Campaign';
import Ad from '../models/Ad';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface AnalyticsOverview {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpent: number;
  avgCTR: number;
  avgCPC: number;
  avgCPM: number;
  avgROAS: number;
}

class AnalyticsService {
  /**
   * Record analytics data
   */
  async recordAnalytics(analyticsData: Partial<IAnalytics>): Promise<IAnalytics> {
    const analytics = new Analytics(analyticsData);
    await analytics.save();
    return analytics;
  }

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(campaignId: string, userId: string, dateRange: DateRange): Promise<any> {
    // Verify campaign exists and belongs to user
    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const { startDate, endDate } = dateRange;

    const analytics = await Analytics.find({
      campaignId,
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Aggregate metrics
    const aggregated = {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalSpent: 0,
      avgCTR: 0,
      avgCPC: 0,
      avgCPM: 0,
      demographics: {},
      deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      dailyData: [] as any[],
    };

    analytics.forEach((record) => {
      aggregated.totalImpressions += record.metrics.impressions;
      aggregated.totalClicks += record.metrics.clicks;
      aggregated.totalConversions += record.metrics.conversions;
      aggregated.totalSpent += record.metrics.spend;

      // Device breakdown
      aggregated.deviceBreakdown.desktop += record.deviceBreakdown.desktop;
      aggregated.deviceBreakdown.mobile += record.deviceBreakdown.mobile;
      aggregated.deviceBreakdown.tablet += record.deviceBreakdown.tablet;

      // Daily data point
      aggregated.dailyData.push({
        date: record.date,
        impressions: record.metrics.impressions,
        clicks: record.metrics.clicks,
        conversions: record.metrics.conversions,
        spent: record.metrics.spend,
      });
    });

    // Calculate averages
    if (aggregated.totalImpressions > 0) {
      aggregated.avgCTR = (aggregated.totalClicks / aggregated.totalImpressions) * 100;
      aggregated.avgCPM = (aggregated.totalSpent / aggregated.totalImpressions) * 1000;
    }

    if (aggregated.totalClicks > 0) {
      aggregated.avgCPC = aggregated.totalSpent / aggregated.totalClicks;
    }

    return aggregated;
  }

  /**
   * Get ad analytics
   */
  async getAdAnalytics(adId: string, userId: string, dateRange: DateRange): Promise<any> {
    // Verify ad exists and belongs to user
    const ad = await Ad.findOne({ _id: adId, userId });
    if (!ad) {
      throw new Error('Ad not found');
    }

    const { startDate, endDate } = dateRange;

    const analytics = await Analytics.find({
      adId,
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Aggregate metrics (similar to campaign analytics)
    const aggregated = {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalSpent: 0,
      avgCTR: 0,
      avgCPC: 0,
      avgCPM: 0,
      deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      hourlyData: [] as any[],
      dailyData: [] as any[],
    };

    analytics.forEach((record) => {
      aggregated.totalImpressions += record.metrics.impressions;
      aggregated.totalClicks += record.metrics.clicks;
      aggregated.totalConversions += record.metrics.conversions;
      aggregated.totalSpent += record.metrics.spend;

      aggregated.deviceBreakdown.desktop += record.deviceBreakdown.desktop;
      aggregated.deviceBreakdown.mobile += record.deviceBreakdown.mobile;
      aggregated.deviceBreakdown.tablet += record.deviceBreakdown.tablet;

      aggregated.dailyData.push({
        date: record.date,
        impressions: record.metrics.impressions,
        clicks: record.metrics.clicks,
        conversions: record.metrics.conversions,
        spent: record.metrics.spend,
      });
    });

    if (aggregated.totalImpressions > 0) {
      aggregated.avgCTR = (aggregated.totalClicks / aggregated.totalImpressions) * 100;
      aggregated.avgCPM = (aggregated.totalSpent / aggregated.totalImpressions) * 1000;
    }

    if (aggregated.totalClicks > 0) {
      aggregated.avgCPC = aggregated.totalSpent / aggregated.totalClicks;
    }

    return aggregated;
  }

  /**
   * Get user overview analytics
   */
  async getUserOverview(userId: string, dateRange: DateRange): Promise<AnalyticsOverview> {
    const { startDate, endDate } = dateRange;

    const analytics = await Analytics.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const overview: AnalyticsOverview = {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalSpent: 0,
      avgCTR: 0,
      avgCPC: 0,
      avgCPM: 0,
      avgROAS: 0,
    };

    analytics.forEach((record) => {
      overview.totalImpressions += record.metrics.impressions;
      overview.totalClicks += record.metrics.clicks;
      overview.totalConversions += record.metrics.conversions;
      overview.totalSpent += record.metrics.spend;
    });

    if (overview.totalImpressions > 0) {
      overview.avgCTR = (overview.totalClicks / overview.totalImpressions) * 100;
      overview.avgCPM = (overview.totalSpent / overview.totalImpressions) * 1000;
    }

    if (overview.totalClicks > 0) {
      overview.avgCPC = overview.totalSpent / overview.totalClicks;
    }

    if (overview.totalSpent > 0) {
      // Assuming revenue = conversions * average order value (placeholder)
      const revenue = overview.totalConversions * 50; // Placeholder value
      overview.avgROAS = revenue / overview.totalSpent;
    }

    return overview;
  }

  /**
   * Get platform comparison
   */
  async getPlatformComparison(userId: string, dateRange: DateRange): Promise<any[]> {
    const { startDate, endDate } = dateRange;

    const platformStats = await Analytics.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$platform',
          totalImpressions: { $sum: '$metrics.impressions' },
          totalClicks: { $sum: '$metrics.clicks' },
          totalConversions: { $sum: '$metrics.conversions' },
          totalSpent: { $sum: '$metrics.spent' },
        },
      },
      {
        $project: {
          platform: '$_id',
          totalImpressions: 1,
          totalClicks: 1,
          totalConversions: 1,
          totalSpent: 1,
          ctr: {
            $multiply: [
              { $divide: ['$totalClicks', '$totalImpressions'] },
              100,
            ],
          },
          cpc: {
            $divide: ['$totalSpent', '$totalClicks'],
          },
        },
      },
    ]);

    return platformStats;
  }

  /**
   * Get trending metrics
   */
  async getTrendingMetrics(userId: string, dateRange: DateRange): Promise<any> {
    const { startDate, endDate } = dateRange;

    const dailyTrends = await Analytics.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          impressions: { $sum: '$metrics.impressions' },
          clicks: { $sum: '$metrics.clicks' },
          conversions: { $sum: '$metrics.conversions' },
          spent: { $sum: '$metrics.spent' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return dailyTrends;
  }
}

export default new AnalyticsService();
