import LoginIcon from '@mui/icons-material/Login';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const hideButtons = location.pathname === '/login' || location.pathname.startsWith('/contact/');

  return (
    <header className='rounded-b-2xl bg-[#383b4a] shadow-xl'>
      <div className='flex h-18 items-center justify-between px-4'>
        <h1 className='text-3xl font-bold text-white'>OPUS</h1>

        <div className='flex items-center gap-2'>
          {!hideButtons && (
            <>
              {!user ? (
                <button
                  type='button'
                  className='flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-1 text-white'
                  onClick={() => navigate('/login')}
                >
                  Log In
                  <LoginIcon sx={{ fontSize: 18 }} />
                </button>
              ) : (
                <>
                  <span className='text-sm text-white/80'>Signed in as {user.firstName}</span>
                  <button
                    type='button'
                    className='rounded-lg bg-transparent px-3 py-1 text-white ring-1 ring-white/20 transition hover:bg-white/10'
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                  >
                    Log out
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
export default Header;
