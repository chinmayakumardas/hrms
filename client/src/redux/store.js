// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import shortlistedReducer from './slices/ShortlistedSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shortlisted: shortlistedReducer, 
  },
});
