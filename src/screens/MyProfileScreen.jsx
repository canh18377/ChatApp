import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Modal } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Avatar, Button, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/api/userApi';
const MyProfileScreen = ({ navigation }) => {
  const me = useSelector((state) => state.userReducer.me);
  const [email, setEmail] = useState(me?.email);
  const [newName, setNewName] = useState(me.name)
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch()
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const asset = response.assets[0];
        const form = new FormData()
        form.append("name", newName)
        form.append("email", email)
        form.append("avatar", {
          uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
          name: asset.fileName || 'photo.jpg',
          type: asset.type || 'image/jpeg',
        });
        dispatch(updateUser(form))
      }
    });
  };

  const updateProfile = () => {
    setModalVisible(false)
    const form = new FormData()
    form.append("name", newName)
    form.append("email", email)
    dispatch(updateUser(form))
  };

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
          {me ? (
            <Image source={{ uri: me.avatar }} style={styles.avatar} />
          ) : (
            <Avatar.Icon size={100} icon="account" />
          )}
          <IconButton icon="camera" size={20} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.name}>{me.name}</Text>
        <IconButton icon="pencil" size={20} onPress={() => setModalVisible(true)} />
      </View>
      <View style={{ flexDirection: "row", alignContent: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 7 }}>Email:</Text>
        <Text style={styles.label}> {me?.email || "Bạn chưa có thông tin về email"}</Text>
      </View>
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
            <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Họ và tên"
              style={styles.input}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              style={styles.input}
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
  cameraIcon: { position: 'absolute', right: -10, bottom: -10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 16, marginTop: 10 },
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
});
