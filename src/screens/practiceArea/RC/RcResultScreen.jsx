/**
 * RCResultScreen.jsx
 * Matches your stack: <Stack.Screen name="RcResult" component={RCResultScreen} />
 * Receives all data via route.params from RcReadingScreen
 */

import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// ─── Constants ────────────────────────────────────────────────────────────────
const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
// Params received from RcReadingScreen via navigation.replace("RcResult", { ... }):
//   answers     : number[]    — selected option index per question (null = skipped)
//   questions   : Question[]  — full question objects
//   timeTaken   : number      — seconds
//   sessionMeta : object      — { subject, sessionId, date }
//
// TODO: Also accept `serverResult` from API response when backend is ready
//   and use server-side score instead of local calculation if needed.

const RCResultScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();

  const {
    answers     = [],
    questions   = [],
    timeTaken   = 0,
    sessionMeta = {},
  } = route.params ?? {};

  // ── Score calculation ──────────────────────────────────────────────────────
  const correct = questions.filter((q, i) => answers[i] === q.correct).length;
  const skipped = answers.filter((a) => a === null).length;
  const wrong   = questions.length - correct - skipped;
  const total   = questions.length;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  // ── Grade ──────────────────────────────────────────────────────────────────
  const grade      = percent >= 80 ? "Excellent!"        : percent >= 60 ? "Good Job!"  : "Keep Practicing!";
  const gradeEmoji = percent >= 80 ? "🏆"               : percent >= 60 ? "👍"         : "💪";
  const gradeColor = percent >= 80 ? "#16A34A"           : percent >= 60 ? "#D97706"    : "#DC2626";

  // ── Animations ─────────────────────────────────────────────────────────────
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    // Goes back to RcReadingScreen and resets it
    navigation.goBack();
  }, [navigation]);

  const handleExit = useCallback(() => {
    // Goes all the way back to RC home screen
    navigation.navigate("RC");
  }, [navigation]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Session Complete</Text>
      </View>

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Session meta */}
          {sessionMeta.subject ? (
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{sessionMeta.subject}</Text>
              {sessionMeta.date && <Text style={styles.metaText}>{sessionMeta.date}</Text>}
            </View>
          ) : null}

          {/* Score circle */}
          <Animated.View style={[styles.scoreCircleWrap, { transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.scoreCircle, { borderColor: gradeColor }]}>
              <Text style={[styles.scorePercent, { color: gradeColor }]}>{percent}%</Text>
              <Text style={styles.scoreLabel}>Score</Text>
            </View>
          </Animated.View>

          {/* Grade */}
          <Text style={styles.gradeEmoji}>{gradeEmoji}</Text>
          <Text style={[styles.gradeText, { color: gradeColor }]}>{grade}</Text>
          <Text style={styles.gradeSubText}>{correct} of {total} questions correct</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#16A34A" }]}>{correct}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#DC2626" }]}>{wrong}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#D97706" }]}>{skipped}</Text>
              <Text style={styles.statLabel}>Skipped</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatTime(timeTaken)}</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
          </View>

          {/* Question Review */}
          <Text style={styles.reviewHeading}>📋 Question Review</Text>

          {questions.map((q, i) => {
            const answered   = answers[i];
            const wasCorrect = answered === q.correct;
            const wasSkipped = answered === null;

            return (
              <View
                key={q.id ?? i}
                style={[
                  styles.reviewCard,
                  wasCorrect  && styles.reviewCardCorrect,
                  !wasCorrect && !wasSkipped && styles.reviewCardWrong,
                  wasSkipped  && styles.reviewCardSkipped,
                ]}
              >
                {/* Card header */}
                <View style={styles.reviewCardHeader}>
                  <View style={styles.reviewQNumWrap}>
                    <Text style={styles.reviewQNum}>Q{i + 1}</Text>
                  </View>
                  <View
                    style={[
                      styles.reviewStatusBadge,
                      wasCorrect  && { backgroundColor: "#DCFCE7" },
                      !wasCorrect && !wasSkipped && { backgroundColor: "#FEE2E2" },
                      wasSkipped  && { backgroundColor: "#F3F4F6" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reviewStatusText,
                        wasCorrect  && { color: "#16A34A" },
                        !wasCorrect && !wasSkipped && { color: "#DC2626" },
                        wasSkipped  && { color: "#6B7280" },
                      ]}
                    >
                      {wasSkipped ? "— Skipped" : wasCorrect ? "✓ Correct" : "✕ Wrong"}
                    </Text>
                  </View>
                </View>

                {/* Question */}
                <Text style={styles.reviewQText} numberOfLines={3}>{q.q}</Text>

                {/* Wrong answer — show what user picked */}
                {!wasCorrect && !wasSkipped && (
                  <View style={styles.reviewAnswerRow}>
                    <Text style={styles.reviewAnswerLabel}>Your answer: </Text>
                    <Text style={styles.reviewYourAnswer}>{q.options[answered]}</Text>
                  </View>
                )}

                {/* Correct answer */}
                <View style={styles.reviewAnswerRow}>
                  <Text style={styles.reviewAnswerLabel}>Correct: </Text>
                  <Text style={styles.reviewCorrectAnswer}>{q.options[q.correct]}</Text>
                </View>

                {/* Analysis */}
                <View style={styles.reviewAnalysisBox}>
                  <Text style={styles.reviewAnalysisLabel}>💡 Explanation</Text>
                  <Text style={styles.reviewAnalysisText}>{q.analysis}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Footer buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={handleRetry}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Retry this session"
          >
            <Text style={styles.retryText}>↺  Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exitBtn}
            onPress={handleExit}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Finish and go to RC home"
          >
            <Text style={styles.exitText}>Done  →</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
    
  );
};

export default RCResultScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAF6" },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    paddingVertical: scale(14),
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5EBE6",
    backgroundColor: "#F9FAF6",
    paddingTop:35,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },

  headerTitle: { fontSize: scale(17), fontWeight: "800", color: "#1F3B1F" },

  container: { flex: 1 },

  scrollContent: { paddingTop: scale(24), paddingBottom: scale(120) },

  // ── Meta ──────────────────────────────────────────────────────────────────
  metaRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: scale(16), marginBottom: scale(16),
  },

  metaText: { fontSize: scale(12), color: "#9CA3AF", fontWeight: "600" },

  // ── Score circle ──────────────────────────────────────────────────────────
  scoreCircleWrap: { alignItems: "center", marginBottom: scale(16) },

  scoreCircle: {
    width: scale(130), height: scale(130), borderRadius: scale(65),
    borderWidth: 6, justifyContent: "center", alignItems: "center",
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 6 },
    }),
  },

  scorePercent: { fontSize: scale(32), fontWeight: "900", lineHeight: scale(38) },

  scoreLabel: { fontSize: scale(12), color: "#6B7280", fontWeight: "600", marginTop: scale(2) },

  // ── Grade ─────────────────────────────────────────────────────────────────
  gradeEmoji:   { textAlign: "center", fontSize: scale(34), marginBottom: scale(6) },
  gradeText:    { textAlign: "center", fontSize: scale(22), fontWeight: "800", marginBottom: scale(4) },
  gradeSubText: { textAlign: "center", fontSize: scale(14), color: "#6B7280", fontWeight: "600", marginBottom: scale(24) },

  // ── Stats row ─────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row", marginHorizontal: scale(16),
    gap: scale(8), marginBottom: scale(28),
  },

  statCard: {
    flex: 1, backgroundColor: "#FFFFFF", borderRadius: scale(14),
    paddingVertical: scale(12), paddingHorizontal: scale(4), alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },

  statValue: { fontSize: scale(20), fontWeight: "800", color: "#1F3B1F" },
  statLabel: { fontSize: scale(10), color: "#9CA3AF", marginTop: scale(3), fontWeight: "600" },

  // ── Review ────────────────────────────────────────────────────────────────
  reviewHeading: {
    fontSize: scale(16), fontWeight: "800", color: "#1F3B1F",
    marginHorizontal: scale(16), marginBottom: scale(12),
  },

  reviewCard: {
    backgroundColor: "#FFFFFF", marginHorizontal: scale(16),
    marginBottom: scale(12), padding: scale(16),
    borderRadius: scale(18), borderLeftWidth: 4, borderLeftColor: "#E5EBE6",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },

  reviewCardCorrect: { borderLeftColor: "#16A34A" },
  reviewCardWrong:   { borderLeftColor: "#DC2626" },
  reviewCardSkipped: { borderLeftColor: "#D1D5DB" },

  reviewCardHeader: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: scale(8),
  },

  reviewQNumWrap: {
    backgroundColor: "#F3F4F6", paddingHorizontal: scale(10),
    paddingVertical: scale(3), borderRadius: scale(20),
  },

  reviewQNum: { fontSize: scale(12), fontWeight: "800", color: "#374151" },

  reviewStatusBadge: {
    paddingHorizontal: scale(10), paddingVertical: scale(3), borderRadius: scale(20),
  },

  reviewStatusText: { fontSize: scale(12), fontWeight: "800" },

  reviewQText: {
    fontSize: scale(13), color: "#374151", fontWeight: "600",
    lineHeight: scale(20), marginBottom: scale(10),
  },

  reviewAnswerRow: {
    flexDirection: "row", flexWrap: "wrap",
    marginBottom: scale(4), alignItems: "flex-start",
  },

  reviewAnswerLabel:   { fontSize: scale(12), color: "#9CA3AF", fontWeight: "600" },
  reviewYourAnswer:    { fontSize: scale(12), color: "#DC2626", fontWeight: "600", flex: 1 },
  reviewCorrectAnswer: { fontSize: scale(12), color: "#16A34A", fontWeight: "700", flex: 1 },

  reviewAnalysisBox: {
    backgroundColor: "#F0F7F0", padding: scale(12),
    borderRadius: scale(12), marginTop: scale(10),
  },

  reviewAnalysisLabel: {
    fontSize: scale(11), fontWeight: "800", color: "#1F3B1F",
    marginBottom: scale(4), letterSpacing: 0.3,
  },

  reviewAnalysisText: { fontSize: scale(13), color: "#374151", lineHeight: scale(20) },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", gap: scale(12),
    paddingHorizontal: scale(16), paddingTop: scale(12),
    paddingBottom: Platform.OS === "ios" ? scale(28) : scale(16),
    backgroundColor: "#F9FAF6", borderTopWidth: 1, borderTopColor: "#E5EBE6",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 8 },
    }),
  },

  retryBtn: {
    flex: 1, paddingVertical: scale(15), borderRadius: scale(16),
    backgroundColor: "#FFFFFF", alignItems: "center",
    borderWidth: 1.5, borderColor: "#DDE8E1",
  },

  retryText: { fontWeight: "800", fontSize: scale(15), color: "#1F3B1F" },

  exitBtn: {
    flex: 2, paddingVertical: scale(15),
    borderRadius: scale(16), backgroundColor: "#1F3B1F", alignItems: "center",
  },

  exitText: { fontWeight: "800", fontSize: scale(15), color: "#FFFFFF" },
});