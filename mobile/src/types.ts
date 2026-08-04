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
  sender: 'user' | 'contact';
  createdAt: string;
};
