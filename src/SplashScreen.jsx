import React, { useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, Animated,
  ActivityIndicator, StatusBar, Platform,
} from "react-native";
import { AuthService } from "./services/AuthService";

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.timing(loaderOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 800);

    const timer = setTimeout(async () => {
  try {
    const token = await AuthService.getToken();
    if (token) {
      navigation.replace("Main");
    } else {
      navigation.replace("Onboarding");
    }
  } catch (e) {
    navigation.replace("Onboarding");
  }
}, 2500);
    return () => clearTimeout(timer);  // ← YE ADD KARO
  }, []);  // ← YE CLOSING BRACE ADD KARO

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" translucent={false} />
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.appName}>LINGOLIFT</Text>
        <Text style={styles.tagline}>Learn smarter. Speak better.</Text>
      </Animated.View>
      <Animated.View style={[styles.loaderContainer, { opacity: loaderOpacity }]}>
        <ActivityIndicator size="small" color="#1F3B1F" />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAF6", justifyContent: "center", alignItems: "center" },
  content: { alignItems: "center" },
  appName: { fontSize: 42, fontWeight: "800", letterSpacing: 4, color: "#1F3B1F" },
  tagline: { marginTop: 12, fontSize: 14, color: "#6B7280", letterSpacing: 0.5 },
  loaderContainer: { position: "absolute", bottom: 80 },
});