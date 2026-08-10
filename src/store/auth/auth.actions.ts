import { createAsyncThunk } from '@reduxjs/toolkit';
import type { User, AuthCredentials } from '@/types/user.types';
import { login as loginApi } from '@/api/authApi';
import type { NormalizedApiError } from '@/types/api.types';

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
