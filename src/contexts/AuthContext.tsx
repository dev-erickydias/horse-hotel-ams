import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { User, Role } from '../types';
import { api } from '../services/data';
import { verifyPassword, isPlaintextPassword, hashPassword } from '../utils/password';

// ── Cookie helpers (no localStorage) ─────────────────────
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict; Secure`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict; Secure`;
}

// ── Secure session token (256-bit) ───────────────────────
function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Rate limiting ────────────────────────────────────────
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

interface LoginAttempts {
  count: number;
  lastAttempt: number;
  lockedUntil: number;
}

// ── Auth Context ─────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

  const attemptsRef = useRef<Map<string, LoginAttempts>>(new Map());

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();

    // ── Rate limit check ──
    const now = Date.now();
    const attempts = attemptsRef.current.get(normalizedEmail) || { count: 0, lastAttempt: 0, lockedUntil: 0 };

    if (attempts.lockedUntil > now) {
      const minutesLeft = Math.ceil((attempts.lockedUntil - now) / 60000);
      return { success: false, error: 'rate_limited', };
    }

    // Reset count if last attempt was more than lockout period ago
    if (now - attempts.lastAttempt > LOCKOUT_MS) {
      attempts.count = 0;
    }

    // ── Credential verification ──
    const found = api.getUserByEmail(normalizedEmail);
    if (!found || !found.password) {
      // Track failed attempt even for non-existent users (prevent enumeration)
      attempts.count++;
      attempts.lastAttempt = now;
      if (attempts.count >= MAX_ATTEMPTS) {
        attempts.lockedUntil = now + LOCKOUT_MS;
      }
      attemptsRef.current.set(normalizedEmail, attempts);
      return { success: false, error: 'invalid' };
    }

    const passwordValid = await verifyPassword(password, found.password);
    if (!passwordValid) {
      attempts.count++;
      attempts.lastAttempt = now;
      if (attempts.count >= MAX_ATTEMPTS) {
        attempts.lockedUntil = now + LOCKOUT_MS;
      }
      attemptsRef.current.set(normalizedEmail, attempts);
      return { success: false, error: 'invalid' };
    }

    if (found.status === 'pending') return { success: false, error: 'pending' };

    // ── Migrate plaintext password to bcrypt on successful login ──
    if (isPlaintextPassword(found.password)) {
      const hashed = await hashPassword(password);
      api.updateUser(found.id, { password: hashed });
      found.password = hashed;
    }

    // ── Create session ──
    const sessionToken = generateSessionToken();
    api.updateUser(found.id, { sessionToken });
    found.sessionToken = sessionToken;
    setUser(found);
    setCookie('hh_session', sessionToken);

    // Reset failed attempts on success
    attemptsRef.current.delete(normalizedEmail);

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
