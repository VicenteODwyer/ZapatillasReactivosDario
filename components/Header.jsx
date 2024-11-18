import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Modal, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const handleNavigation = (screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  return (
    <>
      <View 
        style={styles.header}
        onStartShouldSetResponder={() => {
          setMenuVisible(false);
          return true;
        }}
      >
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={(e) => {
            e.preventDefault();
            setMenuVisible(!menuVisible);
          }}
        >
          <Ionicons 
            name={menuVisible ? "close" : "menu"} 
            size={44} 
            color="black" 
          />
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

      <Modal
        animationType="none"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlayContainer}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer} onStartShouldSetResponder={(event) => {
            event.stopPropagation();
            return true;
          }}>
            <Pressable 
              style={({ hovered }) => [
                styles.menuItem,
                hovered && styles.menuItemHovered
              ]}
              onPress={() => handleNavigation('home')}
            >
              <Ionicons name="home-outline" size={24} color="#555" />
              <Text style={styles.menuText}>Inicio</Text>
            </Pressable>

            <View style={styles.separator} />
            
            <Pressable 
              style={({ hovered }) => [
                styles.menuItem,
                hovered && styles.menuItemHovered
              ]}
              onPress={() => handleNavigation('index')}
            >
              <Ionicons name="log-in-outline" size={24} color="#555" />
              <Text style={styles.menuText}>Login</Text>
            </Pressable>
            
            <View style={styles.separator} />
            
            <Pressable 
              style={({ hovered }) => [
                styles.menuItem,
                hovered && styles.menuItemHovered
              ]}
              onPress={() => handleNavigation('register')}
            >
              <Ionicons name="person-add-outline" size={24} color="#555" />
              <Text style={styles.menuText}>Registro</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 70,
    paddingVertical: 10,
    height: 120,
    zIndex: 2,
  },
  menuButton: {
    padding: 5,
    marginRight: 20,
    outlineStyle: 'none',
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
  modalOverlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    backgroundColor: 'white',
    width: 380,
    borderRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    borderRadius: 20,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    transition: 'all 0.2s ease',
  },
  menuText: {
    fontSize: 20,
    marginLeft: 18,
    color: '#444',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  separator: {
    height: 2,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
    marginHorizontal: 6,
  },
  menuItemHovered: {
    backgroundColor: '#e9ecef',
    transform: [{scale: 1.02}],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
});

export default Header;
