import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '@/features/auth/auth.store';
import type { ApiErrorBody } from '@/types/api';
import { ApiError } from './api-error';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the access token to every request.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status ?? 0;
    const body = error.response?.data;

    if (status === 401 && useAuthStore.getState().token) useAuthStore.getState().clearSession();

    if (!error.response) {
      return Promise.reject(
        new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server. Check your connection and try again.'),
      );
    }
    return Promise.reject(
      new ApiError(
        status,
        body?.error?.code ?? 'UNKNOWN_ERROR',
        body?.error?.message ?? 'Something went wrong. Please try again.',
        body?.error?.details,
      ),
    );
  },
);