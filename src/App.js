import React, { useState, useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import store from './redux/config/store';
import { ThemeProvider, useAppTheme } from './context/ThemeContext';
import { useNavigationContainerRef } from '@react-navigation/native';


const MainApp = () => {
  const { theme, isDarkMode, lightTheme } = useAppTheme();
  const navigationRef = useNavigationContainerRef();
  const [currentRoute, setCurrentRoute] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const route = navigationRef.getCurrentRoute();
      if (route) {
        setCurrentRoute(route.name);
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [navigationRef]);

  const forceLightTheme = currentRoute === 'LoginScreen' || currentRoute === 'RegisterScreen';

  return (
    <PaperProvider theme={forceLightTheme ? lightTheme : theme}>
      <NavigationContainer
        ref={navigationRef}
        theme={forceLightTheme ? DefaultTheme : isDarkMode ? DarkTheme : DefaultTheme}
        onReady={() => {
          const route = navigationRef.getCurrentRoute();
          if (route) {
            setCurrentRoute(route.name);
          }
        }}
        onStateChange={() => {
          const route = navigationRef.getCurrentRoute();
          if (route) {
            setCurrentRoute(route.name);
          }
        }}
      >
        <StackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

const App = () => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default App;
