// GroupInfoScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Avatar, Button, Text, Title, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';

const GroupInfoScreen = ({ navigation, route }) => {
    const { name, participants, groupAvatar } = route.params
    console.log(participants)
    const [editing, setEditing] = useState(false);
    const [groupName, setGroupName] = useState(name);
    const [avatarUri, setAvatarUri] = useState(groupAvatar || null);

    const handleChoosePhoto = () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
            },
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    setAvatarUri(response.assets[0].uri);
                }
            }
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleChoosePhoto}>
                {avatarUri ? <Avatar.Image
                    size={80}
                    source={{ uri: avatarUri }}
                    style={styles.avatar}
                /> : <Avatar.Icon size={70} icon="account-group" />}

                <Icon name="edit" size={20} style={styles.editIcon} />
            </TouchableOpacity>

            {editing ? (
                <TextInput
                    label="Tên nhóm"
                    value={groupName}
                    onChangeText={setGroupName}
                    style={styles.input}
                    mode="outlined"
                />
            ) : (
                <Title style={styles.groupName}>{groupName}</Title>
            )}

            <Button
                mode="text"
                onPress={() => setEditing(!editing)}
                uppercase={false}
                style={styles.editBtn}
            >
                {editing ? 'Lưu' : 'Đổi tên hoặc ảnh'}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
    },
    avatar: {
        marginBottom: 12,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 2,
    },
    groupName: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    activity: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
    editBtn: {
        marginTop: 8,
    },
    input: {
        width: '80%',
        marginBottom: 10,
    },
});

export default GroupInfoScreen;
