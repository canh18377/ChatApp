import {
  LoginScreen,
  HomeScreen,
  MenuScreen,
  RegisterScreen,
  ProfileScreen,
  MyProfileScreen,
  ChatDetailScreen,
  SplashScreen,
  CallScreenAudio,
  GroupInfoScreen
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
  { name: 'CallScreenAudio', component: CallScreenAudio },
  { name: 'GroupInfoScreen', component: GroupInfoScreen },
];