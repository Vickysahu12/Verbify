import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://lingolift-backend.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Retry with up too 3 attempts
const apiWithRetry = async (fn, attempts = 3) => {
  for (let i = 1; i <= attempts; i++) {
    try {
      console.log(`[API] Attempt ${i}/${attempts}`);
      return await fn();
    } catch (error) {
      console.log(`[API] Attempt ${i} failed:`);
      console.log('message:', error.message);
      console.log('code:', error.code);
      console.log('status:', error.response?.status);
      console.log('detail:', error.response?.data?.detail);

      if (i === attempts) throw error;

      const delay = i * 3000;
      console.log(`[API] Retrying in ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
};

export const AuthService = {

  register: async (name, phone, email, password) => {
    return await apiWithRetry(async () => {
      console.log('[AuthService] Registering...', { name, phone, email });
      const response = await api.post('/auth/register', {
        name, phone, email, password,
      });
      console.log('[AuthService] Register success:', response.status);
      return response.data;
    });
  },

  verifyOTP: async (email, otp) => {
    return await apiWithRetry(async () => {
      const response = await api.post('/auth/verify-otp', { email, otp });
      await AsyncStorage.setItem('token', response.data.access_token);
      return response.data;
    });
  },


  login: async (email, password) => {
    await AsyncStorage.removeItem('token');
    return await apiWithRetry(async () => {
      console.log('[AuthService] Logging in...', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('[AuthService] Login success:', response.status);
      await AsyncStorage.setItem('token', response.data.access_token);
      return response.data;
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
  },

  getToken: async () => {
    return await AsyncStorage.getItem('token');
  },

  getUser: () => null,
};