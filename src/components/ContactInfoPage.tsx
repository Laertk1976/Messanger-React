import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { contacts } from '@server/data/contacts';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { InputMessage } from './InputField';

export const ContactInfoPage: React.FC = () => {
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const contact =
    state?.contact ?? contacts.find((item) => item.id === Number(id));

  if (!contact) {
    return <h1>Contact not found</h1>;
  }

  return (
    <>
      <div
        className='mt-8 ml-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-300 shadow-lg'
        onClick={() => navigate('/')}
      >
        <ArrowBackIcon />
      </div>
      <div className='flex flex-col justify-between'>
        <div className='mt-5 px-4'>
          <div className='rounded-2xl border border-neutral-400 bg-blue-100 p-4 shadow-2xl'>
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
        <div className='fixed right-0 bottom-0 left-0 mt-4 bg-white p-4 px-4 shadow-xl'>
          <InputMessage contactId={contact.id} />
        </div>
      </div>
    </>
  );
};

export default ContactInfoPage;
