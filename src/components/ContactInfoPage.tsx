import { useLocation, useParams } from 'react-router-dom';
import { contacts } from '../data/contacts';
import { InputMessage } from './InputField';

export const ContactInfoPage: React.FC = () => {
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();

  const contact =
    state?.contact ?? contacts.find((item) => item.id === Number(id));

  if (!contact) {
    return <h1>Contact not found</h1>;
  }

  return (
    <>
      <div className='flex flex-col justify-between'>
        <div className='mt-22 px-4'>
          <div className='rounded-2xl border border-neutral-400 bg-blue-100 p-6 shadow-2xl'>
            <img
              src={contact.avatar}
              alt={contact.firstName}
              className='mb-4 h-12 w-12 rounded-full'
            />
            <h1 className='text-xl font-semibold'>
              {contact.firstName} {contact.lastName}
            </h1>
            <p className='mt-2 text-gray-700'>{contact.phone}</p>
            <p className='text-gray-700'>{contact.email}</p>
          </div>
        </div>
        <div className='mt-4 px-4 fixed bottom-0 left-0 right-0 bg-white p-4 shadow-xl'>
          <InputMessage />
        </div>
      </div>
    </>
  );
};

export default ContactInfoPage;
