import React, { useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Send from '@mui/icons-material/Send';
import { createMessagingSocket, getMessages, type Message } from '../api';

type InputFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const InputField: React.FC<InputFieldProps> = ({ value, onChange }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log({ value });
    }
  };

  return (
    <div className='absolute top-20 h-14 w-full px-4'>
      <input
        type='text'
        placeholder='Find contacts...'
        value={value}
        onKeyDown={handleKeyDown}
        onChange={(e) => onChange(e.target.value)}
        className='h-full w-full rounded-2xl border bg-white p-2 text-lg text-black shadow-xl'
      />
      <SearchIcon className='absolute top-1/2 right-6 -translate-y-1/2 transform text-gray-500' />
    </div>
  );
};
export default InputField;

type InputMessageProps = {
  contactId: number;
};

export const InputMessage: React.FC<InputMessageProps> = ({ contactId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<ReturnType<typeof createMessagingSocket> | null>(
    null,
  );

  useEffect(() => {
    const socket = createMessagingSocket();
    socketRef.current = socket;
    socket.emit('join_contact', contactId);
    getMessages(contactId).then(setMessages).catch(console.error);
    socket.on('new_message', (newMessage: Message) => {
      setMessages((previous) => [...previous, newMessage]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [contactId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current?.emit(
      'send_message',
      { contactId, text: message },
      (result: { error?: string }) => {
        if (result?.error) console.error(result.error);
      },
    );
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
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'
            }
          >
            <div
              className={
                msg.sender === 'user'
                  ? 'non-italic max-w-xs items-center justify-center rounded-sm bg-blue-500/90 px-2 font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]/20 backdrop-blur-xl'
                  : 'max-w-xs items-center justify-center rounded-sm bg-green-400/90 px-2 text-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]/20'
              }
            >
              {msg.text}
            </div>
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
          <Send className='text-blue-600' />
        </button>
      </div>
    </div>
  );
};
