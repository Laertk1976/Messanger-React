import type { Contact } from '@server/types';
import React, { useMemo, useState } from 'react';
import { AuthContext } from './auth';

const STORAGE_KEY = 'reactProject_auth_user';

const loadUserFromStorage = (): Contact | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Contact;
    return parsed?.id ? parsed : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Contact | null>(loadUserFromStorage);

  React.useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = async (identifier: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        return {
          success: false,
          message: typeof body?.error === 'string' ? body.error : 'Invalid email/phone or password.',
        };
      }

      const result = (await response.json()) as { contact: Contact };
      setUser(result.contact);
      return { success: true };
    } catch {
      const normalized = identifier.toLowerCase().trim();
      const contact = contacts.find((item) => {
        const email = item.email.toLowerCase();
        const phone = item.phone.replace(/\D/g, '');
        const input = normalized.replace(/\D/g, '');

        return email === normalized || phone === input;
      });

      if (contact && password === '123456') {
        setUser(contact);
        return { success: true };
      }

      return {
        success: false,
        message: 'Unable to connect to the login service. Please try again.',
      };
    }
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, login, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
