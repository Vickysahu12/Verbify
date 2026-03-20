import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, StatusBar, KeyboardAvoidingView,
  Platform, ActivityIndicator, Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AuthService } from '../services/AuthService';

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password too short";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleLogin = async () => {
  if (!validateForm()) return;
  setIsLoading(true);
  try {
    await AuthService.login(formData.email, formData.password);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;
    if (status === 401) {
      Alert.alert("Login Failed", "Invalid email or password.");
    } else if (status === 403 && detail?.includes("verified")) {
      Alert.alert("Email Not Verified", "Please verify your email first.",
        [{ text: "Cancel", style: "cancel" },
         { text: "Verify Now", onPress: () => navigation.navigate("OTPVerify", { email: formData.email }) }]
      );
    } else {
      Alert.alert("Error", detail || "Something went wrong. Try again.");
    }
  } finally {
    setIsLoading(false);
  }
};

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
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.brand}>LingoLift</Text>
          <Text style={styles.subtitle}>Sign in to continue learning</Text>
        </View>

        <View style={styles.formSection}>
          {/* Email */}
          <View>
            <View style={[
              styles.inputWrapper,
              emailFocused && styles.inputFocused,
              errors.email && styles.inputError,
            ]}>
              <Icon name="mail-outline" size={20}
                color={emailFocused ? "#1F3B1F" : "#6B7280"}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text.toLowerCase() });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                editable={!isLoading}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View>
            <View style={[
              styles.inputWrapper,
              passwordFocused && styles.inputFocused,
              errors.password && styles.inputError,
            ]}>
              <Icon name="lock-closed-outline" size={20}
                color={passwordFocused ? "#1F3B1F" : "#6B7280"}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({ ...formData, password: text });
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator color="#FFFFFF" size="small" />
              : <Text style={styles.buttonText}>Sign In</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
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
    flexGrow: 1, backgroundColor: "#F9FAF6",
    paddingHorizontal: 24, paddingTop: 60,
    paddingBottom: 40, justifyContent: "space-between",
  },
  header: { alignItems: "center", marginBottom: 40 },
  welcome: { fontSize: 16, color: "#6B7280", fontWeight: "500" },
  brand: { fontSize: 45, fontWeight: "800", color: "#1F3B1F", marginTop: 4 },
  subtitle: { fontSize: 13, color: "#9CA3AF", marginTop: 4 },
  formSection: { marginBottom: 30 },
  inputWrapper: {
    backgroundColor: "#E5EFE5", borderRadius: 30,
    paddingHorizontal: 18, paddingVertical: 14,
    flexDirection: "row", alignItems: "center",
    marginBottom: 16, borderWidth: 2, borderColor: "transparent",
  },
  inputFocused: { borderColor: "#1F3B1F", backgroundColor: "#F0F7F0" },
  inputError: { borderColor: "#EF4444" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: "#111827", paddingVertical: 0 },
  errorText: { color: "#EF4444", fontSize: 12, marginTop: -12, marginBottom: 12, marginLeft: 20 },
  button: {
    backgroundColor: "#1F3B1F", paddingVertical: 16,
    borderRadius: 30, alignItems: "center", marginTop: 20,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 },
  footerText: { fontSize: 14, color: "#6B7280" },
  register: { fontSize: 14, color: "#1F3B1F", fontWeight: "700" },
});