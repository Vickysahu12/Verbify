import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const RegisterScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressActive} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.brand}>VERBIFY</Text>
          </View>

          {/* Spacer */}
          <View style={{ height: 20 }} />

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#6B7280"
              style={styles.input}
            />

            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showConfirmPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Push bottom section */}
          <View style={{ flex: 1 }} />

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signIn}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAF8",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  /* Progress Bar */
  progressContainer: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 50,
    overflow: "hidden",
  },

  progressActive: {
    width: "35%",
    height: "100%",
    backgroundColor: "#1F3B1F",
    borderRadius: 10,
  },

  /* Header */
  header: {
    alignItems: "center",
    marginTop: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },

  brand: {
    fontSize: 45,
    fontWeight: "800",
    color: "#1F3B1F",
    marginTop: 4,
  },

  /* Form */
  form: {
    marginTop:60
  },

  input: {
    backgroundColor: "#E5EFE5",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 14,
    color: "#111827",
    marginTop:12
  },

  passwordWrapper: {
    backgroundColor: "#E5EFE5",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop:12
  },

  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  /* Bottom */
  bottomSection: {
    paddingBottom: 50,
  },

  button: {
    backgroundColor: "#1F3B1F",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },

  footerText: {
    color: "#6B7280",
    fontSize: 13,
  },

  signIn: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 13,
  },
});
