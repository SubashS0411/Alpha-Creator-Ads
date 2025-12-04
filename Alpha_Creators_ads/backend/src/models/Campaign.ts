/**
 * Campaign Model - TypeScript
 */

import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  userId: Types.ObjectId;
  status: 'active' | 'paused' | 'draft' | 'completed';
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'google' | 'youtube';
  objective: 'awareness' | 'traffic' | 'engagement' | 'leads' | 'sales' | 'app_installs';
  budget: {
    total: number;
    daily: number;
    spent: number;
    currency: string;
  };
  targeting: {
    ageRange: { min: number; max: number };
    gender: 'all' | 'male' | 'female' | 'other';
    locations: string[];
    interests: string[];
    languages: string[];
  };
  schedule: {
    startDate: Date;
    endDate?: Date;
    timezone: string;
  };
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
    revenue: number;
  };
  ads: Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>({
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    minlength: [3, 'Campaign name must be at least 3 characters'],
    maxlength: [100, 'Campaign name cannot exceed 100 characters'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'draft', 'completed'],
    default: 'draft',
    index: true,
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'google', 'youtube'],
    required: [true, 'Platform is required'],
    index: true,
  },
  objective: {
    type: String,
    enum: ['awareness', 'traffic', 'engagement', 'leads', 'sales', 'app_installs'],
    required: [true, 'Campaign objective is required'],
  },
  budget: {
    total: {
      type: Number,
      required: [true, 'Total budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    daily: {
      type: Number,
      min: [0, 'Daily budget cannot be negative'],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
  },
  targeting: {
    ageRange: {
      min: { type: Number, default: 18, min: 13, max: 100 },
      max: { type: Number, default: 65, min: 13, max: 100 },
    },
    gender: {
      type: String,
      enum: ['all', 'male', 'female', 'other'],
      default: 'all',
    },
    locations: [{ type: String }],
    interests: [{ type: String }],
    languages: [{ type: String }],
  },
  schedule: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: Date,
    timezone: {
      type: String,
      default: 'UTC',
    },
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 },
    cpm: { type: Number, default: 0 },
    roas: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  },
  ads: [{
    type: Schema.Types.ObjectId,
    ref: 'Ad',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ userId: 1, createdAt: -1 });
campaignSchema.index({ platform: 1, status: 1 });
campaignSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });

const Campaign: Model<ICampaign> = mongoose.model<ICampaign>('Campaign', campaignSchema);

export default Campaign;
