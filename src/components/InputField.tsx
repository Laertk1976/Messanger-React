import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';

type InputFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const InputField: React.FC<InputFieldProps> = () => {
  const [search, setSearch] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log({ search });
      setSearch('');
    }
  };

  return (
    <div className='absolute top-20 h-14 w-full px-4'>
      <input
        type='text'
        placeholder='Find contacts...'
        value={search}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearch(e.target.value)}
        className='h-full w-full rounded-2xl border bg-white p-2 text-lg text-black shadow-xl'
      />
      <SearchIcon className='absolute top-1/2 right-5 -translate-y-1/2 transform text-gray-500' />
    </div>
  );
};
export default InputField;

export const InputMessage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, message]);
    setMessage('');
  };

  const handleSend = () => {
    sendMessage();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Messages */}
      <div className='flex flex-col gap-2'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className='flex justify-end rounded-lg bg-green-100 p-2 px-3 font-bold text-black shadow-xl'
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className='flex flex-row items-center gap-1'>
        <input
          type='text'
          placeholder='Enter message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className='h-full w-full rounded-xl border bg-white p-2 text-lg text-black shadow-xl'
        />

        <button type='button' onClick={handleSend} className='cursor-pointer'>
          <SendIcon color='primary' />
        </button>
      </div>
    </div>
  );
};
