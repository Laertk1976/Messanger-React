import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getContacts } from '../api';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Contact } from '../types';

type ContactListScreenProps = StackScreenProps<RootStackParamList, 'Contacts'>;

export function ContactListScreen({ navigation }: ContactListScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [localContacts, setLocalContacts] = useState<Contact[]>([]);

  useEffect(() => {
    let active = true;
    // setIsLoading(true);

    getContacts()
      .then((data) => {
        if (active) {
          setLocalContacts(data);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      {isLoading ? (
        <ActivityIndicator size='large' color='#2563eb' />
      ) : (
        <FlatList
          data={localContacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => navigation.navigate('ContactDetail', { contact: item })}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.meta}>{item.phone}</Text>
                <Text style={styles.meta}>{item.email}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: '#64748b',
    marginTop: 2,
  },
});
