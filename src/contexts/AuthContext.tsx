import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, Role } from '../types';
import { api } from '../services/data';

// ── Cookie helpers (no localStorage) ─────────────────────
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

// ── Auth Context ─────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isRole: (...roles: Role[]) => boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Restore session from cookie → rehydrate from Supabase cache
    const token = getCookie('hh_session');
    if (token) {
      const fresh = api.getUserBySessionToken(token);
      if (fresh && fresh.status === 'active') return fresh;
      // Invalid token — clean up
      deleteCookie('hh_session');
    }
    return null;
  });

  const login = useCallback((email: string, password: string) => {
    const found = api.getUserByEmail(email);
    if (!found) return { success: false, error: 'invalid' };
    if (!found.password) return { success: false, error: 'invalid' };
    if (found.password !== password) return { success: false, error: 'invalid' };
    if (found.status === 'pending') return { success: false, error: 'pending' };

    // Generate session token, save to Supabase and cookie
    const sessionToken = crypto.randomUUID();
    api.updateUser(found.id, { sessionToken });
    found.sessionToken = sessionToken;
    setUser(found);
    setCookie('hh_session', sessionToken);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    if (user) {
      api.updateUser(user.id, { sessionToken: undefined });
    }
    setUser(null);
    deleteCookie('hh_session');
  }, [user]);

  const isRole = useCallback((...roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const isStaff = user?.role === 'admin' || user?.role === 'worker';

  return (
    <AuthContext.Provider value={{ user, login, logout, isRole, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
