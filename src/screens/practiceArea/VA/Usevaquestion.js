import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { AuthService } from '../../../services/AuthService';

const api = axios.create({
  baseURL: 'https://lingolift-backend.onrender.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const useVAQuestions = (questionType) => {
  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [answers,   setAnswers]   = useState({});
  const [results,   setResults]   = useState({});

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AuthService.getToken();
      const res   = await api.get('/va/questions', {
        headers: { Authorization: `Bearer ${token}` },
        params:  { type: questionType },
      });
      const qs = res.data ?? [];
      setQuestions(qs);
      const initAnswers = {};
      qs.forEach(q => { initAnswers[q.id] = null; });
      setAnswers(initAnswers);
      setResults({});
    } catch (err) {
      console.log(`VA questions (${questionType}) error:`, err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [questionType]);

  // ✅ FIX — mount pe automatically load ho
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSelect = useCallback((questionId, optionId) => {
    if (results[questionId]) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  }, [results]);

  const handleCheck = useCallback(async (questionId) => {
    const selected = answers[questionId];
    if (!selected) return;
    if (results[questionId]) return;

    try {
      const token = await AuthService.getToken();
      const res   = await api.post('/va/submit', {
        question_id:   questionId,
        question_type: questionType,
        selected,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setResults(prev => ({ ...prev, [questionId]: res.data }));
    } catch (err) {
      console.log('VA submit error:', err.message);
      setResults(prev => ({
        ...prev,
        [questionId]: { is_correct: false, correct: '?', explanation: { why: 'Could not verify answer.' } }
      }));
    }
  }, [answers, results, questionType]);

  const isChecked    = useCallback((questionId) => !!results[questionId], [results]);
  const getResult    = useCallback((questionId) => results[questionId] ?? null, [results]);

  const totalCorrect = Object.values(results).filter(r => r?.is_correct).length;
  const totalChecked = Object.keys(results).length;

  return {
    questions, loading,
    answers, results,
    loadQuestions,
    handleSelect, handleCheck,
    isChecked, getResult,
    totalCorrect, totalChecked,
  };
};