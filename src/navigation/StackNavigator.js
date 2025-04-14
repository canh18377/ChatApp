import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screens } from './routes';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {screens.map((screen) => {
        return (
          <Stack.Screen key={screen.name} name={screen.name} component={screen.component} />
        )
      })}
    </Stack.Navigator>
  );
};

export default StackNavigator;
