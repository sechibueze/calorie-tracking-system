import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, Session } from './auth.types';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  hasHydrated: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasHydrated: false,
      setSession: ({ token, user }) => set({ token, user }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: 'caltrack-auth',
      partialize: ({ token, user }) => ({ token, user }),
      onRehydrateStorage: () => () => useAuthStore.setState({ hasHydrated: true }),
    },
  ),
);