import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, Role } from '../types';
import { api } from '../services/data';

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
    const stored = localStorage.getItem('horse_hotel_auth');
    if (stored) { try { return JSON.parse(stored); } catch { /* */ } }
    return null;
  });

  const login = useCallback((email: string, password: string) => {
    const found = api.getUserByEmail(email);
    if (!found) return { success: false, error: 'invalid' };
    if (!found.password) return { success: false, error: 'invalid' };
    if (found.password !== password) return { success: false, error: 'invalid' };
    setUser(found);
    localStorage.setItem('horse_hotel_auth', JSON.stringify(found));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('horse_hotel_auth');
  }, []);

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
