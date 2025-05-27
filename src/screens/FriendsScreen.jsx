import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFriendList,
  fetchSentRequests,
  fetchReceivedRequests,
  acceptFriendRequest,
  rejectFriendRequest
} from '../redux/api/friendApi';

import { useAppTheme } from '../context/ThemeContext';

const FriendsScreen = () => {
  const { theme } = useAppTheme();
  const [activeTab, setActiveTab] = useState('Danh sách');
  const dispatch = useDispatch();
  const { friends, sentRequests, receivedRequests, loading, loadingReject, loadingAccept } = useSelector(
    (state) => state.friendReducer
  );
  const [selected, setSelected] = useState()
  const me = useSelector((state) => state.userReducer.me);
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchFriendList());
      dispatch(fetchSentRequests());
      dispatch(fetchReceivedRequests());
    }, [])
  )

  const renderFriendItem = ({ item }) => {
    const friend = me?.idUser !== item.requester ? item.requester : item.recipient
    return <View style={styles.friendItem}>
      {friend.avatar ? (
        <Avatar.Image size={50} source={{ uri: friend.avatar }} style={styles.avatar} />
      ) : (
        <Avatar.Icon size={50} name="account" />
      )}
      <View style={styles.friendInfo}>
        <Text style={[styles.friendName, { color: theme.colors.onBackground }]}>{friend.name}</Text>
        {friend.lastMessage && <Text style={[styles.lastMessage, { color: theme.colors.onBackground }]}>{friend.lastMessage}</Text>}
      </View>
    </View>
  };

  const renderSentRequestItem = ({ item }) => {
    const recipient = item.recipient; 
    return (
      <View style={styles.requestItem}>
        {recipient?.avatar ? (
          <Avatar.Image size={50} source={{ uri: recipient?.avatar }} style={styles.avatar} />
        ) : (
          <Avatar.Icon size={40} icon="account" />
        )}
        <Text style={[styles.requestName, { color: theme.colors.onBackground }]}>{recipient?.name}</Text>
      </View>
    );
  };

  const renderReceivedRequestItem = ({ item }) => {
    const requester = item.requester; // Lấy thông tin người nhận từ "requester"
    return (
      <View style={styles.requestItem}>
        {requester.avatar ? (
          <Avatar.Image size={50} source={{ uri: requester.avatar }} style={styles.avatar} />
        ) : (
          <Avatar.Icon size={40} icon="account" />
        )}
        <Text style={[styles.requestName, { color: theme.colors.onBackground }]}>{requester.name}</Text>
        <View style={styles.requestActions}>
          <Button
            mode="contained"
            onPress={() => {
              setSelected(item._id)
              dispatch(acceptFriendRequest(item._id))
            }}
            style={styles.acceptButton}
            labelStyle={styles.buttonLabel}
            loading={loadingAccept && selected === item._id}
          >
            Chấp nhận
          </Button>
          <Button
            mode="outlined"
            onPress={() => {
              setSelected(item._id)
              dispatch(rejectFriendRequest(item._id))
            }}
            style={styles.declineButton}
            labelStyle={styles.buttonLabel}
            loading={loadingReject && selected === item._id}
          >
            Từ chối
          </Button>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.headerText, { color: theme.colors.onBackground }]}>Bạn bè</Text>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Danh sách', 'Đã gửi', 'Đã nhận'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => {
              if (tab === 'Danh sách') {
                dispatch(fetchFriendList())
              } setActiveTab(tab)
            }
            }
          >
            <Text style={[styles.tabText, { color: theme.colors.onBackground }, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'Danh sách' && (
        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item._id || item.id}
          ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>Chưa có bạn bè</Text>}
        />
      )}
      {activeTab === 'Đã gửi' && (
        <FlatList
          data={sentRequests}
          renderItem={renderSentRequestItem}
          keyExtractor={(item) => item._id || Math.random()}
          ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>Chưa gửi lời mời nào</Text>}
        />
      )}
      {activeTab === 'Đã nhận' && (
        <FlatList
          data={receivedRequests}
          renderItem={renderReceivedRequestItem}
          keyExtractor={(item) => item._id || item.id}
          ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>Chưa nhận được lời mời nào</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    backgroundColor: '#007AFF',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  requestName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  requestActions: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    marginRight: 8,
    borderRadius: 8,
  },
  declineButton: {
    borderColor: '#666',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});

export default FriendsScreen;
