import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const TopBar: React.FC<TopBarProps> = ({ handlePress }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const onMenuPress = () => setMenuVisible(true);
  const onClose = () => setMenuVisible(false);
  const onMenuItemPress = (id: string, label: string) => {
    setMenuVisible(false);
    handlePress(id, label);
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
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={modalStyles.menuItem}
                onPress={() => onMenuItemPress(item.id, item.label)}
              >
                <Text style={modalStyles.menuText}>{item.label}</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContainer: {
    marginTop: 50,
    marginLeft: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 160,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default TopBar;

