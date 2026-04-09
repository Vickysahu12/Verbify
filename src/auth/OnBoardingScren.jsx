import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" />

      <View style={styles.imageContainer}>
        {!imageLoaded && (
          <ActivityIndicator 
            size="large" 
            color="#1F3B1F" 
            style={styles.imageLoader}
          />
        )}
        <Image
          source={require("../assets/images/3rdslide.png")}
          style={[
            styles.heroImage, 
            { opacity: imageLoaded ? 1 : 0 }
          ]}
          onLoad={() => setImageLoaded(true)}
          resizeMode="contain"
        />
      </View>

      {/* Text Content */}
      <Text style={styles.welcomeText}>Welcome To</Text>
      <Text style={styles.appName}>LingoLift</Text>

      <Text style={styles.tagline}>
        Learn smarter, not harder. Make education fun.
      </Text>

      {/* Buttons */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Sign in to your account"
          accessibilityRole="button"
        >
          <Text style={styles.primaryText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("Register")}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Create a new account"
          accessibilityRole="button"
        >
          <Text style={styles.secondaryText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF6",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  imageContainer: {
    width: width * 0.9,
    height: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: height * 0.03,
  },

  imageLoader: {
    position: 'absolute',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  welcomeText: {
    fontSize: 20,
    color: "#111827",
    marginTop: 17,
    fontWeight: "400",
  },

  appName: {
    fontSize: 40,
    fontWeight: "800",
    color: "#1F3B1F",
    marginBottom: 9,
    ...Platform.select({
      ios: {
        fontWeight: "900",
      },
      android: {
        fontFamily: "sans-serif-black",
      },
    }),
  },

  tagline: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
    lineHeight: 20,
  },

  buttonWrapper: {
    width: "100%",
    marginTop: "auto",
    paddingBottom: 20, // Will be dynamic with SafeArea
  },

  primaryBtn: {
    backgroundColor: "#1F3B1F",
    width: "100%",
    paddingVertical: 16, // Slightly bigger for better tap target
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 12,
    // Add shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    ...Platform.select({
      android: {
        fontFamily: "sans-serif-medium",
      },
    }),
  },

  secondaryBtn: {
    borderWidth: 2, // Slightly thicker for better visibility
    borderColor: "#1F3B1F",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  secondaryText: {
    color: "#1F3B1F", // Changed to match border
    fontSize: 16,
    fontWeight: "600",
    ...Platform.select({
      android: {
        fontFamily: "sans-serif-medium",
      },
    }),
  },
});