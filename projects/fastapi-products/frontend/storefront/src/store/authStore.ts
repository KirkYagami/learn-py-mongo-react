import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi } from '../api/services';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      isAuthenticated: false,

      login: async (username, password) => {
        const { access_token } = await loginApi(username, password);
        localStorage.setItem('access_token', access_token);
        set({ token: access_token, username, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ token: null, username: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({ token: s.token, username: s.username, isAuthenticated: s.isAuthenticated }),
    }
  )
);
