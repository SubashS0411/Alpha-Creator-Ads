import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postAPI } from '../services/api';

// Mock data for when API is not available
const mockPosts = [
  {
    _id: '1',
    author: {
      _id: '64a1b2c3d4e5f6789012345a',
      username: 'demo_user',
      fullName: 'Demo User',
      profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
    },
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
    caption: 'Beautiful mountain landscape 🏔️ #nature #mountains',
    location: 'Swiss Alps',
    aspectRatio: '1:1',
    likes: [],
    likesCount: 24,
    comments: [
      {
        _id: 'c1',
        text: 'Amazing photo! 😍',
        author: {
          _id: '2',
          username: 'nature_lover',
          profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
        }
      }
    ],
    commentsCount: 1,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    author: {
      _id: '2',
      username: 'nature_lover',
      fullName: 'Nature Explorer',
      profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop',
    caption: 'Lost in the forest 🌲 #adventure #hiking',
    location: 'Pacific Northwest',
    aspectRatio: '1:1',
    likes: [],
    likesCount: 18,
    comments: [],
    commentsCount: 0,
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    author: {
      _id: '3',
      username: 'foodie_pics',
      fullName: 'Food Photographer',
      profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=800&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=800&fit=crop',
    caption: 'Delicious homemade pizza! 🍕 Recipe in bio',
    location: 'My Kitchen',
    aspectRatio: '1:1',
    likes: [],
    likesCount: 42,
    comments: [
      {
        _id: 'c2',
        text: 'Looks amazing! Recipe please? 🤤',
        author: {
          _id: '64a1b2c3d4e5f6789012345a',
          username: 'demo_user',
          profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
        }
      }
    ],
    commentsCount: 1,
    createdAt: new Date().toISOString()
  }
];

// Async thunks
export const fetchFeed = createAsyncThunk(
  'posts/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      // Try the new database API first
      const response = await fetch('http://localhost:5000/api/db/posts');
      if (response.ok) {
        const posts = await response.json();
        // Transform the data to match our expected format
        return posts.map(post => ({
          _id: post._id || post.userId,
          author: {
            _id: post.userId,
            username: post.username,
            fullName: post.username,
            profilePictureUrl: post.userProfilePicture
          },
          type: 'image',
          mediaUrl: post.imageUrl,
          imageUrl: post.imageUrl,
          caption: post.caption,
          location: post.location,
          aspectRatio: '1:1',
          likes: [],
          likesCount: post.likes || 0,
          comments: [],
          commentsCount: post.comments || 0,
          createdAt: post.createdAt || new Date().toISOString()
        }));
      } else {
        throw new Error('Database API not available');
      }
    } catch (error) {
      try {
        const response = await postAPI.getFeed();
        return response.data;
      } catch (error2) {
        console.log('Both APIs unavailable, using mock data');
        return mockPosts; // Return mock data when both APIs fail
      }
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postAPI.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async ({ postId, userId }, { rejectWithValue }) => {
    try {
      const response = await postAPI.toggleLike(postId, userId);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, commentData }, { rejectWithValue }) => {
    try {
      const response = await postAPI.addComment(postId, commentData);
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

const initialState = {
  feed: [],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updatePostOptimistic: (state, action) => {
      const { postId, updates } = action.payload;
      const post = state.feed.find(p => p._id === postId);
      if (post) {
        Object.assign(post, updates);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feed
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.feed.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Toggle like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, liked, likesCount } = action.payload;
        const post = state.feed.find(p => p._id === postId);
        if (post) {
          post.likesCount = likesCount;
          // Update likes array would require the full likes data from server
        }
      })
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.feed.find(p => p._id === postId);
        if (post) {
          post.comments.push(comment);
          post.commentsCount = post.comments.length;
        }
      });
  },
});

export const { clearError, updatePostOptimistic } = postsSlice.actions;
export default postsSlice.reducer;