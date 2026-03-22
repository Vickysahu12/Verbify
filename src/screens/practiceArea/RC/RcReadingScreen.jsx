import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Dimensions, Platform, LayoutAnimation,
  UIManager, Alert, Animated, StatusBar, ActivityIndicator, Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import backicon from "../../../assets/icon/backbutton.png";

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

// ─── Color Palette (same across all RC screens) ───────────────────────────────
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
  warning:       "#D97706",
  warningLight:  "#FEF3C7",
};

const STORAGE_KEYS = {
  PROGRESS:  "rc_progress_v1",
  BOOKMARKS: "rc_bookmarks_v1",
};

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Course Data ──────────────────────────────────────────────────────────────
const COURSE_CONTENT = [
  {
    id: 1,
    title: "Understanding Tone",
    bullets: [
      "Identify adjectives & adverbs revealing author sentiment.",
      "Look for structural pivots like 'However', 'Yet'.",
      "Notice intensity words: 'utterly', 'merely', 'profoundly'.",
    ],
    tip: "Frequent rhetorical questions often indicate a skeptical or inquisitive tone.",
  },
  {
    id: 2,
    title: "Identifying Main Idea",
    bullets: [
      "First & last paragraphs often contain thesis statements.",
      "Look for repeated concepts or phrases.",
      "Check for summarizing sentences with 'thus', 'therefore'.",
    ],
    tip: "The main idea is rarely in the middle — scan first and last lines.",
  },
  {
    id: 3,
    title: "Inference Questions",
    bullets: [
      "Don't extrapolate beyond what's stated.",
      "Look for logical extensions of the author's argument.",
      "Eliminate options that contradict the passage.",
    ],
    tip: "If you have to assume too much, it's probably wrong.",
  },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────
const AccordionItem = React.memo(({ item, index, isOpen, isCompleted, onToggle, onMarkComplete }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    style={[styles.accordion, isCompleted && styles.accordionCompleted]}
    onPress={() => onToggle(index)}
    accessibilityRole="button"
  >
    <View style={styles.accordionHeader}>
      <View style={[styles.step, isCompleted && styles.stepCompleted]}>
        {isCompleted
          ? <Text style={styles.stepCheckmark}>✓</Text>
          : <Text style={styles.stepText}>{item.id}</Text>
        }
      </View>
      <Text style={[styles.accordionTitle, isCompleted && styles.accordionTitleDone]}>
        {item.title}
      </Text>
      <Text style={styles.chevron}>{isOpen ? "▲" : "▼"}</Text>
    </View>

    {isOpen && (
      <View style={styles.accordionBody}>
        {item.bullets.map((bullet, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bullet}>{bullet}</Text>
          </View>
        ))}

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 PRO TIP</Text>
          <Text style={styles.tipText}>{item.tip}</Text>
        </View>

        {!isCompleted ? (
          <TouchableOpacity style={styles.markCompleteBtn} onPress={() => onMarkComplete(item.id)} activeOpacity={0.8}>
            <Text style={styles.markCompleteText}>✓  Mark as Complete</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBadge}>
            <Text style={styles.completedIcon}>✅</Text>
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    )}
  </TouchableOpacity>
));

// ─── Main Screen ──────────────────────────────────────────────────────────────
const RCLearningScreen = () => {
  const navigation = useNavigation();

  const [openIndex,      setOpenIndex]      = useState(0);
  const [isBookmarked,   setIsBookmarked]   = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [watchedVideo,   setWatchedVideo]   = useState(false);
  const [isLoading,      setIsLoading]      = useState(true);

  const backButtonScale = useRef(new Animated.Value(1)).current;

  const totalSteps       = COURSE_CONTENT.length + 1;
  const completedCount   = completedSteps.size + (watchedVideo ? 1 : 0);
  const progress         = Math.round((completedCount / totalSteps) * 100);
  const allDone          = completedSteps.size >= COURSE_CONTENT.length;

  useEffect(() => { loadProgress(); }, []);

  const loadProgress = async () => {
    try {
      const [progressRaw, bookmarksRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS),
      ]);
      if (progressRaw) {
        const data = JSON.parse(progressRaw);
        setCompletedSteps(new Set(data.completed || []));
        setWatchedVideo(data.watchedVideo || false);
      }
      if (bookmarksRaw) {
        const list = JSON.parse(bookmarksRaw);
        setIsBookmarked(list.includes("rc_mastery_guide"));
      }
    } catch (e) {
      console.error("[RCLearning] loadProgress:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (newCompleted, newWatched) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify({
        completed: [...newCompleted], watchedVideo: newWatched,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (e) {
      console.error("[RCLearning] saveProgress:", e);
    }
  };

  const handleBack = useCallback(() => {
    Animated.sequence([
      Animated.timing(backButtonScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(backButtonScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  }, [navigation]);

  const handleBookmark = useCallback(async () => {
    try {
      const newVal = !isBookmarked;
      const raw    = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      const list   = raw ? JSON.parse(raw) : [];
      if (newVal) list.push("rc_mastery_guide");
      else { const idx = list.indexOf("rc_mastery_guide"); if (idx > -1) list.splice(idx, 1); }
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      setIsBookmarked(newVal);
    } catch (e) {
      console.error("[RCLearning] handleBookmark:", e);
    }
  }, [isBookmarked]);

  const toggle = useCallback((i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
  }, [openIndex]);

  const markStepComplete = useCallback(async (stepId) => {
    const newCompleted = new Set([...completedSteps, stepId]);
    setCompletedSteps(newCompleted);
    await saveProgress(newCompleted, watchedVideo);
  }, [completedSteps, watchedVideo]);

  const handleStartQuiz = useCallback(() => {
    if (!allDone) {
      Alert.alert("Almost there!", `${COURSE_CONTENT.length - completedSteps.size} aur section(s) baaki hain.`, [{ text: "Got it" }]);
      return;
    }
    Alert.alert("Quiz", "Coming soon!", [{ text: "OK" }]);
  }, [allDone, completedSteps]);

  const handlePlayVideo = useCallback(async () => {
    Alert.alert("Video", "Video player coming soon!", [{ text: "OK" }]);
    if (!watchedVideo) {
      setWatchedVideo(true);
      await saveProgress(completedSteps, true);
    }
  }, [watchedVideo, completedSteps]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]}>
        <ActivityIndicator size="large" color={C.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <View style={styles.stickyHeader}>
        <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
          <TouchableOpacity onPress={handleBack} style={styles.iconBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} activeOpacity={0.7}>
            <Image source={backicon} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.headerTitle} numberOfLines={1}>RC Mastery Guide</Text>

        <TouchableOpacity onPress={handleBookmark} style={styles.iconBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} activeOpacity={0.7}>
          <Text style={styles.bookmarkIcon}>{isBookmarked ? "🔖" : "🏷️"}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Content ────────────────────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Progress */}
        <View style={styles.progressWrap}>
          <Text style={styles.progressLabel}>COURSE PROGRESS</Text>
          <Text style={styles.progressPercent}>{progress}% Complete</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        {/* Video Card */}
        <TouchableOpacity style={styles.videoCard} onPress={handlePlayVideo} activeOpacity={0.9}>
          <View style={styles.playBtn}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
          <View style={styles.videoBottom}>
            <Text style={styles.videoTitle}>RC Strategy: The Skimming & Scanning Method</Text>
            <Text style={styles.videoTime}>⏱ 12:45  ·  👁 2.4K views</Text>
          </View>
          {watchedVideo && (
            <View style={styles.watchedBadge}>
              <Text style={styles.watchedText}>✅ Watched</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Strategic Framework */}
        <Text style={styles.sectionTitle}>📘 Strategic Framework</Text>
        {COURSE_CONTENT.map((item, index) => (
          <AccordionItem
            key={item.id} item={item} index={index}
            isOpen={openIndex === index}
            isCompleted={completedSteps.has(item.id)}
            onToggle={toggle}
            onMarkComplete={markStepComplete}
          />
        ))}

        {/* Interactive Example */}
        <Text style={styles.sectionTitle}>🧠 Interactive Example</Text>
        <View style={styles.passageCard}>
          <Text style={styles.passage}>
            The digitalization of education has promised democratized access for all.{"  "}
            <Text style={styles.highlightGreen}>However</Text>, the reality reflects a stark digital divide.{"  "}
            <Text style={styles.highlightYellow}>This suggests</Text> that technology alone is not a panacea.
          </Text>
        </View>

        <View style={styles.infoGreen}>
          <Text style={styles.infoTitle}>🟢 Structural Pivot: "However"</Text>
          <Text style={styles.infoText}>Indicates a shift from a positive belief to critical evaluation.</Text>
        </View>
        <View style={styles.infoYellow}>
          <Text style={styles.infoTitle}>🟡 Inference Marker: "This suggests"</Text>
          <Text style={styles.infoText}>Signals the author's central argument or conclusion.</Text>
        </View>
      </ScrollView>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.cta, !allDone && styles.ctaDisabled]}
          onPress={handleStartQuiz}
          activeOpacity={0.9}
        >
          <View style={styles.ctaInner}>
            {!allDone && <Text style={styles.lockIcon}>🔒</Text>}
            <Text style={styles.ctaText}>
              {allDone
                ? "Start Practice Quiz  →"
                : `${COURSE_CONTENT.length - completedSteps.size} section${COURSE_CONTENT.length - completedSteps.size > 1 ? "s" : ""} baaki hai unlock karne ke liye`
              }
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RCLearningScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  centered:{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.bg },

  stickyHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: scale(16), paddingVertical: scale(12),
    backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border,
    paddingTop: Platform.OS === "android" ? scale(40) : scale(14),
    ...Platform.select({ android: { elevation: 4 } }),
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: scale(17), fontWeight: "800", color: C.textPrimary, marginHorizontal: scale(8), letterSpacing: -0.3 },
  iconBtn: { width: scale(38), height: scale(38), borderRadius: scale(19), backgroundColor: C.accentLight, justifyContent: "center", alignItems: "center" },
  backIcon: { width: scale(20), height: scale(20), tintColor: C.primary },
  bookmarkIcon: { fontSize: scale(16) },

  scrollContent: { paddingTop: scale(16), paddingBottom: scale(120) },

  progressWrap: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: scale(16) },
  progressLabel: { fontSize: scale(11), fontWeight: "700", color: C.textMuted, letterSpacing: 0.5 },
  progressPercent: { fontSize: scale(11), fontWeight: "700", color: C.primary },
  progressBar: { height: scale(6), backgroundColor: C.border, marginHorizontal: scale(16), borderRadius: scale(6), marginTop: scale(8), overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: C.accent, borderRadius: scale(6) },

  videoCard: {
    height: scale(200), backgroundColor: C.primary,
    borderRadius: scale(20), margin: scale(16),
    justifyContent: "center", alignItems: "center", overflow: "hidden",
    ...Platform.select({ android: { elevation: 8 } }),
  },
  playBtn: { width: scale(64), height: scale(64), borderRadius: scale(32), backgroundColor: C.accent, justifyContent: "center", alignItems: "center" },
  playIcon: { fontSize: scale(22), color: "#FFFFFF", marginLeft: scale(3) },
  videoBottom: { position: "absolute", bottom: scale(14), left: scale(14), right: scale(14) },
  videoTitle: { color: "#FFFFFF", fontSize: scale(13), fontWeight: "700", lineHeight: scale(20) },
  videoTime: { color: "rgba(255,255,255,0.6)", fontSize: scale(11), marginTop: scale(4) },
  watchedBadge: { position: "absolute", top: scale(12), right: scale(12), backgroundColor: C.successLight, paddingHorizontal: scale(10), paddingVertical: scale(6), borderRadius: scale(12) },
  watchedText: { fontSize: scale(11), fontWeight: "700", color: C.success },

  sectionTitle: { fontSize: scale(16), fontWeight: "800", marginHorizontal: scale(16), marginTop: scale(28), marginBottom: scale(4), color: C.textPrimary, letterSpacing: -0.2 },

  accordion: {
    backgroundColor: C.card, borderRadius: scale(18),
    marginHorizontal: scale(16), marginTop: scale(12), padding: scale(16),
    borderWidth: 1, borderColor: C.border,
    ...Platform.select({ android: { elevation: 2 } }),
  },
  accordionCompleted: { borderColor: "#C6E2D0", backgroundColor: "#FAFCFA" },
  accordionHeader: { flexDirection: "row", alignItems: "center" },
  step: { backgroundColor: C.accentLight, width: scale(28), height: scale(28), borderRadius: scale(14), justifyContent: "center", alignItems: "center" },
  stepCompleted: { backgroundColor: C.primary },
  stepText: { fontWeight: "700", color: C.primary, fontSize: scale(13) },
  stepCheckmark: { fontWeight: "800", color: "#FFFFFF", fontSize: scale(13) },
  accordionTitle: { flex: 1, marginLeft: scale(12), fontWeight: "700", color: C.textPrimary, fontSize: scale(15) },
  accordionTitleDone: { color: C.textMuted },
  chevron: { fontSize: scale(10), color: C.textMuted, fontWeight: "700" },
  accordionBody: { marginTop: scale(16) },

  bulletRow: { flexDirection: "row", marginBottom: scale(8), paddingRight: scale(4) },
  bulletDot: { fontSize: scale(13), color: C.accent, marginRight: scale(8), lineHeight: scale(20) },
  bullet: { flex: 1, fontSize: scale(13), lineHeight: scale(20), color: C.textSecondary },

  tipBox: { backgroundColor: C.warningLight, padding: scale(14), borderRadius: scale(12), marginTop: scale(12), borderWidth: 1, borderColor: "#FDE68A" },
  tipTitle: { fontWeight: "700", fontSize: scale(11), color: C.warning, letterSpacing: 0.5 },
  tipText: { fontSize: scale(12), marginTop: scale(6), lineHeight: scale(18), color: "#78350F" },

  markCompleteBtn: { backgroundColor: C.accent, paddingVertical: scale(12), paddingHorizontal: scale(16), borderRadius: scale(12), alignItems: "center", marginTop: scale(14) },
  markCompleteText: { color: "#FFFFFF", fontSize: scale(14), fontWeight: "700" },
  completedBadge: { backgroundColor: C.successLight, paddingVertical: scale(10), paddingHorizontal: scale(12), borderRadius: scale(12), alignItems: "center", marginTop: scale(14), borderWidth: 1, borderColor: "#D1FAE5", flexDirection: "row", justifyContent: "center", gap: scale(6) },
  completedIcon: { fontSize: scale(14) },
  completedText: { color: C.success, fontSize: scale(13), fontWeight: "700" },

  passageCard: { backgroundColor: C.card, margin: scale(16), padding: scale(16), borderRadius: scale(18), borderWidth: 1, borderColor: C.border, ...Platform.select({ android: { elevation: 2 } }) },
  passage: { fontSize: scale(14), lineHeight: scale(26), color: C.textSecondary },
  highlightGreen: { backgroundColor: C.accentLight, fontWeight: "800", color: C.primary },
  highlightYellow: { backgroundColor: C.warningLight, fontWeight: "800", color: C.warning },

  infoGreen: { backgroundColor: C.accentLight, marginHorizontal: scale(16), padding: scale(14), borderRadius: scale(14), marginBottom: scale(10), borderWidth: 1, borderColor: C.border },
  infoYellow: { backgroundColor: C.warningLight, marginHorizontal: scale(16), padding: scale(14), borderRadius: scale(14), borderWidth: 1, borderColor: "#FDE68A", marginBottom: scale(10) },
  infoTitle: { fontWeight: "700", fontSize: scale(13), color: C.textPrimary, marginBottom: scale(4) },
  infoText: { fontSize: scale(12), lineHeight: scale(18), color: C.textSecondary },

  bottomBar: {
    paddingHorizontal: scale(16), paddingTop: scale(12),
    paddingBottom: Platform.OS === "ios" ? scale(28) : scale(16),
    backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border,
    ...Platform.select({ android: { elevation: 8 } }),
  },
  cta: { backgroundColor: C.primary, paddingVertical: scale(16), borderRadius: scale(18), alignItems: "center" },
  ctaDisabled: { backgroundColor: C.textMuted },
  ctaInner: { flexDirection: "row", alignItems: "center", gap: scale(8) },
  lockIcon: { fontSize: scale(14) },
  ctaText: { color: "#FFFFFF", fontSize: scale(15), fontWeight: "800" },
});