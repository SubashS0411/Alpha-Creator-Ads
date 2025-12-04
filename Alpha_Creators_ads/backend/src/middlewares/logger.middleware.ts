/**
 * Request Logger Middleware
 */

import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

// Custom token for logging user ID
morgan.token('userId', (req: Request) => {
  return req.user ? req.user._id.toString() : 'anonymous';
});

// Development logging format
export const devLogger = morgan(
  ':method :url :status :response-time ms - :res[content-length] - User: :userId'
);

// Production logging format
export const prodLogger = morgan('combined');

// Request logger based on environment
export const requestLogger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
