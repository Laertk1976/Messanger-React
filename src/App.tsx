import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './Layout';

const LoginPage = lazy(() =>
  import('./components/LoginPage').then((module) => ({ default: module.LoginPage })),
);
const ContactPage = lazy(() =>
  import('./components/ContactPage').then((module) => ({ default: module.ContactPage })),
);
const ContactInfoPage = lazy(() =>
  import('./components/ContactInfoPage').then((module) => ({ default: module.ContactInfoPage })),
);
const ProfilePage = lazy(() =>
  import('./components/ProfilePage').then((module) => ({ default: module.ProfilePage })),
);

export function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className='flex min-h-screen items-center justify-center text-gray-600'>Loading...</div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route path='/login' element={<LoginPage />} />
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <ContactPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/contact/:id'
              element={
                <ProtectedRoute>
                  <ContactInfoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
