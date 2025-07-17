import { images } from '@/constants/images';
import { useTheme } from '@/context/useThemeContext';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';


type ActionButtonProps = {
  type: 'send' | 'stop' | 'resume';
  query: string;
  isStreaming: boolean;
  handleSend?: () => void;
  handleStopStreaming?: () => void
};

type FloatingButtonProps = {
  onPress: () => void;
  buttonImage: string;
};

export default function ActionButton ({ type, query, isStreaming, handleSend,handleStopStreaming }: ActionButtonProps) {
    const {colors} = useTheme() ;
    return (
        <TouchableOpacity 
            className='rounded-full p-2' 
            onPress={isStreaming ? handleStopStreaming : handleSend} 
            disabled={!isStreaming && query.length === 0}
            style={{ backgroundColor: query.length || isStreaming ? colors.primary : colors.border }}
        >
            {type === 'send' && (
                <Image 
                source={images.send}
                style={{width: 17, height: 17}}
                contentFit='contain'
                tintColor={query.length ? 'white' : colors.gray}
                />
             )}

            {type === 'stop' && (
                <Image 
                source={images.stop} 
                style={{ width: 17, height: 17 }} 
                contentFit='contain'
                tintColor={isStreaming ? 'white' : colors.gray}
                />
             )}

        </TouchableOpacity>
           
    )
}


export function FloatingButton({ onPress, buttonImage }: FloatingButtonProps) {
    return (
    <TouchableOpacity
        onPress={onPress}
        style={{
        position: 'absolute',
        bottom: 120,
        right: 20,
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        }}
        className='bg-primary'
    >
        <Text style={{ color: 'white', fontSize: 20 }}>{buttonImage}</Text>
    </TouchableOpacity>
    )
}