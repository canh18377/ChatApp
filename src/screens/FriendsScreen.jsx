// src/screens/FriendsScreen.jsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Button } from 'react-native-paper';

const friendsList = [
  { id: "1", name: "Draco", avatar: "https://example.com/draco.jpg", lastMessage: "Vient de débloquer le succès Touriste." },
  { id: "2", name: "Hermione", avatar: "https://example.com/hermione.jpg", lastMessage: "A créé la quête Boulogne centre." },
  { id: "3", name: "Ron", avatar: "https://example.com/ron.jpg", lastMessage: "A créé la quête Secrets du Quartier Latin." },
];

const sentRequests = [
  { id: "4", name: "Ginny", avatar: "https://example.com/ginny.jpg" },
  { id: "5", name: "Luna", avatar: "https://example.com/luna.jpg" },
];

const receivedRequests = [
  { id: "6", name: "Neville", avatar: "https://example.com/neville.jpg" },
];

const FriendsScreen = () => {
  const [activeTab, setActiveTab] = useState('Danh sách'); // Tab hiện tại: 'Danh sách', 'Đã gửi', 'Đã nhận'

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      {item.avatar ? (
        <Avatar.Image size={50} source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <Avatar.Text size={50} label={item.name.charAt(0)} style={styles.avatar} />
      )}
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        {item.lastMessage && <Text style={styles.lastMessage}>{item.lastMessage}</Text>}
      </View>
    </View>
  );

  const renderSentRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      {item.avatar ? (
        <Avatar.Image size={50} source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <Avatar.Text size={50} label={item.name.charAt(0)} style={styles.avatar} />
      )}
      <Text style={styles.requestName}>{item.name}</Text>
    </View>
  );

  const renderReceivedRequestItem = ({ item }) => (
    <View style={styles.requestItem}>
      {item.avatar ? (
        <Avatar.Image size={50} source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <Avatar.Text size={50} label={item.name.charAt(0)} style={styles.avatar} />
      )}
      <Text style={styles.requestName}>{item.name}</Text>
      <View style={styles.requestActions}>
        <Button
          mode="contained"
          onPress={() => console.log(`Chấp nhận lời mời từ ${item.name}`)}
          style={styles.acceptButton}
          labelStyle={styles.buttonLabel}
        >
          Chấp nhận
        </Button>
        <Button
          mode="outlined"
          onPress={() => console.log(`Từ chối lời mời từ ${item.name}`)}
          style={styles.declineButton}
          labelStyle={styles.buttonLabel}
        >
          Từ chối
        </Button>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerText}>Bạn bè</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Danh sách' && styles.activeTab]}
          onPress={() => setActiveTab('Danh sách')}
        >
          <Text style={[styles.tabText, activeTab === 'Danh sách' && styles.activeTabText]}>Danh sách</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Đã gửi' && styles.activeTab]}
          onPress={() => setActiveTab('Đã gửi')}
        >
          <Text style={[styles.tabText, activeTab === 'Đã gửi' && styles.activeTabText]}>Đã gửi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Đã nhận' && styles.activeTab]}
          onPress={() => setActiveTab('Đã nhận')}
        >
          <Text style={[styles.tabText, activeTab === 'Đã nhận' && styles.activeTabText]}>Đã nhận</Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung của tab */}
      {activeTab === 'Danh sách' && (
        <FlatList
          data={friendsList}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có bạn bè</Text>}
        />
      )}
      {activeTab === 'Đã gửi' && (
        <FlatList
          data={sentRequests}
          renderItem={renderSentRequestItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa gửi lời mời nào</Text>}
        />
      )}
      {activeTab === 'Đã nhận' && (
        <FlatList
          data={receivedRequests}
          renderItem={renderReceivedRequestItem}
          keyExtractor={(item) => item.id}
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