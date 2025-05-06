import React, { useEffect, useState } from 'react';
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

const FriendsScreen = () => {
  const [activeTab, setActiveTab] = useState('Danh sách');
  const dispatch = useDispatch();
  const { friends, sentRequests, receivedRequests, loading } = useSelector(
    (state) => state.friendReducer
  );

  console.log(receivedRequests)
  useEffect(() => {
    dispatch(fetchFriendList());
    dispatch(fetchSentRequests());
    dispatch(fetchReceivedRequests());
  }, [dispatch]);

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      {item.avatar ? (
        <Avatar.Image size={50} source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <Avatar.Text size={50} style={styles.avatar} />
      )}
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        {item.lastMessage && <Text style={styles.lastMessage}>{item.lastMessage}</Text>}
      </View>
    </View>
  );

  const renderSentRequestItem = ({ item }) => {
    const recipient = item.recipient; // Lấy thông tin người nhận từ "recipient"
    return (
      <View style={styles.requestItem}>
        {recipient.avatar ? (
          <Avatar.Image size={50} source={{ uri: recipient.avatar }} style={styles.avatar} />
        ) : (
          <Avatar.Text size={50} style={styles.avatar} />
        )}
        <Text style={styles.requestName}>{recipient.name}</Text>
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
          <Avatar.Text size={50} style={styles.avatar} />
        )}
        <Text style={styles.requestName}>{requester.name}</Text>
        <View style={styles.requestActions}>
          <Button
            mode="contained"
            onPress={() => dispatch(acceptFriendRequest(item._id))}
            style={styles.acceptButton}
            labelStyle={styles.buttonLabel}
          >
            Chấp nhận
          </Button>
          <Button
            mode="outlined"
            onPress={() => dispatch(rejectFriendRequest(item._id))}
            style={styles.declineButton}
            labelStyle={styles.buttonLabel}
          >
            Từ chối
          </Button>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Bạn bè</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Danh sách', 'Đã gửi', 'Đã nhận'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
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
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có bạn bè</Text>}
        />
      )}
      {activeTab === 'Đã gửi' && (
        <FlatList
          data={sentRequests}
          renderItem={renderSentRequestItem}
          keyExtractor={(item) => item._id || item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa gửi lời mời nào</Text>}
        />
      )}
      {activeTab === 'Đã nhận' && (
        <FlatList
          data={receivedRequests}
          renderItem={renderReceivedRequestItem}
          keyExtractor={(item) => item._id || item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa nhận được lời mời nào</Text>}
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
