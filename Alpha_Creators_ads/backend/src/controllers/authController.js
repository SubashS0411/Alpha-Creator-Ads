/**
 * Authentication Controller
 */

import authService from '../services/authService.js';

class AuthController {
  /**
   * Register new user
   */
  async register(req, res, next) {
    try {
      console.log('📝 Registration attempt:', req.body.email);
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req, res, next) {
    try {
      console.log('🔐 Login attempt:', req.body.email);
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      console.error('❌ Login error:', error.message);
      next(error);
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;
      const result = await authService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.requestPasswordReset(email);

      res.status(200).json({
        success: true,
        message: result.message,
        ...(process.env.NODE_ENV === 'development' && { resetToken: result.resetToken }),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(
        req.user._id,
        currentPassword,
        newPassword
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user._id);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   */
  async logout(req, res, next) {
    try {
      const result = await authService.logout(req.user._id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate account
   */
  async deactivateAccount(req, res, next) {
    try {
      const result = await authService.deactivateAccount(req.user._id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
