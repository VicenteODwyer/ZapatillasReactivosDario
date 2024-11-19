import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Modal, Text, Pressable, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ onSearch, isAuthenticated }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handleNavigation = (screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleLogout = () => {
    setProfileMenuVisible(false);
    navigation.navigate('login');
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
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => onSearch(searchQuery)}
          >
            <Ionicons name="search" size={26} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => handleNavigation('carrito')}
          >
            <Ionicons name="cart-outline" size={44} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setProfileMenuVisible(!profileMenuVisible)}
          >
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
              onPress={() => handleNavigation('index')}
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
              onPress={() => handleNavigation('login')}
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

      <Modal
        animationType="none"
        transparent={true}
        visible={profileMenuVisible}
        onRequestClose={() => setProfileMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlayContainer}
          activeOpacity={1}
          onPress={() => setProfileMenuVisible(false)}
        >
          <View style={[styles.menuContainer, styles.profileMenuContainer]} onStartShouldSetResponder={(event) => {
            event.stopPropagation();
            return true;
          }}>
            {isAuthenticated ? (
              <>
                <View style={styles.profileInfo}>
                  <Ionicons name="person-circle-outline" size={40} color="#555" />
                  <Text style={styles.userName}>Nombre del Usuario</Text>
                </View>
                
                <View style={styles.separator} />
                
                <Pressable 
                  style={({ hovered }) => [
                    styles.menuItem,
                    hovered && styles.menuItemHovered
                  ]}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={24} color="#555" />
                  <Text style={styles.menuText}>Cerrar Sesión</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable 
                  style={({ hovered }) => [
                    styles.menuItem,
                    hovered && styles.menuItemHovered
                  ]}
                  onPress={() => handleNavigation('login')}
                >
                  <Ionicons name="log-in-outline" size={24} color="#555" />
                  <Text style={styles.menuText}>Iniciar Sesión</Text>
                </Pressable>
              </>
            )}
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
    paddingHorizontal: Platform.select({
      web: '5%',
      default: 10
    }),
    paddingVertical: 10,
    height: Platform.select({
      web: 120,
      default: 80
    }),
    zIndex: 2,
  },
  menuButton: {
    padding: 5,
    marginRight: Platform.select({
      web: 20,
      default: 5
    }),
    outlineStyle: 'none',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: Platform.select({
      web: '5%',
      default: 10
    }),
    paddingHorizontal: 10,
    height: Platform.select({
      web: 70,
      default: 40
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: Platform.select({
      web: 18,
      default: 14
    }),
    paddingVertical: Platform.select({
      web: 20,
      default: 8
    }),
    marginLeft: Platform.select({
      web: 12,
      default: 8
    }),
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
    marginLeft: Platform.select({
      web: 40,
      default: 10
    }),
  },
  modalOverlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.select({
      web: 120,
      default: 80
    }),
    left: 0,
    backgroundColor: 'white',
    width: Platform.select({
      web: 380,
      default: '80%'
    }),
    borderRadius: 25,
    padding: Platform.select({
      web: 20,
      default: 15
    }),
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
    padding: Platform.select({
      web: 25,
      default: 15
    }),
    borderRadius: 20,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    transition: 'all 0.2s ease',
  },
  menuText: {
    fontSize: Platform.select({
      web: 20,
      default: 16
    }),
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
  profileMenuContainer: {
    right: Platform.select({
      web: '5%',
      default: 0
    }),
    left: 'auto',
    width: Platform.select({
      web: 300,
      default: '60%'
    }),
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Platform.select({
      web: 20,
      default: 15
    }),
  },
  userName: {
    fontSize: Platform.select({
      web: 18,
      default: 16
    }),
    marginLeft: 15,
    fontWeight: '500',
    color: '#333',
  },
});

export default Header;
