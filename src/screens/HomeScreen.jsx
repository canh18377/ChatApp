import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConversations } from '../redux/api/conversationApi';
import { ChatSkeletonItem } from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentMe } from '../redux/api/userApi';
import { connectSocket } from '../service/socket';
const ChatListScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch()
  const conversations = useSelector(state => state.conversationReducer.conversations)
  const loading = useSelector(state => state.conversationReducer.loading)
  const isLoading = useSelector(state => state.userReducer.loading)
  const me = useSelector((state) => state.userReducer.me);
  const token = useSelector(state => state.authReducer.token)
  if (token) {
    AsyncStorage.setItem("userToken", token)
  }
  useEffect(() => {
    dispatch(getCurrentMe())
    dispatch(fetchConversations())
  }, []);

  useEffect(() => {
    const socket = connectSocket();
    if (me) {
      socket.emit("register", me.idUser)
    }
  }, [me])
  return (
    <View style={styles.container}>
      {/* Search Box */}
      <View style={styles.searchWrapper}>
        <Icon name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
        <Text style={styles.countText}>({messages.length})</Text>
      </View>

      {loading || isLoading ? (
        <View>
          {Array.from({ length: conversations.length }).map((_, index) => (
            <ChatSkeletonItem key={index} />
          ))}
        </View>
      ) : conversations.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: '#999', fontSize: 16 }}>Không có tin nhắn nào</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.conversation._id}
          renderItem={({ item }) => {
            const { plainUser, lastMessage } = item;
            const user = plainUser
            const avatarUrl = user?.avatar;

            return (
              <TouchableOpacity
                style={styles.messageItem}
                onPress={() => navigation.navigate('ChatDetailScreen', { user, isGroup: item?.conversation.isGroup, conversationId: item?.conversation._id })}
              >
                {avatarUrl ? (
                  <Avatar.Image size={40} source={{ uri: avatarUrl }} />
                ) : (
                  <Avatar.Icon size={40} icon="account" />
                )}

                <View style={styles.messageContent}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.messageText} numberOfLines={1} ellipsizeMode="tail">
                    {lastMessage?.content || 'Chưa có tin nhắn'}
                  </Text>
                </View>
                <View style={styles.rightSection}>
                  <Text style={styles.time}>
                    {new Date(lastMessage?.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />

      )}
    </View>
  );
};
export default ChatListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  searchIcon: { marginRight: 6 },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  countText: { fontSize: 16, color: '#4A90E2', marginLeft: 5 },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  messageContent: { flex: 1, marginLeft: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  messageText: { color: '#666' },
  rightSection: { alignItems: 'flex-end' },
  time: { fontSize: 14, color: '#999' },
  badge: { backgroundColor: '#007AFF', color: '#fff', marginTop: 5 },
  avatarText: { backgroundColor: '#4A90E2' },
});

