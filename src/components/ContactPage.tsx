import { subscribeContacts } from '@/api';
import type { Contact } from '@server/types';
import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';
import { useAuth } from '../auth';

type ContactListItemProps = {
  contact: Contact;
  onClick: (contact: Contact) => void;
};

const ContactListItem = React.memo<ContactListItemProps>(({ contact, onClick }) => (
  <button
    type='button'
    onClick={() => onClick(contact)}
    className='mb-3 flex w-full cursor-pointer items-center gap-4 rounded-xl border bg-white p-3 text-left shadow-lg'
  >
    <img
      src={contact.avatar}
      alt={contact.firstName}
      loading='lazy'
      decoding='async'
      className='h-14 w-14 rounded-full'
    />

    <div>
      <h2 className='font-semibold'>
        {contact.firstName} {contact.lastName}
      </h2>
      <p className='text-sm text-gray-600'>{contact.phone}</p>
      <p className='text-sm text-gray-600'>{contact.email}</p>
    </div>
  </button>
));

export const ContactPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || typeof user.id !== 'string') return;
    return subscribeContacts(user.id, setContacts);
  }, [user]);

  const handleContactClick = React.useCallback(
    (contact: Contact) => {
      navigate(`/contact/${contact.id}`, { state: { contact } });
    },
    [navigate],
  );

  const filteredContacts = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase();

    if (!normalizedQuery) {
      return contacts;
    }

    return contacts.filter((contact) => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      return fullName.includes(normalizedQuery);
    });
  }, [contacts, deferredSearch]);

  return (
    <>
      <InputField value={search} onChange={setSearch} />
      <div className='mt-26 bg-white px-4'>
        {filteredContacts.map((contact) => (
          <ContactListItem key={contact.id} contact={contact} onClick={handleContactClick} />
        ))}
      </div>
    </>
  );
};
