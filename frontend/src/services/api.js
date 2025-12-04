import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Users API
export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  getAllUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData)
};

// Posts API
export const postAPI = {
  getFeed: () => api.get('/posts/feed'),
  createPost: (postData) => api.post('/posts', postData),
  getPost: (postId) => api.get(`/posts/${postId}`),
  toggleLike: (postId, userId) => api.put(`/posts/${postId}/like`, { userId }),
  addComment: (postId, commentData) => api.post(`/posts/${postId}/comment`, commentData)
};

export default api;