/**
 * Alpha Creator Ads - Authentication Service
 * Frontend integration for authentication endpoints
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

export class AuthService {

  /**
   * Register a new user
   */
  static async register(userData) {
    try {
      console.log('Registration data being sent:', userData);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log('Registration response:', result);

      if (!response.ok) {
        // If there are detailed validation errors, show them
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors.map(err => `${err.field}: ${err.message}`).join('\n');
          throw new Error(`Validation errors:\n${errorMessages}`);
        }
        throw new Error(result.message || 'Registration failed');
      }

      // Store tokens from Node.js response format
      if (result.data) {
        localStorage.setItem('access_token', result.data.accessToken);
        localStorage.setItem('refresh_token', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(email, password, rememberMe = false) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store tokens from Node.js response format
      if (result.data) {
        localStorage.setItem('access_token', result.data.accessToken);
        localStorage.setItem('refresh_token', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // Try to refresh token on 401
        if (response.status === 401) {
          await this.refreshToken();
          return this.getCurrentUser(); // Retry
        }
        throw new Error(result.message || 'Failed to get user info');
      }

      if (result.data && result.data.user) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
        return result.data.user;
      }

      return result;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Refresh token expired, logout user
        this.logout();
        throw new Error('Session expired. Please login again.');
      }

      if (result.data && result.data.accessToken) {
        localStorage.setItem('access_token', result.data.accessToken);
        return result.data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  static async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Password change failed');
      }

      return result;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Password reset request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Confirm password reset with token
   */
  static async confirmPasswordReset(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Password reset failed');
      }

      return result;
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      throw error;
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Email verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout() {
    try {
      const token = localStorage.getItem('access_token');

      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      // Redirect to login page
      window.location.href = '/auth/login';
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Get stored user info
   */
  static getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Delete account
   */
  static async deleteAccount() {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${API_BASE_URL}/auth/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Account deletion failed');
      }

      // Clear storage and redirect
      this.logout();

      return await response.json();
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
}

// Example usage:
/*

// Register
try {
  const result = await AuthService.register({
    email: 'user@example.com',
    username: 'johndoe',
    fullName: 'John Doe',
    password: 'SecurePass123!',
    companyName: 'Acme Inc',
    companySize: '11-50',
    industry: 'Marketing',
    role: 'user'
  });
  console.log('Registered:', result.user);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Login
try {
  const result = await AuthService.login('user@example.com', 'SecurePass123!');
  console.log('Logged in:', result.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Get current user
try {
  const user = await AuthService.getCurrentUser();
  console.log('Current user:', user);
} catch (error) {
  console.error('Failed to get user:', error.message);
}

// Logout
AuthService.logout();

*/

export default AuthService;
