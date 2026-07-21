import React from 'react';
// import { InputField } from './InputField';

export function Header(): React.ReactElement {
  return (
    <>
      <div className='fixed top-0 right-0 left-0 flex'>
        <header className='absolute top-0 right-0 left-0 h-18 flex-col items-start justify-center rounded-b-2xl bg-[#383b4a] text-3xl font-bold text-white shadow-xl'>
          <h1 className='p-4'>OPUS</h1>
        </header>
        {/* <InputField /> */}
      </div>
    </>
  );
}
export default Header;
