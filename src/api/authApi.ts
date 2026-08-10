import { axiosClient } from './axiosClient';
import type { AuthCredentials, User } from '@/types/user.types';

export interface LoginResponse {
  user: User;
  token: string;
}

export const login = async (credentials: AuthCredentials): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

export const logout = (): Promise<void> => {
  // Client-side logout is synchronous (removes local storage token).
  return Promise.resolve();
};
