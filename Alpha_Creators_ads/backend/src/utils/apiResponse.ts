/**
 * API Response Utilities
 */

import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Send success response
 */
export const successResponse = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data && { data }),
  };

  res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: any[]
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };

  res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message?: string
): void => {
  const response: ApiResponse<T[]> = {
    success: true,
    ...(message && { message }),
    data,
    pagination,
  };

  res.status(200).json(response);
};
