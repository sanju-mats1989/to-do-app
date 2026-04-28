import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { homeStyles as styles } from './home.styles';

const CircularProgress = ({ progress, size, strokeWidth, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ position: 'absolute', color: 'white', fontWeight: 'bold', fontSize: 16 }}>
        {progress}%
      </Text>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'rgba(255,255,255,0.2)',
          position: 'absolute',
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          borderTopColor: 'transparent',
          borderLeftColor: 'transparent',
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
};

const ActiveProjects = ({ btnLoading, handlePress }) => (
  <View style={styles.projectsRow}>
    <TouchableOpacity
      style={[styles.projectCard, { backgroundColor: '#2E9D9D' }]}
      onPress={() => handlePress('medical', 'Medical App')}
    >
      <CircularProgress progress={25} size={70} strokeWidth={6} color="white" />
      <View style={styles.projectInfo}>
        <Text style={styles.projectCardTitle}>Medical App</Text>
        <Text style={styles.projectCardSubtitle}>9 hours progress</Text>
      </View>
      {btnLoading === 'medical' && <ActivityIndicator size="small" color="white" style={styles.cardLoader} />}
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.projectCard, { backgroundColor: '#EB5757' }]}
      onPress={() => handlePress('history', 'History Notes')}
    >
      <CircularProgress progress={60} size={70} strokeWidth={6} color="white" />
      <View style={styles.projectInfo}>
        <Text style={styles.projectCardTitle}>Making History Notes</Text>
        <Text style={styles.projectCardSubtitle}>20 hours progress</Text>
      </View>
      {btnLoading === 'history' && <ActivityIndicator size="small" color="white" style={styles.cardLoader} />}
    </TouchableOpacity>
  </View>
);

export default ActiveProjects;
