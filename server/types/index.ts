// server/types/index.ts

export type Contact = {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
  phone: string;
  email: string;
};

export type Message = {
  id: number;
  contactId: number;
  text: string;
  sender: string;
  createdAt: string;
};