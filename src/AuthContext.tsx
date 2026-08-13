import type { Contact } from '@server/types';
import React, { useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AuthContext } from './auth';
import { firebaseAuth, firestore } from './firebase';

const avatarStorageKey = (uid: string) => `reactProject_avatar_${uid}`;

function toContact(user: User): Contact {
  const email = user.email ?? '';
  const localPart = email.split('@')[0] || 'User';
  const [firstName, ...rest] = localPart.replace(/[._-]+/g, ' ').split(' ');
  const savedAvatar = localStorage.getItem(avatarStorageKey(user.uid));

  return {
    id: user.uid,
    firstName: firstName || 'User',
    lastName: rest.join(' '),
    avatar: savedAvatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(user.uid)}`,
    phone: '',
    email,
  };
}

function friendlyAuthError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  if (code === 'auth/email-already-in-use') return 'An account with this email already exists.';
  if (code === 'auth/invalid-email') return 'Enter a valid email address.';
  if (code === 'auth/weak-password') return 'Use a password with at least 6 characters.';
  if (code === 'auth/invalid-credential') return 'Incorrect email or password.';
  if (code === 'auth/operation-not-allowed') return 'Email/password sign-in is not enabled in Firebase yet.';
  return 'Authentication failed. Please try again.';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Contact | null>(null);

  React.useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      const contact = toContact(firebaseUser);
      setUser(contact);
      void setDoc(
        doc(firestore, 'users', firebaseUser.uid),
        { uid: firebaseUser.uid, ...contact },
        { merge: true },
      );
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: friendlyAuthError(error) };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: friendlyAuthError(error) };
    }
  };

  const updateAvatar = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return { success: false, message: 'Please choose an image file.' };
    }
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, message: 'Choose an image smaller than 2 MB.' };
    }

    const firebaseUser = firebaseAuth.currentUser;
    if (!firebaseUser) return { success: false, message: 'Please sign in again.' };

    try {
      const image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      localStorage.setItem(avatarStorageKey(firebaseUser.uid), image);
      setUser(toContact(firebaseUser));
      return { success: true };
    } catch {
      return { success: false, message: 'Unable to read that image. Please try another file.' };
    }
  };

  const logout = () => void signOut(firebaseAuth);

  const value = useMemo(
    () => ({ user, login, register, updateAvatar, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
