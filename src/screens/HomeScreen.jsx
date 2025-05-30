import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConversations } from '../redux/api/conversationApi';
import { ChatSkeletonItem } from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentMe, searchUsers } from '../redux/api/userApi';
import { connectSocket, getSocket } from '../service/socket';
import debounce from 'lodash.debounce';
import { sendFriendRequest } from '../redux/api/friendApi';
import { useAppTheme } from '../context/ThemeContext';
import SearchBar from '../components/SearchBox';
import { FAB } from 'react-native-paper';
import AddGroupUi from "../components/ui/AddGroupUi"
import { createGroup } from '../redux/api/groupApi';

connectSocket();

const ChatListScreen = ({ navigation }) => {
  const { theme } = useAppTheme();
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
  const [localsearchResults, setLocalsearchResults] = useState(searchResults || [])
  const [isOpenModalAddGroup, setIsOpenModalAddGroup] = useState(false)

  if (token) {
    AsyncStorage.setItem('userToken', token);
  }

  const handleAddFriend = (user) => {
    dispatch(sendFriendRequest(user.idUser))
    setLocalsearchResults(prev => prev.map(element => {
      if (element.idUser === user.idUser) {
        return {
          ...element, isFriend: true
        }
      } else return element
    }))
  };

  useEffect(() => {
    if (searchResults.length) {
      setLocalsearchResults(searchResults)
    }
  }, [searchResults])

  useEffect(() => {
    dispatch(getCurrentMe());
    dispatch(fetchConversations());
  }, []);

  useEffect(() => {
    if (me) {
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
      navigation.navigate('CallScreenAudio', { tokenCall });
    }
  }, [tokenCall, navigation]);

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

  const handleAddGroup = async (groupInfo) => {
    const { name, members, avatar } = groupInfo
    console.log(avatar)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('participants', JSON.stringify([...members, me.idUser]));
    formData.append('avatar', avatar);
    await dispatch(createGroup(formData))
    dispatch(fetchConversations());
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Section - Cải thiện layout */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setIsSearching(true)}
            style={styles.searchBar}
          />
        </View>
        <TouchableOpacity
          style={styles.addGroupButton}
          onPress={() => setIsOpenModalAddGroup(true)}
        >
          <View style={styles.addGroupIcon}>
            <Text style={styles.addGroupText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>

      <AddGroupUi
        me={me}
        visible={isOpenModalAddGroup}
        onClose={() => setIsOpenModalAddGroup(false)}
        users={[]}
        onConfirm={handleAddGroup}
        dispatch={dispatch}
        useSelector={useSelector}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.colors.onBackground }]}>Messages</Text>
      </View>

      {isSearching ? (
        localsearchResults.length > 0 ? (
          <FlatList
            data={localsearchResults}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.messageItem}
                onPress={() => {
                  setIsSearching(false);
                  setSearchQuery('');
                  navigation.navigate('ChatDetailScreen', { user: item, isGroup: false });
                }}
              >
                {item.avatar || item.groupAvatar ? (
                  <Image
                    source={{ uri: item.avatar || item.groupAvatar }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                ) : (
                  <Avatar.Icon size={40} icon="account" />
                )}
                <View style={styles.messageContent}>
                  <Text style={[styles.name, { color: theme.colors.onBackground }]}>{item.name} </Text>
                  <Text style={[styles.messageText, { color: theme.colors.onBackground }]}>Nhấn để trò chuyện</Text>
                </View>

                {!item.isFriend && (
                  <TouchableOpacity
                    style={styles.addFriendButton}
                    onPress={() => handleAddFriend(item)}
                  >
                    <Text style={[styles.addFriendText, { color: theme.colors.onBackground }]}>Kết bạn</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Text style={styles.noResultsText}>Không tìm thấy người dùng nào</Text>
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
          <Text style={styles.noResultsText}>Không có tin nhắn nào</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.conversation._id}
          renderItem={({ item }) => {
            const { conversation, lastMessage, plainUser } = item;
            const isGroup = conversation.isGroup;
            const avatarUrl = isGroup ? conversation.groupAvatar : plainUser?.avatar;
            const name = isGroup ? conversation.name : plainUser?.name;
            const participants = conversation.participants
            return (
              <TouchableOpacity
                style={styles.messageItem}
                onPress={() =>
                  navigation.navigate('ChatDetailScreen', {
                    user: plainUser,
                    participants: participants,
                    name: name,
                    isGroup,
                    conversationId: conversation._id,
                    groupAvatar: conversation.groupAvatar,
                    participants: participants
                  })
                }
              >
                {avatarUrl ? (
                  <Avatar.Image size={40} source={{ uri: avatarUrl }} />
                ) : (
                  isGroup ? <Avatar.Icon size={40} icon="account-group" />
                    : <Avatar.Icon size={40} icon="account" />
                )}

                <View style={styles.messageContent}>
                  <Text style={[styles.name, { color: theme.colors.onBackground }]}>
                    {name || 'Tên nhóm chưa có'}
                  </Text>
                  <Text
                    style={[styles.messageText, { color: theme.colors.onBackground }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {lastMessage?.content || (isGroup ? 'Chưa có tin nhắn nào' : 'Chưa có tin nhắn')}
                  </Text>
                </View>

                <View style={styles.rightSection}>
                  <Text style={[styles.time, { color: theme.colors.onBackground }]}>
                    {lastMessage?.timestamp
                      ? new Date(lastMessage.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                      : ''}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },

  // ===== SEARCH SECTION STYLES =====
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
  },
  searchBar: {
    // Để SearchBar component tự handle style
  },
  addGroupButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addGroupIcon: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: '#6600CC',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addGroupText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },

  // ===== EXISTING STYLES =====
  addFriendText: {
    backgroundColor: "green",
    color: "white",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  countText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 5
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  messageContent: {
    flex: 1,
    marginLeft: 10
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  messageText: {
    color: '#666'
  },
  rightSection: {
    alignItems: 'flex-end'
  },
  time: {
    fontSize: 14,
    color: '#999'
  },
  badge: {
    backgroundColor: '#007AFF',
    color: '#fff',
    marginTop: 5
  },
  avatarText: {
    backgroundColor: '#4A90E2'
  },
});