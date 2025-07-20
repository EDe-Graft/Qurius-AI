import { ThemeProvider, useTheme } from '@/context/useThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";
import 'react-native-url-polyfill/auto';
import './global.css';

function ThemedDrawer() {
  const { colors, toggleTheme, isDark } = useTheme();
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer
        screenOptions={({ navigation }) => ({
          headerShown: true,
          drawerStyle: { backgroundColor: colors.background },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.gray,
          drawerStatusBarAnimation: 'fade',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.primary,
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={24}
              color={colors.text}
              style={{ marginLeft: 16 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerRight: () => (
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={24}
              color={colors.text}
              style={{ marginRight: 16 }}
              onPress={toggleTheme}
              accessibilityLabel="Toggle theme"
            />
          ),
        })}
      >
        <Drawer.Screen
          name="(tabs)"
          options={({ route }) => {
            let title = 'Chat';
            const focusedTab = getFocusedRouteNameFromRoute(route);
            if (focusedTab === 'settings') title = 'Settings';
            else if (focusedTab === 'index') title = 'Chat';
            // Add more tab names as needed
            return { title };
          }}
        />
        <Drawer.Screen name="sign-in" options={{ title: "Sign In" }} />
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
