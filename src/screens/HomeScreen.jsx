import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConversations } from '../redux/api/conversationApi';
import { ChatSkeletonItem } from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBox from '../components/SearchBox';
import { getCurrentMe, searchUsers } from '../redux/api/userApi';
import { connectSocket, getSocket } from '../service/socket';
import debounce from 'lodash.debounce';

connectSocket();

const ChatListScreen = ({ navigation }) => {
  const [tokenCall, setTokenCall] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.conversationReducer.conversations);
  const loading = useSelector((state) => state.conversationReducer.loading);
  const isLoading = useSelector((state) => state.userReducer.loading);
  const me = useSelector((state) => state.userReducer.me);
  const token = useSelector((state) => state.authReducer.token);
  const searchResults = useSelector((state) => state.userReducer.searchResults);

  if (token) {
    AsyncStorage.setItem('userToken', token);
  }

  useEffect(() => {
    dispatch(getCurrentMe());
    dispatch(fetchConversations());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (me) {
      console.log('me', me);
      const socket = getSocket();
      socket.emit('register', me.idUser);

      const handleReceiveToken = (token_call) => {
        setTokenCall(token_call);
      };

      socket.on('receive_token', handleReceiveToken);

      return () => {
        socket.off('receive_token', handleReceiveToken);
      };
    }
  }, [me]);

  useEffect(() => {
    if (tokenCall) {
      navigation.navigate('CallScreen', { tokenCall });
    }
  }, [tokenCall, navigation]);

  // debounce tìm kiếm người dùng
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((text) => {
      if (text.trim() === '') {
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      dispatch(searchUsers(text));
    }, 400),
    [],
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  return (
    <View style={styles.container}>
      {/* Search Box */}
      <SearchBox
        value={searchQuery}
        onChangeText={handleSearch}
        onFocus={() => setIsSearching(true)}
        placeholder="Tìm kiếm người dùng..."
      />
      {isSearching ? (
        searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.messageItem}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                  onPress={() => {
                    setIsSearching(false);
                    setSearchQuery('');
                    navigation.navigate('ChatDetailScreen', { user: item, isGroup: false });
                  }}
                >
                  {item.avatar ? (
                    <Avatar.Image size={40} source={{ uri: item.avatar }} />
                  ) : (
                    <Avatar.Icon size={40} icon="account" style={styles.avatarText} />
                  )}
                  <View style={styles.messageContent}>
                    <Text style={styles.name}>{item.name}</Text>
                  </View>
                </TouchableOpacity>

                {!item.isFriend && (
                  <TouchableOpacity
                    style={styles.addFriendButton}
                    onPress={() => {
                      // Gọi API gửi lời mời kết bạn ở đây nếu có
                      console.log('Send friend request to:', item._id);
                    }}
                  >
                    <Text style={styles.addFriendButtonText}>Kết bạn</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        ) : (
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Text style={{ color: '#999', fontSize: 16 }}>Không tìm thấy người dùng nào</Text>
          </View>
        )
      ) : loading || isLoading ? (
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
            const user = plainUser;
            const avatarUrl = user?.avatar;

            return (
              <TouchableOpacity
                style={styles.messageItem}
                onPress={() =>
                  navigation.navigate('ChatDetailScreen', {
                    user,
                    isGroup: item?.conversation.isGroup,
                    conversationId: item?.conversation._id,
                    tokenCall,
                  })
                }
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
                    {new Date(lastMessage?.timestamp).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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
  addFriendButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addFriendButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
