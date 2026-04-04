import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, SafeAreaView
} from 'react-native';
import { AuthService } from '../services/AuthService';

const OTPVerifyScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter 6-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      await AuthService.verifyOTP(email, otp);
      navigation.replace("Main");
    } catch (error) {
      const detail = error.response?.data?.detail;
      Alert.alert("Invalid OTP", detail || "Wrong OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await fetch('http://https://lingolift-backend.onrender.com:8000/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      Alert.alert("OTP Sent", "New OTP sent to your email!");
    } catch (error) {
      Alert.alert("Error", "Could not resend OTP. Try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>OTP sent to {email}</Text>

        <TextInput
          style={styles.otpInput}
          placeholder="Enter 6-digit OTP"
          placeholderTextColor="#6B7280"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Verify OTP</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} disabled={isResending}>
          <Text style={styles.resendText}>
            {isResending ? "Sending..." : "Resend OTP"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPVerifyScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAF6" },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: "800", color: "#1F3B1F", textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6B7280", textAlign: 'center', marginBottom: 40 },
  otpInput: {
    backgroundColor: "#E5EFE5", borderRadius: 16,
    paddingHorizontal: 20, paddingVertical: 16,
    fontSize: 24, fontWeight: "700", color: "#111827",
    textAlign: 'center', letterSpacing: 8, marginBottom: 24,
  },
  button: { backgroundColor: "#1F3B1F", borderRadius: 30, paddingVertical: 16, alignItems: "center", marginBottom: 20 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  resendText: { color: "#1F3B1F", fontWeight: "600", fontSize: 14, textAlign: 'center' },
});