import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Modal } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Avatar, Button, IconButton } from 'react-native-paper';

const MyProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('Nguyễn Văn A');
  const [gender, setGender] = useState('Nam');
  const [dob, setDob] = useState('01/01/2000');
  const [avatarUri, setAvatarUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newGender, setNewGender] = useState(gender);
  const [newDob, setNewDob] = useState(dob);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response.assets[0].uri;
        setAvatarUri(uri);
      }
    });
  };

  const updateProfile = () => {
    setName(newName);
    setGender(newGender);
    setDob(newDob);
    setModalVisible(false);
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
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Avatar.Icon size={100} icon="account" />
          )}
          <IconButton icon="camera" size={20} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.name}>{name}</Text>
        <IconButton icon="pencil" size={20} onPress={() => setModalVisible(true)} />
      </View>

      <Text style={styles.label}>Giới tính: {gender}</Text>
      <Text style={styles.label}>Ngày sinh: {dob}</Text>

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
              value={newGender}
              onChangeText={setNewGender}
              placeholder="Giới tính"
              style={styles.input}
            />
            <TextInput
              value={newDob}
              onChangeText={setNewDob}
              placeholder="Ngày sinh"
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
