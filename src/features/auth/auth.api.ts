import { api } from '@/lib/api-client';
import type { ApiSuccess } from '@/types/api';
import type { ForgotPasswordInput, LoginInput, SignupInput } from './auth.schemas';
import type { Session } from './auth.types';


export const authApi = {
  async login(input: LoginInput): Promise<Session> {
    const { data } = await api.post<ApiSuccess<Session>>('/auth/login', input);
    return data.data;
  },

  async signup({ name, email, password }: SignupInput): Promise<Session> {
    const { data } = await api.post<ApiSuccess<Session>>('/auth/signup', { name, email, password });
    return data.data;
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await api.post('/auth/forgot-password', input);
  },
};