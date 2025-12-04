/**
 * Ad Validation Schemas - Zod
 */

import { z } from 'zod';

// Create ad validation schema
export const createAdSchema = z.object({
  body: z.object({
    campaignId: z.string()
      .min(1, 'Campaign ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Campaign ID format'),
    name: z.string()
      .min(3, 'Ad name must be at least 3 characters')
      .max(100, 'Ad name cannot exceed 100 characters'),
    type: z.enum(['image', 'video', 'carousel', 'story', 'text']),
    content: z.object({
      headline: z.string()
        .min(5, 'Headline must be at least 5 characters')
        .max(100, 'Headline cannot exceed 100 characters'),
      description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),
      callToAction: z.string()
        .max(30, 'Call to action cannot exceed 30 characters')
        .optional(),
      mediaUrl: z.string().url('Invalid media URL').optional(),
      thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
      linkUrl: z.string().url('Invalid link URL').optional(),
    }),
  }),
});

// Update ad validation schema
export const updateAdSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, 'Ad name must be at least 3 characters')
      .max(100, 'Ad name cannot exceed 100 characters')
      .optional(),
    status: z.enum(['active', 'paused', 'draft']).optional(),
    content: z.object({
      headline: z.string()
        .min(5, 'Headline must be at least 5 characters')
        .max(100, 'Headline cannot exceed 100 characters')
        .optional(),
      description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),
      callToAction: z.string()
        .max(30, 'Call to action cannot exceed 30 characters')
        .optional(),
      mediaUrl: z.string().url('Invalid media URL').optional(),
      thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
      linkUrl: z.string().url('Invalid link URL').optional(),
    }).optional(),
  }),
});

// AI generate ad validation schema
export const aiGenerateAdSchema = z.object({
  body: z.object({
    campaignId: z.string()
      .min(1, 'Campaign ID is required')
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Campaign ID format'),
    prompt: z.string()
      .min(10, 'Prompt must be at least 10 characters')
      .max(1000, 'Prompt cannot exceed 1000 characters'),
    platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'google', 'youtube']),
    adType: z.enum(['image', 'video', 'carousel', 'story', 'text']),
    style: z.string().optional(),
    tone: z.enum(['professional', 'casual', 'friendly', 'formal', 'humorous']).optional(),
    targetAudience: z.string()
      .max(200, 'Target audience description cannot exceed 200 characters')
      .optional(),
  }),
});

// Get ads query validation
export const getAdsQuerySchema = z.object({
  query: z.object({
    campaignId: z.string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Campaign ID format')
      .optional(),
    status: z.enum(['active', 'paused', 'draft']).optional(),
    type: z.enum(['image', 'video', 'carousel', 'story', 'text']).optional(),
    aiGenerated: z.string()
      .transform((val) => val === 'true')
      .pipe(z.boolean())
      .optional(),
    page: z.string().transform(Number).pipe(z.number().positive()).optional(),
    limit: z.string().transform(Number).pipe(z.number().positive().max(100)).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export type CreateAdInput = z.infer<typeof createAdSchema>['body'];
export type UpdateAdInput = z.infer<typeof updateAdSchema>['body'];
export type AIGenerateAdInput = z.infer<typeof aiGenerateAdSchema>['body'];
export type GetAdsQuery = z.infer<typeof getAdsQuerySchema>['query'];
