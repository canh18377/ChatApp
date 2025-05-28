import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '../context/ThemeContext';

const SearchBar = ({ value, onChangeText, onFocus }) => {
  const { theme } = useAppTheme();
  const backgroundColor = theme.colors.searchBackground;

  return (
    <View style={[styles.searchWrapper, { backgroundColor }]}>
      <Icon name="search" size={24} color="#999" style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: theme.colors.onSurface }]}
        placeholder="Tìm kiếm ..."
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 0.95,
    paddingVertical: 8,
    fontSize: 16,
  },
});
