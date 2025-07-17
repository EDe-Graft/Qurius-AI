import { Image } from 'expo-image';
import { View } from 'react-native';

export default function TabIcon({ source, focused }: { source: string, focused: boolean }) {
  return (
    <View className='flex-1 items-center justify-center'>
      <Image 
        source={source}
        style={{ width: 28, height: 28, tintColor: focused ? '#8B5CF6' : '#888888' }}
      />
    </View>
  );
}