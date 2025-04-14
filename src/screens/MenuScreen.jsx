import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Avatar, Switch, List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MenuScreen = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Thông tin người dùng */}
      <View style={styles.profileContainer}>
        <Avatar.Icon size={70} icon="account-circle" style={styles.avatar} />
        <Text style={styles.name}>Duy Đinh</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Các tùy chọn */}
      <View style={styles.optionsContainer}>
        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <Icon name="theme-light-dark" size={22} color="#555" />
            <Text style={styles.optionLabel}>Chế độ tối</Text>
          </View>
          <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
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
