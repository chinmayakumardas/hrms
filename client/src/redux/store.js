// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import shortlistedReducer from './slices/ShortlistedSlice';

export const store = configureStore({
  reducer: {
    shortlisted: shortlistedReducer, // reducer from ShortlistedSlice
  },
});
