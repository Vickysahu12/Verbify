import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Dimensions, Platform, Animated,
  StatusBar, Alert, ActivityIndicator, Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import backicon from "../../../assets/icon/backbutton.png";
import axios from "axios";
import { AuthService } from "../../../services/AuthService";

const api = axios.create({
  baseURL: "https://web-production-4c19b.up.railway.app",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;
const TIMER_DURATION = 15 * 60;

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  primary:       "#1A3320",
  accent:        "#4CAF7D",
  accentLight:   "#E8F5EE",
  bg:            "#F4F6F3",
  card:          "#FFFFFF",
  textPrimary:   "#0D1F12",
  textSecondary: "#4A6551",
  textMuted:     "#8FA99A",
  border:        "#DDE8E1",
  success:       "#16A34A",
  successLight:  "#DCFCE7",
  error:         "#DC2626",
  errorLight:    "#FEE2E2",
  warning:       "#D97706",
  warningLight:  "#FEF3C7",
};

// ─── Fallback ─────────────────────────────────────────────────────────────────
const FALLBACK_SESSION = {
  id: "fallback_001",
  subject: "Reading Comprehension",
  passage: {
    title: "The Evolution of Economic Thought",
    body: `Classical economists believed that markets function best when left alone. They emphasized free markets, division of labor, and the invisible hand as self-regulating forces. [HOWEVER] later schools questioned this assumption, arguing that markets were not always efficient.\n\nKeynesian economists, for instance, believed that government intervention was necessary during recessions. Meanwhile, monetarists focused on controlling the money supply. Each school represented a response to the perceived failures of its predecessor.`,
  },
  questions: [
    {
      id: "q1", q: "What was the primary focus of classical economics?",
      options: ["Government intervention during recessions.", "Free markets, division of labor, and the invisible hand.", "Managing money supply.", "Rational expectations in decision making."],
      correct: 1, difficulty: "Easy",
      analysis: "Classical economists emphasized free markets, division of labor, and the invisible hand as self-regulating forces.",
    },
    {
      id: "q2", q: "Why did later schools challenge classical economics?",
      options: ["Markets failed to generate employment.", "Government intervention proved ineffective.", "Economic downturns exposed limitations of free markets.", "Division of labor reduced productivity."],
      correct: 2, difficulty: "Medium",
      analysis: "Later schools believed markets were not always efficient — economic downturns exposed the limitations of the free-market model.",
    },
    {
      id: "q3", q: "What does the passage suggest about the relationship between economic schools?",
      options: ["They developed independently.", "Each school agreed with prior theories.", "Each school emerged as a response to its predecessor's failures.", "Classical economics remained dominant."],
      correct: 2, difficulty: "Hard",
      analysis: "Each school represented a response to the perceived failures of its predecessor — an evolutionary, reactive relationship.",
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const getDiffStyle = (d) => ({
  Easy:   { bg: C.successLight, text: C.success },
  Medium: { bg: C.warningLight, text: C.warning },
  Hard:   { bg: C.errorLight,   text: C.error   },
}[d] ?? { bg: "#F3F4F6", text: C.textMuted });

const parsePassage = (body) => {
  const parts = []; const regex = /\[([^\]]+)\]/g;
  let last = 0, match;
  while ((match = regex.exec(body)) !== null) {
    if (match.index > last) parts.push({ type: "text",      value: body.slice(last, match.index) });
    parts.push({ type: "highlight", value: match[1] });
    last = match.index + match[0].length;
  }
  if (last < body.length) parts.push({ type: "text", value: body.slice(last) });
  return parts;
};

// ─── Option Item ──────────────────────────────────────────────────────────────
const OptionItem = React.memo(({ option, index, label, isSelected, isCorrect, isWrong, onPress, disabled }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 70, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]).start();
    onPress(index);
  };

  let borderColor = C.border,
      bgColor     = C.card,
      labelBg     = C.accentLight,
      labelTxt    = C.primary,
      textColor   = C.textPrimary;

  if (isCorrect)       { borderColor = C.success;  bgColor = C.successLight; labelBg = C.success;  labelTxt = "#FFF"; textColor = "#166534"; }
  else if (isWrong)    { borderColor = C.error;    bgColor = C.errorLight;   labelBg = C.error;    labelTxt = "#FFF"; textColor = "#991B1B"; }
  else if (isSelected) { borderColor = C.primary;  bgColor = C.accentLight;  labelBg = C.primary;  labelTxt = "#FFF"; }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.option, { backgroundColor: bgColor, borderColor }]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.85}
      >
        <View style={[styles.optionLabel, { backgroundColor: labelBg }]}>
          <Text style={[styles.optionLabelTxt, { color: labelTxt }]}>{label}</Text>
        </View>
        <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
        {isCorrect && <Text style={[styles.statusIcon, { color: C.success }]}>✓</Text>}
        {isWrong   && <Text style={[styles.statusIcon, { color: C.error   }]}>✕</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const RcReadingScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const passageId  = route.params?.passageId ?? null;

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

  useEffect(() => { loadSession(); }, []);

  const loadSession = async () => {
    try {
      const token = await AuthService.getToken();
      let data;

      if (passageId) {
        const res = await api.get(`/rc/sessions/${passageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        data = res.data;
      } else {
        const listRes = await api.get("/rc/sessions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sessions = listRes.data ?? [];
        if (sessions.length === 0) {
          setSessionData(FALLBACK_SESSION);
          setAnswers(Array(FALLBACK_SESSION.questions.length).fill(null));
          return;
        }
        const res = await api.get(`/rc/sessions/${sessions[0].id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        data = res.data;
      }

      setSessionData({
        id:      data.id      ?? "fallback",
        subject: data.subject ?? "Reading Comprehension",
        passage: {
          title: data.title ?? "RC Passage",
          body:  data.body  ?? "No passage available.",
        },
        questions: (data.questions ?? []).map(q => ({
          id:         q.id,
          q:          q.question   ?? "",
          options:    Array.isArray(q.options)
                        ? q.options.map(o => typeof o === "string" ? o : o.option_text ?? "")
                        : [],
          correct:    q.correct_index ?? 0,
          difficulty: q.difficulty    ?? "Medium",
          analysis:   q.analysis      ?? "",
        })),
      });
      setAnswers(Array(data.questions?.length ?? 3).fill(null));

    } catch (err) {
      console.log("RC load error:", err);
      setSessionData(FALLBACK_SESSION);
      setAnswers(Array(FALLBACK_SESSION.questions.length).fill(null));
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionData) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); handleAutoSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [sessionData]);

  useEffect(() => {
    if (!sessionData) return;
    Animated.timing(progressAnim, {
      toValue: (currentQ + 1) / sessionData.questions.length,
      duration: 300, useNativeDriver: false,
    }).start();
  }, [currentQ, sessionData]);

  const submitSession = async (finalAnswers) => {
    try {
      const token = await AuthService.getToken();
      const data  = sessionData;
      await api.post(`/rc/sessions/${data.id}/submit`, {
        passage_id: data.id,
        time_taken: Math.floor((Date.now() - sessionStartTime) / 1000),
        answers: data.questions.map((q, i) => ({
          question_id:    q.id,
          selected_index: finalAnswers[i],
          correct_index:  q.correct,
        })),
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.log("RC submit error (ignored):", err);
    }
    return { success: true };
  };

  const goToResult = useCallback((finalAnswers) => {
    const data = sessionData || FALLBACK_SESSION;
    navigation.replace("RcResult", {
      answers: finalAnswers, questions: data.questions,
      timeTaken: Math.floor((Date.now() - sessionStartTime) / 1000),
      sessionMeta: {
        subject: data.subject, sessionId: data.id,
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      },
    });
  }, [navigation, sessionData, sessionStartTime]);

  const handleBack = useCallback(() => {
    Alert.alert("Exit Session?", "Progress lost karna chahte ho?", [
      { text: "Ruko",  style: "cancel" },
      { text: "Niklo", style: "destructive", onPress: () => { clearInterval(timerRef.current); navigation.goBack(); } },
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
    const updated = [...answers]; updated[currentQ] = index; setAnswers(updated);
  }, [answers, currentQ, showAnalysis]);

  const handleAutoSubmit = useCallback(() => {
    Alert.alert("Time's up!", "Session auto-submit ho gaya.", [
      { text: "Results dekho", onPress: () => goToResult(answers) },
    ]);
  }, [answers, goToResult]);

  const handleSubmitAnswer = useCallback(() => {
    if (answers[currentQ] == null) {
      Alert.alert("Option chuno", "Pehle ek option select karo.", [{ text: "OK" }]);
      return;
    }
    setShowAnalysis(true);
  }, [answers, currentQ]);

  const handleNext = useCallback(async () => {
    const isLast = currentQ === sessionData.questions.length - 1;
    if (isLast) {
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

  if (sessionLoading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={styles.loadingText}>Loading passage...</Text>
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
  const diffStyle       = getDiffStyle(currentQuestion.difficulty);
  const timerColor      = timeLeft < 60 ? C.error : timeLeft < 180 ? C.warning : C.primary;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
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

      {/* Sub header */}
      <View style={styles.subHeader}>
        <Text style={styles.progressLabel}>Q {currentQ + 1} / {questions.length}</Text>
        <View style={[styles.diffBadge, { backgroundColor: diffStyle.bg }]}>
          <Text style={[styles.diffText, { color: diffStyle.text }]}>{currentQuestion.difficulty}</Text>
        </View>
      </View>
      <View style={styles.progressBarBg}>
        <Animated.View style={[styles.progressFill, {
          width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
        }]} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.passageCard}>
          <View style={styles.passageTopRow}>
            <View style={styles.passagePill}>
              <Text style={styles.passagePillText}>📄 PASSAGE</Text>
            </View>
            <Text style={styles.passageTitle}>{passage.title}</Text>
          </View>
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
          {currentQuestion.options.map((opt, i) => (
            <OptionItem
              key={i} index={i} option={opt} label={["A","B","C","D"][i]}
              isSelected={selectedAnswer === i}
              isCorrect={showAnalysis && currentQuestion.correct === i}
              isWrong={showAnalysis && selectedAnswer === i && i !== currentQuestion.correct}
              onPress={selectOption}
              disabled={showAnalysis}
            />
          ))}
        </View>

        {showAnalysis && (
          <View style={styles.analysisCard}>
            <View style={styles.analysisHeaderRow}>
              <Text style={styles.analysisIcon}>
                {answers[currentQ] === currentQuestion.correct ? "✅" : "❌"}
              </Text>
              <Text style={[styles.analysisTitle, {
                color: answers[currentQ] === currentQuestion.correct ? C.success : C.error
              }]}>
                {answers[currentQ] === currentQuestion.correct ? "Correct!" : "Incorrect"}
              </Text>
            </View>
            <View style={styles.analysisDivider} />
            <Text style={styles.analysisHeading}>💡 Explanation</Text>
            <Text style={styles.analysisText}>{currentQuestion.analysis}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentQ === 0}
          style={[styles.prevBtn, currentQ === 0 && styles.btnDisabled]}
          activeOpacity={0.8}
        >
          <Text style={[styles.prevText, currentQ === 0 && { color: C.textMuted }]}>← Prev</Text>
        </TouchableOpacity>

        <View style={styles.dots}>
          {questions.map((_, i) => (
            <View key={i} style={[
              styles.dot,
              i === currentQ && styles.dotActive,
              answers[i] != null && i !== currentQ && styles.dotAnswered,
            ]} />
          ))}
        </View>

        {showAnalysis ? (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} disabled={isSubmitting} activeOpacity={0.9}>
            {isSubmitting
              ? <ActivityIndicator color="#FFF" size="small" />
              : <Text style={styles.nextText}>{isLastQuestion ? "Finish ✓" : "Next →"}</Text>
            }
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, selectedAnswer == null && styles.nextBtnDisabled]}
            onPress={handleSubmitAnswer}
            disabled={selectedAnswer == null}
            activeOpacity={0.9}
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
  safe: { flex: 1, backgroundColor: C.bg },
  loadingText: { marginTop: 12, color: C.textMuted, fontSize: scale(14), fontWeight: "600" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: scale(16), paddingBottom: scale(12),
    paddingTop: Platform.OS === "android" ? scale(40) : scale(14),
    backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border,
    ...Platform.select({ android: { elevation: 3 } }),
  },
  iconBtn: { width: scale(38), height: scale(38), borderRadius: scale(19), backgroundColor: C.accentLight, justifyContent: "center", alignItems: "center" },
  backIcon: { width: scale(20), height: scale(20), tintColor: C.primary },
  headerCenter: { flex: 1, alignItems: "center", marginHorizontal: scale(8) },
  headerTitle: { fontSize: scale(15), fontWeight: "800", color: C.textPrimary, letterSpacing: -0.3 },
  headerSubtitle: { fontSize: scale(11), color: C.textMuted, marginTop: 1, fontWeight: "600" },
  timerPill: { paddingHorizontal: scale(12), paddingVertical: scale(7), borderRadius: scale(20), borderWidth: 1.5, backgroundColor: C.card, minWidth: scale(76), alignItems: "center" },
  timerText: { fontSize: scale(13), fontWeight: "800" },
  subHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: scale(16), paddingTop: scale(10), paddingBottom: scale(6) },
  progressLabel: { fontSize: scale(12), fontWeight: "700", color: C.textMuted },
  diffBadge: { paddingHorizontal: scale(10), paddingVertical: scale(3), borderRadius: scale(20) },
  diffText: { fontSize: scale(11), fontWeight: "700" },
  progressBarBg: { height: scale(4), backgroundColor: C.border, marginHorizontal: scale(16), borderRadius: 4, overflow: "hidden", marginBottom: scale(4) },
  progressFill: { height: "100%", backgroundColor: C.accent, borderRadius: 4 },
  scrollContent: { paddingBottom: scale(130), paddingTop: scale(8) },
  passageCard: { backgroundColor: C.card, marginHorizontal: scale(16), marginTop: scale(12), padding: scale(16), borderRadius: scale(20), borderWidth: 1, borderColor: C.border, ...Platform.select({ android: { elevation: 3 } }) },
  passageTopRow: { marginBottom: scale(12) },
  passagePill: { alignSelf: "flex-start", backgroundColor: C.accentLight, paddingHorizontal: scale(10), paddingVertical: scale(4), borderRadius: scale(20), marginBottom: scale(8) },
  passagePillText: { fontSize: scale(10), fontWeight: "800", color: C.primary, letterSpacing: 0.5 },
  passageTitle: { fontSize: scale(16), fontWeight: "800", color: C.textPrimary, lineHeight: scale(23), letterSpacing: -0.2 },
  passageBody: { fontSize: scale(14), lineHeight: scale(25), color: C.textSecondary },
  passageHighlight: { backgroundColor: C.accentLight, fontWeight: "800", color: C.primary },
  questionBlock: { marginHorizontal: scale(16), marginTop: scale(20), marginBottom: scale(4) },
  questionTag: { fontSize: scale(11), fontWeight: "800", color: "#2563EB", letterSpacing: 1, marginBottom: scale(6) },
  questionText: { fontSize: scale(16), fontWeight: "700", color: C.textPrimary, lineHeight: scale(26) },
  optionsWrap: { marginTop: scale(8), paddingBottom: scale(4) },
  option: { flexDirection: "row", alignItems: "center", marginHorizontal: scale(16), marginTop: scale(10), padding: scale(14), borderRadius: scale(16), gap: scale(12), borderWidth: 1.5, ...Platform.select({ android: { elevation: 2 } }) },
  optionLabel: { width: scale(28), height: scale(28), borderRadius: scale(14), justifyContent: "center", alignItems: "center", flexShrink: 0 },
  optionLabelTxt: { fontSize: scale(12), fontWeight: "800" },
  optionText: { flex: 1, fontSize: scale(14), lineHeight: scale(22), fontWeight: "500" },
  statusIcon: { fontSize: scale(16), fontWeight: "800", flexShrink: 0 },
  analysisCard: { backgroundColor: C.card, marginHorizontal: scale(16), marginTop: scale(16), padding: scale(16), borderRadius: scale(20), borderLeftWidth: 4, borderLeftColor: C.primary, borderWidth: 1, borderColor: C.border, ...Platform.select({ android: { elevation: 2 } }) },
  analysisHeaderRow: { flexDirection: "row", alignItems: "center", gap: scale(8), marginBottom: scale(10) },
  analysisIcon: { fontSize: scale(20) },
  analysisTitle: { fontSize: scale(16), fontWeight: "800" },
  analysisDivider: { height: 1, backgroundColor: C.border, marginBottom: scale(12) },
  analysisHeading: { fontSize: scale(11), fontWeight: "800", color: C.textMuted, letterSpacing: 0.5, marginBottom: scale(6) },
  analysisText: { fontSize: scale(14), lineHeight: scale(22), color: C.textSecondary },
  bottomBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: scale(16), paddingTop: scale(12), paddingBottom: Platform.OS === "ios" ? scale(28) : scale(16), backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border, ...Platform.select({ android: { elevation: 8 } }) },
  prevBtn: { paddingVertical: scale(13), paddingHorizontal: scale(18), borderRadius: scale(14), backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border },
  btnDisabled: { opacity: 0.4 },
  prevText: { fontWeight: "700", fontSize: scale(14), color: C.primary },
  dots: { flexDirection: "row", alignItems: "center", gap: scale(6) },
  dot: { width: scale(7), height: scale(7), borderRadius: scale(4), backgroundColor: C.border },
  dotActive: { backgroundColor: C.primary, width: scale(20), borderRadius: scale(4) },
  dotAnswered: { backgroundColor: C.accent },
  nextBtn: { paddingVertical: scale(13), paddingHorizontal: scale(22), borderRadius: scale(14), backgroundColor: C.primary, minWidth: scale(90), alignItems: "center", ...Platform.select({ android: { elevation: 2 } }) },
  nextBtnDisabled: { backgroundColor: C.textMuted },
  nextText: { fontWeight: "800", fontSize: scale(14), color: "#FFFFFF" },
  
});