import React,{useEffect,useRef} from "react";
import { View, StyleSheet, Text, Animated, TouchableOpacity } from "react-native";

const SplashScreen = ({navigation}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue:1,
            duration:1000,
            useNativeDriver:true,
        }).start();

        const timer = setTimeout(() => {
            navigation.replace("Onboarding")
        },5000)
        
        return() => clearTimeout(timer);
    }, [fadeAnim,navigation]);

    return (
    <View style={styles.container}>
      {/* App Name / Tagline */}
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Text style={styles.title}>Be the</Text>
        <Text style={styles.hype}>HYPE.</Text>
      </Animated.View>

      {/* Button */}
      <Animated.View style={{ opacity: fadeAnim, marginTop: 50 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace("Onboarding")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Let's go</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
    );
};

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF6", // light neutral background
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#4A4A4A",
    fontWeight: "500",
  },
  hype: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1F3B1F", // dark green
    marginTop: 8,
  },
  button: {
    backgroundColor: "#6AC259", // gradient-like green
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});