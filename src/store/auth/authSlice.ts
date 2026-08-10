import { createSlice } from '@reduxjs/toolkit';
import type { User } from '@/types/user.types';
import { login } from './auth.actions';

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('taskflow_token'),
  status: 'idle',
  error: null,
};

const storedUser = localStorage.getItem('taskflow_user');
if (storedUser) {
  try {
    initialState.user = JSON.parse(storedUser);
    initialState.status = 'succeeded';
  } catch {
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('taskflow_token');
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Login failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export { login } from './auth.actions';
export default authSlice.reducer;
