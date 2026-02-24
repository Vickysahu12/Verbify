import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// ─── DATA ─────────────────────────────────────────────────────────────────────

const MODULES = [
  {
    title: "Parajumbles",
    subtitle: "Mastering chronological flow",
    progress: 82,
    icon: "🔢",
    tag: "IN PROGRESS",
    tagColor: "#D4F7C5",
    tagTextColor: "#1F4D0F",
    route: "Parajumble",
  },
  {
    title: "Odd One Out",
    subtitle: "Identifying the outlier theme",
    progress: 45,
    icon: "🎯",
    tag: "STARTED",
    tagColor: "#FEF3C7",
    tagTextColor: "#92400E",
    route: "OddOne",
  },
  {
    title: "Para Summary",
    subtitle: "Extracting the core essence",
    progress: 12,
    icon: "📝",
    tag: "NEW",
    tagColor: "#DBEAFE",
    tagTextColor: "#1E40AF",
    route: "Parasum",
  },
];

const STRATEGIES = [
  {
    title: "Identifying Opening Sentences",
    icon: "🔍",
    content:
      "Look for broad contextual statements that introduce a topic fresh. Avoid sentences starting with pronouns like 'it', 'they', 'this' — these always refer back to something already stated.",
    tip: "If a sentence can stand alone without any context, it's likely the opener.",
  },
  {
    title: "Connecting Transition Words",
    icon: "🔗",
    content:
      "Track linking words like 'However', 'Therefore', 'Moreover', 'Furthermore'. These words create mandatory sequence — 'However' means contrast from the previous sentence.",
    tip: "Transition words are like arrows pointing to their previous sentence.",
  },
  {
    title: "Pronoun–Noun Linking",
    icon: "⛓️",
    content:
      "Whenever a pronoun (it, they, such, this) appears, find the noun it refers to. That noun sentence must come immediately before the pronoun sentence — creating a locked pair.",
    tip: "'Such' is the strongest signal — it almost always directly follows its defining noun.",
  },
];

// ─── SCREEN ───────────────────────────────────────────────────────────────────

const VAHubScreen = () => {
  const navigation = useNavigation();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const totalProgress = Math.round(
    MODULES.reduce((acc, m) => acc + m.progress, 0) / MODULES.length
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F0" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
      >

        {/* ═══════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarInner} />
              <View style={styles.avatarDot} />
            </View>
            <View>
              <Text style={styles.brand}>VA Concept Hub</Text>
              <Text style={styles.brandSub}>PREMIUM CAT ACCESS</Text>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════
            OVERALL PROGRESS BANNER
        ════════════════════════════════════════ */}
        <View style={styles.progressBanner}>
          <View style={styles.progressBannerLeft}>
            <Text style={styles.progressBannerGreeting}>Good Morning, Rahul 👋</Text>
            <Text style={styles.progressBannerSub}>Keep going — you're making great strides!</Text>
            <View style={styles.overallBarTrack}>
              <View style={[styles.overallBarFill, { width: `${totalProgress}%` }]} />
            </View>
            <Text style={styles.overallPercent}>{totalProgress}% overall mastery</Text>
          </View>
          <View style={styles.progressBannerRight}>
            <Text style={styles.streakNumber}>5</Text>
            <Text style={styles.streakLabel}>🔥 day streak</Text>
          </View>
        </View>

        {/* ═══════════════════════════════════════
            TODAY'S CHALLENGE CARD
        ════════════════════════════════════════ */}
        <View style={styles.challengeCard}>
          {/* Decorative circles */}
          <View style={styles.deco1} />
          <View style={styles.deco2} />

          <View style={styles.challengeTop}>
            <View style={styles.taskLabelWrap}>
              <View style={styles.taskLabelDot} />
              <Text style={styles.taskLabel}>TODAY'S CHALLENGE</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+50 XP</Text>
            </View>
          </View>

          <Text style={styles.challengeTitle}>Daily VA Challenge</Text>
          <Text style={styles.challengeDesc}>
            Solve today's Parajumble to maintain your 5-day streak and earn bonus XP!
          </Text>

          <View style={styles.challengeMeta}>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>⏱ ~5 min</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>📊 Medium</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>🔢 Parajumble</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Parajumble")}
          >
            <Text style={styles.startButtonText}>Start Challenge →</Text>
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════
            MASTERY MODULES
        ════════════════════════════════════════ */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Mastery Modules</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {MODULES.map((mod, i) => (
          <ModuleCard key={i} mod={mod} navigation={navigation} />
        ))}

        {/* ═══════════════════════════════════════
            CORE STRATEGIES
        ════════════════════════════════════════ */}
        <View style={[styles.sectionRow, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>Core Strategies</Text>
        </View>
        <Text style={styles.sectionCaption}>Tap to expand key CAT VA techniques</Text>

        {STRATEGIES.map((s, i) => (
          <AccordionCard
            key={i}
            index={i}
            item={s}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── MODULE CARD ─────────────────────────────────────────────────────────────

const ModuleCard = ({ mod, navigation }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation.navigate(mod.route)}
        style={styles.moduleCard}
      >
        {/* Top row */}
        <View style={styles.moduleTop}>
          <View style={styles.moduleIconWrap}>
            <Text style={styles.moduleIcon}>{mod.icon}</Text>
          </View>
          <View style={styles.moduleTitleBlock}>
            <Text style={styles.moduleTitle}>{mod.title}</Text>
            <Text style={styles.moduleSubtitle}>{mod.subtitle}</Text>
          </View>
          <View>
            <View style={[styles.moduleTag, { backgroundColor: mod.tagColor }]}>
              <Text style={[styles.moduleTagText, { color: mod.tagTextColor }]}>{mod.tag}</Text>
            </View>
          </View>
        </View>

        {/* Progress row */}
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${mod.progress}%` }]}>
              <View style={styles.progressGloss} />
            </View>
          </View>
          <Text style={styles.progressPercent}>{mod.progress}%</Text>
        </View>

        {/* Divider */}
        <View style={styles.moduleDivider} />

        {/* CTA */}
        <View style={styles.moduleFooter}>
          <Text style={styles.moduleCTA}>
            {mod.progress === 0 ? "Start Module" : mod.progress === 100 ? "Review" : "Continue Learning"}
          </Text>
          <Text style={styles.moduleCTAArrow}>→</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── ACCORDION CARD ──────────────────────────────────────────────────────────

const AccordionCard = ({ index, item, isOpen, onToggle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[styles.accordionCard, isOpen && styles.accordionCardOpen]}
      onPress={onToggle}
    >
      <View style={styles.accordionHeader}>
        <View style={styles.accordionIconWrap}>
          <Text style={styles.accordionIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.accordionTitle}>{item.title}</Text>
        <View style={[styles.chevronWrap, isOpen && styles.chevronOpen]}>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>

      {isOpen && (
        <View style={styles.accordionBody}>
          <Text style={styles.accordionText}>{item.content}</Text>
          {item.tip && (
            <View style={styles.tipBox}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>{item.tip}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default VAHubScreen;

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7F0",
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // ── HEADER ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: "#F4F7F0",
    shadowColor: "#1F3B1F",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5, 
    zIndex: 100,
    elevation: 6,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#1F3B1F",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  avatarDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#5EBA4A",
    borderWidth: 2,
    borderColor: "#F4F7F0",
  },
  brand: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F3B1F",
    letterSpacing: -0.2,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: "700",
    color: "#B58900",
    letterSpacing: 1.2,
    marginTop: 1,
  },

  // ── PROGRESS BANNER ──
  progressBanner: {
    flexDirection: "row",
    backgroundColor: "#1F3B1F",
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    overflow: "hidden",
    marginTop:10
  },
  progressBannerLeft: { flex: 1 },
  progressBannerGreeting: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 3,
  },
  progressBannerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 14,
    lineHeight: 17,
  },
  overallBarTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 6,
  },
  overallBarFill: {
    height: "100%",
    backgroundColor: "#5EBA4A",
    borderRadius: 6,
  },
  overallPercent: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
  },
  progressBannerRight: {
    alignItems: "center",
    marginLeft: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  streakNumber: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFD700",
    lineHeight: 34,
  },
  streakLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
    marginTop: 2,
  },

  // ── CHALLENGE CARD ──
  challengeCard: {
    backgroundColor: "#1F3B1F",
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#1F3B1F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  deco1: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(255,255,255,0.04)",
    top: -40,
    right: -30,
  },
  deco2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(94,186,74,0.12)",
    bottom: -20,
    right: 60,
  },
  challengeTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  taskLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  taskLabelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5EBA4A",
  },
  taskLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#A7F3D0",
    letterSpacing: 1.2,
  },
  xpBadge: {
    backgroundColor: "rgba(255,215,0,0.18)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  xpText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFD700",
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  challengeDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 21,
    marginBottom: 18,
  },
  challengeMeta: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  metaChip: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  metaChipText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: "#1F3B1F",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.2,
  },

  // ── SECTION ROW ──
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F3B1F",
    letterSpacing: -0.3,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F3B1F",
    opacity: 0.6,
  },
  sectionCaption: {
    fontSize: 12,
    color: "#6B7280",
    paddingHorizontal: 20,
    marginBottom: 12,
    fontWeight: "500",
  },

  // ── MODULE CARD ──
  moduleCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    marginTop: 10,
    shadowColor: "#1F3B1F",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  moduleTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  moduleIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#EAF2E8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  moduleIcon: { fontSize: 20 },
  moduleTitleBlock: { flex: 1 },
  moduleTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
  },
  moduleSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  moduleTag: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  moduleTagText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: "#EDF2EC",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
    borderRadius: 8,
    position: "relative",
  },
  progressGloss: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1F3B1F",
    width: 38,
    textAlign: "right",
  },
  moduleDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 14,
  },
  moduleFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moduleCTA: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F3B1F",
  },
  moduleCTAArrow: {
    fontSize: 16,
    color: "#1F3B1F",
    fontWeight: "700",
  },

  // ── ACCORDION CARD ──
  accordionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    shadowColor: "#1F3B1F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#EDF2EC",
  },
  accordionCardOpen: {
    borderColor: "#1F3B1F",
    borderWidth: 1.5,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  accordionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EAF2E8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  accordionIcon: { fontSize: 17 },
  accordionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#1F3B1F",
    lineHeight: 20,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EDF2EC",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "90deg" }],
  },
  chevronOpen: {
    backgroundColor: "#1F3B1F",
    transform: [{ rotate: "270deg" }],
  },
  chevron: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F3B1F",
    lineHeight: 22,
  },
  accordionBody: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F4EF",
  },
  accordionText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: "#374151",
    marginBottom: 12,
  },
  tipBox: {
    flexDirection: "row",
    backgroundColor: "#F0F7EE",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    alignItems: "flex-start",
    borderLeftWidth: 3,
    borderLeftColor: "#1F3B1F",
  },
  tipIcon: { fontSize: 14, marginTop: 1 },
  tipText: {
    flex: 1,
    fontSize: 12.5,
    color: "#1F3B1F",
    lineHeight: 19,
    fontWeight: "500",
    fontStyle: "italic",
  },
});