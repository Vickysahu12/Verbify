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
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
// import { authService } from '../services/authService'; // Uncomment when backend ready

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Login
  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);

      try {
        // TODO: Uncomment when backend ready
        // const response = await authService.login(
        //   formData.email,
        //   formData.password
        // );
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success - Navigate to main app
        navigation.replace("Main");

      } catch (error) {
        setIsLoading(false);

        if (error.response?.status === 401) {
          // Invalid credentials
          Alert.alert(
            "Login Failed",
            "Invalid email or password. Please try again.",
            [{ text: "OK" }]
          );
        } else if (error.response?.status === 404) {
          // Account not found
          Alert.alert(
            "Account Not Found",
            "No account found with this email. Please register first.",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Register", 
                onPress: () => navigation.navigate("Register") 
              }
            ]
          );
        } else {
          // Network or server error
          Alert.alert(
            "Connection Error",
            "Please check your internet connection and try again.",
            [{ text: "OK" }]
          );
        }
      } finally {
        setIsLoading(false);
      }
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.brand}>LingoLift</Text>
          <Text style={styles.subtitle}>Sign in to continue learning</Text>
        </View>

        {/* FORM SECTION */}
        <View style={styles.formSection}>
          {/* Email Input */}
          <View>
            <View
              style={[
                styles.inputWrapper,
                emailFocused && styles.inputFocused,
                errors.email && styles.inputError,
              ]}
            >
              <Icon 
                name="mail-outline" 
                size={20} 
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
                  if (errors.email) {
                    setErrors({ ...errors, email: null });
                  }
                }}
                editable={!isLoading}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View>
            <View
              style={[
                styles.inputWrapper,
                passwordFocused && styles.inputFocused,
                errors.password && styles.inputError,
              ]}
            >
              <Icon 
                name="lock-closed-outline" 
                size={20} 
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
                  if (errors.password) {
                    setErrors({ ...errors, password: null });
                  }
                }}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity 
            style={styles.forgotWrapper}
            onPress={() => navigation.navigate("ForgotPassword")}
            disabled={isLoading}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>Or continue with</Text>
            <View style={styles.line} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity 
              style={styles.socialBtn}
              onPress={() => Alert.alert("Coming Soon", "Google login will be available soon!")}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Image
                source={require("../assets/icon/search.png")}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialBtn}
              onPress={() => Alert.alert("Coming Soon", "Facebook login will be available soon!")}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Image
                source={require("../assets/icon/facebook.png")}
                style={styles.socialIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialBtn}
              onPress={() => Alert.alert("Coming Soon", "Apple login will be available soon!")}
              disabled={isLoading}
              activeOpacity={0.7}
            >
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
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            disabled={isLoading}
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
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },

  /* Header */
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcome: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  brand: {
    fontSize: 45,
    fontWeight: "800",
    color: "#1F3B1F",
    marginTop: 4,
    letterSpacing: 1,
    ...Platform.select({
      ios: {
        fontWeight: "900",
      },
      android: {
        fontFamily: "sans-serif-black",
      },
    }),
  },
  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },

  /* Form Section */
  formSection: {
    marginBottom: 30,
  },

  /* Inputs */
  inputWrapper: {
    backgroundColor: "#E5EFE5",
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: "#1F3B1F",
    backgroundColor: "#F0F7F0",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    paddingVertical: 0,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 20,
    fontWeight: "500",
  },

  /* Forgot */
  forgotWrapper: {
    alignItems: "center",
    marginVertical: 8,
  },
  forgotText: {
    fontSize: 13,
    color: "#1F3B1F",
    fontWeight: "600",
  },

  /* Button */
  button: {
    backgroundColor: "#1F3B1F",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    ...Platform.select({
      android: {
        fontFamily: "sans-serif-medium",
      },
    }),
  },

  /* Divider */
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
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
    fontWeight: "500",
  },

  /* Social */
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#E5EFE5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  socialIcon: {
    width: 24,
    height: 24,
  },

  /* Footer */
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  register: {
    fontSize: 14,
    color: "#1F3B1F",
    fontWeight: "700",
  },
});