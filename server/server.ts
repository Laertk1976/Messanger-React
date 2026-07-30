import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { contacts } from './data/contacts';

import type { Message } from './types';

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

let nextId = 1;

const messages: Message[] = [];

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('join_contact', (contactId: number) => {
    socket.join(`contact-${contactId}`);
  });

  socket.on(
    'send_message',
    (
      data: { contactId: number; text: string },
      callback?: (result: { error?: string }) => void,
    ) => {
      const message = {
        id: nextId++,
        contactId: data.contactId,
        text: data.text,
        sender: 'user',
        createdAt: new Date().toISOString(),
      };

      messages.push(message);

      io.to(`contact-${data.contactId}`).emit('new_message', message);

      callback?.({});
    },
  );
});

app.get('/api/contacts/:contactId/messages', (req, res) => {
  const id = Number(req.params.contactId);

  res.json(messages.filter((m) => m.contactId === id));
});
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

server.listen(3000, '0.0.0.0',() => {
  console.log('Server started on http://localhost:3000');
});
