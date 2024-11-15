import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="menu" size={44} color="black" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="¿Qué zapatilla buscas?"
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="cart-outline" size={44} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="person-outline" size={44} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 70,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: 120,
  },
  menuButton: {
    padding: 5,
    marginRight: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 190,
    paddingHorizontal: 10,
    height: 70,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 20,
    marginLeft: 12,
    outlineStyle: 'none',
  },
  searchButton: {
    padding: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginLeft: 40,
  },
});

export default Header;
