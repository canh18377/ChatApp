import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable
} from 'react-native';
import RecalledMessage from '../components/ui/RecalledMessage';
import { Avatar, IconButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from 'emoji-mart-native';
import { fetchMessages, saveImage } from '../redux/api/messageApi';
import { getCurrentMe } from '../redux/api/userApi';
import { useSelector, useDispatch } from 'react-redux';
import { getSocket } from '../service/socket';
import { useAppTheme } from '../context/ThemeContext';

const ChatDetailScreen = ({ navigation, route }) => {
  let socket = null
  const { theme } = useAppTheme();
  const { user, name, isGroup, conversationId, participants, groupAvatar } = route.params || {};
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messageReducer.messages);
  const loading = useSelector((state) => state.messageReducer.loading);
  const [localMessage, setLocalMessage] = useState([])
  const me = useSelector((state) => state.userReducer.me);
  const [input, setInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(false)
  const [openInputUpdateMes, setOpenInputUpdateMes] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")
  useEffect(() => {
    const data = conversationId ? { conversationId: conversationId, exist: true } : { participants: [user.idUser, me.idUser], exist: false }
    dispatch(fetchMessages(data));
    dispatch(getCurrentMe())
    const handleReceiveMessage = (newMessage) => {
      setLocalMessage((prevMessages) => {
        const isExist = prevMessages.some(msg => msg._id === newMessage._id);
        if (isExist) return prevMessages;
        const updatedMessages = [...prevMessages, newMessage];
        updatedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return updatedMessages;
      });
    };

    const handleChangeMessage = (newMessage) => {
      setLocalMessage(prev => {
        return prev.map(mes => {
          if (mes._id === newMessage._id) return newMessage
          else return mes
        })
      })
    }

    if (!socket) {
      socket = getSocket()
    }
    if (socket) {
      socket.on('receive_message', handleReceiveMessage);
      socket.on('deleted_message', handleChangeMessage);
      socket.on('updated_message', handleChangeMessage);

    }
    return () => {
      if (socket) {
        socket.off('receive_message', handleReceiveMessage);
      }
    };
  }, []);

  const handleClickActionMessage = (type, message) => {
    if (!socket) {
      socket = getSocket()
    }
    switch (type) {
      case "update":
        setOpenInputUpdateMes(message._id)
        return
      case "delete":
        socket.emit("deleteMessage", message)
        return
    }
  }
  useEffect(() => {
    if (messages.length) {
      setLocalMessage(messages)
    }
  }, [messages])

  const sendMessage = () => {
    socket = getSocket()
    if (input.trim() && socket) {
      console.log(participants)
      !isGroup
        ? socket.emit('private_message', { senderId: me?.idUser, receiverId: user.idUser, message: input })
        : socket.emit('group_message', { senderId: me?.idUser, receiverIds: participants, message: input, groupName: name, groupAvatar: groupAvatar });
      setInput('');
      setShowPicker(false);
    }
  };
  const sendImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length > 0) {
        const asset = response.assets[0];

        const form = new FormData();
        form.append("image", {
          uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
          name: asset.fileName || 'photo.jpg',
          type: asset.type || 'image/jpeg',
        });

        try {
          const imageUrl = await dispatch(saveImage(form)).unwrap();
          if (!socket) {
            socket = getSocket();
          }
          if (socket) {
            !isGroup
              ? socket.emit('private_message', { senderId: me?.idUser, receiverId: user.idUser, message: imageUrl })
              : socket.emit('group_message', { senderId: me?.idUser, receiverIds: participants, message: imageUrl, groupName: name, groupAvatar: groupAvatar }); setShowPicker(false);
          }
        } catch (err) {
          console.error("Upload image error:", err);
        }
      }
    });
  };
  const isValidUrl = (str) => {
    const pattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    return pattern.test(str);
  };

  const handleUpdateMessage = (item) => {
    if (!socket) {
      socket = getSocket();
    }
    socket.emit("updateMessage", { item, updateMessage })
    setOpenInputUpdateMes(false)
  }
  const renderMessage = ({ item }) => {
    const isImage = isValidUrl(item.content);
    return <View>
      {me?.idUser === item.sender && item.content && selectedMessage === item._id &&
        <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
          {!isValidUrl(item.content) && <IconButton onPress={() => handleClickActionMessage("update", item)} icon="pencil" size={24} />}
          <IconButton onPress={() => handleClickActionMessage("delete", item)} icon="trash-can" size={24} />
        </View>}
      <Pressable onPress={() => {
        setOpenInputUpdateMes(false)
        setSelectedMessage(item._id)
      }}>
        {item.content ?
          <View>
            <View
              style={[
                styles.messageContainer,
                item.sender === me?.idUser ? styles.sent : styles.received,
                isImage && { backgroundColor: 'transparent', padding: 0 }
              ]}>
              {isValidUrl(item.content) ? (
                <Image source={{ uri: item.content }} style={styles.imageMessage} />
              ) : (
                <Text style={[styles.messageText, { color: theme.colors.onBackground }]}>{item.content}</Text>
              )}
            </View>
            {openInputUpdateMes === item._id &&

              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: "flex-end",
                  alignItems: "center",
                  borderWidth: 1,
                  width: 250,
                  borderColor: '#ccc',
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  margin: 10,
                }}
              >
                <TextInput
                  placeholder="Nhập tin nhắn..."
                  value={updateMessage}
                  onChangeText={setUpdateMessage}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    fontSize: 16,
                  }}
                  placeholderTextColor="#888"
                />

                <TouchableOpacity onPress={() => handleUpdateMessage(item)} >
                  <Text
                    style={{
                      color: '#007AFF',
                      fontWeight: 'bold',
                      paddingHorizontal: 10,
                    }}
                  >
                    Cập nhật
                  </Text>
                </TouchableOpacity>
              </View>
            }
          </View>
          : <RecalledMessage
            css={{
              alignSelf: item.sender === me?.idUser ? 'flex-end' : 'flex-start',
            }}
          />}
      </Pressable>
    </View>

  };
  if (!localMessage.length) {
    return
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80} style={{ height: '100%' }}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Main")}>
            <IconButton icon="arrow-left" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileSection} onPress={() =>
            !isGroup && navigation.navigate('ProfileScreen', { user })
          }>
            {groupAvatar || user?.avatar ? (
              <Image source={user?.avatar} />
            ) : (
              isGroup ? <Avatar.Icon size={40} icon="account-group" /> : <Avatar.Icon size={40} icon="account" />
            )}
            <View style={styles.userInfo}>
              <Text style={[styles.username, { color: theme.colors.onBackground }]}>{name || user?.name}</Text>
              <Text style={[styles.status, { color: theme.colors.onBackground }]}>Online</Text>
            </View>
          </TouchableOpacity>

          {!isGroup && <IconButton icon="phone" onPress={() => {
            const socket = getSocket()
            socket.emit("start_call_audio", { toUserId: isGroup ? participants : user.idUser, fromUserId: me?.idUser, name: name || null, groupAvatar: groupAvatar || null })
          }} size={24} />}
        </View>

        {/* Chat Messages */}
        <FlatList
          data={localMessage}
          keyExtractor={(item) => item?._id?.toString() || Math.random()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          inverted
        />
        {/* Emoji Picker */}
        {showPicker && (
          <Picker
            onSelect={emoji => setInput(prev => prev + emoji.native)}
            showPreview={false}
            showSkinTones={false}
            style={{ height: 250 }}
          />)
        }

        {/* Input Box */}
        <View style={styles.inputContainer}>
          <IconButton icon="camera" size={24} onPress={sendImage} />
          <IconButton icon="emoticon-outline" size={24} onPress={() => setShowPicker(prev => !prev)} />
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type message..."
          />
          <TouchableOpacity onPress={sendMessage}>
            <IconButton loading={loading} icon="send" size={24} color="#E91E63" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    position: 'relative'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  userInfo: { marginLeft: 10, flex: 1 },
  username: { fontSize: 18, fontFamily: 'Roboto-Bold' },
  status: { fontSize: 14, color: 'green', fontFamily: 'Roboto-Regular' },
  messagesList: { paddingHorizontal: 16, paddingTop: 10, flexGrow: 1, justifyContent: 'flex-end' },
  buttonAction: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: '75%',
  },
  sent: {
    backgroundColor: '#E91E63',
    alignSelf: 'flex-end',
  },
  received: {
    backgroundColor: '#8BC34A',
    alignSelf: 'flex-start',
  },
  messageText: { fontSize: 16, color: '#fff', fontFamily: 'Roboto-Regular' },
  imageMessage: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: ""
  },
  inputContainer: {
    position: "static",
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 0.5,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 20,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
});

export default ChatDetailScreen;
