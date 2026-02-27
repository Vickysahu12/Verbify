/**
 * ProfileScreen.jsx
 * Production-ready | Backend-ready | Consistent with app design system
 *
 * TODO markers show exact backend wiring points.
 * Data shape mirrors a typical user profile API response.
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import backicon from "../assets/icon/backbutton.png";

// ─── Constants ────────────────────────────────────────────────────────────────
const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

// ─── Mock User Data ───────────────────────────────────────────────────────────
// TODO: Replace with API call:
// const res = await fetch("https://your-api.com/user/profile", {
//   headers: { Authorization: `Bearer ${token}` },
// });
// Shape: { id, name, email, phone, avatar, targetExam, targetYear,
//          stats: { streak, testsGiven, avgScore, rank },
//          subscription: { plan, expiresAt } }

const USER = {
  id: "u_001",
  name: "Aryan Sharma",
  email: "aryan.sharma@gmail.com",
  phone: "+91 98765 43210",
  avatar: null,           // TODO: replace with image URI from API
  initials: "AS",
  targetExam: "CAT 2025",
  targetYear: "2025",
  college: "IIM Ahmedabad",
  subscription: {
    plan: "Pro",
    expiresAt: "31 Dec 2025",
  },
  stats: {
    streak:     14,
    testsGiven: 38,
    avgScore:   82,
    rank:       247,
  },
};

// ─── Settings sections ────────────────────────────────────────────────────────
const SETTINGS_SECTIONS = [
  {
    title: "Account",
    items: [
      { id: "edit",     icon: "✏️", label: "Edit Profile",         arrow: true,  action: "EditProfile" },
      { id: "target",   icon: "🎯", label: "Target & Preferences", arrow: true,  action: "TargetPrefs" },
      { id: "notif",    icon: "🔔", label: "Notifications",        arrow: true,  action: "Notifications" },
    ],
  },
  {
    title: "Study",
    items: [
      { id: "history",  icon: "📊", label: "Test History",         arrow: true,  action: "TestHistory" },
      { id: "bookmark", icon: "🔖", label: "Bookmarks",            arrow: true,  action: "Bookmarks" },
      { id: "download", icon: "⬇️", label: "Downloads",            arrow: true,  action: "Downloads" },
    ],
  },
  {
    title: "Support",
    items: [
      { id: "help",     icon: "💬", label: "Help & Support",       arrow: true,  action: "Help" },
      { id: "about",    icon: "ℹ️",  label: "About Verbify",        arrow: true,  action: "About" },
      { id: "rate",     icon: "⭐", label: "Rate the App",          arrow: false, action: "rate" },
    ],
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = React.memo(({ value, label, accent, delay }) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(scale(16))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.statCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
});

// ─── Setting Row ──────────────────────────────────────────────────────────────
const SettingRow = React.memo(({ item, isFirst, isLast, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 50 }).start();

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.settingRow,
            isFirst && styles.settingRowFirst,
            isLast  && styles.settingRowLast,
          ]}
          onPress={() => onPress(item)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel={item.label}
        >
          <View style={styles.settingIconWrap}>
            <Text style={styles.settingIcon}>{item.icon}</Text>
          </View>
          <Text style={styles.settingLabel}>{item.label}</Text>
          {item.arrow && <Text style={styles.settingArrow}>›</Text>}
        </TouchableOpacity>
      </Animated.View>
      {!isLast && <View style={styles.settingDivider} />}
    </>
  );
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const navigation = useNavigation();
  const scrollY     = useRef(new Animated.Value(0)).current;
  const backScale   = useRef(new Animated.Value(1)).current;
  const headerFade  = useRef(new Animated.Value(0)).current;

  // Sticky header title fades in on scroll
  const stickyTitleOpacity = scrollY.interpolate({
    inputRange: [scale(80), scale(130)],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleBack = useCallback(() => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 80, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  }, [navigation]);

  const handleSetting = useCallback((item) => {
    if (item.action === "rate") {
      Alert.alert("Rate Verbify", "Opening app store…");
      return;
    }
    // TODO: navigation.navigate(item.action)
    Alert.alert(item.label, "Coming soon!");
  }, [navigation]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            // TODO: clear token, navigate to Auth
            // await AsyncStorage.clear();
            // navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
          },
        },
      ]
    );
  }, []);

  const avatarBg = ["#1F3B1F", "#2563EB", "#7C3AED", "#D97706"][
    USER.name.charCodeAt(0) % 4
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAF6" />

      {/* ── STICKY HEADER ── */}
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: backScale }] }}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.iconBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Image source={backicon} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
        </Animated.View>

        {/* Title fades in when user scrolls past hero */}
        <Animated.Text style={[styles.headerTitle, { opacity: stickyTitleOpacity }]}>
          {USER.name}
        </Animated.Text>

        {/* Edit shortcut */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => handleSetting({ label: "Edit Profile", action: "EditProfile" })}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* ── SCROLLABLE CONTENT ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >

        {/* ── HERO SECTION ── */}
        <View style={styles.hero}>
          {/* Avatar */}
          <View style={[styles.avatarRing, { borderColor: avatarBg + "30" }]}>
            <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
              {USER.avatar
                ? <Image source={{ uri: USER.avatar }} style={styles.avatarImg} />
                : <Text style={styles.avatarInitials}>{USER.initials}</Text>
              }
            </View>
            {/* Pro badge */}
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>⭐ {USER.subscription.plan}</Text>
            </View>
          </View>

          {/* Name & info */}
          <Text style={styles.heroName}>{USER.name}</Text>
          <Text style={styles.heroEmail}>{USER.email}</Text>

          {/* Target chip */}
          <View style={styles.targetChip}>
            <Text style={styles.targetChipText}>🎯 {USER.targetExam}</Text>
          </View>
        </View>

        {/* ── STATS ROW ── */}
        <View style={styles.statsRow}>
          <StatCard value={`${USER.stats.streak}🔥`} label="Streak"    accent="#D97706" delay={0}   />
          <StatCard value={USER.stats.testsGiven}     label="Tests"     accent="#2563EB" delay={80}  />
          <StatCard value={`${USER.stats.avgScore}%`} label="Avg Score" accent="#059669" delay={160} />
          <StatCard value={`#${USER.stats.rank}`}     label="Rank"      accent="#7C3AED" delay={240} />
        </View>

        {/* ── SUBSCRIPTION CARD ── */}
        <View style={styles.subCard}>
          <View style={styles.subLeft}>
            <Text style={styles.subIcon}>💎</Text>
            <View>
              <Text style={styles.subPlan}>{USER.subscription.plan} Plan</Text>
              <Text style={styles.subExpiry}>Valid till {USER.subscription.expiresAt}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.subBtn} activeOpacity={0.85}>
            <Text style={styles.subBtnText}>Renew</Text>
          </TouchableOpacity>
        </View>

        {/* ── SETTINGS SECTIONS ── */}
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <SettingRow
                  key={item.id}
                  item={item}
                  isFirst={idx === 0}
                  isLast={idx === section.items.length - 1}
                  onPress={handleSetting}
                />
              ))}
            </View>
          </View>
        ))}

        {/* ── LOGOUT ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* ── VERSION ── */}
        <Text style={styles.version}>Verbify v2.4.0</Text>

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F1F5F0",
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingTop: Platform.OS === "android" ? scale(8) : scale(4),
    paddingBottom: scale(10),
    backgroundColor: "#F1F5F0",
    paddingTop:35
  },

  iconBtn: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: "#E4EDE4",
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    width: scale(19),
    height: scale(19),
    tintColor: "#1F3B1F",
  },

  editIcon: { fontSize: scale(16) },

  headerTitle: {
    fontSize: scale(16),
    fontWeight: "800",
    color: "#1F3B1F",
    flex: 1,
    textAlign: "center",
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingBottom: scale(48),
  },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    alignItems: "center",
    paddingTop: scale(8),
    paddingBottom: scale(24),
    paddingHorizontal: scale(20),
  },

  avatarRing: {
    width: scale(104),
    height: scale(104),
    borderRadius: scale(52),
    borderWidth: scale(4),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(14),
  },

  avatar: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    justifyContent: "center",
    alignItems: "center",
  },

  avatarImg: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
  },

  avatarInitials: {
    fontSize: scale(30),
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: scale(1),
  },

  proBadge: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: scale(8),
    paddingVertical: scale(3),
    borderRadius: scale(20),
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },

  proBadgeText: {
    fontSize: scale(10),
    fontWeight: "800",
    color: "#1F3B1F",
  },

  heroName: {
    fontSize: scale(22),
    fontWeight: "800",
    color: "#111827",
    marginBottom: scale(4),
    letterSpacing: -0.3,
  },

  heroEmail: {
    fontSize: scale(13),
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: scale(12),
  },

  targetChip: {
    backgroundColor: "#E4EDE4",
    paddingHorizontal: scale(14),
    paddingVertical: scale(6),
    borderRadius: scale(20),
  },

  targetChipText: {
    fontSize: scale(12),
    fontWeight: "700",
    color: "#1F3B1F",
  },

  // ── Stats ──────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    marginHorizontal: scale(16),
    gap: scale(8),
    marginBottom: scale(16),
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: scale(16),
    paddingVertical: scale(14),
    paddingHorizontal: scale(4),
    alignItems: "center",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },

  statValue: {
    fontSize: scale(17),
    fontWeight: "800",
    marginBottom: scale(3),
  },

  statLabel: {
    fontSize: scale(10),
    color: "#9CA3AF",
    fontWeight: "600",
  },

  // ── Subscription card ──────────────────────────────────────────────────────
  subCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1F3B1F",
    marginHorizontal: scale(16),
    marginBottom: scale(24),
    padding: scale(16),
    borderRadius: scale(18),
  },

  subLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },

  subIcon: { fontSize: scale(24) },

  subPlan: {
    fontSize: scale(15),
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subExpiry: {
    fontSize: scale(11),
    color: "#A7C4A7",
    marginTop: scale(2),
    fontWeight: "500",
  },

  subBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(12),
  },

  subBtnText: {
    fontSize: scale(13),
    fontWeight: "800",
    color: "#1F3B1F",
  },

  // ── Settings sections ──────────────────────────────────────────────────────
  section: {
    marginHorizontal: scale(16),
    marginBottom: scale(20),
  },

  sectionTitle: {
    fontSize: scale(12),
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.6,
    marginBottom: scale(8),
    marginLeft: scale(4),
    textTransform: "uppercase",
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(18),
    overflow: "hidden",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scale(14),
    paddingHorizontal: scale(16),
    backgroundColor: "#FFFFFF",
  },

  settingRowFirst: { borderTopLeftRadius: scale(18), borderTopRightRadius: scale(18) },
  settingRowLast:  { borderBottomLeftRadius: scale(18), borderBottomRightRadius: scale(18) },

  settingIconWrap: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(10),
    backgroundColor: "#F1F5F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },

  settingIcon: { fontSize: scale(16) },

  settingLabel: {
    flex: 1,
    fontSize: scale(14),
    fontWeight: "600",
    color: "#111827",
  },

  settingArrow: {
    fontSize: scale(20),
    color: "#D1D5DB",
    fontWeight: "300",
    lineHeight: scale(22),
  },

  settingDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: scale(62),
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logoutBtn: {
    marginHorizontal: scale(16),
    marginTop: scale(4),
    marginBottom: scale(16),
    backgroundColor: "#FEF2F2",
    borderRadius: scale(16),
    paddingVertical: scale(15),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },

  logoutText: {
    fontSize: scale(15),
    fontWeight: "800",
    color: "#DC2626",
  },

  // ── Version ───────────────────────────────────────────────────────────────
  version: {
    textAlign: "center",
    fontSize: scale(12),
    color: "#CBD5E1",
    fontWeight: "500",
    marginBottom: scale(8),
  },
});