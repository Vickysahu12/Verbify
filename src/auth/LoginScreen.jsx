import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome To</Text>
          <Text style={styles.brand}>VARCIFY</Text>
        </View>

        {/* FORM SECTION */}
        <View style={styles.formSection}>
          {/* Email */}
          <View
            style={[
              styles.inputWrapper,
              emailFocused && styles.inputFocused,
            ]}
          >
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              style={styles.input}
            />
          </View>

          {/* Password */}
          <View
            style={[
              styles.inputWrapper,
              passwordFocused && styles.inputFocused,
            ]}
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password (CENTER) */}
          <TouchableOpacity style={styles.forgotWrapper}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={() => navigation.replace("Main")}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>Or continue with</Text>
            <View style={styles.line} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
  <TouchableOpacity style={styles.socialBtn}>
    <Image
      source={require("../assets/icon/search.png")}
      style={styles.socialIcon}
      resizeMode="contain"
    />
  </TouchableOpacity>

  <TouchableOpacity style={styles.socialBtn}>
    <Image
      source={require("../assets/icon/facebook.png")}
      style={styles.socialIcon}
      resizeMode="contain"
    />
  </TouchableOpacity>

  <TouchableOpacity style={styles.socialBtn}>
    <Image
      source={require("../assets/icon/apple.png")}
      style={styles.socialIcon}
      resizeMode="contain"
    />
  </TouchableOpacity>
</View>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.replace("Register")}
          >
            <Text style={styles.register}> Register Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F9FAF6",
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
    justifyContent: "space-between", // 🔥 KEY LINE

  },

  /* Header */
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcome: {
    fontSize: 16,
    color: "#6B7280",
  },
  brand: {
    fontSize: 45,
    fontWeight: "800",
    color: "#1F3B1F",
    marginTop: 6,
    letterSpacing: 1,
  },

  /* Form Section */
  formSection: {
    marginBottom: 40,
  },

  /* Inputs */
  inputWrapper: {
    backgroundColor: "#E5EFE5",
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 10, // 🔽 reduced height
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1.4,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: "#1F3B1F",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  /* Forgot */
  forgotWrapper: {
    alignItems: "center",
    marginVertical: 6,
  },
  forgotText: {
    fontSize: 13,
    color: "#1F3B1F",
    fontWeight: "600",
  },

  /* Button */
  button: {
    backgroundColor: "#1F3B1F",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /* Divider */
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
  },
  or: {
    marginHorizontal: 12,
    fontSize: 12,
    color: "#6B7280",
  },

  /* Social */
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#E5EFE5",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Footer */
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#6B7280",
  },
  register: {
    fontSize: 13,
    color: "#1F3B1F",
    fontWeight: "700",
  },
  socialIcon: {
  width: 22,
  height: 22,
},
});
