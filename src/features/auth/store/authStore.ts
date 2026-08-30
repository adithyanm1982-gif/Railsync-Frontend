import { create } from 'zustand';
import { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

function loadInitialAuth(): { user: AuthUser | null; isAuthenticated: boolean } {
  try {
    const raw = localStorage.getItem('railsync_user');
    const token = localStorage.getItem('railsync_token');
    if (raw && token) {
      return { user: JSON.parse(raw), isAuthenticated: true };
    }
  } catch {
    // corrupted storage -- fall through to logged-out state
  }
  return { user: null, isAuthenticated: false };
}

/**
 * Auth state is hydrated SYNCHRONOUSLY at store-creation time (not in a
 * useEffect) specifically to avoid a race with DeptGuardRoute's first
 * render: previously, isAuthenticated started false and only became
 * true after AuthProvider's effect ran post-mount, so every hard
 * refresh briefly (or permanently, depending on effect timing) saw
 * isAuthenticated=false and bounced straight to /login even with a
 * valid session in localStorage. Reading localStorage inline here
 * means the store's very first value is already correct.
 */
export const useAuthStore = create<AuthState>((set) => ({
  ...loadInitialAuth(),

  login: (user, token) => {
    localStorage.setItem('railsync_token', token);
    localStorage.setItem('railsync_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('railsync_token');
    localStorage.removeItem('railsync_user');
    set({ user: null, isAuthenticated: false });
  },
}));
