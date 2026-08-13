import type { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import { getContacts } from '../api';
import { useAuth } from '../auth';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Contact } from '../types';
type Props = StackScreenProps<RootStackParamList, 'Contacts'>;
export function ContactListScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(true); const [localContacts, setLocalContacts] = useState<Contact[]>([]); const [search, setSearch] = useState(''); const { user } = useAuth();
  useEffect(() => { let active = true; getContacts().then((data) => active && setLocalContacts(data)).catch(console.error).finally(() => active && setIsLoading(false)); return () => { active = false; }; }, []);
  const contacts = useMemo(() => { const query = search.trim().toLowerCase(); return query ? localContacts.filter((contact) => `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(query)) : localContacts; }, [localContacts, search]);
  return <View className='flex-1 bg-slate-50 p-4'><View className='mb-4 flex-row items-center justify-between'><View><Text className='text-2xl font-bold text-slate-900'>OPUS</Text><Text className='mt-0.5 text-base text-slate-500'>Contacts</Text></View><Pressable className='h-11 w-11 items-center justify-center rounded-full bg-blue-600' onPress={() => navigation.navigate('Profile')}><Text className='text-lg font-bold text-white'>{user?.firstName?.slice(0, 1).toUpperCase() ?? 'P'}</Text></Pressable></View><TextInput className='mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3' value={search} onChangeText={setSearch} placeholder='Search contacts' />{isLoading ? <ActivityIndicator size='large' color='#2563eb' /> : <FlatList data={contacts} keyExtractor={(item) => item.id.toString()} ListEmptyComponent={<Text className='mt-9 text-center text-slate-500'>No contacts found.</Text>} renderItem={({ item }) => <Pressable className='mb-3 flex-row items-center rounded-2xl border border-slate-200 bg-white p-3' onPress={() => navigation.navigate('ContactDetail', { contact: item })}><Image source={{ uri: item.avatar }} className='mr-3 h-12 w-12 rounded-full' /><View className='flex-1'><Text className='text-base font-semibold text-slate-900'>{item.firstName} {item.lastName}</Text><Text className='mt-0.5 text-slate-500'>{item.phone}</Text><Text className='mt-0.5 text-slate-500'>{item.email}</Text></View></Pressable>} />}</View>;
}
