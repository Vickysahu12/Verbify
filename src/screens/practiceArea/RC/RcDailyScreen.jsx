/**
 * RCDailyScreen.jsx
 * Daily RC — user ko aaj ke 2 RC passages dikhata hai
 * Navigate: PracticeScreen → RCDaily → RC (RcReadingScreen)
 */

import React, { useState, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Dimensions, Platform, Animated,
  StatusBar, ActivityIndicator, Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { AuthService } from "../../../services/AuthService";
import backicon from "../../../assets/icon/backbutton.png";

// ─── API ──────────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: "https://web-production-4c19b.up.railway.app",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ─── Constants ────────────────────────────────────────────────────────────────
const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

// ─── Color Palette (shared across all RC screens) ────────────────────────────
export const RC_COLORS = {
  primary:       "#1A3320",
  primaryMid:    "#2D5A3D",
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
  overlay:       "rgba(26,51,32,0.06)",
};

// ─── Difficulty Config ────────────────────────────────────────────────────────
const DIFF = {
  Easy:   { bg: RC_COLORS.successLight, text: RC_COLORS.success,  dot: "#86EFAC" },
  Medium: { bg: RC_COLORS.warningLight, text: RC_COLORS.warning,  dot: "#FCD34D" },
  Hard:   { bg: RC_COLORS.errorLight,   text: RC_COLORS.error,    dot: "#FCA5A5" },
};

// ─── Passage Card ─────────────────────────────────────────────────────────────
const PassageCard = React.memo(({ item, index, onPress, scaleAnim }) => {
  const diff        = DIFF[item.difficulty] ?? DIFF.Medium;
  const isCompleted = item.is_completed;

  return (
    <Animated.View style={[styles.cardWrap, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.card, isCompleted && styles.cardCompleted]}
        onPress={() => !isCompleted && onPress(item)}
        activeOpacity={0.88}
        disabled={isCompleted}
      >
        {/* Top Row */}
        <View style={styles.cardTopRow}>
          <View style={styles.cardIndexBadge}>
            <Text style={styles.cardIndexText}>RC {index + 1}</Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
            <View style={[styles.diffDot, { backgroundColor: diff.dot }]} />
            <Text style={[styles.diffText, { color: diff.text }]}>{item.difficulty}</Text>
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>✓ Done</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={[styles.cardTitle, isCompleted && styles.cardTitleDone]} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Meta row */}
        <View style={styles.cardMeta}>
          <Text style={styles.cardMetaText}>📄 {item.subject}</Text>
          <Text style={styles.cardMetaDot}>·</Text>
          <Text style={styles.cardMetaText}>❓ {item.total_questions} questions</Text>
          {item.source && (
            <>
              <Text style={styles.cardMetaDot}>·</Text>
              <Text style={styles.cardMetaText}>📌 {item.source}</Text>
            </>
          )}
        </View>

        {/* CTA */}
        {isCompleted ? (
          <View style={styles.doneCta}>
            <Text style={styles.doneCtaText}>✅ Completed today</Text>
          </View>
        ) : (
          <View style={styles.startCta}>
            <Text style={styles.startCtaText}>Start Reading  →</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── All Done Card ────────────────────────────────────────────────────────────
const AllDoneCard = () => (
  <View style={styles.allDoneCard}>
    <Text style={styles.allDoneEmoji}>🎉</Text>
    <Text style={styles.allDoneTitle}>Aaj ke dono RC ho gaye!</Text>
    <Text style={styles.allDoneSubtitle}>Kal naye passages milenge. Keep it up!</Text>
    <View style={styles.allDoneStrip}>
      <Text style={styles.allDoneStripText}>✦  Consistency builds CAT toppers  ✦</Text>
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const RCDailyScreen = () => {
  const navigation      = useNavigation();
  const [passages,      setPassages]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [attemptedIds,  setAttemptedIds]  = useState(new Set());
  const backScale       = useRef(new Animated.Value(1)).current;
  const card1Scale      = useRef(new Animated.Value(0.96)).current;
  const card2Scale      = useRef(new Animated.Value(0.96)).current;

  useFocusEffect(
    useCallback(() => {
      loadPassages();
    }, [])
  );

  const loadPassages = async () => {
    try {
      setLoading(true);
      const token = await AuthService.getToken();

      // Fetch all passages + attempted list
      const [passagesRes, attemptedRes] = await Promise.all([
        api.get("/rc/sessions",          { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/rc/attempted-today",   { headers: { Authorization: `Bearer ${token}` } })
          .catch(() => ({ data: [] })), // graceful fallback agar endpoint nahi hai abhi
      ]);

      const allPassages  = passagesRes.data ?? [];
      const attempted    = new Set((attemptedRes.data ?? []).map(a => String(a.passage_id ?? a.id)));

      // Sirf pehle 2 lo — backend baad mein daily assignment dega
      const daily = allPassages.slice(0, 2).map(p => ({
        ...p,
        is_completed: attempted.has(String(p.id)),
      }));

      setPassages(daily);
      setAttemptedIds(attempted);

      // Animate cards in
      Animated.stagger(120, [
        Animated.spring(card1Scale, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
        Animated.spring(card2Scale, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }),
      ]).start();

    } catch (err) {
      console.log("RCDaily error:", err);
      setPassages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  };

  const handleStartPassage = (passage) => {
    navigation.navigate("RC", { passageId: passage.id });
  };

  const cardScales     = [card1Scale, card2Scale];
  const allCompleted   = passages.length > 0 && passages.every(p => p.is_completed);
  const completedCount = passages.filter(p => p.is_completed).length;

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]}>
        <ActivityIndicator size="large" color={RC_COLORS.primary} />
        <Text style={styles.loadingText}>Loading today's RC...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={RC_COLORS.bg} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: backScale }] }}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.iconBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Image source={backicon} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Today's RC</Text>
          <Text style={styles.headerSubtitle}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
          </Text>
        </View>

        {/* Progress pill */}
        <View style={[
          styles.progressPill,
          allCompleted && styles.progressPillDone,
        ]}>
          <Text style={[styles.progressPillText, allCompleted && styles.progressPillTextDone]}>
            {completedCount}/{passages.length}
          </Text>
        </View>
      </View>

      {/* ── Progress bar ───────────────────────────────────────────────────── */}
      <View style={styles.progressBarBg}>
        <View style={[
          styles.progressBarFill,
          { width: passages.length > 0 ? `${(completedCount / passages.length) * 100}%` : "0%" },
        ]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Info Banner ────────────────────────────────────────────────────── */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>📅</Text>
          <Text style={styles.infoBannerText}>
            Har din 2 fresh RC passages milte hain. Dono complete karo streak maintain karne ke liye!
          </Text>
        </View>

        {/* ── All Done ───────────────────────────────────────────────────────── */}
        {allCompleted && <AllDoneCard />}

        {/* ── Passage Cards ──────────────────────────────────────────────────── */}
        {passages.map((item, index) => (
          <PassageCard
            key={item.id}
            item={item}
            index={index}
            onPress={handleStartPassage}
            scaleAnim={cardScales[index] ?? card2Scale}
          />
        ))}

        {passages.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>Koi RC nahi mila</Text>
            <Text style={styles.emptySubtitle}>Admin se contact karo — passages add honge jald hi.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RCDailyScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: RC_COLORS.bg },
  centered:{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: RC_COLORS.bg },
  loadingText: { marginTop: 12, fontSize: scale(14), color: RC_COLORS.textMuted, fontWeight: "600" },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: scale(16), paddingBottom: scale(12),
    paddingTop: Platform.OS === "android" ? scale(40) : scale(14),
    backgroundColor: RC_COLORS.bg,
    borderBottomWidth: 1, borderBottomColor: RC_COLORS.border,
    ...Platform.select({ android: { elevation: 3 } }),
  },
  iconBtn: {
    width: scale(38), height: scale(38), borderRadius: scale(19),
    backgroundColor: RC_COLORS.accentLight,
    justifyContent: "center", alignItems: "center",
  },
  backIcon:    { width: scale(20), height: scale(20), tintColor: RC_COLORS.primary },
  headerCenter:{ flex: 1, alignItems: "center", marginHorizontal: scale(8) },
  headerTitle: { fontSize: scale(16), fontWeight: "800", color: RC_COLORS.textPrimary, letterSpacing: -0.3 },
  headerSubtitle: { fontSize: scale(11), color: RC_COLORS.textMuted, marginTop: 2, fontWeight: "600" },
  progressPill: {
    paddingHorizontal: scale(12), paddingVertical: scale(6),
    borderRadius: scale(20), backgroundColor: RC_COLORS.accentLight,
    borderWidth: 1.5, borderColor: RC_COLORS.border,
  },
  progressPillDone:     { backgroundColor: RC_COLORS.successLight, borderColor: "#86EFAC" },
  progressPillText:     { fontSize: scale(13), fontWeight: "800", color: RC_COLORS.textSecondary },
  progressPillTextDone: { color: RC_COLORS.success },

  // ── Progress bar ────────────────────────────────────────────────────────
  progressBarBg: {
    height: scale(4), backgroundColor: RC_COLORS.border,
    marginHorizontal: scale(16), borderRadius: 4, overflow: "hidden", marginTop: scale(2),
  },
  progressBarFill: {
    height: "100%", backgroundColor: RC_COLORS.accent, borderRadius: 4,
  },

  scrollContent: { padding: scale(16), paddingBottom: scale(40) },

  // ── Info banner ─────────────────────────────────────────────────────────
  infoBanner: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: RC_COLORS.accentLight,
    borderRadius: scale(14), padding: scale(14),
    marginBottom: scale(20), gap: scale(10),
    borderWidth: 1, borderColor: RC_COLORS.border,
  },
  infoBannerIcon: { fontSize: scale(16), marginTop: 1 },
  infoBannerText: {
    flex: 1, fontSize: scale(13), color: RC_COLORS.textSecondary,
    lineHeight: scale(19), fontWeight: "500",
  },

  // ── All Done card ───────────────────────────────────────────────────────
  allDoneCard: {
    backgroundColor: RC_COLORS.primary,
    borderRadius: scale(20), padding: scale(24),
    alignItems: "center", marginBottom: scale(20),
    ...Platform.select({ android: { elevation: 6 } }),
  },
  allDoneEmoji:    { fontSize: scale(42), marginBottom: scale(10) },
  allDoneTitle:    { fontSize: scale(20), fontWeight: "800", color: "#FFFFFF", marginBottom: scale(6) },
  allDoneSubtitle: { fontSize: scale(14), color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: scale(20) },
  allDoneStrip: {
    marginTop: scale(18), backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: scale(16), paddingVertical: scale(8), borderRadius: scale(20),
  },
  allDoneStripText: { fontSize: scale(11), color: "rgba(255,255,255,0.8)", fontWeight: "700", letterSpacing: 0.5 },

  // ── Passage card ────────────────────────────────────────────────────────
  cardWrap: { marginBottom: scale(16) },
  card: {
    backgroundColor: RC_COLORS.card,
    borderRadius: scale(20), padding: scale(18),
    borderWidth: 1.5, borderColor: RC_COLORS.border,
    ...Platform.select({ android: { elevation: 4 } }),
  },
  cardCompleted: {
    backgroundColor: "#FAFCFA",
    borderColor: "#C6E2D0", opacity: 0.85,
  },
  cardTopRow:    { flexDirection: "row", alignItems: "center", marginBottom: scale(12), gap: scale(8) },
  cardIndexBadge: {
    backgroundColor: RC_COLORS.primary,
    paddingHorizontal: scale(10), paddingVertical: scale(4),
    borderRadius: scale(20),
  },
  cardIndexText: { fontSize: scale(11), fontWeight: "800", color: "#FFFFFF", letterSpacing: 0.3 },
  diffBadge:     { flexDirection: "row", alignItems: "center", paddingHorizontal: scale(10), paddingVertical: scale(4), borderRadius: scale(20), gap: scale(5) },
  diffDot:       { width: scale(6), height: scale(6), borderRadius: 3 },
  diffText:      { fontSize: scale(11), fontWeight: "700" },
  completedBadge: {
    marginLeft: "auto", backgroundColor: RC_COLORS.successLight,
    paddingHorizontal: scale(10), paddingVertical: scale(4), borderRadius: scale(20),
  },
  completedBadgeText: { fontSize: scale(11), fontWeight: "800", color: RC_COLORS.success },

  cardTitle:     { fontSize: scale(16), fontWeight: "800", color: RC_COLORS.textPrimary, marginBottom: scale(10), lineHeight: scale(23), letterSpacing: -0.2 },
  cardTitleDone: { color: RC_COLORS.textMuted },

  cardMeta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: scale(4), marginBottom: scale(16) },
  cardMetaText: { fontSize: scale(12), color: RC_COLORS.textMuted, fontWeight: "500" },
  cardMetaDot:  { fontSize: scale(12), color: RC_COLORS.border },

  startCta: {
    backgroundColor: RC_COLORS.primary,
    paddingVertical: scale(13), borderRadius: scale(14), alignItems: "center",
    ...Platform.select({ android: { elevation: 2 } }),
  },
  startCtaText: { fontSize: scale(14), fontWeight: "800", color: "#FFFFFF", letterSpacing: 0.2 },

  doneCta: {
    backgroundColor: RC_COLORS.successLight,
    paddingVertical: scale(13), borderRadius: scale(14), alignItems: "center",
    borderWidth: 1, borderColor: "#86EFAC",
  },
  doneCtaText: { fontSize: scale(14), fontWeight: "700", color: RC_COLORS.success },

  // ── Empty state ─────────────────────────────────────────────────────────
  emptyState: { alignItems: "center", paddingTop: scale(60) },
  emptyEmoji:    { fontSize: scale(52), marginBottom: scale(14) },
  emptyTitle:    { fontSize: scale(18), fontWeight: "800", color: RC_COLORS.textPrimary, marginBottom: scale(6) },
  emptySubtitle: { fontSize: scale(14), color: RC_COLORS.textMuted, textAlign: "center", lineHeight: scale(20) },
  
});