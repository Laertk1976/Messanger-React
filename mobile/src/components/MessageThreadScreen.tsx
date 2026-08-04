import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { connectMessagingSocket, getMessages, sendMessage, type Message } from '../api';
import type { RootStackParamList } from '../navigation/AppNavigator';

type MessageThreadScreenProps = StackScreenProps<RootStackParamList, 'Messages'>;

export function MessageThreadScreen({ route, navigation }: MessageThreadScreenProps) {
  const { contact } = route.params;
  const contactId = contact.id;
  const contactName = `${contact.firstName} ${contact.lastName}`;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let active = true;
    const socket = connectMessagingSocket();

    socket.emit('join_contact', contactId);

    getMessages(contactId)
      .then((data) => {
        if (active) {
          setMessages(data);
        }
      })
      .catch(console.error);

    socket.on('new_message', (nextMessage: Message) => {
      if (active && nextMessage.contactId === contactId) {
        setMessages((current) => [...current, nextMessage]);
      }
    });

    return () => {
      active = false;
      socket.off('new_message');
    };
  }, [contactId]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    sendMessage(contactId, trimmed);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Button title='Back' onPress={() => navigation.goBack()} />
      <Text style={styles.title}>{contactName}</Text>
      <ScrollView style={styles.messageList} contentContainerStyle={styles.messageListContent}>
        {messages.length === 0 ? (
          <Text style={styles.placeholder}>No messages yet.</Text>
        ) : (
          messages.map((item) => {
            const isMine = item.sender === 'user';
            return (
              <View
                key={item.id}
                style={[styles.messageBubble, isMine ? styles.myBubble : styles.otherBubble]}
              >
                <Text style={[styles.messageText, isMine ? styles.myText : styles.otherText]}>
                  {item.text}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
      <View style={styles.composer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder='Type a message'
          style={styles.input}
          returnKeyType='send'
          onSubmitEditing={handleSend}
        />
        <View style={styles.sendRow}>
          <Button title='Send' onPress={handleSend} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholder: {
    color: '#64748b',
    marginBottom: 16,
  },
  messageList: {
    flex: 1,
    marginVertical: 12,
  },
  messageListContent: {
    paddingBottom: 12,
  },
  messageBubble: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    maxWidth: '80%',
  },
  myBubble: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 15,
  },
  myText: {
    color: '#fff',
  },
  otherText: {
    color: '#0f172a',
  },
  composer: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  sendRow: {
    marginTop: 4,
  },
});
