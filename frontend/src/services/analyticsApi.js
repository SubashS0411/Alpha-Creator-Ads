const API_BASE = 'http://localhost:5000/api';

export const trackViewDuration = async (postId, postType, durationMs) => {
  try {
    await fetch(`${API_BASE}/analytics/view-duration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId,
        postType,
        durationMs,
        userId: '6743c123456789012345678a' // Hardcoded for no-auth
      }),
    });
  } catch (error) {
    console.error('Error tracking view duration:', error);
  }
};

export const trackInteraction = async (postId, postType, actionType) => {
  try {
    await fetch(`${API_BASE}/analytics/interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId,
        postType,
        actionType,
        userId: '6743c123456789012345678a' // Hardcoded for no-auth
      }),
    });
  } catch (error) {
    console.error('Error tracking interaction:', error);
  }
};

export const trackSearchQuery = async (queryText) => {
  try {
    await fetch(`${API_BASE}/analytics/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryText,
        userId: '6743c123456789012345678a' // Hardcoded for no-auth
      }),
    });
  } catch (error) {
    console.error('Error tracking search query:', error);
  }
};

export const getAnalytics = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/analytics?${queryParams}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return [];
  }
};