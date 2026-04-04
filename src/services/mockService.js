/**
 * mockService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All MockPortal API calls in one place.
 * Tera existing getMocks() wala pattern follow kiya — same axios instance.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://lingolift-backend.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Token auto-attach
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── 1. MOCK LIST  →  MockListScreen ─────────────────────────────────────────
// GET /mocks?type=full|half|topic

export const getMocks = async (type = null) => {
  const res = await api.get('/mocks', {
    params: type ? { type } : {},
  });
  return res.data;
};

// ─── 2. MOCK DETAIL  →  MockDetailScreen ─────────────────────────────────────
// GET /mocks/{mockId}

export const getMockDetail = async (mockId) => {
  const res = await api.get(`/mocks/${mockId}`);
  return res.data;
};

// ─── 3. EXAM CONFIG  →  TestInterfaceScreen ──────────────────────────────────
// GET /mocks/{mockId}/exam-config
// Creates a new attempt + returns passages & questions (no correct answers)

export const getExamConfig = async (mockId) => {
  const res = await api.get(`/mocks/${mockId}/exam-config`);
  return res.data;
};

// ─── 4. SUBMIT ATTEMPT  →  TestInterfaceScreen SubmitModal ──────────────────
// POST /attempts/{attemptId}/submit
// questionMeta: { [questionId]: { status, selected, tita_answer, time_spent } }

export const submitAttempt = async (attemptId, questionMeta, timeTakenSecs) => {
  const res = await api.post(`/attempts/${attemptId}/submit`, {
    question_meta:    questionMeta,
    time_taken_secs:  timeTakenSecs,
  });
  return res.data;
};

// ─── 5. SOLUTIONS  →  SolutionScreen ─────────────────────────────────────────
// GET /attempts/{attemptId}/solutions
// Only works after submit — returns correct answers + explanations

export const getSolutions = async (attemptId) => {
  const res = await api.get(`/attempts/${attemptId}/solutions`);
  return res.data;
};

// ─── 6. AUTO-SAVE (optional)  →  TestInterfaceScreen ─────────────────────────
// POST /attempts/{attemptId}/save
// Call every 30s to not lose progress if app crashes

export const saveProgress = async (attemptId, questionMeta, timeTakenSecs) => {
  const res = await api.post(`/attempts/${attemptId}/save`, {
    question_meta:   questionMeta,
    time_taken_secs: timeTakenSecs,
  });
  return res.data;
};

// ─── 7. USER ATTEMPT HISTORY  →  MockDetailScreen "Previous Attempt" ─────────
// GET /mocks/{mockId}/attempts

export const getMockAttempts = async (mockId) => {
  const res = await api.get(`/mocks/${mockId}/attempts`);
  return res.data;
};