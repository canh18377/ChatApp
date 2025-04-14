import { Provider } from 'react-redux';
import StackNavigator from './navigation/StackNavigator'; // Tách StackNavigator riêng
import store from './redux/config/store';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};
export default App;
