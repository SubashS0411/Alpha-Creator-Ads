/**
 * Request Validation Middleware
 */

import Joi from 'joi';

/**
 * Validate request body
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    next();
  };
};

/**
 * Validation schemas
 */
export const schemas = {
  // User registration
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
    username: Joi.string().min(3).max(30).alphanum().required().messages({
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username cannot exceed 30 characters',
      'string.alphanum': 'Username must contain only letters and numbers',
      'any.required': 'Username is required',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required',
    }),
    firstName: Joi.string().max(50).optional(),
    lastName: Joi.string().max(50).optional(),
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),

  // Change password
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
    }),
    newPassword: Joi.string().min(8).required().messages({
      'string.min': 'New password must be at least 8 characters',
      'any.required': 'New password is required',
    }),
  }),

  // Reset password
  resetPassword: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Reset token is required',
    }),
    newPassword: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required',
    }),
  }),

  // Request password reset
  requestPasswordReset: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
  }),

  // Verify email
  verifyEmail: Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Verification token is required',
    }),
  }),

  // Refresh token
  refreshToken: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token is required',
    }),
  }),
};
