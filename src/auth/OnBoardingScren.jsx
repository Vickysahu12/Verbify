import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";

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
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF6",
    alignItems: "center",
    paddingTop: 20, // 🔥 image slightly up
    paddingHorizontal: 24,
  },

  heroImage: {
    width: 450,
    height: 450,
    resizeMode: "contain",
    marginBottom: 12,
  },

  welcomeText: {
    fontSize: 22,
    color: "#111827",
    marginTop:22
  },

  appName: {
    fontSize: 45,
    fontWeight: "800",
    color: "#1F3B1F",
    marginBottom: 8,
  },

  tagline: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 8,
  },

  primaryBtn: {
    padding:50,
    backgroundColor: "#1F3B1F",
    width: "85%",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    marginBottom:10
  },

  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#1F3B1F",
    width: "85%",
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
