// src/screens/ProfileScreen.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Divider, List, useTheme } from 'react-native-paper';
import { IconButton } from 'react-native-paper';

const ProfileScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { userId, name, avatar } = route.params; // Nhận các tham số trực tiếp

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
      </View>

      {/* Avatar & Tên người dùng */}
      <View style={styles.profileContainer}>
        <Avatar.Image size={100} source={{ uri: avatar }} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>ID: {userId}</Text> {/* Hiển thị userId nếu cần */}
      </View>

      {/* Danh sách tuỳ chọn */}
      <View style={styles.optionsContainer}>
        <List.Item
          title="Ảnh & video"
          left={(props) => <List.Icon {...props} icon="image-multiple-outline" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Tìm trong cuộc trò chuyện"
          left={(props) => <List.Icon {...props} icon="magnify" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Tắt thông báo"
          left={(props) => <List.Icon {...props} icon="bell-off-outline" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Chặn người này"
          left={(props) => <List.Icon {...props} icon="block-helper" />}
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Xoá cuộc trò chuyện"
          titleStyle={{ color: theme.colors.error }}
          left={(props) => (
            <List.Icon {...props} icon="delete-outline" color={theme.colors.error} />
          )}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  name: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
  },
  username: {
    color: 'gray',
    marginBottom: 12,
  },
  optionsContainer: {
    marginTop: 16,
  },
});