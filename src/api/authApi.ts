import { axiosClient } from './axiosClient';
import { AuthCredentials, User } from '@/types/user.types';

export interface LoginResponse {
  user: User;
  token: string;
}

export const login = (credentials: AuthCredentials): Promise<LoginResponse> => {
  return axiosClient.post<LoginResponse>('/auth/login', credentials).then((r) => r.data);
};

export const logout = (): Promise<void> => {
  // Client-side logout is synchronous (removes local storage token).
  // This API call is a stub that can hook into a real logout endpoint.
  return Promise.resolve();
};
