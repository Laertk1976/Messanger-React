import type { Contact } from '@server/types';
import { createContext, useContext } from 'react';

type AuthResult = {
  success: boolean;
  message?: string;
};

type AuthContextType = {
  user: Contact | null;
  login: (identifier: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  updateAvatar: (file: File) => Promise<AuthResult>;
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
