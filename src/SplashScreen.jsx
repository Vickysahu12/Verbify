import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start main animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Slightly faster
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Delay loader animation for smoother effect
    setTimeout(() => {
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 800);

    // Navigate after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 2500); // Changed from 7000

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim, loaderOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#F9FAF6"
        translucent={false}
      />

      <Animated.View
        style={[
          styles.content,
          { 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }] 
          },
        ]}
      >
        <Text style={styles.appName}>LINGOLIFT</Text>
        <Text style={styles.tagline}>Learn smarter. Speak better.</Text>
      </Animated.View>

      {/* Animated Loader */}
      <Animated.View 
        style={[
          styles.loaderContainer,
          { opacity: loaderOpacity }
        ]}
      >
        <ActivityIndicator size="small" color="#1F3B1F" />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF6",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 4,
    color: "#1F3B1F",
    ...Platform.select({
      ios: {
        fontWeight: "900",
      },
      android: {
        fontFamily: "sans-serif-medium", // Better rendering on Android
      },
    }),
  },
  tagline: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    letterSpacing: 0.5,
    fontWeight: "400",
  },
  loaderContainer: {
    position: "absolute",
    bottom: 80,
  },
});