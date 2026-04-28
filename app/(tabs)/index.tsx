import { Feather } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Custom Circular Progress Component (since we are using vanilla React Native)
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
      {/* Simple representation of progress since SVG requires external libs */}
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

const TaskManagerApp = () => {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial loading state
    setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 2000);
  }, []);

  const handlePress = (id, title) => {
    console.log(`Pressed: ${title}`);
    setBtnLoading(id);
    setTimeout(() => {
      setBtnLoading(null);
    }, 1500);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF9F66" />
        <Text style={styles.loadingText}>Loading Your Workspace...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.flex, { opacity: fadeAnim }]}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => handlePress('menu', 'Menu')}>
            <Feather name="menu" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePress('search', 'Search')}>
            <Feather name="search" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }}
                  style={styles.avatar}
                />
              </View>
              <View>
                <Text style={styles.profileName}>Sourav Suman</Text>
                <Text style={styles.profileTitle}>App Developer</Text>
              </View>
            </View>
          </View>

          {/* My Tasks Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Tasks</Text>
            <TouchableOpacity
              style={styles.calendarFab}
              onPress={() => handlePress('calendar', 'Calendar')}
            >
              <Feather name="calendar" size={20} color="white" />
            </TouchableOpacity>
          </View>

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

          {/* Active Projects Section */}
          <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 15 }]}>Active Projects</Text>

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
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Light cream background
  },
  flex: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
  loadingText: {
    marginTop: 10,
    color: '#8E8E8E',
    fontWeight: '500',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFB788', // Soft orange
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
    marginRight: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  profileTitle: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    paddingHorizontal: 20,
  },
  calendarFab: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2E9D9D',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginRight: 20,
  },
  tasksContainer: {
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  taskIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  taskSubtitle: {
    fontSize: 12,
    color: '#8E8E8E',
    marginTop: 2,
  },
  projectsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  projectCard: {
    width: width * 0.43,
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  projectInfo: {
    marginTop: 15,
    alignItems: 'center',
  },
  projectCardTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  projectCardSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  cardLoader: {
    marginTop: 10,
  }
});

export default TaskManagerApp;