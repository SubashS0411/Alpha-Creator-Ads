/**
 * Application Configuration
 */

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  apiVersion: process.env.API_VERSION || 'v1',

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/alpha_creator_ads',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/alpha_creator_ads_test',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '3d',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    accountLockTime: parseInt(process.env.ACCOUNT_LOCK_TIME) || 1800000, // 30 minutes
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@alphaads.com',
  },

  // CORS
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8083'],
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
};

export default config;
