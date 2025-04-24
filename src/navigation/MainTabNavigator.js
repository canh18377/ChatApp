import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, MenuScreen } from '../screens';
import FriendsScreen from '../screens/FriendsScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { height: 60, paddingBottom: 6 },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Đoạn chat',
          tabBarIcon: ({ color, size }) => <Icon name="message-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="FriendsScreen"
        component={FriendsScreen}
        options={{
          tabBarLabel: 'Bạn bè',
          tabBarIcon: ({ color, size }) => <Icon name="account-group" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color, size }) => <Icon name="menu" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
