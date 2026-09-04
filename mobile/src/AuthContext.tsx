import React, { useCallback, useMemo, useState } from 'react';
import { login as apiLogin } from './api';
import { AuthContext } from './auth';
import type { Contact } from './types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Contact | null>(null);

  const login = useCallback(async (identifier: string, password: string) => {
    try {
      const result = await apiLogin(identifier, password);
      setUser(result.contact);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || password.trim().length < 6) {
      return {
        success: false,
        message: 'Use a valid email and a password with at least 6 characters.',
      };
    }

    const newUser: Contact = {
      id: Date.now(),
      firstName: 'New',
      lastName: 'User',
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(trimmedEmail)}`,
      phone: '',
      email: trimmedEmail,
    };

    setUser(newUser);
    return { success: true };
  }, []);

  const updateAvatar = useCallback(async (avatarUri: string) => {
    if (!avatarUri.trim()) {
      return { success: false, message: 'Please choose a valid image.' };
    }

    setUser((current) => (current ? { ...current, avatar: avatarUri } : current));
    return { success: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const signIn = useCallback(async (identifier: string, password: string) => {
    const result = await login(identifier, password);
    if (!result.success) {
      throw new Error(result.message ?? 'Login failed');
    }
  }, [login]);

  const signOut = useCallback(() => logout(), [logout]);

  const value = useMemo(
    () => ({ user, login, register, updateAvatar, logout, signIn, signOut }),
    [user, login, register, updateAvatar, logout, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
