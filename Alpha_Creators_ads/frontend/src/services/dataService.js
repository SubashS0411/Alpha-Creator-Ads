/**
 * Data Service - Fetch campaigns, analytics, and notifications from backend
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

class DataService {
  
  /**
   * Get authorization headers
   */
  static getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  /**
   * Get all campaigns
   */
  static async getCampaigns() {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns`, {
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch campaigns');
      }

      return result.data;
    } catch (error) {
      console.error('Get campaigns error:', error);
      throw error;
    }
  }

  /**
   * Get campaign by ID
   */
  static async getCampaignById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch campaign');
      }

      return result.data;
    } catch (error) {
      console.error('Get campaign error:', error);
      throw error;
    }
  }

  /**
   * Get analytics data
   */
  static async getAnalytics(startDate = null, endDate = null) {
    try {
      let url = `${API_BASE_URL}/analytics/overview`;
      
      // Add date range query parameters if provided
      if (startDate && endDate) {
        const params = new URLSearchParams({
          startDate: startDate,
          endDate: endDate
        });
        url += `?${params.toString()}`;
      } else {
        // Default to last 30 days
        const end = new Date();
        const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        const params = new URLSearchParams({
          startDate: start.toISOString(),
          endDate: end.toISOString()
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch analytics');
      }

      return result.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }


}

export default DataService;
