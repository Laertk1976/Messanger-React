import cors from 'cors';
import express from 'express';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const databasePath = join(currentDirectory, 'data.json');
const port = Number(process.env.PORT ?? 3001);

const normalizePhone = (value) => value.replace(/\D/g, '');

const seedContacts = [
  { id: 1, firstName: 'John', lastName: 'Smith', avatar: 'https://i.pravatar.cc/150?img=1', phone: '+1 555-123-4567', email: 'john.smith@example.com' },
  { id: 2, firstName: 'Emma', lastName: 'Johnson', avatar: 'https://i.pravatar.cc/150?img=5', phone: '+1 555-987-6543', email: 'emma.johnson@example.com' },
  { id: 3, firstName: 'Michael', lastName: 'Brown', avatar: 'https://i.pravatar.cc/150?img=12', phone: '+1 555-222-3344', email: 'michael.brown@example.com' },
  { id: 4, firstName: 'Sophia', lastName: 'Davis', avatar: 'https://i.pravatar.cc/150?img=20', phone: '+1 555-444-5566', email: 'sophia.davis@example.com' },
  { id: 5, firstName: 'Daniel', lastName: 'Wilson', avatar: 'https://i.pravatar.cc/150?img=33', phone: '+1 555-777-8899', email: 'daniel.wilson@example.com' },
];

function loadDatabase() {
  if (!existsSync(databasePath)) {
    const initialData = {
      contacts: seedContacts,
      users: [
        { id: 1, email: 'john.smith@example.com', phone: '+1 555-123-4567', password: 'Password123', contactId: 1 },
        { id: 2, email: 'emma.johnson@example.com', phone: '+1 555-987-6543', password: 'Password123', contactId: 2 },
        { id: 3, email: 'michael.brown@example.com', phone: '+1 555-222-3344', password: 'Password123', contactId: 3 },
        { id: 4, email: 'sophia.davis@example.com', phone: '+1 555-444-5566', password: 'Password123', contactId: 4 },
        { id: 5, email: 'daniel.wilson@example.com', phone: '+1 555-777-8899', password: 'Password123', contactId: 5 },
      ],
      messages: [],
    };
    writeFileSync(databasePath, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  const loaded = JSON.parse(readFileSync(databasePath, 'utf8'));
  loaded.users = loaded.users ?? [];
  return loaded;
}

function saveDatabase(database) {
  writeFileSync(databasePath, JSON.stringify(database, null, 2));
}

const database = loadDatabase();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
});

app.use(cors());
app.use(express.json());

app.get('/api/contacts', (_request, response) => {
  response.json(database.contacts);
});

app.get('/api/contacts/:contactId/messages', (request, response) => {
  const contactId = Number(request.params.contactId);
  const messages = database.messages.filter((message) => message.contactId === contactId);
  response.json(messages);
});

app.post('/api/login', (request, response) => {
  const { identifier, password } = request.body;

  if (typeof identifier !== 'string' || typeof password !== 'string') {
    return response.status(400).json({ error: 'Identifier and password are required.' });
  }

  const normalizedIdentifier = identifier.trim().toLowerCase();
  const matchedUser = database.users.find(
    (user) =>
      user.email.toLowerCase() === normalizedIdentifier ||
      normalizePhone(user.phone) === normalizePhone(identifier),
  );

  if (!matchedUser || matchedUser.password !== password) {
    return response.status(401).json({ error: 'Invalid email/phone or password.' });
  }

  const contact = database.contacts.find((contact) => contact.id === matchedUser.contactId);
  if (!contact) {
    return response.status(500).json({ error: 'Linked contact not found.' });
  }

  return response.json({ contact });
});

function createMessage(contactId, text) {
  const message = {
    id: Date.now(),
    contactId,
    text: text.trim(),
    sender: 'user',
    createdAt: new Date().toISOString(),
  };
  database.messages.push(message);
  saveDatabase(database);
  return message;
}

io.on('connection', (socket) => {
  socket.on('join_contact', (contactId) => {
    socket.join(`contact:${Number(contactId)}`);
  });

  socket.on('send_message', ({ contactId, text }, callback) => {
    const numericContactId = Number(contactId);
    if (!numericContactId || typeof text !== 'string' || !text.trim()) {
      callback?.({ error: 'A contact and non-empty message are required.' });
      return;
    }

    const message = createMessage(numericContactId, text);
    io.to(`contact:${numericContactId}`).emit('new_message', message);
    callback?.({ message });
  });
});

httpServer.listen(port, () => {
  console.log(`Messaging server running at http://localhost:${port}`);
});
