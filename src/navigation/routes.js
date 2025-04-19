import {
  LoginScreen,
  HomeScreen,
  MenuScreen,
  RegisterScreen,
  ProfileScreen,
  MyProfileScreen,
  ChatDetailScreen,
  SplashScreen,
  CallScreen
} from '../screens';
import MainTabNavigator from './MainTabNavigator';
// Mảng chứa các màn hình
export const screens = [
  { name: 'SplashScreen', component: SplashScreen },
  { name: 'LoginScreen', component: LoginScreen },
  { name: 'Main', component: MainTabNavigator },
  { name: 'ChatDetailScreen', component: ChatDetailScreen },
  { name: 'MenuScreen', component: MenuScreen },
  { name: 'RegisterScreen', component: RegisterScreen },
  { name: 'ProfileScreen', component: ProfileScreen },
  { name: 'MyProfileScreen', component: MyProfileScreen },
  { name: 'CallScreen', component: CallScreen },
];