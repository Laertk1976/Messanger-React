import type { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import {
  connectMessagingSocket,
  getMessages,
  sendMessage,
  type Message,
} from '../api';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'Messages'>;

export function MessageThreadScreen({ route, navigation }: Props) {
  const { contact } = route.params;
  const contactId = contact.id;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let active = true;
    const socket = connectMessagingSocket();
    socket.emit('join_contact', contactId);
    getMessages(contactId)
      .then((data) => active && setMessages(data))
      .catch(console.error);
    socket.on('new_message', (next: Message) => {
      if (active && next.contactId === contactId) {
        setMessages((current) => [...current, next]);
      }
    });

    return () => {
      active = false;
      socket.off('new_message');
    };
  }, [contactId]);

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    sendMessage(contactId, text);
    setMessage('');
  };

  const hasMessage = message.trim().length > 0;
  const handleComposerAction = () => {
    if (hasMessage) {
      handleSend();
      return;
    }
    navigation.navigate('VoiceCall', { contact });
  };

  return (
    <View className='flex-1 bg-slate-50 p-5'>
      <Pressable
        className='self-start rounded-full bg-blue-100 px-4 py-2'
        onPress={() => navigation.goBack()}
      >
        <Text className='font-semibold text-blue-800'>Back</Text>
      </Pressable>
      <Text className='mb-2 mt-4 text-2xl font-bold text-slate-900'>
        {contact.firstName} {contact.lastName}
      </Text>
      <FlatList
        className='flex-1'
        contentContainerClassName='py-3'
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text className='text-slate-500'>No messages yet.</Text>}
        renderItem={({ item }) => {
          const mine = item.sender === 'user';
          return (
            <View
              className={`mb-2 max-w-[80%] rounded-2xl px-3 py-2 ${mine ? 'self-end bg-blue-600' : 'self-start border border-slate-200 bg-white'}`}
            >
              <Text className={mine ? 'text-white' : 'text-slate-900'}>
                {item.text}
              </Text>
            </View>
          );
        }}
      />
      <View className='flex-row items-center gap-2'>
        <TextInput
          className='flex-1 rounded-xl border border-slate-300 bg-white px-3 py-3'
          value={message}
          onChangeText={setMessage}
          placeholder='Type a message'
          returnKeyType='send'
          onSubmitEditing={handleSend}
        />
        <Pressable
          className={`h-12 w-12 items-center justify-center rounded-xl ${hasMessage ? 'bg-blue-600' : 'bg-emerald-500'}`}
          onPress={handleComposerAction}
          accessibilityLabel={
            hasMessage
              ? 'Send message'
              : `Call ${contact.firstName} ${contact.lastName}`
          }
        >
          <Text className='text-xl font-bold text-white'>
            {hasMessage ? '\u2191' : '\u260E'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
