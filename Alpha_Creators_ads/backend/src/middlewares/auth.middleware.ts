/**
 * Authentication Middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config';

interface TokenPayload {
  userId: string;
  type: 'access' | 'refresh';
}

/**
 * Verify JWT token and authenticate user
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token required',
      });
      return;
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

    if (decoded.type !== 'access') {
      res.status(401).json({
        success: false,
        message: 'Invalid token type',
      });
      return;
    }

    // Get user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if ((error as any).name === 'JsonWebTokenError') {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
      return;
    }

    if ((error as any).name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expired',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: (error as Error).message,
    });
  }
};

/**
 * Check if user has required role
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

/**
 * Check if email is verified
 */
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  if (!req.user.isEmailVerified) {
    res.status(403).json({
      success: false,
      message: 'Email verification required',
    });
    return;
  }

  next();
};
