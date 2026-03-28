import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, Animated, Platform, Image
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import BackIcon from "../../../assets/icon/backbutton.png";
import axios from 'axios';
import { AuthService } from '../../../services/AuthService';

const api = axios.create({
  baseURL: 'http://https://web-production-4c19b.up.railway.app:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const VocabScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { wordData } = route.params;

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null);

  const word = wordData;
  const progress = 100;

  const handleSubmit = async () => {
    if (selected === null) return;
    setSubmitted(true);
    try {
      const token = await AuthService.getToken();
      const response = await api.post('/vocab/quiz/submit',
        {
          word_id:  word.word_id,
          selected: selected,
          correct:  word.correct,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
    } catch (error) {
      console.log('Submit error:', error);
      // Locally bhi kaam karega
      setResult({
        is_correct: selected === word.correct,
        explanation: word.explanation,
        correct_index: word.correct,
      });
    }
  };

  const isCorrect = result?.is_correct ?? (selected === word.correct);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Image source={BackIcon} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Vocab Builder</Text>
          </View>
          <Text style={styles.day}>🔥 Practice</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.wotdCard}>
          <Text style={styles.wotdTitle}>✨ Practice Word</Text>
          <Text style={styles.wotdSub}>Apply what you just learned</Text>
        </View>

        <View style={styles.wordCard}>
          <Text style={styles.word}>{word.word}</Text>
          <Text style={styles.pronunciation}>{word.pronunciation}</Text>
          <TouchableOpacity style={styles.hintBtn} onPress={() => setShowHint(!showHint)} activeOpacity={0.7}>
            <Text style={styles.hintText}>💡 {showHint ? 'Hide Hint' : 'Show Hint'}</Text>
          </TouchableOpacity>
          {showHint && (
            <View style={styles.hintCard}>
              <Text style={styles.hintContent}>
                Think about the context: "{word.explanation?.substring(0, 50)}..."
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.question}>{word.question}</Text>

        {word.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOpt = submitted && i === word.correct;
          const isWrong = submitted && isSelected && i !== word.correct;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.option, isSelected && styles.optionSelected, isCorrectOpt && styles.correct, isWrong && styles.wrong]}
              onPress={() => !submitted && setSelected(i)}
              disabled={submitted}
              activeOpacity={0.7}
            >
              <View style={[styles.radio, isSelected && styles.radioSelected, isCorrectOpt && styles.radioCorrect, isWrong && styles.radioWrong]}>
                {isSelected && !submitted && <View style={styles.radioDot} />}
                {isCorrectOpt && <Text style={styles.checkmark}>✓</Text>}
                {isWrong && <Text style={styles.crossmark}>✕</Text>}
              </View>
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        {submitted && (
          <View style={[styles.explainCard, isCorrect ? styles.explainSuccess : styles.explainError]}>
            <Text style={styles.explainTitle}>{isCorrect ? '🎉 Correct!' : '❌ Incorrect'}</Text>
            <Text style={styles.explainText}>{result?.explanation || word.explanation}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        {!submitted ? (
          <TouchableOpacity
            style={[styles.submitBtn, selected === null && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={selected === null}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>Submit Answer</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.dualBtn}>
            <TouchableOpacity style={styles.reviewBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Text style={styles.reviewText}>← Review Word</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Text style={styles.nextText}>Finish ✓</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default VocabScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAF6" },
  header: { padding: 16, backgroundColor: "#FFFFFF", elevation: 3 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS === 'ios' ? 10 : 30 },
  backIcon: { width: 22, height: 22 },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center", borderRadius: 20, backgroundColor: "#F3F4F6" },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#1F3B1F" },
  day: { fontSize: 13, fontWeight: "600", color: '#1F3B1F' },
  progressBar: { height: 4, backgroundColor: "#E5E7EB", borderRadius: 10, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: "#1F3B1F", borderRadius: 10 },
  content: { paddingHorizontal: 16 },
  wotdCard: { backgroundColor: "#ECFDF5", padding: 16, borderRadius: 16, marginTop: 16, borderWidth: 1, borderColor: '#D1FAE5' },
  wotdTitle: { fontSize: 14, fontWeight: "700", color: "#065F46" },
  wotdSub: { fontSize: 13, color: "#047857", marginTop: 4 },
  wordCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 24, marginTop: 20, alignItems: "center", elevation: 4 },
  word: { fontSize: 30, fontWeight: "800", color: "#0F172A" },
  pronunciation: { fontSize: 14, color: "#6B7280", marginTop: 6, fontStyle: 'italic' },
  hintBtn: { marginTop: 16, borderWidth: 2, borderColor: "#FDE68A", backgroundColor: '#FEF3C7', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 30 },
  hintText: { fontSize: 14, fontWeight: "700", color: "#92400E" },
  hintCard: { backgroundColor: '#FEF3C7', padding: 12, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#FDE68A', width: '100%' },
  hintContent: { fontSize: 12, color: '#78350F', lineHeight: 18, textAlign: 'center' },
  question: { marginTop: 24, fontSize: 16, fontWeight: "700", color: "#111827" },
  option: { flexDirection: "row", alignItems: "center", borderWidth: 2, borderColor: "#E5E7EB", borderRadius: 14, padding: 16, marginTop: 12, backgroundColor: '#FFFFFF' },
  optionSelected: { borderColor: "#1F3B1F", backgroundColor: "#ECFDF5" },
  correct: { borderColor: "#10B981", backgroundColor: "#DCFCE7" },
  wrong: { borderColor: "#EF4444", backgroundColor: "#FEE2E2" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#9CA3AF", marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: '#1F3B1F' },
  radioCorrect: { borderColor: '#1F3B1F', backgroundColor: '#1F3B1F' },
  radioWrong: { borderColor: '#EF4444', backgroundColor: '#EF4444' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1F3B1F' },
  checkmark: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  crossmark: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  optionText: { fontSize: 15, color: "#111827", flex: 1, fontWeight: '500' },
  explainCard: { padding: 16, borderRadius: 16, marginTop: 20, borderWidth: 2 },
  explainSuccess: { backgroundColor: "#ECFDF5", borderColor: '#1F3B1F' },
  explainError: { backgroundColor: "#FEF2F2", borderColor: '#EF4444' },
  explainTitle: { fontSize: 15, fontWeight: "700", marginBottom: 8, color: "#000" },
  explainText: { fontSize: 13, lineHeight: 20, color: "#000" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: Platform.OS === 'ios' ? 24 : 16, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderColor: "#E5E7EB", elevation: 8 },
  submitBtn: { backgroundColor: "#1F3B1F", paddingVertical: 16, borderRadius: 18, alignItems: "center" },
  btnDisabled: { opacity: 0.4 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  dualBtn: { flexDirection: 'row', gap: 12 },
  reviewBtn: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 16, borderRadius: 18, alignItems: 'center', borderWidth: 2, borderColor: '#E5E7EB' },
  reviewText: { color: '#1F3B1F', fontSize: 15, fontWeight: '700' },
  nextBtn: { flex: 1, backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 18, alignItems: 'center' },
  nextText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
