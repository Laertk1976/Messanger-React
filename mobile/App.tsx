import { StatusBar } from 'expo-status-bar';
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style='auto' />
      <AuthProvider><AppNavigator /></AuthProvider>
    </SafeAreaProvider>
  );
}
