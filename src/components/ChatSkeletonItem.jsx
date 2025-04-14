// components/ChatSkeletonItem.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ChatSkeletonItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.lineShort} />
        <View style={styles.lineLong} />
      </View>
    </View>
  );
};

export default ChatSkeletonItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  lineShort: {
    height: 12,
    width: '40%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 6,
  },
  lineLong: {
    height: 12,
    width: '70%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
});
