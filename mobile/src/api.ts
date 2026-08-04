import { io, Socket } from 'socket.io-client';
import type { Contact } from './types';

const API_BASE_URL = 'http://192.168.1.126:3001';

export type Message = {
  id: number;
  contactId: number;
  text: string;
  sender: 'user' | 'contact';
  createdAt: string;
};

export async function login(identifier: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(typeof body?.error === 'string' ? body.error : 'Login failed');
  }

  return response.json() as Promise<{ contact: Contact }>;
}

export async function getContacts(): Promise<Contact[]> {
  const response = await fetch(`${API_BASE_URL}/api/contacts`);
  if (!response.ok) {
    throw new Error('Unable to load contacts');
  }

  return response.json() as Promise<Contact[]>;
}

export async function getMessages(contactId: number): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/api/contacts/${contactId}/messages`);
  if (!response.ok) {
    throw new Error('Unable to load messages');
  }

  return response.json() as Promise<Message[]>;
}

let socket: Socket | null = null;

export function connectMessagingSocket() {
  if (!socket) {
    socket = io(API_BASE_URL, { transports: ['websocket'] });
  }

  return socket;
}

export function disconnectMessagingSocket() {
  socket?.disconnect();
  socket = null;
}

export function sendMessage(contactId: number, text: string) {
  const activeSocket = socket ?? connectMessagingSocket();
  activeSocket.emit('join_contact', contactId);
  activeSocket.emit('send_message', { contactId, text });
}
