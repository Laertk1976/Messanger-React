import type { Contact } from '@server/types';
import { io } from 'socket.io-client';

export type Message = {
  id: number;
  contactId: number;
  text: string;
  sender: 'user' | 'contact';
  createdAt: string;
};

let contactsCache: { data: Contact[] | null; promise: Promise<Contact[]> | null } = {
  data: null,
  promise: null,
};

const messageCache = new Map<number, { data: Message[] | null; promise: Promise<Message[]> | null }>();

export async function getContacts(): Promise<Contact[]> {
  if (contactsCache.data) {
    return contactsCache.data;
  }

  if (contactsCache.promise) {
    return contactsCache.promise;
  }

  const promise = fetch('/api/contacts')
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Unable to load contacts');
      }

      const contacts = (await response.json()) as Contact[];
      contactsCache = { data: contacts, promise: null };
      return contacts;
    })
    .catch((error) => {
      contactsCache = { data: null, promise: null };
      throw error;
    });

  contactsCache.promise = promise;
  return promise;
}

export async function getMessages(contactId: number): Promise<Message[]> {
  const cached = messageCache.get(contactId);

  if (cached?.data) {
    return cached.data;
  }

  if (cached?.promise) {
    return cached.promise;
  }

  const promise = fetch(`/api/contacts/${contactId}/messages`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Unable to load messages');
      }

      const messages = (await response.json()) as Message[];
      messageCache.set(contactId, { data: messages, promise: null });
      return messages;
    })
    .catch((error) => {
      messageCache.set(contactId, { data: null, promise: null });
      throw error;
    });

  messageCache.set(contactId, { data: null, promise });
  return promise;
}

export function createMessagingSocket() {
  return io();
}