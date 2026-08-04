import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ContactDetailScreen } from '../components/ContactDetailScreen';
import { ContactListScreen } from '../components/ContactListScreen';
import { LoginScreen } from '../components/LoginScreen';
import { MessageThreadScreen } from '../components/MessageThreadScreen';
import type { Contact } from '../types';

export type RootStackParamList = {
  Login: undefined;
  Contacts: undefined;
  ContactDetail: { contact: Contact };
  Messages: { contact: Contact };
};

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Contacts' component={ContactListScreen} />
        <Stack.Screen name='ContactDetail' component={ContactDetailScreen} />
        <Stack.Screen name='Messages' component={MessageThreadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
