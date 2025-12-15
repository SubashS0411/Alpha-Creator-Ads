/**
 * Authentication Service
 */

import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import config from '../config';
import { CustomError } from '../middlewares/error.middleware';

interface TokenPayload {
  userId: string;
  type: 'access' | 'refresh';
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  companySize?: string;
  industry?: string;
  monthlyAdSpend?: string;
  integrations?: string[];
}

interface RegisterResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
  emailVerificationToken: string;
}

interface LoginResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

interface PasswordResetResponse {
  message: string;
  resetToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}

class AuthService {
  /**
   * Generate JWT access token
   */
  generateAccessToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'access' } as TokenPayload,
      config.jwt.secret,
      { expiresIn: config.jwt.accessExpiry } as jwt.SignOptions
    );
  }

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'refresh' } as TokenPayload,
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiry } as jwt.SignOptions
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string, type: 'access' | 'refresh' = 'access'): TokenPayload {
    try {
      const secret = type === 'access' ? config.jwt.secret : config.jwt.refreshSecret;
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate random token for email verification and password reset
   */
  generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<RegisterResponse> {
    const { email, username, password, firstName, lastName, companyName, companySize, industry, monthlyAdSpend, integrations } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new CustomError('Email already registered', 409);
      }
      if (existingUser.username === username) {
        throw new CustomError('Username already taken', 409);
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
      companyName,
      companySize,
      industry,
      monthlyAdSpend,
      integrations,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await user.save();
    console.log(`✅ User registered: ${user.email} (ID: ${user._id})`);

    // Generate tokens
    const accessToken = this.generateAccessToken(user._id.toString());
    const refreshToken = this.generateRefreshToken(user._id.toString());

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
  async login(email: string, password: string): Promise<LoginResponse> {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password +refreshToken');

    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // await user.incLoginAttempts(); // Removed for disabling lock mechanism
      throw new CustomError('Invalid email or password', 401);
    }

    // Reset login attempts on successful login
    // if (user.loginAttempts > 0) { // Removed for disabling lock mechanism
    //   await user.resetLoginAttempts(); // Removed for disabling lock mechanism
    // }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = this.generateAccessToken(user._id.toString());
    const refreshToken = this.generateRefreshToken(user._id.toString());

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
  async verifyEmail(token: string): Promise<{ message: string }> {
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
  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      throw new Error('If the email exists, a reset link has been sent');
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
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
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
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
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
  async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const decoded = this.verifyToken(refreshToken, 'refresh');

      const user = await User.findById(decoded.userId).select('+refreshToken');

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = this.generateAccessToken(user._id.toString());

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
  async logout(userId: string): Promise<{ message: string }> {
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
  async getCurrentUser(userId: string): Promise<any> {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  /**
   * Deactivate account
   */
  async deactivateAccount(userId: string): Promise<{ message: string }> {
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
