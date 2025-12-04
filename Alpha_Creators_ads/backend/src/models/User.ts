/**
 * User Model - TypeScript
 */

import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// User Interface
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  companyName?: string;
  companySize?: string;
  industry?: string;
  monthlyAdSpend?: string;
  integrations?: string[];
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  refreshToken?: string;
  role: 'user' | 'admin' | 'moderator';
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    startDate?: Date;
    endDate?: Date;
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  isLocked: boolean;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  incLoginAttempts(): Promise<any>;
  resetLoginAttempts(): Promise<any>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  companyName: {
    type: String,
    trim: true,
  },
  companySize: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  monthlyAdSpend: {
    type: String,
    trim: true,
  },
  integrations: [{
    type: String,
  }],
  emailVerificationToken: {
    type: String,
    select: false,
  },
  emailVerificationExpires: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  refreshToken: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active',
    },
    startDate: Date,
    endDate: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete (ret as any).password;
      delete (ret as any).refreshToken;
      delete (ret as any).emailVerificationToken;
      delete (ret as any).passwordResetToken;
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Indexes (email and username already indexed via unique: true)
userSchema.index({ createdAt: -1 });
userSchema.index({ 'subscription.plan': 1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function (this: IUser) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = async function () {
  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < new Date()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates: any = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;

  // Lock account after max attempts
  const needsLock = this.loginAttempts + 1 >= maxAttempts && !this.isLocked;
  if (needsLock) {
    updates.$set = { lockUntil: new Date(Date.now() + 1800000) }; // 30 minutes
  }

  return await this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
