import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateAvatar } = useAuth();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <main className='mx-auto mt-10 max-w-md px-4'>
      <section className='rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl'>
        <img
          src={user.avatar}
          alt='Your profile avatar'
          className='mx-auto h-28 w-28 rounded-full border-4 border-blue-100 object-cover'
        />
        <input
          ref={imageInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const result = await updateAvatar(file);
            setError(result.success ? '' : result.message ?? 'Unable to update your photo.');
            event.target.value = '';
          }}
        />
        <button
          type='button'
          onClick={() => imageInputRef.current?.click()}
          className='mt-3 text-sm font-medium text-blue-700 underline cursor-pointer underline-offset-4 hover:text-blue-900'
        >
          Change profile photo
        </button>
        {error ? <p className='mt-2 text-sm text-red-600'>{error}</p> : null}
        <p className='mt-6 text-sm font-medium uppercase tracking-wide text-blue-600'>My profile</p>
        <h1 className='mt-1 text-3xl font-semibold text-slate-900'>{fullName}</h1>
        <p className='mt-2 break-all text-slate-600'>{user.email}</p>

        <div className='mt-8 space-y-3'>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='w-full rounded-full bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700'
          >
            Back to messages
          </button>
          <button
            type='button'
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className='w-full rounded-full border border-slate-300 px-4 py-3 text-slate-700 transition hover:bg-slate-50'
          >
            Log out
          </button>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
