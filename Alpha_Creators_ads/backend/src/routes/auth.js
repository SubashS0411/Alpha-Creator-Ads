/**
 * Authentication Routes
 */

import express from 'express';
import authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', validate(schemas.register), authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validate(schemas.login), authController.login);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email', validate(schemas.verifyEmail), authController.verifyEmail);

/**
 * @route   POST /api/v1/auth/password-reset
 * @desc    Request password reset
 * @access  Public
 */
router.post('/password-reset', validate(schemas.requestPasswordReset), authController.requestPasswordReset);

/**
 * @route   POST /api/v1/auth/password-reset/confirm
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/password-reset/confirm', validate(schemas.resetPassword), authController.resetPassword);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', validate(schemas.refreshToken), authController.refreshToken);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post('/change-password', authenticate, validate(schemas.changePassword), authController.changePassword);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   DELETE /api/v1/auth/account
 * @desc    Deactivate account
 * @access  Private
 */
router.delete('/account', authenticate, authController.deactivateAccount);

export default router;
