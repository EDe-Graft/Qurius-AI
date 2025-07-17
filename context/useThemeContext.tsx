// src/context/ThemeContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

// 1. Define your theme color types
type ThemeColors = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  card: string;
  border: string;
  gray: string;
};

// 2. Define light/dark themes
type Theme = {
  light: ThemeColors;
  dark: ThemeColors;
};

const defaultTheme: Theme = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#8B5CF6',
    secondary: '#8B5CF6',
    card: '#f5f5f5',
    border: '#e0e0e0',
    gray: '#888888',
  },
  dark: {
    background: '#000000',
    text: '#ffffff',
    primary: '#8B5CF6',
    secondary: '#8B5CF6',
    card: '#1e1e1e',
    border: '#333333',
    gray: '#888888',
  },
};

// 3. Define context type
interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  setColorScheme: (scheme: ColorSchemeName) => void;
  toggleTheme: () => void;
}

// 4. Create the context with proper typing
export const ThemeContext = createContext<ThemeContextType>({
  colors: defaultTheme.light,
  isDark: false,
  setColorScheme: () => {},
  toggleTheme: () => {},
});

// 5. Define props for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

// 6. Implement the provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');
  
  const setColorScheme = (scheme: ColorSchemeName) => {
    setIsDark(scheme === 'dark');
  };

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const colors = isDark ? defaultTheme.dark : defaultTheme.light;

  return (
    <ThemeContext.Provider value={{ colors, isDark, setColorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 7. Create a custom hook for consuming the context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};