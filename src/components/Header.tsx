import React from 'react';
import {useState} from 'react';

export function Header(): React.ReactElement {
  const [search, setSearch] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter'){
      console.log({search});
      setSearch('');
    }
  }
  return (
    <>
      <div className='fixed top-0 right-0 left-0 flex'>
        <header className='absolute top-0 right-0 left-0 h-18 flex-col items-start justify-center rounded-b-2xl bg-[#383b4a] text-3xl font-bold text-white shadow-xl'>
          <h1 className='p-4'>L.o.c.a.L</h1>
        </header>
        <div className='h-14 w-full px-4 absolute top-20 '>
          <input type='search' placeholder='Find contacts...' 
          value={search}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearch(e.target.value)}
          className='h-full w-full text-lg text-black rounded-2xl border bg-white shadow-xl p-2' />
        </div>
      </div>
    </>
  );
};
export default Header;