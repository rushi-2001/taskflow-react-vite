import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, AuthCredentials } from '@/types/user.types';
import { login as loginApi } from '@/api/authApi';
import { NormalizedApiError } from '@/types/api.types';

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

// Bootstrap initial state from localStorage
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

export const login = createAsyncThunk<
  { user: User; token: string },
  AuthCredentials,
  { rejectValue: NormalizedApiError }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginApi(credentials);
    localStorage.setItem('taskflow_token', data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err as NormalizedApiError);
  }
});

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
export default authSlice.reducer;
