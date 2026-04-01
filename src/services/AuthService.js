import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://web-production-4c19b.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Server cold start ke liye retry logic
const apiWithRetry = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    console.log('First attempt failed, retrying in 3s...', error.message);
    await new Promise(r => setTimeout(r, 3000));
    return await fn();
  }
};

export const AuthService = {

  register: async (name, phone, email, password) => {
    await AsyncStorage.clear();
    console.log('Trying fetch...');
    const response = await fetch(BASE_URL + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, password }),
    });
    console.log('Fetch status:', response.status);
    const data = await response.json();
    if (!response.ok) throw { response: { data, status: response.status } };
    return data;
  },

  verifyOTP: async (email, otp) => {
    return await apiWithRetry(async () => {
      const response = await api.post('/auth/verify-otp', { email, otp });
      await AsyncStorage.setItem('token', response.data.access_token);
      return response.data;
    });
  },

  login: async (email, password) => {
    await AsyncStorage.clear();
    return await apiWithRetry(async () => {
      console.log('Logging in... URL:', BASE_URL + '/auth/login'); // ← debug
      const response = await api.post('/auth/login', { email, password });
      console.log('Login success:', response.data); // ← debug
      await AsyncStorage.setItem('token', response.data.access_token);
      return response.data;
    });
  },

  logout: async () => {
    await AsyncStorage.clear();
  },

  getToken: async () => {
    return await AsyncStorage.getItem('token');
  },

  getUser: () => null,
};