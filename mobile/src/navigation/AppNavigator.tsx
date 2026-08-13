import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useAuth } from '../auth';
import { ContactDetailScreen } from '../components/ContactDetailScreen';
import { ContactListScreen } from '../components/ContactListScreen';
import { LoginScreen } from '../components/LoginScreen';
import { MessageThreadScreen } from '../components/MessageThreadScreen';
import { ProfileScreen } from '../components/ProfileScreen';
import type { Contact } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Contacts: undefined;
  ContactDetail: { contact: Contact };
  Messages: { contact: Contact };
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? <Stack.Screen name='Login' component={LoginScreen} /> : <>
          <Stack.Screen name='Contacts' component={ContactListScreen} />
          <Stack.Screen name='ContactDetail' component={ContactDetailScreen} />
          <Stack.Screen name='Messages' component={MessageThreadScreen} />
          <Stack.Screen name='Profile' component={ProfileScreen} />
        </>}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
