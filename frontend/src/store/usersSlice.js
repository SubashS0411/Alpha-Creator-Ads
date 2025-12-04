import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../services/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'users/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userAPI.getProfile(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getAllUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

const initialState = {
  users: [],
  currentProfile: null,
  currentProfilePosts: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
      state.currentProfilePosts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload.user;
        state.currentProfilePosts = action.payload.posts;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all users
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentProfile } = usersSlice.actions;
export default usersSlice.reducer;