import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  LayoutAnimation,
  UIManager,
  Alert,
  Animated,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Your custom icons ────────────────────────────────────────────────────────
import backicon from "../../../assets/icon/backbutton.png";

// ─── Constants ────────────────────────────────────────────────────────────────
const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

const STORAGE_KEYS = {
  PROGRESS: "rc_progress_v1",
  BOOKMARKS: "rc_bookmarks_v1",
};

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
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
    tip: "The main idea is rarely in the middle—scan first and last lines.",
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
const AccordionItem = React.memo(
  ({ item, index, isOpen, isCompleted, onToggle, onMarkComplete }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.accordion}
      onPress={() => onToggle(index)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${isCompleted ? "Completed." : ""} ${
        isOpen ? "Collapse" : "Expand"
      } section.`}
    >
      <View style={styles.accordionHeader}>
        {/* Step number / completed indicator */}
        <View style={[styles.step, isCompleted && styles.stepCompleted]}>
          {isCompleted ? (
            <Text style={styles.stepCheckmark}>✓</Text>
          ) : (
            <Text style={styles.stepText}>{item.id}</Text>
          )}
        </View>

        <Text style={styles.accordionTitle}>{item.title}</Text>

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
            <TouchableOpacity
              style={styles.markCompleteBtn}
              onPress={() => onMarkComplete(item.id)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Mark section as complete"
            >
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
  )
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const RCLearningScreen = () => {
  const navigation = useNavigation();

  const [openIndex, setOpenIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [watchedVideo, setWatchedVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const backButtonScale = useRef(new Animated.Value(1)).current;

  // Progress computation
  const totalSteps = COURSE_CONTENT.length + 1;
  const completedCount = completedSteps.size + (watchedVideo ? 1 : 0);
  const progress = Math.round((completedCount / totalSteps) * 100);
  const allSectionsComplete = completedSteps.size >= COURSE_CONTENT.length;

  useEffect(() => {
    loadProgress();
  }, []);

  // ── Data ──────────────────────────────────────────────────────────────────
  const loadProgress = async () => {
    try {
      // TODO: Uncomment when AsyncStorage is installed
      // const [progressRaw, bookmarksRaw] = await Promise.all([
      //   AsyncStorage.getItem(STORAGE_KEYS.PROGRESS),
      //   AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS),
      // ]);
      // if (progressRaw) {
      //   const data = JSON.parse(progressRaw);
      //   setCompletedSteps(new Set(data.completed || []));
      //   setWatchedVideo(data.watchedVideo || false);
      // }
      // if (bookmarksRaw) {
      //   const list = JSON.parse(bookmarksRaw);
      //   setIsBookmarked(list.includes("rc_mastery_guide"));
      // }
    } catch (error) {
      console.error("[RCLearningScreen] loadProgress error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (newCompleted, newWatchedVideo) => {
    try {
      // TODO: Uncomment when AsyncStorage is installed
      // await AsyncStorage.setItem(
      //   STORAGE_KEYS.PROGRESS,
      //   JSON.stringify({
      //     completed: [...newCompleted],
      //     watchedVideo: newWatchedVideo,
      //     lastUpdated: new Date().toISOString(),
      //   })
      // );
    } catch (error) {
      console.error("[RCLearningScreen] saveProgress error:", error);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    Animated.sequence([
      Animated.timing(backButtonScale, {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(backButtonScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(() => navigation.goBack());
  }, [navigation, backButtonScale]);

  const handleBookmark = useCallback(async () => {
    try {
      const newBookmarked = !isBookmarked;
      // TODO: Uncomment when AsyncStorage is installed
      // const bookmarksRaw = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      // const list = bookmarksRaw ? JSON.parse(bookmarksRaw) : [];
      // if (newBookmarked) list.push("rc_mastery_guide");
      // else { const idx = list.indexOf("rc_mastery_guide"); if (idx > -1) list.splice(idx, 1); }
      // await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      setIsBookmarked(newBookmarked);
    } catch (error) {
      console.error("[RCLearningScreen] handleBookmark error:", error);
    }
  }, [isBookmarked]);

  const toggle = useCallback(
    (i) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setOpenIndex(openIndex === i ? null : i);
    },
    [openIndex]
  );

  const markStepComplete = useCallback(
    async (stepId) => {
      const newCompleted = new Set([...completedSteps, stepId]);
      setCompletedSteps(newCompleted);
      await saveProgress(newCompleted, watchedVideo);
    },
    [completedSteps, watchedVideo]
  );

  const handleStartQuiz = useCallback(() => {
    if (!allSectionsComplete) {
      Alert.alert(
        "Almost there!",
        `Complete ${COURSE_CONTENT.length - completedSteps.size} more section(s) to unlock the quiz.`,
        [{ text: "Got it" }]
      );
      return;
    }
    Alert.alert("Quiz", "Quiz feature coming soon!", [{ text: "OK" }]);
  }, [allSectionsComplete, completedSteps]);

  const handlePlayVideo = useCallback(async () => {
    Alert.alert("Video", "Video player coming soon!", [{ text: "OK" }]);
    if (!watchedVideo) {
      const newWatched = true;
      setWatchedVideo(newWatched);
      await saveProgress(completedSteps, newWatched);
    }
  }, [watchedVideo, completedSteps]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]}>
        <ActivityIndicator size="large" color="#1F3B1F" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" />

      {/* ─────────────────────────────────────────────────────────────────────
          STICKY HEADER — always fixed at top, never scrolls away
      ───────────────────────────────────────────────────────────────────── */}
      <View style={styles.stickyHeader}>
        {/* Back button — your custom image */}
        <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.iconBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.7}
          >
            <Image
              source={backicon}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Title */}
        <Text style={styles.headerTitle} numberOfLines={1}>
          RC Mastery Guide
        </Text>

        {/* Bookmark */}
        <TouchableOpacity
          onPress={handleBookmark}
          style={styles.iconBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          activeOpacity={0.7}
        >
          <Text style={styles.bookmarkIcon}>{isBookmarked ? "🔖" : "🏷️"}</Text>
        </TouchableOpacity>
      </View>

      {/* ─────────────────────────────────────────────────────────────────────
          SCROLLABLE CONTENT
      ───────────────────────────────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* ── PROGRESS ── */}
        <View style={styles.progressWrap}>
          <Text style={styles.progressLabel}>COURSE PROGRESS</Text>
          <Text style={styles.progressPercent}>{progress}% Complete</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        {/* ── VIDEO CARD ── */}
        <TouchableOpacity
          style={styles.videoCard}
          onPress={handlePlayVideo}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Play RC Strategy video"
        >
          <View style={styles.playBtn}>
            <Text style={styles.playIcon}>▶</Text>
          </View>

          <View style={styles.videoBottom}>
            <Text style={styles.videoTitle}>
              RC Strategy: The Skimming & Scanning Method
            </Text>
            <Text style={styles.videoTime}>⏱ 12:45  •  👁 2.4K views</Text>
          </View>

          {watchedVideo && (
            <View style={styles.watchedBadge}>
              <Text style={styles.watchedText}>✅ Watched</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* ── STRATEGIC FRAMEWORK ── */}
        <Text style={styles.sectionTitle}>📘 Strategic Framework</Text>

        {COURSE_CONTENT.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            index={index}
            isOpen={openIndex === index}
            isCompleted={completedSteps.has(item.id)}
            onToggle={toggle}
            onMarkComplete={markStepComplete}
          />
        ))}

        {/* ── INTERACTIVE EXAMPLE ── */}
        <Text style={styles.sectionTitle}>🧠 Interactive Example</Text>

        <View style={styles.passageCard}>
          <Text style={styles.passage}>
            The digitalization of education has promised democratized access for
            all.{"  "}
            <Text style={styles.highlightBlue}>However</Text>, the reality
            reflects a stark digital divide.{"  "}
            <Text style={styles.highlightYellow}>This suggests</Text> that
            technology alone is not a panacea.
          </Text>
        </View>

        <View style={styles.infoBlue}>
          <Text style={styles.infoTitle}>🔵 Structural Pivot: "However"</Text>
          <Text style={styles.infoText}>
            Indicates a shift from a positive belief to critical evaluation.
          </Text>
        </View>

        <View style={styles.infoYellow}>
          <Text style={styles.infoTitle}>
            🟡 Inference Marker: "This suggests"
          </Text>
          <Text style={styles.infoText}>
            Signals the author's central argument or conclusion.
          </Text>
        </View>
      </ScrollView>

      {/* ── BOTTOM CTA ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.cta, !allSectionsComplete && styles.ctaDisabled]}
          onPress={handleStartQuiz}
          accessibilityRole="button"
        >
          <View style={styles.ctaInner}>
            {!allSectionsComplete && (
              <Text style={styles.lockIcon}>🔒</Text>
            )}
            <Text style={styles.ctaText}>
              {allSectionsComplete
                ? "Start Practice Quiz  →"
                : `Complete ${COURSE_CONTENT.length - completedSteps.size} more section${
                    COURSE_CONTENT.length - completedSteps.size > 1 ? "s" : ""
                  } to unlock`}
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
  safe: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Always-sticky header ──────────────────────────────────────────────────
  stickyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    backgroundColor: "#F9FAF6",
    borderBottomWidth: 1,
    borderBottomColor: "#E5EBE6",
    paddingTop:30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: scale(17),
    fontWeight: "800",
    color: "#1F3B1F",
    marginHorizontal: scale(8),
  },

  // ── Icon button container ─────────────────────────────────────────────────
  iconBtn: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: "#E9F2EC",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Custom back icon (your PNG) ───────────────────────────────────────────
  backIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: "#1F3B1F", // remove this line if your image already has the right colour
  },

  bookmarkIcon: {
    fontSize: scale(16),
  },

  // ── Scroll content ────────────────────────────────────────────────────────
  scrollContent: {
    paddingTop: scale(16),
    paddingBottom: scale(120),
  },

  // ── Progress ──────────────────────────────────────────────────────────────
  progressWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
  },

  progressLabel: {
    fontSize: scale(11),
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.5,
  },

  progressPercent: {
    fontSize: scale(11),
    fontWeight: "700",
    color: "#1F3B1F",
  },

  progressBar: {
    height: scale(6),
    backgroundColor: "#DDE8E1",
    marginHorizontal: scale(16),
    borderRadius: scale(6),
    marginTop: scale(8),
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
    borderRadius: scale(6),
  },

  // ── Video card ────────────────────────────────────────────────────────────
  videoCard: {
    height: scale(200),
    backgroundColor: "#0F1A13",
    borderRadius: scale(20),
    margin: scale(16),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },

  playBtn: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },

  playIcon: {
    fontSize: scale(22),
    color: "#F9FAF6",
    marginLeft: scale(3),
  },

  videoBottom: {
    position: "absolute",
    bottom: scale(14),
    left: scale(14),
    right: scale(14),
  },

  videoTitle: {
    color: "#F9FAF6",
    fontSize: scale(13),
    fontWeight: "700",
    lineHeight: scale(20),
  },

  videoTime: {
    color: "#D1D5DB",
    fontSize: scale(11),
    marginTop: scale(4),
  },

  watchedBadge: {
    position: "absolute",
    top: scale(12),
    right: scale(12),
    backgroundColor: "#ECFDF5",
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(12),
  },

  watchedText: {
    fontSize: scale(11),
    fontWeight: "700",
    color: "#1F3B1F",
  },

  // ── Section title ─────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "800",
    marginHorizontal: scale(16),
    marginTop: scale(28),
    marginBottom: scale(4),
    color: "#1F3B1F",
  },

  // ── Accordion ─────────────────────────────────────────────────────────────
  accordion: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(18),
    marginHorizontal: scale(16),
    marginTop: scale(12),
    padding: scale(16),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },

  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  step: {
    backgroundColor: "#E9F2EC",
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    justifyContent: "center",
    alignItems: "center",
  },

  stepCompleted: {
    backgroundColor: "#1F3B1F",
  },

  stepText: {
    fontWeight: "700",
    color: "#1F3B1F",
    fontSize: scale(13),
  },

  stepCheckmark: {
    fontWeight: "800",
    color: "#FFFFFF",
    fontSize: scale(13),
  },

  accordionTitle: {
    flex: 1,
    marginLeft: scale(12),
    fontWeight: "700",
    color: "#1F3B1F",
    fontSize: scale(15),
  },

  chevron: {
    fontSize: scale(10),
    color: "#1F3B1F",
    fontWeight: "700",
  },

  accordionBody: {
    marginTop: scale(16),
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: scale(8),
    paddingRight: scale(4),
  },

  bulletDot: {
    fontSize: scale(13),
    color: "#10B981",
    marginRight: scale(8),
    lineHeight: scale(20),
  },

  bullet: {
    flex: 1,
    fontSize: scale(13),
    lineHeight: scale(20),
    color: "#374151",
  },

  tipBox: {
    backgroundColor: "#FEF3C7",
    padding: scale(14),
    borderRadius: scale(12),
    marginTop: scale(12),
    borderWidth: 1,
    borderColor: "#FDE68A",
  },

  tipTitle: {
    fontWeight: "700",
    fontSize: scale(11),
    color: "#92400E",
    letterSpacing: 0.5,
  },

  tipText: {
    fontSize: scale(12),
    marginTop: scale(6),
    lineHeight: scale(18),
    color: "#78350F",
  },

  markCompleteBtn: {
    backgroundColor: "#10B981",
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    alignItems: "center",
    marginTop: scale(14),
  },

  markCompleteText: {
    color: "#FFFFFF",
    fontSize: scale(14),
    fontWeight: "700",
  },

  completedBadge: {
    backgroundColor: "#ECFDF5",
    paddingVertical: scale(10),
    paddingHorizontal: scale(12),
    borderRadius: scale(12),
    alignItems: "center",
    marginTop: scale(14),
    borderWidth: 1,
    borderColor: "#D1FAE5",
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(6),
  },

  completedIcon: {
    fontSize: scale(14),
  },

  completedText: {
    color: "#10B981",
    fontSize: scale(13),
    fontWeight: "700",
  },

  // ── Interactive example ───────────────────────────────────────────────────
  passageCard: {
    backgroundColor: "#FFFFFF",
    margin: scale(16),
    padding: scale(16),
    borderRadius: scale(18),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },

  passage: {
    fontSize: scale(14),
    lineHeight: scale(26),
    color: "#111827",
  },

  highlightBlue: {
    backgroundColor: "#DDE8E1",
    fontWeight: "800",
    color: "#1F3B1F",
  },

  highlightYellow: {
    backgroundColor: "#F3EED9",
    fontWeight: "800",
    color: "#1F3B1F",
  },

  infoBlue: {
    backgroundColor: "#E9F2EC",
    marginHorizontal: scale(16),
    padding: scale(14),
    borderRadius: scale(14),
    marginBottom: scale(10),
    borderWidth: 1,
    borderColor: "#D1E7DD",
  },

  infoYellow: {
    backgroundColor: "#F6F3E6",
    marginHorizontal: scale(16),
    padding: scale(14),
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: "#F3EED9",
    marginBottom: scale(10),
  },

  infoTitle: {
    fontWeight: "700",
    fontSize: scale(13),
    color: "#1F3B1F",
    marginBottom: scale(4),
  },

  infoText: {
    fontSize: scale(12),
    lineHeight: scale(18),
    color: "#374151",
  },

  // ── Bottom CTA ────────────────────────────────────────────────────────────
  bottomBar: {
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: Platform.OS === "ios" ? scale(28) : scale(16),
    backgroundColor: "#F9FAF6",
    borderTopWidth: 1,
    borderTopColor: "#E5EBE6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 8 },
    }),
  },

  cta: {
    backgroundColor: "#1F3B1F",
    paddingVertical: scale(16),
    borderRadius: scale(18),
    alignItems: "center",
  },

  ctaDisabled: {
    backgroundColor: "#9CA3AF",
  },

  ctaInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },

  lockIcon: {
    fontSize: scale(14),
  },

  ctaText: {
    color: "#F9FAF6",
    fontSize: scale(15),
    fontWeight: "800",
  },
});