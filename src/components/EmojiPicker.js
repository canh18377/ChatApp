import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { categories, getEmojisByCategory } from '../constants/emojiData';

const { width } = Dimensions.get('window');
const EMOJI_SIZE = width / 8; // 8 emoji trên một hàng

const EmojiPicker = ({ onEmojiSelected, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const currentEmojis = getEmojisByCategory(selectedCategory);

  const renderEmoji = ({ item }) => (
    <TouchableOpacity
      style={styles.emojiItem}
      onPress={() => {
        onEmojiSelected(item);
      }}
    >
      <Text style={styles.emojiText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, selectedCategory === item.id && styles.selectedCategory]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chọn Emoji</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentEmojis}
        renderItem={renderEmoji}
        keyExtractor={(item, index) => `emoji-${index}`}
        numColumns={8}
        contentContainerStyle={styles.emojiList}
      />

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => `category-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emojiList: {
    padding: 5,
  },
  emojiItem: {
    width: EMOJI_SIZE,
    height: EMOJI_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  categoryList: {
    paddingVertical: 10,
    backgroundColor: '#e9e9e9',
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  selectedCategory: {
    backgroundColor: '#ddd',
  },
  categoryIcon: {
    fontSize: 22,
  },
});

export default EmojiPicker;
