import { Feather } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActiveProjects from '../../components/ActiveProjects';
import MyTasks from '../../components/MyTasks';
import TopBar from '../../components/TopBar';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import { homeStyles as styles } from '../../stylesheets/home.styles';

// Custom Circular Progress Component (since we are using vanilla React Native)
type CircularProgressProps = {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
};
const CircularProgress = ({ progress, size, strokeWidth, color }: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // const strokeDashoffset = circumference - (progress / 100) * circumference;

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

const capitalizeFirstLetter = (value: string) => {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState({
    total: 0,
    'to-do': 0,
    'in-progress': 0,
    done: 0,
    'on-hold': 0,
    cancelled: 0,
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { firstName, lastName, email } = useContext(AuthContext);
  const fullName = `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`.trim();
  const displayName = fullName || email || 'User';

  useEffect(() => {
    const fetchTaskStatus = async () => {
      try {
        const res = await API.get('/tasks/status');
        setTaskStatus({
          total: res.data?.total ?? 0,
          'to-do': res.data?.['to-do'] ?? 0,
          'in-progress': res.data?.['in-progress'] ?? 0,
          done: res.data?.done ?? 0,
          'on-hold': res.data?.['on-hold'] ?? 0,
          cancelled: res.data?.cancelled ?? 0,
        });
      } catch (err) {
        console.log('TASK STATUS ERROR:', err);
      }
    };

    fetchTaskStatus();

    // Initial loading state
    setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 2000);
     
  }, [fadeAnim]);

  const handlePress = (id: string, title: string) => {
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
      <TopBar handlePress={handlePress} />
      <Animated.View style={[styles.flex, { opacity: fadeAnim }]}> 
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
                <Text style={styles.profileName}>{displayName}</Text>
                {/* <Text style={styles.profileTitle}>App Developer</Text> */}
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
          <MyTasks
            btnLoading={btnLoading}
            handlePress={handlePress}
            taskStatus={taskStatus}
          />

          {/* Active Projects Section */}
          <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 15 }]}>Active Projects</Text>
          <ActiveProjects btnLoading={btnLoading} handlePress={handlePress} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;