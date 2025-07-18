import { Text, View, Switch, StyleSheet } from 'react-native';
import { useTheme } from '@/context/useThemeContext';

export default function SettingsScreen() {
  // Destructure both colors and toggleTheme from useTheme
  const { colors, isDark, toggleTheme } = useTheme();
  
  return (
    <View 
      className='flex-1 items-center justify-center' 
      style={{ backgroundColor: colors.background }}
    >
      <View className='flex-row items-center justify-between w-4/5 px-4 py-2 rounded-lg mx-2' style={{ backgroundColor: colors.card }}>
        <Text style={[styles.settingText, { color: colors.text }]}>
          Dark Mode
        </Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={isDark ? colors.primary : colors.gray}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingText: {
    fontSize: 18,
  },
});