import { io } from 'socket.io-client';
import type { Contact } from './data/contacts';

export type Message = {
  id: number;
  contactId: number;
  text: string;
  sender: 'user' | 'contact';
  createdAt: string;
};

export async function getContacts(): Promise<Contact[]> {
  const response = await fetch('http://localhost:3000/api/contacts');

  if (!response.ok) {
    throw new Error('Unable to load contacts');
  }

  return response.json();
}

export async function getMessages(contactId: number): Promise<Message[]> {
  const response = await fetch(
    `http://localhost:3000/api/contacts/${contactId}/messages`,
  );

  if (!response.ok) {
    throw new Error('Unable to load messages');
  }

  return response.json();
}

export function createMessagingSocket() {
  return io('http://localhost:3000');
}