import { Tabs } from 'expo-router';
import { icons } from '@/constants/icons';
import TabIcon from '../components/ui/TabIcon';
import { useTheme } from '@/context/useThemeContext';

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#888888',
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
            }} 
        />
    </Tabs>
  );
}