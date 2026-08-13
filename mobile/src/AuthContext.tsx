import React, { useCallback, useMemo, useState } from 'react';
import { login } from './api';
import { AuthContext } from './auth';
import type { Contact } from './types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Contact | null>(null);
  const signIn = useCallback(async (identifier: string, password: string) => {
    const result = await login(identifier, password);
    setUser(result.contact);
  }, []);
  const signOut = useCallback(() => setUser(null), []);
  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
