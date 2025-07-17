import { Stack } from "expo-router";
import './global.css';
import { ThemeProvider } from '@/context/useThemeContext';
import { SafeAreaProvider } from "react-native-safe-area-context";
import 'react-native-url-polyfill/auto'

export default function RootLayout() {
  return ( 
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
