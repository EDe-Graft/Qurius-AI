import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-2xl font-bold text-white'>This screen does not exist.</Text>
    </View>
  );
}
