import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, StyleSheet } from 'react-native';
import { TextInput, Card, Checkbox, Button, Text, Portal, Divider, Provider, Avatar } from 'react-native-paper';
import { fetchFriendList } from '../../redux/api/friendApi';

const AddGroupUi = ({ dispatch, useSelector, visible, me, onClose, onConfirm }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState('');
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
                    <Avatar.Text
                        label={friend.name.split(' ').slice(-1)[0][0]}
                        size={40}
                    />
                    <Text style={styles.userName}>{friend.name}</Text>
                    <Checkbox
                        status={selectedUsers.includes(friend.idUser) ? 'checked' : 'unchecked'}
                        onPress={() => toggleSelect(friend.idUser)}
                    />
                </Card.Content>
            </Card>
        );
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
        onConfirm({ name: groupName.trim(), members: selectedUsers });
        onClose();
        setGroupName('');
        setSelectedUsers([]);
    };

    if (!friends.length) {
        return <Text>Loading...</Text>;
    }

    return (
        <Portal>
            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Tạo nhóm trò chuyện</Text>
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
                            keyExtractor={(item) => item.id}
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
