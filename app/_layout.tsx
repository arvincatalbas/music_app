import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlaybackProvider } from '../contexts/PlaybackContext';
import { PlaylistProvider } from '../contexts/PlaylistContext';
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PlaybackProvider>
        <PlaylistProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="[song]" options={{ title: 'Now Playing' }} />
          </Stack>
        </PlaylistProvider>
      </PlaybackProvider>
    </SafeAreaProvider>
  );
}