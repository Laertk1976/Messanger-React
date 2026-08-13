import type { Contact } from '@server/types';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { firestore } from './firebase';

export type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: Date | null;
};

export function subscribeContacts(currentUid: string, onChange: (contacts: Contact[]) => void) {
  return onSnapshot(collection(firestore, 'users'), (snapshot) => {
    const contacts = snapshot.docs
      .filter((item) => item.id !== currentUid)
      .map((item) => item.data() as Contact)
      .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
    onChange(contacts);
  });
}

function conversationId(firstUid: string, secondUid: string) {
  return [firstUid, secondUid].sort().join('_');
}

export function subscribeMessages(currentUid: string, contactUid: string, onChange: (messages: Message[]) => void) {
  const id = conversationId(currentUid, contactUid);
  const messages = query(collection(firestore, 'conversations', id, 'messages'), orderBy('createdAt'));
  return onSnapshot(messages, (snapshot) => {
    onChange(snapshot.docs.map((item) => {
      const data = item.data();
      return { id: item.id, text: String(data.text ?? ''), senderId: String(data.senderId), createdAt: data.createdAt?.toDate?.() ?? null };
    }));
  });
}

export async function sendMessage(currentUid: string, contactUid: string, text: string) {
  const id = conversationId(currentUid, contactUid);
  const conversation = doc(firestore, 'conversations', id);
  const existing = await getDoc(conversation);
  if (!existing.exists()) {
    await setDoc(conversation, { members: [currentUid, contactUid], createdAt: serverTimestamp() });
  }
  await addDoc(collection(firestore, 'conversations', id, 'messages'), {
    text,
    senderId: currentUid,
    createdAt: serverTimestamp(),
  });
}
