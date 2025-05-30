import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Platform,
  Alert
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { IconButton, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/api/userApi';

import { useAppTheme } from '../context/ThemeContext';


const MyProfileScreen = ({ navigation }) => {
  const me = useSelector((state) => state.userReducer.me);
  const dispatch = useDispatch();

  const [newName, setNewName] = useState(me?.name || '');
  const [newEmail, setNewEmail] = useState(me?.email || '');
  const [avatar, setAvatar] = useState(me?.avatar || null);
  const [modalVisible, setModalVisible] = useState(false);

  // Context theme
  const { theme } = useAppTheme();
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response?.assets && response.assets.length > 0) {
        const asset = response.assets[0];

        const form = new FormData();
        form.append('name', newName);
        form.append('email', newEmail);
        form.append('avatar', {
          uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
          name: asset.fileName || 'photo.jpg',
          type: asset.type || 'image/jpeg',
        });

        setAvatar(asset.uri); // Cập nhật avatar hiển thị
        dispatch(updateUser(form));
      }
    });
  };

  const updateProfile = async () => {
    setModalVisible(false);
    const form = new FormData();
    form.append('name', newName);
    form.append('email', newEmail);

    try {
      await dispatch(updateUser(form)).unwrap();
      Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={avatar ? { uri: avatar } : require('../assets/images/noAvatar.jpg')}
            style={styles.avatar}
          />
          <IconButton icon="camera" size={20} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={[styles.name, { color: theme.colors.onBackground }]}>{me?.name}</Text>
        <IconButton icon="pencil" size={20} onPress={() => setModalVisible(true)} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 7, color: theme.colors.onBackground }}>Email:</Text>
        <Text style={[styles.label, { color: theme.colors.onBackground }]}>
          {me?.email || 'Bạn chưa có thông tin về email'}
        </Text>
      </View>

      <Button mode="contained" style={styles.button} onPress={() => setModalVisible(true)}>
        Cập nhật
      </Button>

      {/* Modal chỉnh sửa */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>

            <TouchableOpacity
              onPress={pickImage}
              style={{ alignItems: 'center', marginBottom: 10 }}
            >
              <Image
                source={me.avatar ? { uri: avatar } : require('../assets/images/noAvatar.jpg')}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <Text style={{ color: '#007bff', marginTop: 5 }}>Đổi ảnh đại diện</Text>
            </TouchableOpacity>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Họ và tên"
              style={styles.input}
            />
            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button mode="contained" onPress={updateProfile}>
              Lưu
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 20, left: 10 },
  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 20, marginTop: 4, marginLeft: 10 },
  button: { marginTop: 20, width: '100%' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#999',
  },
});
