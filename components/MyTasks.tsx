import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { homeStyles as styles } from './home.styles';

const MyTasks = ({ btnLoading, handlePress }) => (
  <View style={styles.tasksContainer}>
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => handlePress('todo', 'To Do')}
    >
      <View style={[styles.taskIconContainer, { backgroundColor: '#FFEDED' }]}> 
        <Feather name="clock" size={20} color="#FF5252" />
      </View>
      <View style={styles.taskTextContainer}>
        <Text style={styles.taskLabel}>To Do</Text>
        <Text style={styles.taskSubtitle}>5 tasks now. 1 started</Text>
      </View>
      {btnLoading === 'todo' && <ActivityIndicator size="small" color="#FF5252" />}
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => handlePress('inprogress', 'In Progress')}
    >
      <View style={[styles.taskIconContainer, { backgroundColor: '#FFF4E5' }]}> 
        <Feather name="refresh-cw" size={20} color="#FFA726" />
      </View>
      <View style={styles.taskTextContainer}>
        <Text style={styles.taskLabel}>In Progress</Text>
        <Text style={styles.taskSubtitle}>1 tasks now. 1 started</Text>
      </View>
      {btnLoading === 'inprogress' && <ActivityIndicator size="small" color="#FFA726" />}
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => handlePress('done', 'Done')}
    >
      <View style={[styles.taskIconContainer, { backgroundColor: '#EBF3FF' }]}> 
        <Feather name="check-circle" size={20} color="#4285F4" />
      </View>
      <View style={styles.taskTextContainer}>
        <Text style={styles.taskLabel}>Done</Text>
        <Text style={styles.taskSubtitle}>18 tasks now. 13 started</Text>
      </View>
      {btnLoading === 'done' && <ActivityIndicator size="small" color="#4285F4" />}
    </TouchableOpacity>
  </View>
);

export default MyTasks;
