import React, { useState } from 'react';
import { InteractionManager } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Avatar, Switch, List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { useAppTheme } from '../context/ThemeContext';
const MenuScreen = ({ navigation }) => {
  const { isDarkMode, toggleTheme, theme } = useAppTheme();
  const me = useSelector((state) => state.userReducer.me);
  const handleLogout = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          InteractionManager.runAfterInteractions(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            });
          });
        },
      },
    ]);
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Thông tin người dùng */}
      <View style={styles.profileContainer}>
        <Image
          source={
            me?.avatar
              ? { uri: me.avatar }
              : require('../assets/images/noAvatar.jpg')
          }
          style={styles.avatarImage}
        />
        <Text style={[styles.name, { color: theme.colors.onBackground }]}>{me?.name}</Text>
      </View>


      <Divider style={styles.divider} />

      {/* Các tùy chọn */}
      <View style={styles.optionsContainer}>
        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Icon style={{ color: theme.colors.onBackground }} name="theme-light-dark" size={22} color="#555" />
            <Text style={[styles.optionLabel, { color: theme.colors.onBackground }]}>Chế độ tối</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('MyProfileScreen')}>
          <List.Item
            title="Hồ sơ của bạn"
            description="Xem và chỉnh sửa thông tin cá nhân"
            left={() => <List.Icon icon="account-edit" />}
          />
        </TouchableOpacity>

        <Divider style={{ marginVertical: 8 }} />

        <TouchableOpacity onPress={handleLogout}>
          <View style={styles.logoutRow}>
            <Icon name="logout" size={22} color="red" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#007AFF',
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  optionsContainer: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
