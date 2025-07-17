
import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export const useTabBarHeight = () => {
  const [tabBarHeight, setTabBarHeight] = useState<number>(0);
  
  useEffect(() => {
    // Adjust this value to match your actual tab bar height
    const height = Platform.select({
      ios: 95,    // Typical iPhone tab bar height
      android: 60, // Typical Android bottom navigation height
    });
    setTabBarHeight(height || 0);
  }, []);

  return tabBarHeight;
};