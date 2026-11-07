import { api } from '@/lib/api-client';
import type { ApiSuccess } from '@/types/api';
import type { ForgotPasswordInput, LoginInput, SignupInput } from './auth.schemas';
import type { AuthUser, Session } from './auth.types';


export const authApi = {
  async login(input: LoginInput): Promise<Session> {
    const { data } = await api.post<ApiSuccess<Session>>('/auth', input);
    return data.data;
  },

  async signup({ name, email, password }: SignupInput): Promise<Session> {
    const { data } = await api.post<ApiSuccess<Session>>('/auth/signup', { name, email, password });
    return data.data;
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await api.post('/auth/forgot-password', input);
  },
  async me(signal?: AbortSignal): Promise<AuthUser> {
    const { data } = await api.get<ApiSuccess<AuthUser>>('/auth/me', { signal });
    console.log('auth/me', data.data)
    return data.data;
  },
};