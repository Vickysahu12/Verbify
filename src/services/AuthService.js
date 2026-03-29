import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://web-production-4c19b.up.railway.app';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Response interceptor — 200 aaye but axios error kare toh bhi handle karo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 200 || error.response.status === 201)) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export const AuthService = {

  register: async (name, phone, email, password) => {
  const response = await fetch(
    'https://web-production-4c19b.up.railway.app/auth/register',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, password }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw { response: { data, status: response.status } };
  return data;
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