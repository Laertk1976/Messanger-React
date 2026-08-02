import type { Contact } from '@server/types';

export const contacts: Contact[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    avatar: 'https://i.pravatar.cc/150?img=1',
    phone: '+1 555-123-4567',
    email: 'john.smith@example.com',
  },
  {
    id: 2,
    firstName: 'Emma',
    lastName: 'Johnson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    phone: '+1 555-987-6543',
    email: 'emma.johnson@example.com',
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Brown',
    avatar: 'https://i.pravatar.cc/150?img=12',
    phone: '+1 555-222-3344',
    email: 'michael.brown@example.com',
  },
  {
    id: 4,
    firstName: 'Sophia',
    lastName: 'Davis',
    avatar: 'https://i.pravatar.cc/150?img=20',
    phone: '+1 555-444-5566',
    email: 'sophia.davis@example.com',
  },
  {
    id: 5,
    firstName: 'Daniel',
    lastName: 'Wilson',
    avatar: 'https://i.pravatar.cc/150?img=33',
    phone: '+1 555-777-8899',
    email: 'daniel.wilson@example.com',
  },
];
export default contacts;