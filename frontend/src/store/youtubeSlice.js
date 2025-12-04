import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5001/api/youtube';

// Mock data for fallback
const getMockVideos = (category) => [
  {
    _id: '1',
    title: 'iPhone 15 Pro Max COMPLETE Review - Is It Worth The Upgrade?',
    description: 'In this comprehensive review, we dive deep into the iPhone 15 Pro Max. From the new titanium design to the revolutionary Action Button, we cover everything you need to know.',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/1E40AF/ffffff?text=iPhone+15+Pro+Review',
    duration: 1247,
    views: 2456789,
    likes: 89234,
    dislikes: 2341,
    category: 'Programming',
    commentCount: 12459,
    uploadDate: '2024-11-20T10:30:00Z',
    channelId: {
      _id: 'ch1',
      name: 'TechMaster Pro',
      handle: '@techmaster',
      avatarUrl: 'https://via.placeholder.com/120x120/FF0000/ffffff?text=TMP',
      subscriberCount: 1250000,
      verified: true
    }
  },
  {
    _id: '2',
    title: 'React 18 Complete Tutorial - Build Modern Web Apps',
    description: 'Master React 18 with this complete tutorial covering hooks, context, suspense, and concurrent features.',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/61DAFB/000000?text=React+18+Tutorial',
    duration: 3421,
    views: 1234567,
    likes: 45678,
    dislikes: 1234,
    category: 'Programming',
    commentCount: 8923,
    uploadDate: '2024-11-18T14:20:00Z',
    channelId: {
      _id: 'ch2',
      name: 'CodeWith Alex',
      handle: '@codewithalex',
      avatarUrl: 'https://via.placeholder.com/120x120/FFA500/ffffff?text=CWA',
      subscriberCount: 567000,
      verified: false
    }
  },
  {
    _id: '3',
    title: 'Cyberpunk 2077 Phantom Liberty DLC - Full Walkthrough Part 1',
    description: 'Experience the thrilling new expansion with our complete walkthrough.',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/FFFF00/000000?text=Cyberpunk+2077+DLC',
    duration: 2856,
    views: 3456789,
    likes: 125678,
    dislikes: 3456,
    category: 'Gaming',
    commentCount: 15789,
    uploadDate: '2024-11-19T16:45:00Z',
    channelId: {
      _id: 'ch3',
      name: 'Gaming Universe',
      handle: '@gaminguniv',
      avatarUrl: 'https://via.placeholder.com/120x120/00FF00/ffffff?text=GU',
      subscriberCount: 890000,
      verified: true
    }
  },
  {
    _id: '4',
    title: 'Lo-Fi Hip Hop Mix 2024 - Study & Chill Beats',
    description: 'Perfect background music for studying, working, or relaxing. 2 hours of carefully curated lo-fi beats.',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/9333EA/ffffff?text=Lo-Fi+Mix+2024',
    duration: 7200,
    views: 987654,
    likes: 67890,
    dislikes: 234,
    category: 'Music',
    commentCount: 4567,
    uploadDate: '2024-11-21T09:15:00Z',
    channelId: {
      _id: 'ch4',
      name: 'Music Vibes',
      handle: '@musicvibes',
      avatarUrl: 'https://via.placeholder.com/120x120/0000FF/ffffff?text=MV',
      subscriberCount: 2100000,
      verified: true
    }
  },
  {
    _id: '5',
    title: '30-Minute Full Body HIIT Workout - No Equipment Needed',
    description: 'Burn calories and build strength with this intense 30-minute HIIT workout.',
    thumbnailUrl: 'https://via.placeholder.com/1280x720/DC2626/ffffff?text=HIIT+Workout',
    duration: 1800,
    views: 890123,
    likes: 34567,
    dislikes: 892,
    category: 'Sports',
    commentCount: 5678,
    uploadDate: '2024-11-17T07:30:00Z',
    channelId: {
      _id: 'ch5',
      name: 'Fitness Journey',
      handle: '@fitnessjourney',
      avatarUrl: 'https://via.placeholder.com/120x120/FF69B4/ffffff?text=FJ',
      subscriberCount: 734000,
      verified: false
    }
  }
].filter(video => category === 'All' || video.category === category);

const getMockShorts = () => [
  {
    _id: 's1',
    title: 'iPhone 15 vs Android - Speed Test',
    description: 'Quick speed comparison! #TechShorts #iPhone15',
    thumbnailUrl: 'https://via.placeholder.com/720x1280/EF4444/ffffff?text=Speed+Test+Short',
    duration: 45,
    views: 5678901,
    likes: 234567,
    dislikes: 5678,
    category: 'Programming',
    commentCount: 23456,
    isShort: true,
    uploadDate: '2024-11-22T12:00:00Z',
    channelId: {
      _id: 'ch1',
      name: 'TechMaster Pro',
      handle: '@techmaster',
      avatarUrl: 'https://via.placeholder.com/120x120/FF0000/ffffff?text=TMP',
      subscriberCount: 1250000,
      verified: true
    }
  },
  {
    _id: 's2',
    title: 'CSS Flexbox in 60 seconds',
    description: 'Master CSS Flexbox in just one minute! #WebDev #CSS',
    thumbnailUrl: 'https://via.placeholder.com/720x1280/3B82F6/ffffff?text=CSS+Flexbox',
    duration: 58,
    views: 1234567,
    likes: 67890,
    dislikes: 1234,
    category: 'Programming',
    commentCount: 8901,
    isShort: true,
    uploadDate: '2024-11-23T15:30:00Z',
    channelId: {
      _id: 'ch2',
      name: 'CodeWith Alex',
      handle: '@codewithalex',
      avatarUrl: 'https://via.placeholder.com/120x120/FFA500/ffffff?text=CWA',
      subscriberCount: 567000,
      verified: false
    }
  },
  {
    _id: 's3',
    title: 'Epic Gaming Moment - Clutch Victory!',
    description: 'Insane clutch moment! Can\'t believe this happened 🔥 #Gaming #Clutch',
    thumbnailUrl: 'https://via.placeholder.com/720x1280/10B981/ffffff?text=Epic+Clutch',
    duration: 30,
    views: 2345678,
    likes: 156789,
    dislikes: 2345,
    category: 'Gaming',
    commentCount: 12345,
    isShort: true,
    uploadDate: '2024-11-24T18:45:00Z',
    channelId: {
      _id: 'ch3',
      name: 'Gaming Universe',
      handle: '@gaminguniv',
      avatarUrl: 'https://via.placeholder.com/120x120/00FF00/ffffff?text=GU',
      subscriberCount: 890000,
      verified: true
    }
  }
];

// Async thunks for API calls
export const fetchHomeVideos = createAsyncThunk(
  'youtube/fetchHomeVideos',
  async ({ category = 'All', page = 1 } = {}) => {
    const response = await fetch(`${API_BASE}/videos/home?category=${category}&page=${page}&limit=20`);
    if (!response.ok) throw new Error('Failed to fetch videos');
    return response.json();
  }
);

export const fetchShorts = createAsyncThunk(
  'youtube/fetchShorts',
  async ({ page = 1 } = {}) => {
    const response = await fetch(`${API_BASE}/videos/shorts?page=${page}&limit=10`);
    if (!response.ok) throw new Error('Failed to fetch shorts');
    return response.json();
  }
);

export const fetchVideoDetails = createAsyncThunk(
  'youtube/fetchVideoDetails',
  async (videoId) => {
    const response = await fetch(`${API_BASE}/videos/${videoId}?userId=674587d123456789abcdef01`);
    if (!response.ok) throw new Error('Failed to fetch video details');
    return response.json();
  }
);

export const fetchRecommendations = createAsyncThunk(
  'youtube/fetchRecommendations',
  async (videoId) => {
    try {
      const response = await fetch(`${API_BASE}/videos/${videoId}/recommendations`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    } catch (error) {
      // Fallback to mock data
      return getMockVideos('All').filter(v => v._id !== videoId).slice(0, 10);
    }
  }
);

export const searchContent = createAsyncThunk(
  'youtube/searchContent',
  async ({ query, type = 'all', page = 1 }) => {
    const response = await fetch(`${API_BASE}/search/${encodeURIComponent(query)}?type=${type}&page=${page}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  }
);

export const likeVideo = createAsyncThunk(
  'youtube/likeVideo',
  async ({ videoId, action }) => {
    const response = await fetch(`${API_BASE}/videos/${videoId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action,
        userId: '674587d123456789abcdef01'
      })
    });
    if (!response.ok) throw new Error('Failed to update like');
    return { videoId, ...await response.json() };
  }
);

export const dislikeVideo = createAsyncThunk(
  'youtube/dislikeVideo',
  async ({ videoId, action }) => {
    const response = await fetch(`${API_BASE}/videos/${videoId}/dislike`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action,
        userId: '674587d123456789abcdef01' 
      })
    });
    if (!response.ok) throw new Error('Failed to update dislike');
    return { videoId, ...await response.json() };
  }
);

export const fetchLikedVideos = createAsyncThunk(
  'youtube/fetchLikedVideos',
  async (userId = '674587d123456789abcdef01') => {
    const response = await fetch(`${API_BASE}/videos/user/${userId}/liked`);
    if (!response.ok) throw new Error('Failed to fetch liked videos');
    return response.json();
  }
);

export const fetchDislikedVideos = createAsyncThunk(
  'youtube/fetchDislikedVideos', 
  async (userId = '674587d123456789abcdef01') => {
    const response = await fetch(`${API_BASE}/videos/user/${userId}/disliked`);
    if (!response.ok) throw new Error('Failed to fetch disliked videos');
    return response.json();
  }
);

const youtubeSlice = createSlice({
  name: 'youtube',
  initialState: {
    // Home feed
    homeVideos: [],
    selectedCategory: 'All',
    homeLoading: false,
    homeError: null,
    
    // Shorts
    shorts: [],
    shortsLoading: false,
    shortsError: null,
    currentShortIndex: 0,
    
    // Video details
    currentVideo: null,
    videoLoading: false,
    videoError: null,
    recommendations: [],
    
    // Search
    searchResults: { videos: [], channels: [], totalResults: 0 },
    searchLoading: false,
    searchError: null,
    searchHistory: JSON.parse(localStorage.getItem('youtubeSearchHistory') || '[]'),
    
    // User interactions
    likedVideos: [],
    dislikedVideos: [],
    subscribedChannels: [],
    userLikedVideos: [],
    userDislikedVideos: [],
    likedVideosLoading: false,
    dislikedVideosLoading: false,
    
    // Categories
    categories: [
      { id: 'explore', name: 'Explore', icon: 'compass' },
      { id: 'All', name: 'All' },
      { id: 'Gaming', name: 'Gaming' },
      { id: 'Music', name: 'Music' },
      { id: 'Live', name: 'Live' },
      { id: 'Mixes', name: 'Mixes' },
      { id: 'Programming', name: 'Programming' },
      { id: 'Sports', name: 'Sports' },
      { id: 'News', name: 'News' },
      { id: 'Comedy', name: 'Comedy' }
    ]
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setCurrentShortIndex: (state, action) => {
      state.currentShortIndex = action.payload;
    },
    addToSearchHistory: (state, action) => {
      const query = action.payload;
      const history = state.searchHistory.filter(item => item !== query);
      state.searchHistory = [query, ...history].slice(0, 10);
      localStorage.setItem('youtubeSearchHistory', JSON.stringify(state.searchHistory));
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
      localStorage.removeItem('youtubeSearchHistory');
    },
    toggleVideoLike: (state, action) => {
      const videoId = action.payload;
      if (state.likedVideos.includes(videoId)) {
        state.likedVideos = state.likedVideos.filter(id => id !== videoId);
      } else {
        state.likedVideos.push(videoId);
        state.dislikedVideos = state.dislikedVideos.filter(id => id !== videoId);
      }
    },
    toggleVideoDislike: (state, action) => {
      const videoId = action.payload;
      if (state.dislikedVideos.includes(videoId)) {
        state.dislikedVideos = state.dislikedVideos.filter(id => id !== videoId);
      } else {
        state.dislikedVideos.push(videoId);
        state.likedVideos = state.likedVideos.filter(id => id !== videoId);
      }
    },
    toggleChannelSubscription: (state, action) => {
      const channelId = action.payload;
      if (state.subscribedChannels.includes(channelId)) {
        state.subscribedChannels = state.subscribedChannels.filter(id => id !== channelId);
      } else {
        state.subscribedChannels.push(channelId);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Home videos
      .addCase(fetchHomeVideos.pending, (state) => {
        state.homeLoading = true;
        state.homeError = null;
      })
      .addCase(fetchHomeVideos.fulfilled, (state, action) => {
        state.homeLoading = false;
        state.homeVideos = action.payload;
      })
      .addCase(fetchHomeVideos.rejected, (state, action) => {
        state.homeLoading = false;
        state.homeError = action.error.message;
      })
      
      // Shorts
      .addCase(fetchShorts.pending, (state) => {
        state.shortsLoading = true;
        state.shortsError = null;
      })
      .addCase(fetchShorts.fulfilled, (state, action) => {
        state.shortsLoading = false;
        state.shorts = action.payload;
      })
      .addCase(fetchShorts.rejected, (state, action) => {
        state.shortsLoading = false;
        state.shortsError = action.error.message;
      })
      
      // Video details
      .addCase(fetchVideoDetails.pending, (state) => {
        state.videoLoading = true;
        state.videoError = null;
      })
      .addCase(fetchVideoDetails.fulfilled, (state, action) => {
        state.videoLoading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoDetails.rejected, (state, action) => {
        state.videoLoading = false;
        state.videoError = action.error.message;
      })
      
      // Recommendations
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })
      
      // Search
      .addCase(searchContent.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message;
      })
      
      // Like/Dislike
      .addCase(likeVideo.fulfilled, (state, action) => {
        const { videoId, likes, dislikes, action: userAction } = action.payload;
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.currentVideo.likes = likes;
          state.currentVideo.dislikes = dislikes;
          state.currentVideo.isLikedByUser = userAction === 'like';
          if (userAction === 'like') {
            state.currentVideo.isDislikedByUser = false;
          }
        }
        // Update in home videos if present
        const homeVideo = state.homeVideos.find(v => v._id === videoId);
        if (homeVideo) {
          homeVideo.likes = likes;
          homeVideo.dislikes = dislikes;
        }
      })
      .addCase(dislikeVideo.fulfilled, (state, action) => {
        const { videoId, likes, dislikes, action: userAction } = action.payload;
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.currentVideo.likes = likes;
          state.currentVideo.dislikes = dislikes;
          state.currentVideo.isDislikedByUser = userAction === 'dislike';
          if (userAction === 'dislike') {
            state.currentVideo.isLikedByUser = false;
          }
        }
        // Update in home videos if present
        const homeVideo = state.homeVideos.find(v => v._id === videoId);
        if (homeVideo) {
          homeVideo.likes = likes;
          homeVideo.dislikes = dislikes;
        }
      })
      
      // Liked videos
      .addCase(fetchLikedVideos.pending, (state) => {
        state.likedVideosLoading = true;
      })
      .addCase(fetchLikedVideos.fulfilled, (state, action) => {
        state.likedVideosLoading = false;
        state.userLikedVideos = action.payload;
      })
      .addCase(fetchLikedVideos.rejected, (state) => {
        state.likedVideosLoading = false;
      })
      
      // Disliked videos
      .addCase(fetchDislikedVideos.pending, (state) => {
        state.dislikedVideosLoading = true;
      })
      .addCase(fetchDislikedVideos.fulfilled, (state, action) => {
        state.dislikedVideosLoading = false;
        state.userDislikedVideos = action.payload;
      })
      .addCase(fetchDislikedVideos.rejected, (state) => {
        state.dislikedVideosLoading = false;
      });
  }
});

export const {
  setSelectedCategory,
  setCurrentShortIndex,
  addToSearchHistory,
  clearSearchHistory,
  toggleVideoLike,
  toggleVideoDislike,
  toggleChannelSubscription
} = youtubeSlice.actions;

export default youtubeSlice.reducer;