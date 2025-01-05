import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  username: null,
  role: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, username, role, email } = action.payload;
      state.token = token;
      state.username = username;
      state.role = role;
      state.email = email;
    },
    logout: (state) => {
      // Reset the state on logout
      state.token = null;
      state.username = null;
      state.role = null;
      state.email = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
