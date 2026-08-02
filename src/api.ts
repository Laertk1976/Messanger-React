import type { Contact } from '@server/types';
import { io } from 'socket.io-client';

export type Message = {
  id: number;
  contactId: number;
  text: string;
  sender: 'user' | 'contact';
  createdAt: string;
};

export async function getContacts(): Promise<Contact[]> {
  const response = await fetch('/api/contacts');

  if (!response.ok) {
    throw new Error('Unable to load contacts');
  }

  return response.json();
}

export async function getMessages(contactId: number): Promise<Message[]> {
  const response = await fetch(
    `/api/contacts/${contactId}/messages`,
  );

  if (!response.ok) {
    throw new Error('Unable to load messages');
  }

  return response.json();
}

export function createMessagingSocket() {
  return io();
}