import React, { createContext, useContext, useEffect, useState } from 'react';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  return {
    ...context,
    lightTheme: context.lightTheme,
    darkTheme: context.darkTheme,
  };
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const lightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
    },
  };

  const darkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      searchBackground: '#3A3A3A',
      inputText: '#fff',
    },
  };

  const toggleTheme = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    await AsyncStorage.setItem('theme', newValue ? 'dark' : 'light');
  };

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem('theme');
    setIsDarkMode(saved === 'dark');
  };

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        theme: isDarkMode ? darkTheme : lightTheme,
        lightTheme,
        darkTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
