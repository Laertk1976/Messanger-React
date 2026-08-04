import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type ContactDetailScreenProps = StackScreenProps<RootStackParamList, 'ContactDetail'>;

export function ContactDetailScreen({ route, navigation }: ContactDetailScreenProps) {
  const { contact } = route.params;
  return (
    <View style={styles.container}>
      <Button title='Back' onPress={() => navigation.goBack()} />
      <View style={styles.card}>
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        <Text style={styles.name}>
          {contact.firstName} {contact.lastName}
        </Text>
        <Text style={styles.meta}>{contact.phone}</Text>
        <Text style={styles.meta}>{contact.email}</Text>
        <View style={styles.actions}>
          <Button title='Open messages' onPress={() => navigation.navigate('Messages', { contact })} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  card: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  meta: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 4,
  },
  actions: {
    marginTop: 16,
  },
});
