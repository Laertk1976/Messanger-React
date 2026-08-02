import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ContactInfoPage } from './components/ContactInfoPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './Layout';

export function App() {
  return (
    <AuthProvider>
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
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
