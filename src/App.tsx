// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
// import { Header } from './components/Header';
import { ContactPage } from './components/ContactPage';
import { ContactInfoPage } from './components/ContactInfoPage';
import { Layout } from './Layout';

export function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />} >
        <Route path='/' element={<ContactPage />} />
        <Route path='/contact/:id' element={<ContactInfoPage />} />
      </Route>
      </Routes>
    </>
  );
}

export default App;
