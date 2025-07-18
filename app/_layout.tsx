import { ThemeProvider, useTheme } from '@/context/useThemeContext';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";
import 'react-native-url-polyfill/auto';
import './global.css';

function ThemedDrawer() {
  const { colors } = useTheme();
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: { backgroundColor: colors.background },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.gray,
          drawerStatusBarAnimation: 'fade'
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return ( 
    <ThemeProvider>
      <SafeAreaProvider>
        <ThemedDrawer />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
