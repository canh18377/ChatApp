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
} from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from 'emoji-mart-native';
import { fetchMessages, saveImage } from '../redux/api/messageApi';
import { getCurrentMe } from '../redux/api/userApi';
import { useSelector, useDispatch } from 'react-redux';
import { getSocket } from '../service/socket';
const ChatDetailScreen = ({ navigation, route }) => {
  const { user, conversationId, isGroup } = route.params || {};
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messageReducer.messages);
  const loading = useSelector((state) => state.messageReducer.loading);
  const [localMessage, setLocalMessage] = useState(messages)
  const me = useSelector((state) => state.userReducer.me);
  const [input, setInput] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  useEffect(() => {
    const data = conversationId ? { conversationId: conversationId, exist: true } : { participants: [user.idUser, me.idUser], exist: false }
    dispatch(fetchMessages(data));
    dispatch(getCurrentMe())
    const handleReceiveMessage = (newMessage) => {
      setLocalMessage((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        updatedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return updatedMessages;
      });
    };
    const socket = getSocket()
    if (socket) {
      socket.on('receive_message', handleReceiveMessage);
    }
    return () => {
      if (socket) {
        socket.off('receive_message', handleReceiveMessage);
      }
    };
  }, []);
  useEffect(() => {
    if (messages.length) {
      setLocalMessage(messages)
    }
  }, [messages])
  const sendMessage = () => {
    const socket = getSocket()
    if (input.trim() && socket) {
      socket.emit('private_message', { senderId: me?.idUser, receiverId: user.idUser, message: input });
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
          const socket = getSocket();
          if (socket) {
            socket.emit('private_message', { senderId: me?.idUser, receiverId: user.idUser, message: imageUrl });
            setShowPicker(false);
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


  const renderMessage = ({ item }) => {
    const isImage = isValidUrl(item.content);
    return <View style={[
      styles.messageContainer,
      item.sender === me?.idUser ? styles.sent : styles.received,
      isImage && { backgroundColor: 'transparent', padding: 0 }
    ]}>
      {isValidUrl(item.content) ? (
        <Image source={{ uri: item.content }} style={styles.imageMessage} />
      ) : (
        <Text style={styles.messageText}>{item.content}</Text>
      )}
    </View>
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80} style={{ height: '100%' }}>
      <View style={{ flex: 1, height: '100%', position: 'relative' }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Main")}>
            <IconButton icon="arrow-left" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileSection} onPress={() => navigation.navigate('ProfileScreen', { user })}>
            {user?.avatar ? (
              <Image source={user?.avatar} />
            ) : (
              <Avatar.Icon size={40} icon="account" />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user?.name}</Text>
              <Text style={styles.status}>Online</Text>
            </View>
          </TouchableOpacity>

          <IconButton icon="phone" onPress={() => {
            const socket = getSocket()
            socket.emit("start_call_audio", { toUserId: user.idUser, fromUserId: me?.idUser })
          }} size={24} />
          <IconButton icon="video" size={24} />
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
    backgroundColor: 'black',
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
