/**
 * Analytics Model - TypeScript
 */

import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IAnalytics extends Document {
  userId: Types.ObjectId;
  campaignId: Types.ObjectId;
  adId?: Types.ObjectId;
  date: Date;
  platform: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    reach: number;
    engagement: number;
    spend: number;
    revenue: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
  };
  demographics: {
    ageGroups: Map<string, number>;
    gender: Map<string, number>;
    locations: Map<string, number>;
  };
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  timeMetrics: {
    hour: number;
    dayOfWeek: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    index: true,
  },
  adId: {
    type: Schema.Types.ObjectId,
    ref: 'Ad',
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  platform: {
    type: String,
    required: true,
    index: true,
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    spend: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 },
    cpm: { type: Number, default: 0 },
    roas: { type: Number, default: 0 },
  },
  demographics: {
    ageGroups: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    gender: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    locations: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  deviceBreakdown: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
  },
  timeMetrics: {
    hour: { type: Number, min: 0, max: 23 },
    dayOfWeek: { type: Number, min: 0, max: 6 },
  },
}, {
  timestamps: true,
});

// Indexes
analyticsSchema.index({ userId: 1, date: -1 });
analyticsSchema.index({ campaignId: 1, date: -1 });
analyticsSchema.index({ adId: 1, date: -1 });
analyticsSchema.index({ platform: 1, date: -1 });
analyticsSchema.index({ userId: 1, campaignId: 1, date: -1 });

const Analytics: Model<IAnalytics> = mongoose.model<IAnalytics>('Analytics', analyticsSchema);

export default Analytics;
