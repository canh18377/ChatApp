import React, { useState, useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import store from './redux/config/store';
import { ThemeProvider, useAppTheme } from './context/ThemeContext';
import { useNavigationContainerRef } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

const MainApp = () => {
  const { theme, isDarkMode, lightTheme } = useAppTheme();
  const navigationRef = useNavigationContainerRef();

  const [initialRoute, setInitialRoute] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setInitialRoute(token ? 'Main' : 'LoginScreen');
      } catch (error) {
        console.error('Error checking token:', error);
        setInitialRoute('LoginScreen');
      }
    };

    checkToken();
  }, []);

  // Nếu chưa xác định route ban đầu, hiện loading
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

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
        <StackNavigator initialRoute={initialRoute} />
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
