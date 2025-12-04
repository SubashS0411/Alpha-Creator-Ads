import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: {
    _id: '64a1b2c3d4e5f6789012345a', // Hardcoded user ID
    username: 'demo_user',
    fullName: 'Demo User',
    profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  },
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = authSlice.actions;
export default authSlice.reducer;