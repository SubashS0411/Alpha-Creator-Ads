/**
 * Authentication Service
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { config } from '../config/index.js';

class AuthService {
  /**
   * Generate JWT access token
   */
  generateAccessToken(userId) {
    return jwt.sign(
      { userId, type: 'access' },
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpiry }
    );
  }

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId, type: 'refresh' },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiry }
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token, type = 'access') {
    try {
      const secret = type === 'access' ? config.jwt.secret : config.jwt.refreshSecret;
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate random token for email verification and password reset
   */
  generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Register new user
   */
  async register(userData) {
    const { email, username, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already registered');
      }
      if (existingUser.username === username) {
        throw new Error('Username already taken');
      }
    }

    // Create verification token
    const emailVerificationToken = this.generateRandomToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = new User({
      email,
      username,
      password,
      firstName,
      lastName,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await user.save();
    console.log(`✅ User registered: ${user.email} (ID: ${user._id})`);

    // Generate tokens
    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();
    console.log(`🔑 Tokens generated for user: ${user.email}`);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
      emailVerificationToken, // In production, send this via email
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password +refreshToken');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new Error('Account is temporarily locked. Please try again later.');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('Account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      await user.incLoginAttempts();
      throw new Error('Invalid email or password');
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify email
   */
  async verifyEmail(token) {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = this.generateRandomToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    return {
      message: 'Password reset token generated',
      resetToken, // In production, send this via email
    };
  }

  /**
   * Reset password
   */
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken, 'refresh');

      const user = await User.findById(decoded.userId).select('+refreshToken');

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = this.generateAccessToken(user._id);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.refreshToken = undefined;
    await user.save();

    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  /**
   * Deactivate account
   */
  async deactivateAccount(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;
    user.refreshToken = undefined;
    await user.save();

    return { message: 'Account deactivated successfully' };
  }
}

export default new AuthService();
