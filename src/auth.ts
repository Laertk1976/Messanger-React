import type { Contact } from '@server/types';
import { createContext, useContext } from 'react';

type AuthContextType = {
  user: Contact | null;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
