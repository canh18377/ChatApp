import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Card, Checkbox, Button, Text, Portal, Divider, Avatar } from 'react-native-paper';
import { fetchFriendList } from '../../redux/api/friendApi';
import { launchImageLibrary } from 'react-native-image-picker';

const AddGroupUi = ({ dispatch, useSelector, visible, me, onClose, onConfirm }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [groupAvatar, setGroupAvatar] = useState(null); // Lưu URI ảnh avatar nhóm
    const friends = useSelector(state => state.friendReducer.friends);

    useEffect(() => {
        dispatch(fetchFriendList());
    }, []);

    const toggleSelect = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const renderUserItem = ({ item }) => {
        const friend = me?.idUser !== item.requester.idUser ? item.requester : item.recipient;
        return (
            <Card style={styles.card}>
                <Card.Content style={styles.userRow}>
                    {friend.avatarUrl ? (
                        <Avatar.Image
                            source={{ uri: friend.avatarUrl }}
                            size={40}
                        />
                    ) : (
                        <Avatar.Text
                            label={friend.name.split(' ').slice(-1)[0][0]}
                            size={40}
                        />
                    )}
                    <Text style={styles.userName}>{friend.name}</Text>
                    <Checkbox
                        status={selectedUsers.includes(friend.idUser) ? 'checked' : 'unchecked'}
                        onPress={() => toggleSelect(friend.idUser)}
                    />
                </Card.Content>
            </Card>
        );
    };

    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response?.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setGroupAvatar({
                    uri: asset.uri,
                    name: asset.fileName || 'photo.jpg',
                    type: asset.type || 'image/jpeg',
                })
            }
        });
    };

    const handleConfirm = () => {
        if (!groupName.trim()) {
            alert("Vui lòng nhập tên nhóm.");
            return;
        }
        if (selectedUsers.length < 2) {
            alert("Vui lòng chọn ít nhất 2 người dùng để tạo nhóm.");
            return;
        }
        if (!groupAvatar) {
            alert("Vui lòng chọn ảnh nhóm");
            return;
        }
        onConfirm({ name: groupName.trim(), members: selectedUsers, avatar: groupAvatar });
        onClose();
        setGroupName('');
        setSelectedUsers([]);
        setGroupAvatar(null);
    };

    if (!friends.length) {
        return null;
    }

    return (
        <Portal>
            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Tạo nhóm trò chuyện</Text>

                        {/* Avatar nhóm */}
                        <TouchableOpacity onPress={pickImage} style={styles.avatarPicker}>
                            {groupAvatar ? (
                                <Avatar.Image size={80} source={{ uri: groupAvatar.uri }} />
                            ) : (
                                <Avatar.Icon size={80} icon="camera" />
                            )}
                            <Text style={styles.avatarHint}>Chọn ảnh đại diện nhóm</Text>
                        </TouchableOpacity>

                        <TextInput
                            label="Tên nhóm"
                            value={groupName}
                            onChangeText={setGroupName}
                            mode="outlined"
                            style={styles.input}
                        />
                        <Divider style={{ marginBottom: 8 }} />
                        <FlatList
                            data={friends}
                            keyExtractor={(item) => item._id}
                            renderItem={renderUserItem}
                        />
                        <View style={styles.actions}>
                            <Button onPress={onClose}>Huỷ</Button>
                            <Button mode="contained" onPress={handleConfirm}>
                                Tạo nhóm
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
};

export default AddGroupUi;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        maxHeight: '85%',
        padding: 16,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    avatarPicker: {
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarHint: {
        marginTop: 4,
        fontSize: 12,
        color: 'gray',
    },
    input: {
        marginBottom: 12,
    },
    card: {
        marginVertical: 4,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    userName: {
        flex: 1,
        fontSize: 16,
        marginLeft: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 8,
    },
});
