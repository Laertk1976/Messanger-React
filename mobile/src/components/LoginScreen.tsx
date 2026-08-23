import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../auth';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePress = async () => {
    if (!identifier.trim() || !password.trim())
      return Alert.alert(
        'Missing details',
        'Please enter both an identifier and a password.',
      );
    setIsSubmitting(true);
    try {
      await signIn(identifier.trim(), password.trim());
    } catch (error) {
      Alert.alert(
        'Login failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View className='flex-1 justify-center bg-slate-50 p-6'>
      <Text className='mb-2 text-3xl font-bold text-slate-900'>Log in</Text>
      <Text className='mb-5 text-base text-slate-500'>
        Use an email or phone number to continue.
      </Text>
      <TextInput
        className='mb-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900'
        value={identifier}
        onChangeText={setIdentifier}
        placeholder='Email or phone'
        autoCapitalize='none'
      />
      <View className='mb-5 flex-row items-center'>
        <TextInput
          className='flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900'
          value={password}
          onChangeText={setPassword}
          placeholder='Password'
          secureTextEntry={!showPassword}
        />
        <Pressable
          className='ml-2 rounded-lg bg-slate-200 px-3 py-3'
          onPress={() => setShowPassword((value) => !value)}
        >
          <Text>{showPassword ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>
      {isSubmitting ? (
        <ActivityIndicator size='small' color='#2563eb' />
      ) : (
        <Pressable
          className='items-center rounded-xl bg-blue-600 p-4'
          onPress={handlePress}
        >
          <Text className='font-bold text-white'>Sign in</Text>
        </Pressable>
      )}
    </View>
  );
}
