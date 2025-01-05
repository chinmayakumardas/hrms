// redux/slices/ShortlistedSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  applications: [], 
  loading: false,    
};

const ShortlistedSlice = createSlice({
  name: 'shortlisted',
  initialState,
  reducers: {

    setApplications: (state, action) => {
      state.applications = action.payload;
    },
 
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setApplications, setLoading } = ShortlistedSlice.actions;

export default ShortlistedSlice.reducer;
