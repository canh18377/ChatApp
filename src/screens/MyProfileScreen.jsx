import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux';

import { getCurrentMe, updateUser } from '../redux/api/userApi';
const MyProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.userReducer.me);
  const token = useSelector((state) => state.authReducer.token);

  const [name, setName] = useState(me?.name || '');
  const [email, setEmail] = useState(me?.email || '');
  const [avatar, setAvatar] = useState(me?.avatar || null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);

  useEffect(() => {
    dispatch(getCurrentMe());
  }, [dispatch]);

  useEffect(() => {
    if (me) {
      setName(me.name || '');
      setEmail(me.email || '');
      setAvatar(me.avatar || null);

      setNewName(me.name || '');
      setNewEmail(me.email || '');
    }
  }, [me]);

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.7,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        const base64Img = `data:${response.assets[0].type};base64,${response.assets[0].base64}`;
        setAvatar(base64Img);
      }
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        name: newName,
        email: newEmail,
      };

      if (avatar && avatar.startsWith('data:image')) {
        updatedData.avatar = avatar; // Chỉ gửi khi là ảnh mới chọn
      }

      await dispatch(updateUser({ userData: updatedData, token })).unwrap();
      dispatch(getCurrentMe());
      Alert.alert('Cập nhật thành công');
      setModalVisible(false);
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Cập nhật thất bại', error?.message || 'Đã có lỗi xảy ra');
    }
  };

  useEffect(() => {
    dispatch(getCurrentMe());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
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
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <IconButton icon="camera" size={20} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.name}>{name}</Text>
        <IconButton icon="pencil" size={20} onPress={() => setModalVisible(true)} />
      </View>

      <Text style={styles.label}>Email: {email}</Text>

      <Button mode="contained" style={styles.button} onPress={() => setModalVisible(true)}>
        Cập nhật
      </Button>

      {/* Modal chỉnh sửa thông tin */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Nút X để đóng modal */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>

            {/* Ảnh đại diện */}
            <TouchableOpacity
              onPress={pickImage}
              style={{ alignItems: 'center', marginBottom: 10 }}
            >
              <Image
                source={avatar ? { uri: avatar } : require('../assets/images/noAvatar.jpg')}
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
            <Button mode="contained" onPress={handleUpdate}>
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
  container: { flex: 1, alignItems: 'center', padding: 20 },
  backButton: { position: 'absolute', top: 20, left: 10 },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 100,
    padding: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
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
  name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  label: { fontSize: 16, marginTop: 10, color: '#333' },
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
