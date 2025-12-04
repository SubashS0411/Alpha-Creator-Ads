/**
 * Mock Data Controller
 * Serves mock data for campaigns, analytics, and notifications
 */

// Mock Campaigns Data
const campaigns = [
  {
    id: "camp-001",
    name: "Summer Sale 2025",
    status: "active",
    platform: "facebook",
    budget: 5000,
    spent: 3247.50,
    impressions: 125000,
    clicks: 8750,
    conversions: 342,
    ctr: 7.0,
    cpc: 0.37,
    roas: 4.8,
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    targetAudience: "Age 25-45, Interest: Fashion",
    adFormat: "carousel",
    createdAt: "2025-05-28T10:00:00Z"
  },
  {
    id: "camp-002",
    name: "Product Launch - Smart Watch",
    status: "active",
    platform: "google",
    budget: 8000,
    spent: 4120.00,
    impressions: 85000,
    clicks: 5100,
    conversions: 215,
    ctr: 6.0,
    cpc: 0.81,
    roas: 3.2,
    startDate: "2025-07-15",
    endDate: "2025-09-15",
    targetAudience: "Tech enthusiasts, Age 20-40",
    adFormat: "search",
    createdAt: "2025-07-10T14:30:00Z"
  },
  {
    id: "camp-003",
    name: "Holiday Special Campaign",
    status: "paused",
    platform: "instagram",
    budget: 3500,
    spent: 1850.25,
    impressions: 95000,
    clicks: 7200,
    conversions: 156,
    ctr: 7.6,
    cpc: 0.26,
    roas: 5.2,
    startDate: "2025-11-01",
    endDate: "2025-12-31",
    targetAudience: "Shopping enthusiasts, Age 18-55",
    adFormat: "story",
    createdAt: "2025-10-25T09:15:00Z"
  },
  {
    id: "camp-004",
    name: "B2B Lead Generation",
    status: "active",
    platform: "linkedin",
    budget: 6000,
    spent: 5430.00,
    impressions: 42000,
    clicks: 2520,
    conversions: 89,
    ctr: 6.0,
    cpc: 2.15,
    roas: 2.8,
    startDate: "2025-08-01",
    endDate: "2025-11-30",
    targetAudience: "C-Level Executives, IT Decision Makers",
    adFormat: "sponsored_content",
    createdAt: "2025-07-28T11:45:00Z"
  },
  {
    id: "camp-005",
    name: "Brand Awareness Q4",
    status: "draft",
    platform: "youtube",
    budget: 10000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0,
    roas: 0,
    startDate: "2025-12-01",
    endDate: "2025-12-31",
    targetAudience: "Broad audience, Age 18-65",
    adFormat: "video",
    createdAt: "2025-11-20T16:00:00Z"
  }
];

const notifications = [
  {
    id: "notif-001",
    type: "success",
    title: "Campaign Performance Alert",
    message: "Your 'Summer Sale 2025' campaign has exceeded target ROAS by 20%!",
    timestamp: "2025-11-27T09:30:00Z",
    read: false,
    priority: "high",
    actionUrl: "/campaigns/camp-001"
  },
  {
    id: "notif-002",
    type: "warning",
    title: "Budget Alert",
    message: "Campaign 'B2B Lead Generation' has used 90% of allocated budget.",
    timestamp: "2025-11-27T08:15:00Z",
    read: false,
    priority: "medium",
    actionUrl: "/campaigns/camp-004"
  },
  {
    id: "notif-003",
    type: "info",
    title: "New Feature Available",
    message: "Try our new AI-powered audience targeting feature in Ad Studio!",
    timestamp: "2025-11-26T14:00:00Z",
    read: true,
    priority: "low",
    actionUrl: "/generate"
  },
  {
    id: "notif-004",
    type: "warning",
    title: "Campaign Paused",
    message: "Your campaign 'Holiday Special Campaign' was automatically paused due to low performance.",
    timestamp: "2025-11-25T16:45:00Z",
    read: true,
    priority: "high",
    actionUrl: "/campaigns/camp-003"
  }
];

/**
 * Get all campaigns
 */
export const getCampaigns = async (req, res) => {
  try {
    const summary = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      pausedCampaigns: campaigns.filter(c => c.status === 'paused').length,
      draftCampaigns: campaigns.filter(c => c.status === 'draft').length,
      totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
      totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
      totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
      totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
      totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
      averageCTR: campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length,
      averageROAS: campaigns.filter(c => c.roas > 0).reduce((sum, c) => sum + c.roas, 0) / campaigns.filter(c => c.roas > 0).length
    };

    res.json({
      success: true,
      data: {
        campaigns,
        summary
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns',
      error: error.message
    });
  }
};

/**
 * Get campaign by ID
 */
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = campaigns.find(c => c.id === id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaign',
      error: error.message
    });
  }
};

/**
 * Get analytics data
 */
export const getAnalytics = async (req, res) => {
  try {
    // Generate time series data for the last 27 days
    const timeSeriesData = Array.from({ length: 27 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (26 - i));
      const baseImpressions = 12000 + Math.random() * 17000;
      const ctr = 0.06 + Math.random() * 0.03;
      const clicks = Math.floor(baseImpressions * ctr);
      const conversionRate = 0.035 + Math.random() * 0.025;
      const conversions = Math.floor(clicks * conversionRate);
      const cpc = 0.25 + Math.random() * 0.35;
      const spend = clicks * cpc;
      const revenue = conversions * 48;

      return {
        date: date.toISOString().split('T')[0],
        impressions: Math.floor(baseImpressions),
        clicks,
        conversions,
        spend: Math.round(spend * 100) / 100,
        revenue: Math.round(revenue * 100) / 100
      };
    });

    const analytics = {
      timeSeriesData,
      demographics: {
        age: [
          { range: "18-24", percentage: 15, conversions: 120 },
          { range: "25-34", percentage: 35, conversions: 280 },
          { range: "35-44", percentage: 28, conversions: 224 },
          { range: "45-54", percentage: 15, conversions: 120 },
          { range: "55+", percentage: 7, conversions: 58 }
        ],
        gender: [
          { type: "Male", percentage: 52, conversions: 416 },
          { type: "Female", percentage: 45, conversions: 360 },
          { type: "Other", percentage: 3, conversions: 26 }
        ],
        location: [
          { country: "United States", percentage: 45, conversions: 361 },
          { country: "United Kingdom", percentage: 18, conversions: 144 },
          { country: "Canada", percentage: 12, conversions: 96 },
          { country: "Australia", percentage: 10, conversions: 80 },
          { country: "Germany", percentage: 8, conversions: 64 },
          { country: "Other", percentage: 7, conversions: 57 }
        ]
      },
      platformPerformance: [
        {
          platform: "Facebook",
          impressions: 145000,
          clicks: 10150,
          conversions: 425,
          ctr: 7.0,
          spend: 3750.50,
          revenue: 20400.00,
          roas: 5.44
        },
        {
          platform: "Google Ads",
          impressions: 98000,
          clicks: 5880,
          conversions: 285,
          ctr: 6.0,
          spend: 4762.80,
          revenue: 13680.00,
          roas: 2.87
        },
        {
          platform: "Instagram",
          impressions: 112000,
          clicks: 8512,
          conversions: 368,
          ctr: 7.6,
          spend: 2213.12,
          revenue: 17664.00,
          roas: 7.98
        },
        {
          platform: "LinkedIn",
          impressions: 52000,
          clicks: 3120,
          conversions: 142,
          ctr: 6.0,
          spend: 6708.00,
          revenue: 6816.00,
          roas: 1.02
        }
      ],
      deviceBreakdown: [
        { device: "Mobile", percentage: 58, conversions: 465 },
        { device: "Desktop", percentage: 32, conversions: 257 },
        { device: "Tablet", percentage: 10, conversions: 80 }
      ],
      topPerformingAds: [
        {
          id: "ad-001",
          name: "Summer Sale Hero Banner",
          campaign: "Summer Sale 2025",
          impressions: 45000,
          clicks: 3600,
          conversions: 152,
          ctr: 8.0,
          conversionRate: 4.22,
          spend: 936.00,
          revenue: 7296.00
        },
        {
          id: "ad-002",
          name: "Smart Watch Launch Video",
          campaign: "Product Launch - Smart Watch",
          impressions: 38000,
          clicks: 2660,
          conversions: 128,
          ctr: 7.0,
          conversionRate: 4.81,
          spend: 2153.60,
          revenue: 6144.00
        },
        {
          id: "ad-003",
          name: "Holiday Gift Guide Carousel",
          campaign: "Holiday Special Campaign",
          impressions: 52000,
          clicks: 4160,
          conversions: 185,
          ctr: 8.0,
          conversionRate: 4.45,
          spend: 1081.60,
          revenue: 8880.00
        }
      ]
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

/**
 * Get notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = notifications.find(n => n.id === id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.read = true;

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message
    });
  }
};
