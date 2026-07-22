import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContacts } from '../api';
import type { Contact } from '../data/contacts';
import InputField from './InputField';
//  import { ContactInfoPage } from './ContactInfoPage';

export const ContactPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getContacts().then(setContacts).catch(console.error);
  }, []);
  const handleContactClick = (contact: Contact) => {
    navigate(`/contact/${contact.id}`, { state: { contact } });
    console.log(contact);
  };

  const filteredContacts = contacts.filter((contact) =>
    `${contact.firstName} ${contact.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <>
      <InputField value={search} onChange={setSearch} />
      <div className='mt-46 bg-white px-4'>
        {filteredContacts.map((contact) => (
          <button
            key={contact.id}
            type='button'
            onClick={() => handleContactClick(contact)}
            className='mb-3 flex w-full cursor-pointer items-center gap-4 rounded-xl border bg-white p-3 text-left shadow-lg'
          >
            <img
              src={contact.avatar}
              alt={contact.firstName}
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
        ))}
      </div>
    </>
  );
};
