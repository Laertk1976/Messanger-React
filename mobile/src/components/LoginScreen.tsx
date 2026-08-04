import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { login } from '../api';
import type { RootStackParamList } from '../navigation/AppNavigator';

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePress = async () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Please enter both an identifier and a password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(identifier.trim(), password.trim());
      navigation.replace('Contacts');
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>
      <Text style={styles.subtitle}>Use an email or phone number to continue.</Text>

      <TextInput
        value={identifier}
        onChangeText={setIdentifier}
        placeholder='Email or phone'
        autoCapitalize='none'
        style={styles.input}
      />

      <View style={styles.passwordRow}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder='Password'
          secureTextEntry={!showPassword}
          style={[styles.input, styles.passwordInput]}
        />
        <Pressable onPress={() => setShowPassword((value) => !value)} style={styles.toggle}>
          <Text>{showPassword ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>

      {isSubmitting ? <ActivityIndicator size='small' color='#2563eb' /> : <Button title='Sign in' onPress={handlePress} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  toggle: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
  },
});
