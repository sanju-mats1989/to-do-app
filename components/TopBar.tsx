import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { homeStyles as styles } from '../stylesheets/home.styles';

interface TopBarProps {
  handlePress: (id: string, title: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'mytasks', label: 'My Tasks' },
  { id: 'createtask', label: 'Create Task' },
  { id: 'profile', label: 'Profile' },
  { id: 'logout', label: 'Logout' },
];

const menuIcons: Record<string, keyof typeof Feather.glyphMap> = {
  home: 'home',
  mytasks: 'check-square',
  createtask: 'plus-circle',
  profile: 'user',
  logout: 'log-out',
};

const TopBar: React.FC<TopBarProps> = ({ handlePress }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const auth = useContext(AuthContext);
  const router = useRouter();

  const onMenuPress = () => setMenuVisible(true);
  const onClose = () => setMenuVisible(false);
  const onMenuItemPress = async (id: string, label: string) => {
    setMenuVisible(false);
    if (id === 'logout') {
      // Logout logic: remove token, clear context, redirect
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        auth.setFirstName('');
        auth.setLastName('');
        auth.setEmail('');
        router.replace('/');
      } catch (e) {
        console.log('Logout error:', e);
      }
    } else {
      handlePress(id, label);
    }
  };

  return (
    <>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onMenuPress}>
          <Feather name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('search', 'Search')}>
          <Feather name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity style={modalStyles.overlay} activeOpacity={1} onPress={onClose}>
          <View style={modalStyles.menuContainer}>
            <Text style={modalStyles.menuTitle}>Quick Menu</Text>
            {menuItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={modalStyles.menuItem}
                  onPress={() => onMenuItemPress(item.id, item.label)}
                >
                  <View style={modalStyles.menuLeftSection}>
                    <View style={modalStyles.menuIconWrap}>
                      <Feather name={menuIcons[item.id]} size={16} color="#2C2C2C" />
                    </View>
                    <Text style={modalStyles.menuText}>{item.label}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color="#A2A2A2" />
                </TouchableOpacity>
                {index < menuItems.length - 1 ? <View style={modalStyles.menuDivider} /> : null}
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContainer: {
    marginTop: 56,
    marginLeft: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 10,
    minWidth: 240,
    maxWidth: 300,
    width: '70%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8D8D8D',
    paddingHorizontal: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  menuLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
});

export default TopBar;

