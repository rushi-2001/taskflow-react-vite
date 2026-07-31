import axios from 'axios';
import type { NormalizedApiError } from '@/types/api.types';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized: NormalizedApiError = {
      message: error.response?.data?.message ?? error.message ?? 'Unexpected error',
      status: error.response?.status ?? 0,
    };
    return Promise.reject(normalized);
  }
);
