import type { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Pressable, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'VoiceCall'>;

export function VoiceCallScreen({ route, navigation }: Props) {
  const { contact } = route.params;
  const [callState, setCallState] = useState<'dialing' | 'connected' | 'ended'>('dialing');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!contact.phone) {
      Alert.alert('No phone number', 'This contact does not have a phone number available for calling.');
      navigation.goBack();
      return;
    }

    const startDialer = async () => {
      try {
        await Linking.openURL(`tel:${contact.phone}`);
      } catch {
        Alert.alert('Call unavailable', 'The dialer could not be opened on this device.');
      }
    };

    void startDialer();
    const timer = setTimeout(() => setCallState('connected'), 1200);
    return () => clearTimeout(timer);
  }, [contact, navigation]);

  useEffect(() => {
    if (callState !== 'connected') return;

    const interval = setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callState]);

  const formattedDuration = useMemo(() => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }, [seconds]);

  const handleEndCall = () => {
    setCallState('ended');
    navigation.goBack();
  };

  return (
    <View className='flex-1 items-center justify-center bg-slate-950 px-6'>
      <View className='mb-8 items-center'>
        <Text className='text-3xl font-bold text-white'>
          {contact.firstName} {contact.lastName}
        </Text>
        <Text className='mt-2 text-base text-slate-300'>
          {contact.phone || 'No phone number'}
        </Text>
      </View>

      <View className='mb-8 rounded-full bg-slate-800 px-6 py-3'>
        <Text className='text-lg font-semibold text-white'>
          {callState === 'dialing' ? 'Dialing...' : callState === 'connected' ? `Connected • ${formattedDuration}` : 'Call ended'}
        </Text>
      </View>

      <View className='w-full max-w-xs flex-row justify-between'>
        <Pressable
          className='items-center rounded-full bg-slate-800 px-6 py-4'
          onPress={() => navigation.goBack()}
        >
          <Text className='font-semibold text-white'>Back</Text>
        </Pressable>

        <Pressable
          className='items-center rounded-full bg-red-600 px-6 py-4'
          onPress={handleEndCall}
        >
          <Text className='font-semibold text-white'>End Call</Text>
        </Pressable>
      </View>
    </View>
  );
}
