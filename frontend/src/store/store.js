import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import postsSlice from './postsSlice';
import usersSlice from './usersSlice';
import youtubeSlice from './youtubeSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    users: usersSlice,
    youtube: youtubeSlice,
  },
});

export default store;