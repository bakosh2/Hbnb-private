import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  nationality?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const USERS_KEY = 'mabat_users_v2';
const SESSION_KEY = 'mabat_session_v2';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const { userId } = JSON.parse(raw);
        const users = getUsers();
        if (users[userId]) setUser(users[userId].user);
      }
    } catch { /* ignore */ }
  }, []);

  const getUsers = (): Record<string, { user: User; passwordHash: string }> => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
    catch { return {}; }
  };

  const saveUsers = (u: Record<string, { user: User; passwordHash: string }>) =>
    localStorage.setItem(USERS_KEY, JSON.stringify(u));

  const hash = (p: string) => btoa(encodeURIComponent(p + '_mabat_v2'));

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const users = getUsers();
    const emailKey = email.toLowerCase().trim();
    // Check if email already used
    const existing = Object.values(users).find(u => u.user.email.toLowerCase() === emailKey);
    if (existing) return { success: false, error: 'البريد الإلكتروني مسجّل مسبقاً' };
    if (password.length < 6) return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    const newUser: User = {
      id: crypto.randomUUID(),
      email: emailKey,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      createdAt: new Date().toISOString(),
    };
    users[newUser.id] = { user: newUser, passwordHash: hash(password) };
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newUser.id }));
    setUser(newUser);
    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const users = getUsers();
    const emailKey = email.toLowerCase().trim();
    const entry = Object.values(users).find(u => u.user.email.toLowerCase() === emailKey);
    if (!entry) return { success: false, error: 'البريد الإلكتروني غير مسجّل' };
    if (entry.passwordHash !== hash(password)) return { success: false, error: 'كلمة المرور غير صحيحة' };
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: entry.user.id }));
    setUser(entry.user);
    return { success: true };
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    const users = getUsers();
    if (users[user.id]) {
      users[user.id].user = updated;
      saveUsers(users);
    }
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}
