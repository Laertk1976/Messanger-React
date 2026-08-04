import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { contacts } from './data/contacts';

import type { Message } from './types';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

let nextId = 1;

const messages: Message[] = [];

function registerSocketHandlers(io: Server) {
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
}

app.get('/api/contacts/:contactId/messages', (req, res) => {
  const id = Number(req.params.contactId);

  res.json(messages.filter((m) => m.contactId === id));
});
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.post('/api/login', (req, res) => {
  const { identifier, password } = req.body as {
    identifier?: string;
    password?: string;
  };

  if (!identifier || !password) {
    res.status(400).json({ error: 'Email/phone and password are required.' });
    return;
  }

  const normalized = identifier.toLowerCase().trim();
  const contact = contacts.find((item) => {
    const email = item.email.toLowerCase();
    const phone = item.phone.replace(/\D/g, '');
    const input = normalized.replace(/\D/g, '');

    return email === normalized || phone === input;
  });

  if (!contact || password !== '123456') {
    res.status(401).json({ error: 'Invalid email/phone or password.' });
    return;
  }

  res.json({ contact });
});

function startServer(port: number) {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: true,
    },
  });

  registerSocketHandlers(io);

  server.once('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy, trying ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error(error);
    process.exit(1);
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}

startServer(Number(process.env.PORT ?? 3001));
