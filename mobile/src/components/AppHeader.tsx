import React from 'react';
import { Pressable, Text, View } from 'react-native';

type AppHeaderProps = { title?: string; isLoggedIn?: boolean; userName?: string; onLogin?: () => void; onLogout?: () => void };

export function AppHeader({ title = 'OPUS', isLoggedIn = false, userName, onLogin, onLogout }: AppHeaderProps) {
  return <View className='flex-row items-center justify-between bg-slate-800 px-4 py-3'>
    <Text className='text-2xl font-bold text-white'>{title}</Text>
    {!isLoggedIn ? <Pressable className='rounded-lg bg-blue-600 px-3 py-2' onPress={onLogin}><Text className='font-semibold text-white'>Log in</Text></Pressable> :
      <View className='flex-row items-center gap-2'><Text className='text-white/80'>Signed in as {userName}</Text><Pressable className='rounded-lg border border-white/20 px-3 py-2' onPress={onLogout}><Text className='font-semibold text-white'>Log out</Text></Pressable></View>}
  </View>;
}
