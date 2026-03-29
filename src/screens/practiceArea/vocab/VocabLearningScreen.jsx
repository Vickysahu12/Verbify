import React, { useState, useCallback, useEffect } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Dimensions, ActivityIndicator, Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Linking } from 'react-native';
import axios from 'axios';
import { AuthService } from '../../../services/AuthService';

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

const api = axios.create({
  baseURL: 'https://web-production-4c19b.up.railway.app',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const VocabLearningScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => { loadWords(); }, []);

  const loadWords = async () => {
    try {
      setIsLoading(true);
      const token = await AuthService.getToken();
      const response = await api.get('/vocab/words', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWords(response.data);
    } catch (error) {
      console.log('Error loading words:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      const token = await AuthService.getToken();
      const word = words[index];
      await api.post('/vocab/bookmark',
        { word_id: word.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      const updated = [...words];
      updated[index] = { ...word, is_bookmarked: !word.is_bookmarked };
      setWords(updated);
    } catch (error) {
      console.log('Bookmark error:', error);
    }
  };

  const handlePractice = async () => {
    try {
      const token = await AuthService.getToken();
      const word = words[index];
      const response = await api.get(`/vocab/words/${word.id}/quiz`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const quiz = response.data;
      navigation.navigate("Vocab", {
        wordData: {
          word_id:       quiz.word_id,
          word:          quiz.word,
          pronunciation: quiz.phonetic,
          question:      quiz.question,
          options:       quiz.options,
          correct:       quiz._correct_index,
          explanation:   quiz.explanation,
        }
      });
    } catch (error) {
      console.log('Quiz error:', error);
    }
  };

  const handleNext = useCallback(() => {
    if (index < words.length - 1) setIndex(prev => prev + 1);
  }, [index, words.length]);

  const handlePrevious = useCallback(() => {
    if (index > 0) setIndex(prev => prev - 1);
  }, [index]);

  const openArticle = () => {
    const word = words[index];
    if (word?.article_url) Linking.openURL(word.article_url);
  };

  const renderContext = (word) => {
    if (!word?.context) return null;
    const parts = word.context.split(new RegExp(`(${word.word})`, 'gi'));
    return (
      <Text style={styles.contextText}>
        {parts.map((part, idx) =>
          part.toLowerCase() === word.word.toLowerCase() ? (
            <Text key={idx} style={styles.highlight}>{part}</Text>
          ) : (
            <Text key={idx}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, styles.centerContent]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading vocabulary...</Text>
      </SafeAreaView>
    );
  }

  if (words.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, styles.centerContent]}>
        <Text style={{ fontSize: 40 }}>📚</Text>
        <Text style={styles.loadingText}>No words available</Text>
      </SafeAreaView>
    );
  }

  const word = words[index];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.headerAction}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>CAT VOCAB</Text>
          <Text style={styles.headerSub}>Word {index + 1} of {words.length}</Text>
        </View>
        <TouchableOpacity onPress={handleBookmark} activeOpacity={0.7}>
          <Text style={styles.headerAction}>{word.is_bookmarked ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* TAG */}
        {word.tag && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{word.tag}</Text>
          </View>
        )}

        {/* WORD */}
        <Text style={styles.word}>{word.word}</Text>

        {/* LEARNED BADGE */}
        {word.is_completed && (
          <View style={styles.learnedBadge}>
            <Text style={styles.learnedText}>✓ Learned</Text>
          </View>
        )}

        {/* PRONUNCIATION */}
        <View style={styles.pronounceBox}>
          <Text style={styles.phonetic}>{word.phonetic}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.pronounceText}>🔊 PRONOUNCE</Text>
          </TouchableOpacity>
        </View>

        {/* DEFINITION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📘 Definition</Text>
          <View style={styles.definitionCard}>
            <Text style={styles.definitionText}>{word.definition}</Text>
          </View>
        </View>

        {/* SYNONYMS & ANTONYMS */}
        <View style={styles.dualSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>↔️ Synonyms</Text>
            {(word.synonyms || []).map((item, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>🚫 Antonyms</Text>
            {(word.antonyms || []).map((item, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CONTEXT */}
        {word.context && (
          <View style={styles.section}>
            <View style={styles.contextHeader}>
              <Text style={styles.sectionTitle}>📰 Editorial Context</Text>
              {word.source && <Text style={styles.source}>SOURCE: {word.source}</Text>}
            </View>
            <View style={styles.contextCard}>
              {renderContext(word)}
              {word.article_url && (
                <TouchableOpacity onPress={openArticle} activeOpacity={0.7}>
                  <Text style={styles.readMore}>Read Full Article ↗</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* TIP */}
        {word.tip && (
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 CAT EXAM TIP</Text>
            <Text style={styles.tipText}>{word.tip}</Text>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
          onPress={handlePrevious}
          disabled={index === 0}
          activeOpacity={0.7}
        >
          <Text style={styles.navBtnText}>← Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, index === words.length - 1 && styles.navBtnDisabled]}
          onPress={handleNext}
          disabled={index === words.length - 1}
          activeOpacity={0.7}
        >
          <Text style={styles.navBtnText}>Next →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.practiceBtn} onPress={handlePractice} activeOpacity={0.8}>
          <Text style={styles.practiceText}>Practice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VocabLearningScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FCFCF7" },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: scale(16), backgroundColor: "#FCFCF7", zIndex: 10,
    paddingTop: Platform.OS === 'ios' ? scale(10) : scale(40), elevation: 2,
  },
  container: { padding: scale(16), paddingBottom: scale(140) },
  headerTitle: { fontSize: scale(12), fontWeight: "700", color: "#0F172A", textAlign: "center" },
  headerSub: { fontSize: scale(11), color: "#1F3B1F", textAlign: "center", marginTop: 2 },
  headerAction: { fontSize: scale(20), fontWeight: "700", color: "#0F172A" },
  tag: { alignSelf: "center", backgroundColor: "#ECFDF5", paddingHorizontal: scale(14), paddingVertical: scale(5), borderRadius: 20, marginBottom: scale(16) },
  tagText: { fontSize: scale(10), fontWeight: "700", color: "#1F3B1F", letterSpacing: 1 },
  word: { fontSize: scale(34), fontWeight: "800", color: "#0F172A", textAlign: "center", marginBottom: scale(8) },
  learnedBadge: { alignSelf: 'center', backgroundColor: '#1F3B1F', paddingHorizontal: scale(12), paddingVertical: scale(4), borderRadius: 12, marginBottom: scale(14) },
  learnedText: { fontSize: scale(11), fontWeight: '700', color: '#FFFFFF' },
  pronounceBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: scale(14), padding: scale(14), marginBottom: scale(22), elevation: 2 },
  phonetic: { fontSize: scale(14), color: "#374151", fontStyle: 'italic' },
  pronounceText: { fontSize: scale(11), fontWeight: "700", color: "#1F3B1F" },
  section: { marginBottom: scale(24) },
  sectionTitle: { fontSize: scale(14), fontWeight: "700", color: "#0F172A", marginBottom: scale(10) },
  definitionCard: { backgroundColor: "#FFFFFF", borderRadius: scale(14), padding: scale(16), elevation: 2 },
  definitionText: { fontSize: scale(14), color: "#374151", lineHeight: 22, fontStyle: "italic" },
  dualSection: { flexDirection: "row", gap: scale(14), marginBottom: scale(24) },
  chip: { backgroundColor: "#FFFFFF", paddingVertical: scale(8), paddingHorizontal: scale(12), borderRadius: 10, marginBottom: 8, elevation: 1 },
  chipText: { fontSize: scale(12), color: "#0F172A", fontWeight: '500' },
  contextHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  source: { fontSize: scale(10), fontWeight: "700", color: "#6B7280" },
  contextCard: { backgroundColor: "#ECFDF5", borderRadius: scale(14), padding: scale(16), borderWidth: 1, borderColor: '#D1FAE5' },
  contextText: { fontSize: scale(13), color: "#065F46", lineHeight: 21 },
  highlight: { backgroundColor: "#A7F3D0", fontWeight: "800", paddingHorizontal: 2 },
  readMore: { marginTop: 12, fontSize: scale(12), fontWeight: "700", color: "#10B981" },
  tipCard: { backgroundColor: "#FEF3C7", borderRadius: scale(14), padding: scale(16), borderWidth: 1, borderColor: '#FDE68A' },
  tipTitle: { fontSize: scale(13), fontWeight: "700", color: "#92400E", marginBottom: 8 },
  tipText: { fontSize: scale(12), color: "#78350F", lineHeight: 19 },
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", gap: scale(10), padding: scale(16),
    paddingBottom: Platform.OS === 'ios' ? scale(24) : scale(16),
    backgroundColor: "#FCFCF7", elevation: 8,
  },
  navBtn: { paddingHorizontal: scale(16), height: 50, borderRadius: 14, backgroundColor: "#1F3B1F", alignItems: "center", justifyContent: "center" },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText: { fontWeight: "700", color: "#fff", fontSize: scale(13) },
  practiceBtn: { flex: 1, height: 50, borderRadius: 14, backgroundColor: "#1F3B1F", alignItems: "center", justifyContent: "center", elevation: 4 },
  practiceText: { fontSize: scale(14), fontWeight: "700", color: "#FFFFFF" },
});