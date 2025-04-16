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
import EmojiSelector from 'react-native-emoji-selector';
import { fetchMessages } from '../redux/api/messageApi';
import { getCurrentMe } from '../redux/api/userApi';
import { useSelector, useDispatch } from 'react-redux';
import { getSocket } from '../service/socket';
const ChatDetailScreen = ({ navigation, route }) => {
  const { user, conversationId, isGroup } = route.params || {};
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messageReducer.messages);
  const [localMessage, setLocalMessage] = useState(messages)
  const me = useSelector((state) => state.userReducer.me);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const socket = getSocket()
    dispatch(fetchMessages(conversationId));
    dispatch(getCurrentMe())
    socket.on('receive_message', (newMessage) => {
      setLocalMessage((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        updatedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return updatedMessages;
      });
    });
    return () => {
      if (socket) {
        socket.off('new_message');
      }
    };
  }, []);
  useEffect(() => {
    if (messages.length) {
      setLocalMessage(messages)
    }
  }, [messages])
  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('private_message', { senderId: me?.idUser, receiverId: user.idUser, message: input });
      setInput('');
      setShowEmojiPicker(false);
    }
  };

  const sendImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      socket.emit('send_image', { conversationId, sender: user.id, imageUri });
    }
  };

  const renderMessage = ({ item }) => {
    return (
      <View style={[styles.messageContainer, item.sender === me?.idUser ? styles.sent : styles.received]}>
        {item.content && <Text style={styles.messageText}>{item.content}</Text>}
        {item.image && <Image source={{ uri: item.image }} style={styles.imageMessage} />}
      </View>
    );
  }

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
              <Avatar.Text size={40} label={user?.avatar} />
            ) : (
              <Avatar.Icon size={40} icon="account" />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user?.name}</Text>
              <Text style={styles.status}>Online</Text>
            </View>
          </TouchableOpacity>

          <IconButton icon="phone" size={24} />
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
        {showEmojiPicker && (
          <EmojiSelector
            onEmojiSelected={(emoji) => setInput((prev) => prev + emoji)}
            showSearchBar={false}
            showTabs={true}
          />
        )}

        {/* Input Box */}
        <View style={styles.inputContainer}>
          <IconButton icon="camera" size={24} onPress={sendImage} />
          <IconButton icon="emoticon-outline" size={24} onPress={() => setShowEmojiPicker(!showEmojiPicker)} />
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type message..."
          />
          <TouchableOpacity onPress={sendMessage}>
            <IconButton icon="send" size={24} color="#E91E63" />
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
  },
  inputContainer: {
    position: 'absolute',
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
