import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppHeaderProps = {
  title?: string;
  isLoggedIn?: boolean;
  userName?: string;
  onLogin?: () => void;
  onLogout?: () => void;
};

export function AppHeader({
  title = 'OPUS',
  isLoggedIn = false,
  userName,
  onLogin,
  onLogout,
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>
        {!isLoggedIn ? (
          <Pressable style={styles.button} onPress={onLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
        ) : (
          <>
            {userName ? <Text style={styles.userText}>Signed in as {userName}</Text> : null}
            <Pressable style={styles.secondaryButton} onPress={onLogout}>
              <Text style={styles.buttonText}>Log out</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#383b4a',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  userText: {
    color: 'rgba(255,255,255,0.8)',
    marginRight: 8,
  },
});
