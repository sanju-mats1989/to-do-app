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
import { homeStyles as styles } from '../../components/home.styles';
import MyTasks from '../../components/MyTasks';
import { AuthContext } from '../../context/AuthContext';
import TopBar from '../../components/TopBar';

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

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { email } = useContext(AuthContext);

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
                <Text style={styles.profileName}>{email || 'User'}</Text>
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
          <MyTasks btnLoading={btnLoading} handlePress={handlePress} />

          {/* Active Projects Section */}
          <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 15 }]}>Active Projects</Text>
          <ActiveProjects btnLoading={btnLoading} handlePress={handlePress} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;