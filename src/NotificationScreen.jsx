/**
 * NotificationScreen.jsx
 * Production-ready | Backend-ready | Responsive all screens
 */

import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  Animated,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import backicon from "./assets/icon/backbutton.png";

// ─── Constants ────────────────────────────────────────────────────────────────
const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

// ─── Data shape (replace with API call) ──────────────────────────────────────
// TODO: const res = await fetch("https://your-api.com/notifications", { headers: { Authorization: `Bearer ${token}` } });
// returns: { notifications: Notification[], unreadCount: number }

const NOTIFICATION_DATA = [
  {
    id: "n1", category: "mock", icon: "📘",
    title: "VARC Sectional Mock 12 Live",
    desc: "New reading comprehension focus test is now available. Time: 40 mins.",
    time: "10 min ago", unread: true, actionUrl: "RcRead",
  },
  {
    id: "n2", category: "mock", icon: "📊",
    title: "Results: Full Mock #08",
    desc: "Your performance analysis is ready. View rank now.",
    time: "Yesterday", unread: false, actionUrl: "RcResult",
  },
  {
    id: "n3", category: "study", icon: "⏰",
    title: "Daily Vocab Practice",
    desc: "Don't break your streak! Spend 10 mins on hard words.",
    time: "2 hrs ago", unread: true, actionUrl: "VocabLearning",
  },
  {
    id: "n4", category: "study", icon: "📝",
    title: "Review Incorrect Answers",
    desc: "You have 15 pending questions from last session.",
    time: "Yesterday", unread: false, actionUrl: null,
  },
  {
    id: "n5", category: "achievement", icon: "🏆",
    title: "7-Day Streak Achieved!",
    desc: "You've practiced 7 days in a row. Keep it going!",
    time: "3 hrs ago", unread: true, actionUrl: null,
  },
  {
    id: "n6", category: "achievement", icon: "🎯",
    title: "Top 10% this Week",
    desc: "You ranked in the top 10% of all mock test takers.",
    time: "2 days ago", unread: false, actionUrl: null,
  },
  {
    id: "n7", category: "update", icon: "✨",
    title: "New: Dark Mode Theme",
    desc: "Experience better focus with our sleek dark UI.",
    time: "2 days ago", unread: false, actionUrl: null,
  },
  {
    id: "n8", category: "update", icon: "🚀",
    title: "App Updated to v2.4",
    desc: "Faster performance, new article reader, and bug fixes.",
    time: "3 days ago", unread: false, actionUrl: null,
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const TABS = [
  { key: "All",         label: "All" },
  { key: "Unread",      label: "Unread" },
  { key: "mock",        label: "🧪 Mocks" },
  { key: "study",       label: "📚 Study" },
  { key: "achievement", label: "🏆 Awards" },
];

const CATEGORY_META = {
  mock:        { label: "Mock Tests",      accent: "#2563EB", bg: "#EFF6FF", dot: "#2563EB" },
  study:       { label: "Study",           accent: "#D97706", bg: "#FFFBEB", dot: "#D97706" },
  achievement: { label: "Achievements",    accent: "#7C3AED", bg: "#F5F3FF", dot: "#7C3AED" },
  update:      { label: "App Updates",     accent: "#059669", bg: "#ECFDF5", dot: "#059669" },
};

// ─── NotificationCard ─────────────────────────────────────────────────────────
const NotificationCard = React.memo(({ item, onPress, onDismiss, isLast }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const meta = CATEGORY_META[item.category] ?? { accent: "#64748B", bg: "#F8FAFC" };

  const handlePressIn  = () => Animated.spring(scaleAnim, { toValue: 0.975, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1,     useNativeDriver: true, speed: 50 }).start();

  const handleDismiss = () => {
    Animated.timing(slideAnim, { toValue: -width, duration: 260, useNativeDriver: true })
      .start(() => onDismiss(item.id));
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }, { translateX: slideAnim }] }}>
      <TouchableOpacity
        style={[styles.card, item.unread && styles.cardUnread]}
        onPress={() => onPress(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        {/* Unread left strip */}
        {item.unread && (
          <View style={[styles.unreadStrip, { backgroundColor: meta.accent }]} />
        )}

        {/* Icon */}
        <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
          <Text style={styles.iconEmoji}>{item.icon}</Text>
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            {item.unread && <View style={[styles.unreadDot, { backgroundColor: meta.accent }]} />}
          </View>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardTime}>{item.time}</Text>
            {item.actionUrl && (
              <Text style={[styles.cardAction, { color: meta.accent }]}>View →</Text>
            )}
          </View>
        </View>

        {/* Dismiss */}
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.dismissBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.dismissIcon}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Inline divider between cards — no big headers */}
      {!isLast && <View style={styles.cardDivider} />}
    </Animated.View>
  );
});

// ─── EmptyState ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <View style={styles.emptyWrap}>
    <Text style={styles.emptyEmoji}>🔔</Text>
    <Text style={styles.emptyTitle}>All caught up!</Text>
    <Text style={styles.emptyDesc}>No notifications here right now.</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function NotificationScreen() {
  const navigation = useNavigation();

  const [activeTab,     setActiveTab]     = useState("All");
  const [notifications, setNotifications] = useState(NOTIFICATION_DATA);
  const backScale = useRef(new Animated.Value(1)).current;

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  // Filter
  const filtered = useMemo(() => {
    if (activeTab === "All")    return notifications;
    if (activeTab === "Unread") return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  // Group by category — only when showing "All" view
  // For category-specific tabs, skip section headers entirely
  const grouped = useMemo(() => {
    if (activeTab !== "All") {
      // Single flat group, no section label needed
      return [{ category: null, items: filtered }];
    }
    const map = {};
    filtered.forEach((n) => {
      if (!map[n.category]) map[n.category] = [];
      map[n.category].push(n);
    });
    return ["mock", "study", "achievement", "update"]
      .filter((cat) => map[cat])
      .map((cat) => ({ category: cat, items: map[cat] }));
  }, [filtered, activeTab]);

  // Handlers
  const handleBack = useCallback(() => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  }, [navigation]);

  const handleMarkAllRead = useCallback(() => {
    // TODO: await fetch("https://your-api.com/notifications/read-all", { method: "POST" })
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const handlePress = useCallback((item) => {
    // TODO: await fetch(`https://your-api.com/notifications/${item.id}/read`, { method: "PATCH" })
    setNotifications((prev) => prev.map((n) => n.id === item.id ? { ...n, unread: false } : n));
    if (item.actionUrl) navigation.navigate(item.actionUrl);
  }, [navigation]);

  const handleDismiss = useCallback((id) => {
    // TODO: await fetch(`https://your-api.com/notifications/${id}`, { method: "DELETE" })
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: backScale }] }}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.iconBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Image source={backicon} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* ── TABS ── */}
      <View style={styles.tabsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, isActive && styles.tabActive]}
                activeOpacity={0.75}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                  {tab.key === "Unread" && unreadCount > 0 ? `  ${unreadCount}` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── LIST ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {/* Mark all read bar */}
        {unreadCount > 0 && (
          <View style={styles.markAllRow}>
            <Text style={styles.markAllCountText}>
              {unreadCount} unread
            </Text>
            <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
              <Text style={styles.markAllAction}>Mark all read</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty */}
        {filtered.length === 0 && <EmptyState />}

        {/* Groups */}
        {grouped.map(({ category, items }) => (
          <View key={category ?? "flat"} style={styles.group}>

            {/* Section pill — only in "All" tab, and very minimal */}
            {category && (
              <View style={styles.sectionPillRow}>
                <View style={[
                  styles.sectionPill,
                  { backgroundColor: CATEGORY_META[category]?.bg ?? "#F1F5F9" }
                ]}>
                  <View style={[
                    styles.sectionDot,
                    { backgroundColor: CATEGORY_META[category]?.accent ?? "#64748B" }
                  ]} />
                  <Text style={[
                    styles.sectionPillText,
                    { color: CATEGORY_META[category]?.accent ?? "#64748B" }
                  ]}>
                    {CATEGORY_META[category]?.label ?? category}
                  </Text>
                </View>
              </View>
            )}

            {/* Cards in a rounded container */}
            <View style={styles.cardGroup}>
              {items.map((item, idx) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  onPress={handlePress}
                  onDismiss={handleDismiss}
                  isLast={idx === items.length - 1}
                />
              ))}
            </View>

          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F1F5F9" },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingTop:35,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },

  iconBtn: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: { width: scale(19), height: scale(19), tintColor: "#0F172A" },

  settingsIcon: { fontSize: scale(17), color: "#64748B" },

  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(7),
  },

  headerTitle: { fontSize: scale(17), fontWeight: "800", color: "#0F172A" },

  headerBadge: {
    backgroundColor: "#EF4444",
    borderRadius: scale(9),
    minWidth: scale(18),
    height: scale(18),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(4),
  },

  headerBadgeText: { fontSize: scale(10), fontWeight: "800", color: "#FFFFFF" },

  // ── Tabs ────────────────────────────────────────────────────────────────
  tabsRow: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  tabsContent: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    gap: scale(8),
  },

  tab: {
    paddingHorizontal: scale(14),
    paddingVertical: scale(6),
    borderRadius: scale(20),
    backgroundColor: "#F1F5F9",
  },

  tabActive: { backgroundColor: "#0F172A" },

  tabText: { fontSize: scale(13), fontWeight: "600", color: "#64748B" },

  tabTextActive: { color: "#FFFFFF", fontWeight: "700" },

  // ── List ────────────────────────────────────────────────────────────────
  listContent: { paddingBottom: scale(100), paddingTop: scale(12) },

  // ── Mark all ────────────────────────────────────────────────────────────
  markAllRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingBottom: scale(8),
  },

  markAllCountText: { fontSize: scale(12), color: "#94A3B8", fontWeight: "500" },

  markAllAction: { fontSize: scale(13), color: "#2563EB", fontWeight: "700" },

  // ── Group ───────────────────────────────────────────────────────────────
  group: { marginBottom: scale(16), marginHorizontal: scale(16) },

  // ── Section pill — small, inline, not a big header ────────────────────
  sectionPillRow: {
    flexDirection: "row",
    marginBottom: scale(8),
  },

  sectionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(5),
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(20),
    alignSelf: "flex-start",
  },

  sectionDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },

  sectionPillText: {
    fontSize: scale(11),
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ── Card group container ────────────────────────────────────────────────
  cardGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(18),
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },

  // ── Card ────────────────────────────────────────────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: scale(13),
    paddingRight: scale(12),
    paddingLeft: scale(14),
  },

  cardUnread: { backgroundColor: "#FAFBFF" },

  unreadStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: scale(3),
  },

  iconBox: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(13),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
    flexShrink: 0,
  },

  iconEmoji: { fontSize: scale(19) },

  cardBody: { flex: 1 },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginBottom: scale(2),
  },

  cardTitle: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
  },

  unreadDot: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(4),
    flexShrink: 0,
  },

  cardDesc: {
    fontSize: scale(12),
    color: "#64748B",
    lineHeight: scale(17),
    marginBottom: scale(5),
  },

  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTime: { fontSize: scale(11), color: "#94A3B8", fontWeight: "500" },

  cardAction: { fontSize: scale(12), fontWeight: "700" },

  dismissBtn: { paddingLeft: scale(8), paddingVertical: scale(4) },

  dismissIcon: { fontSize: scale(12), color: "#CBD5E1" },

  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: scale(68), // aligns with card content, skips icon
  },

  // ── Empty ────────────────────────────────────────────────────────────────
  emptyWrap: {
    alignItems: "center",
    paddingTop: scale(80),
    paddingHorizontal: scale(40),
  },

  emptyEmoji: { fontSize: scale(48), marginBottom: scale(14) },

  emptyTitle: {
    fontSize: scale(17),
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: scale(6),
    textAlign: "center",
  },

  emptyDesc: {
    fontSize: scale(14),
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: scale(21),
    fontWeight: "500",
  },
});