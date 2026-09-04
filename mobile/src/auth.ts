import { createContext, useContext } from 'react';
import type { Contact } from './types';

export type AuthResult = {
  success: boolean;
  message?: string;
};

export type AuthContextValue = {
  user: Contact | null;
  login: (identifier: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  updateAvatar: (avatarUri: string) => Promise<AuthResult>;
  logout: () => void;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
