import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Animated,
} from "react-native";
//import AsyncStorage from '@react-native-async-storage/async-storage';
// import { userService } from '../services/userService'; // When backend ready

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  
  const [userData, setUserData] = useState({
    name: "User",
    dayCount: 0,
    streak: 0,
    studyTime: "0h 0m",
    todayProgress: 0,
  });

  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: userData.todayProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [userData.todayProgress]);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      
      if (userDataStr) {
        const user = JSON.parse(userDataStr);
        
        // TODO: Fetch from backend
        // const stats = await userService.getStats();
        
        setUserData({
          name: user.full_name?.split(' ')[0] || "User",
          dayCount: 12,
          streak: 3,
          studyTime: "4h 20m",
          todayProgress: 40,
        });
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    // TODO: Fetch latest data
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const handlePracticePress = (type) => {
    console.log('Practice pressed:', type);
    // TODO: Navigate to respective screens
    // navigation.navigate('Vocabulary');
  };

  const handleTestPress = (testId) => {
    console.log('Test pressed:', testId);
    // TODO: Navigate to test screen
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.wrapper, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1F3B1F" />
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" />
      
      {/* STICKY HEADER */}
      <View style={styles.stickyHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>
            {getGreeting()}, {userData.name}
          </Text>
          <Text style={styles.subGreeting}>
            Day {userData.dayCount} • Building consistency
          </Text>
        </View>

        <View style={styles.notificationWrapper}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Image
              source={require("../assets/icon/notification.png")}
              style={styles.notificationIcon}
            />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1F3B1F"]}
            tintColor="#1F3B1F"
          />
        }
      >
        <View style={{ height: 110 }} />

        {/* TODAY'S FOCUS */}
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>Today's Focus</Text>
          <Text style={styles.focusDesc}>
            VARC Practice • 70 minutes
          </Text>

          <Text style={styles.focusProgress}>
            {userData.todayProgress}% completed
          </Text>

          <View style={styles.progressBarBg}>
            <Animated.View 
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  })
                }
              ]}
            />
          </View>

          <TouchableOpacity 
            style={styles.focusBtn}
            activeOpacity={0.8}
            onPress={() => console.log('Continue learning')}
          >
            <Text style={styles.focusBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* PRACTICE */}
        <Text style={styles.sectionTitle}>Practice</Text>
        <View style={styles.grid}>
          <PracticeCard 
            icon="🔤" 
            title="Vocabulary" 
            subtitle="10 / 20 words"
            onPress={() => handlePracticePress('vocabulary')}
          />
          <PracticeCard 
            icon="📘" 
            title="Reading" 
            subtitle="12 min article"
            onPress={() => handlePracticePress('reading')}
          />
          <PracticeCard 
            icon="📄" 
            title="RC Practice" 
            subtitle="2 passages"
            onPress={() => handlePracticePress('rc')}
          />
          <PracticeCard 
            icon="🧩" 
            title="VA Practice" 
            subtitle="Para Jumble • OOO"
            onPress={() => handlePracticePress('va')}
          />
        </View>

        {/* TESTS */}
        <Text style={styles.sectionTitle}>Tests</Text>
        <View style={styles.testGrid}>
          <TestCard 
            title="RC Test" 
            status="Not attempted"
            onPress={() => handleTestPress('rc')}
          />
          <TestCard 
            title="Vocab Test" 
            status="Avg 62%"
            onPress={() => handleTestPress('vocab')}
          />
          <TestCard 
            title="VA Test" 
            status="Last: 2 days ago"
            onPress={() => handleTestPress('va')}
          />
        </View>

        {/* WEEKLY SNAPSHOT */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>This Week</Text>

          <View style={styles.weekRow}>
            <Text style={styles.weekStat}>⏱ {userData.studyTime} studied</Text>
            <Text style={styles.weekStat}>🔥 {userData.streak}-day streak</Text>
          </View>

          <View style={styles.weekDots}>
            {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < userData.streak && { backgroundColor: "#1F3B1F" },
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* COMPONENTS */

const PracticeCard = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity 
    style={styles.practiceCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.practiceIcon}>{icon}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSub}>{subtitle}</Text>
  </TouchableOpacity>
);

const TestCard = ({ title, status, onPress }) => (
  <TouchableOpacity 
    style={styles.testCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.testStatus}>{status}</Text>
  </TouchableOpacity>
);

/* STYLES */

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },

  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#F9FAF6",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },

  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    ...Platform.select({
      android: {
        fontFamily: "sans-serif-medium",
      },
    }),
  },

  subGreeting: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  notificationWrapper: {
    position: 'relative',
  },

  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: "#1F3B1F",
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  focusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 28,
    borderWidth: 1,
    marginTop:10,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  focusTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },

  focusDesc: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  focusProgress: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 8,
  },

  progressBarBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
    borderRadius: 8,
  },

  focusBtn: {
    backgroundColor: "#1F3B1F",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#1F3B1F",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  focusBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginHorizontal: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  practiceCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  practiceIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  cardSub: {
    fontSize: 12,
    color: "#6B7280",
  },

  testGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  testCard: {
    width: "31%",
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
  },

  testStatus: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },

  progressCard: {
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  progressTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    fontWeight: "600",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  weekStat: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  weekDots: {
    flexDirection: "row",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },
});