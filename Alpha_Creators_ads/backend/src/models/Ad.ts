/**
 * Ad Model - TypeScript
 */

import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IAd extends Document {
  campaignId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: 'image' | 'video' | 'carousel' | 'text' | 'story';
  status: 'active' | 'paused' | 'draft' | 'rejected' | 'approved';
  content: {
    headline: string;
    description: string;
    callToAction: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
    linkUrl?: string;
  };
  aiGenerated: boolean;
  aiModel?: string;
  aiPrompt?: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    engagement: number;
    reach: number;
  };
  performance: {
    score: number;
    rating: 'poor' | 'fair' | 'good' | 'excellent';
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adSchema = new Schema<IAd>({
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Ad name is required'],
    trim: true,
    minlength: [3, 'Ad name must be at least 3 characters'],
    maxlength: [100, 'Ad name cannot exceed 100 characters'],
  },
  type: {
    type: String,
    enum: ['image', 'video', 'carousel', 'text', 'story'],
    required: [true, 'Ad type is required'],
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'draft', 'rejected', 'approved'],
    default: 'draft',
    index: true,
  },
  content: {
    headline: {
      type: String,
      required: [true, 'Headline is required'],
      maxlength: [100, 'Headline cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    callToAction: {
      type: String,
      required: [true, 'Call to action is required'],
    },
    mediaUrl: String,
    thumbnailUrl: String,
    linkUrl: String,
  },
  aiGenerated: {
    type: Boolean,
    default: false,
  },
  aiModel: String,
  aiPrompt: String,
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
  },
  performance: {
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rating: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent'],
      default: 'fair',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
adSchema.index({ campaignId: 1, status: 1 });
adSchema.index({ userId: 1, createdAt: -1 });
adSchema.index({ type: 1, status: 1 });
adSchema.index({ aiGenerated: 1 });

const Ad: Model<IAd> = mongoose.model<IAd>('Ad', adSchema);

export default Ad;
