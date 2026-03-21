import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Dimensions, Platform, Animated,
  StatusBar, Alert, ActivityIndicator, Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import backicon from "../../../assets/icon/backbutton.png";
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthService } from '../../../services/AuthService';

const api = axios.create({
  baseURL: 'http://10.182.41.220:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;
const TIMER_DURATION = 15 * 60;



// Fallback data
const FALLBACK_SESSION = {
  id: "session_rc_001",
  subject: "Reading Comprehension",
  passage: {
    title: "The Evolution of Economic Thought",
    body: `Classical economists believed that markets function best when left alone. They emphasized free markets, division of labor, and the invisible hand as self-regulating forces. [HOWEVER] later schools questioned this assumption, arguing that markets were not always efficient.\n\nKeynesian economists, for instance, believed that government intervention was necessary during recessions. Meanwhile, monetarists focused on controlling the money supply. Each school represented a response to the perceived failures of its predecessor.`,
  },
  questions: [
    {
      id: "q1",
      q: "According to the passage, what was the primary focus of the classical school of economic thought?",
      options: [
        "The necessity of government intervention during recessions.",
        "Free markets, division of labor, and the invisible hand.",
        "The management of money supply to control national output.",
        "The implementation of rational expectations in decision making.",
      ],
      correct: 1,
      difficulty: "Easy",
      analysis: "The passage clearly states that classical economists emphasized free markets, division of labor, and the invisible hand as self-regulating forces of the economy.",
    },
    {
      id: "q2",
      q: "Why did later schools of thought challenge classical economics?",
      options: [
        "Markets failed to generate employment.",
        "Government intervention proved ineffective.",
        "Economic downturns exposed limitations of free markets.",
        "Division of labor reduced productivity.",
      ],
      correct: 2,
      difficulty: "Medium",
      analysis: "The passage states that later schools believed markets were not always efficient, implying that real-world economic downturns exposed the limitations of the free-market model.",
    },
    {
      id: "q3",
      q: "What does the passage suggest about the relationship between economic schools of thought?",
      options: [
        "They developed independently of one another.",
        "Each school built upon and agreed with prior theories.",
        "Each school emerged as a response to its predecessor's perceived failures.",
        "Classical economics remained dominant throughout history.",
      ],
      correct: 2,
      difficulty: "Hard",
      analysis: "The final sentence explicitly states that each school represented a response to the perceived failures of its predecessor, indicating an evolutionary, reactive relationship.",
    },
  ],
};

const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const getDifficultyStyle = (difficulty) => {
  switch (difficulty) {
    case "Easy":   return { bg: "#DCFCE7", text: "#166534" };
    case "Medium": return { bg: "#FEF9C3", text: "#854D0E" };
    case "Hard":   return { bg: "#FEE2E2", text: "#991B1B" };
    default:       return { bg: "#F3F4F6", text: "#374151" };
  }
};

const parsePassage = (body) => {
  const parts = [];
  const regex = /\[([^\]]+)\]/g;
  let last = 0, match;
  while ((match = regex.exec(body)) !== null) {
    if (match.index > last)
      parts.push({ type: "text", value: body.slice(last, match.index) });
    parts.push({ type: "highlight", value: match[1] });
    last = match.index + match[0].length;
  }
  if (last < body.length) parts.push({ type: "text", value: body.slice(last) });
  return parts;
};

const OptionItem = React.memo(({ option, index, label, isSelected, isCorrect, isWrong, onPress, disabled }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 70, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]).start();
    onPress(index);
  };

  let borderColor = "transparent", bgColor = "#FFFFFF", labelColor = "#111827";
  if (isCorrect)       { borderColor = "#16A34A"; bgColor = "#F0FDF4"; labelColor = "#166534"; }
  else if (isWrong)    { borderColor = "#DC2626"; bgColor = "#FFF1F2"; labelColor = "#991B1B"; }
  else if (isSelected) { borderColor = "#1F3B1F"; bgColor = "#F0F7F0"; }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.option, { backgroundColor: bgColor, borderColor, borderWidth: 2 }]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.85}
      >
        <View style={[styles.optionLabel, { backgroundColor: borderColor === "transparent" ? "#E9F2EC" : borderColor }]}>
          <Text style={[styles.optionLabelText, { color: borderColor === "transparent" ? "#1F3B1F" : "#FFFFFF" }]}>
            {label}
          </Text>
        </View>
        <Text style={[styles.optionText, { color: labelColor }]}>{option}</Text>
        {isCorrect && <Text style={styles.statusIcon}>✓</Text>}
        {isWrong   && <Text style={[styles.statusIcon, { color: "#DC2626" }]}>✕</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
});

const RcReadingScreen = () => {
  const navigation = useNavigation();

  const [sessionData,    setSessionData]    = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [currentQ,       setCurrentQ]       = useState(0);
  const [answers,        setAnswers]         = useState([]);
  const [showAnalysis,   setShowAnalysis]    = useState(false);
  const [timeLeft,       setTimeLeft]        = useState(TIMER_DURATION);
  const [sessionStartTime]                   = useState(Date.now());
  const [isSubmitting,   setIsSubmitting]    = useState(false);

  const timerRef        = useRef(null);
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const progressAnim    = useRef(new Animated.Value(0)).current;

  // ── Load session from backend ──────────────────────────────────────────
  useEffect(() => { loadSession(); }, []);

 const loadSession = async () => {
  try {
    const token = await AuthService.getToken();
    const sessionsRes = await api.get('/rc/sessions', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const sessions = sessionsRes.data;

    if (sessions && sessions.length > 0) {
      const sessionRes = await api.get(`/rc/sessions/${sessions[0].id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = sessionRes.data;

      // ← Backend response check karo
      console.log('RC DATA:', JSON.stringify(data));

      setSessionData({
        id:      data.id ?? "fallback",
        subject: data.subject ?? "Reading Comprehension",
        passage: {
          title: data.passage?.title ?? data.title ?? "RC Passage",
          body:  data.passage?.body  ?? data.passage?.text ?? data.body ?? "No passage available.",
        },
        questions: (data.questions ?? []).map(q => ({
          id:         q.id,
          q:          q.question ?? q.text ?? q.q ?? "",
          options:    Array.isArray(q.options)
                        ? q.options.map(o => typeof o === 'string' ? o : o.text ?? o.option ?? "")
                        : [],
          correct:    q.correct_option ?? q.correct ?? 0,
          difficulty: q.difficulty ?? "Medium",
          analysis:   q.explanation ?? q.analysis ?? "",
        })),
      });
      setAnswers(Array(data.questions?.length ?? 3).fill(null));
    } else {
      setSessionData(FALLBACK_SESSION);
      setAnswers(Array(FALLBACK_SESSION.questions.length).fill(null));
    }
  } catch (error) {
    console.log('RC error:', error);
    setSessionData(FALLBACK_SESSION);
    setAnswers(Array(FALLBACK_SESSION.questions.length).fill(null));
  } finally {
    setSessionLoading(false);
  }
};

  // Start timer after session loads
  useEffect(() => {
    if (!sessionData) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [sessionData]);

  // Progress bar animation
  useEffect(() => {
    if (!sessionData) return;
    Animated.timing(progressAnim, {
      toValue: (currentQ + 1) / sessionData.questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQ, sessionData]);

  const submitSession = async (finalAnswers) => {
    try {
      const token = await AuthService.getToken();
      const data = sessionData;
      await api.post(`/rc/sessions/${data.id}/submit`, {
        passage_id:data.id,
        time_taken: Math.floor((Date.now() - sessionStartTime) / 1000),
        answers: data.questions.map((q, i) => ({
          question_id:     q.id,
          selected_index: finalAnswers[i],
          correct_index:  q.correct,
        }))
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.log('RC Submit error (ignored):', error);
    }
    return { success: true };
  };

  const goToResult = useCallback((finalAnswers) => {
    const data = sessionData || FALLBACK_SESSION;
    navigation.replace("RcResult", {
      answers:     finalAnswers,
      questions:   data.questions,
      timeTaken:   Math.floor((Date.now() - sessionStartTime) / 1000),
      sessionMeta: {
        subject:   data.subject,
        sessionId: data.id,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        }),
      },
    });
  }, [navigation, sessionData, sessionStartTime]);

  const handleBack = useCallback(() => {
    Alert.alert("Exit Session?", "Your progress will be lost if you leave now.", [
      { text: "Stay", style: "cancel" },
      { text: "Exit", style: "destructive", onPress: () => { clearInterval(timerRef.current); navigation.goBack(); } },
    ]);
  }, [navigation]);

  const handleBackPress = useCallback(() => {
    Animated.sequence([
      Animated.timing(backButtonScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(backButtonScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => handleBack());
  }, [handleBack]);

  const selectOption = useCallback((index) => {
    if (showAnalysis) return;
    const updated = [...answers];
    updated[currentQ] = index;
    setAnswers(updated);
  }, [answers, currentQ, showAnalysis]);

  const handleAutoSubmit = useCallback(() => {
    Alert.alert("Time's up!", "Your session has been auto-submitted.", [
      { text: "See Results", onPress: () => goToResult(answers) },
    ]);
  }, [answers, goToResult]);

  const handleSubmitAnswer = useCallback(() => {
    if (answers[currentQ] === null || answers[currentQ] === undefined) {
      Alert.alert("Select an answer", "Please choose an option before submitting.", [{ text: "OK" }]);
      return;
    }
    setShowAnalysis(true);
  }, [answers, currentQ]);

  const handleNext = useCallback(async () => {
    const isLastQuestion = currentQ === sessionData.questions.length - 1;
    if (isLastQuestion) {
      setIsSubmitting(true);
      clearInterval(timerRef.current);
      await submitSession(answers);
      setIsSubmitting(false);
      goToResult(answers);
    } else {
      setShowAnalysis(false);
      setCurrentQ(q => q + 1);
    }
  }, [currentQ, sessionData, answers, goToResult]);

  const handlePrev = useCallback(() => {
    if (currentQ === 0) return;
    setShowAnalysis(false);
    setCurrentQ(q => q - 1);
  }, [currentQ]);

  // Loading state
  if (sessionLoading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1F3B1F" />
        <Text style={{ marginTop: 12, color: '#6B7280' }}>Loading session...</Text>
      </SafeAreaView>
    );
  }

  const data            = sessionData || FALLBACK_SESSION;
  const questions       = data.questions;
  const passage         = data.passage;
  const parsedPassage   = parsePassage(passage.body);
  const currentQuestion = questions[currentQ];
  const selectedAnswer  = answers[currentQ];
  const isLastQuestion  = currentQ === questions.length - 1;
  const diffStyle       = getDifficultyStyle(currentQuestion.difficulty);
  const timerColor      = timeLeft < 60 ? "#DC2626" : timeLeft < 180 ? "#D97706" : "#1F3B1F";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" />

      {/* HEADER */}
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
          <TouchableOpacity onPress={handleBackPress} style={styles.iconBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Image source={backicon} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>RC Practice</Text>
          <Text style={styles.headerSubtitle}>{data.subject}</Text>
        </View>
        <View style={[styles.timerPill, { borderColor: timerColor }]}>
          <Text style={[styles.timerText, { color: timerColor }]}>⏱ {formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* PROGRESS */}
      <View style={styles.progressWrap}>
        <Text style={styles.progressLabel}>Question {currentQ + 1} of {questions.length}</Text>
        <View style={[styles.diffBadge, { backgroundColor: diffStyle.bg }]}>
          <Text style={[styles.diffText, { color: diffStyle.text }]}>{currentQuestion.difficulty}</Text>
        </View>
      </View>
      <View style={styles.progressBarBg}>
        <Animated.View style={[styles.progressFill, {
          width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
        }]} />
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.passageCard}>
          <View style={styles.passageHeaderRow}>
            <View style={styles.passageLabelPill}>
              <Text style={styles.passageLabelText}>📄 PASSAGE</Text>
            </View>
          </View>
          <Text style={styles.passageTitle}>{passage.title}</Text>
          <Text style={styles.passageBody}>
            {parsedPassage.map((part, i) =>
              part.type === "highlight"
                ? <Text key={i} style={styles.passageHighlight}>{part.value}</Text>
                : <Text key={i}>{part.value}</Text>
            )}
          </Text>
        </View>

        <View style={styles.questionBlock}>
          <Text style={styles.questionTag}>QUESTION {currentQ + 1}</Text>
          <Text style={styles.questionText}>{currentQuestion.q}</Text>
        </View>

        <View style={styles.optionsWrap}>
          {currentQuestion.options.map((opt, i) => {
            const labels = ["A", "B", "C", "D"];
            return (
              <OptionItem
                key={i} index={i} option={opt} label={labels[i]}
                isSelected={selectedAnswer === i}
                isCorrect={showAnalysis && currentQuestion.correct === i}
                isWrong={showAnalysis && selectedAnswer === i && i !== currentQuestion.correct}
                onPress={selectOption}
                disabled={showAnalysis}
              />
            );
          })}
        </View>

        {showAnalysis && (
          <View style={styles.analysisCard}>
            <View style={styles.analysisHeaderRow}>
              <Text style={styles.analysisIcon}>
                {answers[currentQ] === currentQuestion.correct ? "✅" : "❌"}
              </Text>
              <Text style={styles.analysisTitle}>
                {answers[currentQ] === currentQuestion.correct ? "Correct!" : "Incorrect"}
              </Text>
            </View>
            <View style={styles.analysisDivider} />
            <Text style={styles.analysisHeading}>💡 Explanation</Text>
            <Text style={styles.analysisText}>{currentQuestion.analysis}</Text>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentQ === 0}
          style={[styles.prevBtn, currentQ === 0 && styles.btnDisabled]}
          activeOpacity={0.8}
        >
          <Text style={[styles.prevText, currentQ === 0 && { color: "#9CA3AF" }]}>← Prev</Text>
        </TouchableOpacity>

        <View style={styles.dots}>
          {questions.map((_, i) => (
            <View key={i} style={[
              styles.dot,
              i === currentQ && styles.dotActive,
              answers[i] !== null && answers[i] !== undefined && i !== currentQ && styles.dotAnswered,
            ]} />
          ))}
        </View>

        {showAnalysis ? (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.9} disabled={isSubmitting}>
            {isSubmitting
              ? <ActivityIndicator color="#FFFFFF" size="small" />
              : <Text style={styles.nextText}>{isLastQuestion ? "Finish ✓" : "Next →"}</Text>
            }
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, (selectedAnswer === null || selectedAnswer === undefined) && styles.nextBtnDisabled]}
            onPress={handleSubmitAnswer}
            activeOpacity={0.9}
            disabled={selectedAnswer === null || selectedAnswer === undefined}
          >
            <Text style={styles.nextText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default RcReadingScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAF6" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: scale(16), paddingVertical: scale(12),
    backgroundColor: "#F9FAF6", borderBottomWidth: 1, borderBottomColor: "#E5EBE6",
    paddingTop: 35, elevation: 3,
  },
  iconBtn: { width: scale(38), height: scale(38), borderRadius: scale(19), backgroundColor: "#E9F2EC", justifyContent: "center", alignItems: "center" },
  backIcon: { width: scale(20), height: scale(20), tintColor: "#1F3B1F" },
  headerCenter: { flex: 1, alignItems: "center", marginHorizontal: scale(8) },
  headerTitle: { fontSize: scale(15), fontWeight: "800", color: "#1F3B1F" },
  headerSubtitle: { fontSize: scale(11), color: "#6B7280", marginTop: 1, fontWeight: "500" },
  timerPill: { paddingHorizontal: scale(12), paddingVertical: scale(7), borderRadius: scale(20), borderWidth: 1.5, backgroundColor: "#FFFFFF", minWidth: scale(76), alignItems: "center" },
  timerText: { fontSize: scale(13), fontWeight: "800" },
  progressWrap: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: scale(16), paddingTop: scale(10), paddingBottom: scale(6) },
  progressLabel: { fontSize: scale(12), fontWeight: "700", color: "#6B7280" },
  diffBadge: { paddingHorizontal: scale(10), paddingVertical: scale(3), borderRadius: scale(20) },
  diffText: { fontSize: scale(11), fontWeight: "700" },
  progressBarBg: { height: scale(5), backgroundColor: "#DDE8E1", marginHorizontal: scale(16), borderRadius: scale(5), overflow: "hidden", marginBottom: scale(4) },
  progressFill: { height: "100%", backgroundColor: "#1F3B1F", borderRadius: scale(5) },
  scrollContent: { paddingBottom: scale(130), paddingTop: scale(8) },
  passageCard: { backgroundColor: "#FFFFFF", marginHorizontal: scale(16), marginTop: scale(12), padding: scale(16), borderRadius: scale(20), elevation: 3 },
  passageHeaderRow: { flexDirection: "row", marginBottom: scale(10) },
  passageLabelPill: { backgroundColor: "#E9F2EC", paddingHorizontal: scale(10), paddingVertical: scale(4), borderRadius: scale(20) },
  passageLabelText: { fontSize: scale(10), fontWeight: "800", color: "#1F3B1F", letterSpacing: 0.5 },
  passageTitle: { fontSize: scale(16), fontWeight: "800", color: "#111827", marginBottom: scale(10), lineHeight: scale(24) },
  passageBody: { fontSize: scale(14), lineHeight: scale(24), color: "#374151" },
  passageHighlight: { backgroundColor: "#E9F2EC", fontWeight: "800", color: "#1F3B1F" },
  questionBlock: { marginHorizontal: scale(16), marginTop: scale(20), marginBottom: scale(4) },
  questionTag: { fontSize: scale(11), fontWeight: "800", color: "#2563EB", letterSpacing: 1, marginBottom: scale(6) },
  questionText: { fontSize: scale(16), fontWeight: "700", color: "#111827", lineHeight: scale(26) },
  optionsWrap: { marginTop: scale(8) , color:"#000"},
  option: { flexDirection: "row", alignItems: "center", marginHorizontal: scale(16), marginTop: scale(10), padding: scale(14), borderRadius: scale(16), gap: scale(12), elevation: 2 },
  optionLabel: { width: scale(28), height: scale(28), borderRadius: scale(14), justifyContent: "center", alignItems: "center", flexShrink: 0 },
  optionLabelText: { fontSize: scale(12), fontWeight: "800",color:"#000" },
  optionText: { flex: 1, fontSize: scale(14), lineHeight: scale(22), },
  statusIcon: { fontSize: scale(16), fontWeight: "800", color: "#16A34A", flexShrink: 0 },
  analysisCard: { backgroundColor: "#FFFFFF", marginHorizontal: scale(16), marginTop: scale(16), padding: scale(16), borderRadius: scale(20), borderLeftWidth: 4, borderLeftColor: "#1F3B1F", elevation: 3 },
  analysisHeaderRow: { flexDirection: "row", alignItems: "center", gap: scale(8), marginBottom: scale(10) },
  analysisIcon: { fontSize: scale(20) },
  analysisTitle: { fontSize: scale(16), fontWeight: "800", color: "#1F3B1F" },
  analysisDivider: { height: 1, backgroundColor: "#E5EBE6", marginBottom: scale(12) },
  analysisHeading: { fontSize: scale(12), fontWeight: "800", color: "#6B7280", letterSpacing: 0.5, marginBottom: scale(6) },
  analysisText: { fontSize: scale(14), lineHeight: scale(22), color: "#374151" },
  bottomBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: scale(16), paddingTop: scale(12), paddingBottom: Platform.OS === "ios" ? scale(28) : scale(16), backgroundColor: "#F9FAF6", borderTopWidth: 1, borderTopColor: "#E5EBE6", elevation: 8 },
  prevBtn: { paddingVertical: scale(13), paddingHorizontal: scale(18), borderRadius: scale(14), backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#DDE8E1" },
  btnDisabled: { opacity: 0.4 },
  prevText: { fontWeight: "700", fontSize: scale(14), color: "#1F3B1F" },
  dots: { flexDirection: "row", alignItems: "center", gap: scale(6) },
  dot: { width: scale(7), height: scale(7), borderRadius: scale(4), backgroundColor: "#DDE8E1" },
  dotActive: { backgroundColor: "#1F3B1F", width: scale(20), borderRadius: scale(4) },
  dotAnswered: { backgroundColor: "#10B981" },
  nextBtn: { paddingVertical: scale(13), paddingHorizontal: scale(22), borderRadius: scale(14), backgroundColor: "#1F3B1F", minWidth: scale(90), alignItems: "center" },
  nextBtnDisabled: { backgroundColor: "#9CA3AF" },
  nextText: { fontWeight: "800", fontSize: scale(14), color: "#FFFFFF" },
});