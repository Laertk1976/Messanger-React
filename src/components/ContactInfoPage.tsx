import { useLocation, useParams } from 'react-router-dom';
import { contacts } from '../data/contacts';

export const ContactInfoPage: React.FC = () => {
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();

  const contact = state?.contact ?? contacts.find((item) => item.id === Number(id));

  if (!contact) {
    return <h1>Contact not found</h1>;
  }

  return (
    <div className='mt-46 px-4'>
      <div className='rounded-2xl border bg-white p-6 shadow-lg'>
        <img src={contact.avatar} alt={contact.firstName} className='mb-4 h-24 w-24 rounded-full' />
        <h1 className='text-2xl font-semibold'>
          {contact.firstName} {contact.lastName}
        </h1>
        <p className='mt-2 text-gray-700'>{contact.phone}</p>
        <p className='text-gray-700'>{contact.email}</p>
      </div>
    </div>
  );
};

export default ContactInfoPage;
