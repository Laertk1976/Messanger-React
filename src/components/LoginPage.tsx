import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = identifier.trim();

    if (!trimmed) {
      setError('Please enter an email or phone number.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    const result = await login(trimmed, password);
    if (result.success) {
      navigate(from, { replace: true });
      return;
    }

    setError(result.message ?? 'Invalid email/phone or password.');
  };

  return (
    <div className='mx-auto mt-10 max-w-md rounded-3xl border border-neutral-300 bg-white p-8 shadow-2xl'>
      <h1 className='mb-4 text-3xl font-semibold text-slate-900'>Log in</h1>
      <p className='mb-6 text-sm text-slate-600'>Use a contact email or phone number to sign in.</p>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <label className='block'>
          <span className='text-sm font-medium text-slate-700'>Email or phone</span>
          <input
            type='text'
            value={identifier}
            onChange={(event) => {
              setIdentifier(event.target.value);
              setError('');
            }}
            placeholder='john.smith@example.com or +1 555-123-4567'
            className='mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200'
          />
        </label>

        <label className='block'>
          <span className='text-sm font-medium text-slate-700'>Password</span>
          <div className='relative mt-2'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              placeholder='Password123'
              className='w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 pr-28 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200'
            />
            <button
              type='button'
              onClick={() => setShowPassword((value) => !value)}
              className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200'
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        {error ? <p className='text-sm text-red-600'>{error}</p> : null}

        <button
          type='submit'
          className='w-full rounded-full bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700'
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
