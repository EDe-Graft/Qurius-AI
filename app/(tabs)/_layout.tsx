import { icons } from '@/constants/icons';
import { useTheme } from '@/context/useThemeContext';
import { Ionicons } from '@expo/vector-icons';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import { Tabs, useRouter } from 'expo-router';
import TabIcon from '../_components/ui/TabIcon';

export default function TabsLayout() {
  const { colors, toggleTheme, isDark } = useTheme();
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Tabs
    screenOptions={{
        headerShown: false,
        headerStyle: {backgroundColor: colors.background},
        headerTitleStyle: {color: colors.text},
        headerTintColor: colors.primary,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: { backgroundColor: colors.background, marginTop: 0, paddingTop: 10},
        tabBarLabelStyle: { fontSize: 12 },
        tabBarLabelPosition: 'beside-icon',
        tabBarShowLabel: true,
    }}
    >
        <Tabs.Screen 
            name="index" 
            options={{ 
              title: 'Chat',
              tabBarIcon: ({focused}) => <TabIcon source={icons.chat} focused={focused} />, 
            }} 
        />
        <Tabs.Screen 
            name="settings"   
            options={{ 
            title: 'Settings',
            tabBarIcon: ({focused}) => <TabIcon source={icons.settings} focused={focused} />,
            // headerLeft: () => (
            //   <Ionicons
            //     name="arrow-back"
            //     size={24}
            //     color={colors.text}
            //     style={{ marginLeft: 16 }}
            //     onPress={() => router.back()}
            //   />
            // ),
            }} 
        />
    </Tabs>
  );
}