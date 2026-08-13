import type { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
type Props = StackScreenProps<RootStackParamList, 'ContactDetail'>;
export function ContactDetailScreen({ route, navigation }: Props) {
  const { contact } = route.params;
  return <View className='flex-1 bg-slate-50 p-5'><Pressable className='self-start rounded-full bg-blue-100 px-4 py-2' onPress={() => navigation.goBack()}><Text className='font-semibold text-blue-800'>← Back</Text></Pressable><View className='mt-5 items-center rounded-2xl border border-slate-200 bg-white p-5'><Image source={{ uri: contact.avatar }} className='mb-3 h-20 w-20 rounded-full' /><Text className='text-xl font-bold text-slate-900'>{contact.firstName} {contact.lastName}</Text><Text className='mt-2 text-slate-500'>{contact.phone}</Text><Text className='mt-1 text-slate-500'>{contact.email}</Text><Pressable className='mt-5 rounded-xl bg-blue-600 px-5 py-3' onPress={() => navigation.navigate('Messages', { contact })}><Text className='font-bold text-white'>Open messages</Text></Pressable></View></View>;
}
