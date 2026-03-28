import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://web-production-4c19b.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const AuthService = {

  register: async (name, phone, email, password) => {
    const response = await api.post('/auth/register', { name, phone, email, password });
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    await AsyncStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
  },

  getToken: async () => {
    return await AsyncStorage.getItem('token');
  },

  getUser: () => null,
};