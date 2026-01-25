import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" />

      {/* Illustration */}
      <Image
        source={require("../assets/images/3rdslide.png")}
        style={styles.heroImage}
      />

      {/* Text Content */}
      <Text style={styles.welcomeText}>Welcome To</Text>
      <Text style={styles.appName}>VARCIFY</Text>

      <Text style={styles.tagline}>
        Learn smarter, not harder. Make education fun & achieve your goals!
      </Text>

      {/* Buttons */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.secondaryText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF6",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: height * 0.05, // 🔥 dynamic top spacing
  },

  heroImage: {
    width: width * 0.9,      // 🔥 responsive
    height: width * 0.9,
    resizeMode: "contain",
    marginBottom: 12,
  },

  welcomeText: {
    fontSize: 20,
    color: "#111827",
    marginTop: 17,
  },

  appName: {
    fontSize: 40,            // 🔥 balanced
    fontWeight: "800",
    color: "#1F3B1F",
    marginBottom: 9,
  },

  tagline: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
  },

  buttonWrapper: {
    width: "100%",
    marginTop: "auto",       // 🔥 buttons stick to bottom safely
    paddingBottom: height * 0.05,
  },

  primaryBtn: {
    backgroundColor: "#1F3B1F",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#1F3B1F",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
  },

  secondaryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
// Today is rest day for building our app