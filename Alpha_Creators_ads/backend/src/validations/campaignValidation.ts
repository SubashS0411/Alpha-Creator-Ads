/**
 * Campaign Validation Schemas - Zod
 */

import { z } from 'zod';

// Create campaign validation schema
export const createCampaignSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, 'Campaign name must be at least 3 characters')
      .max(100, 'Campaign name cannot exceed 100 characters'),
    platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'google', 'youtube']),
    objective: z.enum(['awareness', 'traffic', 'engagement', 'leads', 'sales', 'app_installs']),
    budget: z.object({
      total: z.number().positive('Total budget must be positive'),
      daily: z.number().positive('Daily budget must be positive').optional(),
      currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
    }),
    targeting: z.object({
      ageRange: z.object({
        min: z.number().min(13).max(100),
        max: z.number().min(13).max(100),
      }).optional(),
      gender: z.enum(['all', 'male', 'female', 'other']).optional(),
      locations: z.array(z.string()).optional(),
      interests: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
    }).optional(),
    schedule: z.object({
      startDate: z.string().or(z.date()),
      endDate: z.string().or(z.date()).optional(),
      timezone: z.string().optional(),
    }),
  }),
});

// Update campaign validation schema
export const updateCampaignSchema = z.object({
  body: z.object({
    name: z.string()
      .min(3, 'Campaign name must be at least 3 characters')
      .max(100, 'Campaign name cannot exceed 100 characters')
      .optional(),
    status: z.enum(['active', 'paused', 'draft', 'completed']).optional(),
    budget: z.object({
      total: z.number().positive().optional(),
      daily: z.number().positive().optional(),
      currency: z.string().length(3).optional(),
    }).optional(),
    targeting: z.object({
      ageRange: z.object({
        min: z.number().min(13).max(100),
        max: z.number().min(13).max(100),
      }).optional(),
      gender: z.enum(['all', 'male', 'female', 'other']).optional(),
      locations: z.array(z.string()).optional(),
      interests: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
    }).optional(),
    schedule: z.object({
      startDate: z.string().or(z.date()).optional(),
      endDate: z.string().or(z.date()).optional(),
      timezone: z.string().optional(),
    }).optional(),
  }),
});

// Get campaigns query validation
export const getCampaignsQuerySchema = z.object({
  query: z.object({
    status: z.enum(['active', 'paused', 'draft', 'completed']).optional(),
    platform: z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'google', 'youtube']).optional(),
    page: z.string().transform(Number).pipe(z.number().positive()).optional(),
    limit: z.string().transform(Number).pipe(z.number().positive().max(100)).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>['body'];
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>['body'];
export type GetCampaignsQuery = z.infer<typeof getCampaignsQuerySchema>['query'];
