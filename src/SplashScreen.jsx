import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StatusBar,
} from "react-native";

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Onboarding");
    }, 7000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* App Name */}
        <Text style={styles.appName}>VERBIFY</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Learn smarter. Speak better.
        </Text>
      </Animated.View>

      {/* Loader */}
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#1F3B1F" />
      </View>
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
  },
  tagline: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  loaderContainer: {
    position: "absolute",
    bottom: 80,
  },
});
