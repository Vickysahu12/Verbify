/**
 * ProfileScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Production-ready | Backend-ready | Consistent with Verbify design system
 *
 * BACKEND INTEGRATION GUIDE:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. FETCH PROFILE     → GET  /api/user/profile       (Bearer token)
 * 2. LOGOUT            → POST /api/auth/logout        (clears refresh token)
 * 3. AVATAR UPLOAD     → PUT  /api/user/avatar        (multipart/form-data)
 * 4. SUBSCRIPTION INFO → GET  /api/user/subscription  (Bearer token)
 *
 * Response shape (GET /api/user/profile):
 * {
 *   id, name, email, phone, avatarUrl,
 *   targetExam, targetYear,
 *   stats: { streak, testsGiven, avgScore, rank },
 *   subscription: { plan, expiresAt, isActive }
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
  useState, useRef, useCallback,
  useEffect, useMemo,
} from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Dimensions,
  Platform, StatusBar, Animated, Image, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

// ─── DESIGN TOKENS — same as ResultScreen / SolutionScreen ───────────────────
const C = {
  primary:      '#1F3B1F',
  primaryLight: '#E8F5EE',
  primaryMid:   '#2EA86B',
  primarySoft:  '#F0FAF5',
  surface:      '#FFFFFF',
  bg:           '#F6F8F7',
  border:       '#E8EDEA',
  borderLight:  '#F0F4F2',
  text:         '#0D1F15',
  sub:          '#527A62',
  muted:        '#9DB5A5',
  correct:      '#16A34A',
  correctBg:    '#DCFCE7',
  wrong:        '#DC2626',
  wrongBg:      '#FEE2E2',
  gold:         '#D97706',
  goldSoft:     '#FEF3C7',
  blue:         '#2563EB',
  blueSoft:     '#EFF6FF',
  purple:       '#7C3AED',
  purpleSoft:   '#EDE9FE',
  shadow:       '#0D1F15',
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with API call → GET /api/user/profile
// See backend integration guide at top of file.
const MOCK_USER = {
  id:          'u_001',
  name:        'Aryan Sharma',
  email:       'aryan.sharma@gmail.com',
  phone:       '+91 98765 43210',
  avatarUrl:   null,             // TODO: string URI from API
  targetExam:  'CAT 2025',
  targetYear:  '2025',
  stats: {
    streak:     14,
    testsGiven: 38,
    avgScore:   82,
    rank:       247,
  },
  subscription: {
    plan:      'Pro',
    expiresAt: '31 Dec 2025',
    isActive:  true,
  },
};

// ─── SETTINGS CONFIG ──────────────────────────────────────────────────────────
const SETTINGS = [
  {
    title: 'Account',
    items: [
      { id: 'edit',     icon: '✏️', label: 'Edit Profile',         screen: 'EditProfile'  },
      { id: 'target',   icon: '🎯', label: 'Target & Preferences', screen: 'TargetPrefs'  },
      { id: 'notif',    icon: '🔔', label: 'Notifications',        screen: 'Notifications' },
    ],
  },
  {
    title: 'Study',
    items: [
      { id: 'history',  icon: '📊', label: 'Test History',  screen: 'TestHistory' },
      { id: 'bookmark', icon: '🔖', label: 'Bookmarks',     screen: 'Bookmarks'   },
      { id: 'download', icon: '⬇️', label: 'Downloads',     screen: 'Downloads'   },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help',     icon: '💬', label: 'Help & Support',  screen: 'Help'  },
      { id: 'about',    icon: 'ℹ️',  label: 'About Verbify',   screen: 'About' },
      { id: 'rate',     icon: '⭐',  label: 'Rate the App',    screen: null    },
    ],
  },
];

// ─── AVATAR COLORS ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [C.primary, C.blue, C.purple, C.gold, '#BE185D'];
const getAvatarColor = name =>
  AVATAR_COLORS[name?.charCodeAt(0) % AVATAR_COLORS.length] ?? C.primary;

const getInitials = name =>
  name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?';

// ─── SKELETON PULSE ──────────────────────────────────────────────────────────
const SkeletonPulse = ({ style }) => {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1,   duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[style, { opacity: anim, backgroundColor: C.border }]} />;
};

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
const ProfileSkeleton = () => (
  <View style={{ paddingHorizontal: sc(16), paddingTop: sc(8) }}>
    {/* Hero */}
    <View style={{ alignItems: 'center', paddingVertical: sc(24), gap: sc(10) }}>
      <SkeletonPulse style={{ width: sc(90), height: sc(90), borderRadius: sc(45) }} />
      <SkeletonPulse style={{ width: sc(140), height: sc(16), borderRadius: sc(8) }} />
      <SkeletonPulse style={{ width: sc(180), height: sc(12), borderRadius: sc(6) }} />
      <SkeletonPulse style={{ width: sc(90),  height: sc(28), borderRadius: sc(14) }} />
    </View>
    {/* Stats */}
    <View style={{ flexDirection: 'row', gap: sc(8), marginBottom: sc(16) }}>
      {[0,1,2,3].map(i => (
        <SkeletonPulse key={i} style={{ flex: 1, height: sc(72), borderRadius: sc(14) }} />
      ))}
    </View>
    {/* Sub card */}
    <SkeletonPulse style={{ height: sc(72), borderRadius: sc(18), marginBottom: sc(24) }} />
    {/* Sections */}
    {[0,1].map(i => (
      <View key={i} style={{ marginBottom: sc(20) }}>
        <SkeletonPulse style={{ width: sc(60), height: sc(11), borderRadius: sc(6), marginBottom: sc(8) }} />
        <SkeletonPulse style={{ height: sc(140), borderRadius: sc(18) }} />
      </View>
    ))}
  </View>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = React.memo(({ value, label, accent, bg, delay }) => {
  const fadeY = useRef(new Animated.Value(sc(12))).current;
  const fade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 380, delay, useNativeDriver: true }),
      Animated.timing(fadeY, { toValue: 0, duration: 380, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      s.statCard,
      { opacity: fade, transform: [{ translateY: fadeY }] },
    ]}>
      <View style={[s.statIconRow, { backgroundColor: bg }]}>
        <Text style={[s.statValue, { color: accent }]}>{value}</Text>
      </View>
      <Text style={s.statLabel}>{label}</Text>
    </Animated.View>
  );
});

// ─── SETTING ROW ─────────────────────────────────────────────────────────────
const SettingRow = React.memo(({ item, isLast, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () =>
    Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 60 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1,     useNativeDriver: true, speed: 60 }).start();

  return (
    <>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={s.settingRow}
          onPress={() => onPress(item)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          accessibilityRole="button"
          accessibilityLabel={item.label}
        >
          <View style={s.settingIconWrap}>
            <Text style={s.settingIcon}>{item.icon}</Text>
          </View>
          <Text style={s.settingLabel}>{item.label}</Text>
          {item.screen && (
            <View style={s.settingArrowWrap}>
              <Text style={s.settingArrow}>›</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
      {!isLast && <View style={s.settingDivider} />}
    </>
  );
});

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const navigation = useNavigation();

  // ── State ──
  // TODO: Replace MOCK_USER with API fetch result
  // useEffect(() => { fetchProfile(); }, []);
  const [user,    setUser]    = useState(MOCK_USER);
  const [loading, setLoading] = useState(false);   // set true while API fetches
  const [error,   setError]   = useState(null);

  // ── Animations ──
  const scrollY    = useRef(new Animated.Value(0)).current;
  const backScale  = useRef(new Animated.Value(1)).current;

  // Sticky header title
  const stickyOpacity = scrollY.interpolate({
    inputRange:  [sc(90), sc(140)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Hero parallax
  const heroTranslate = scrollY.interpolate({
    inputRange:  [0, sc(200)],
    outputRange: [0, -sc(30)],
    extrapolate: 'clamp',
  });

  // ── TODO: Fetch profile from backend ──────────────────────────────────────
  // const fetchProfile = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const token = await SecureStore.getItemAsync('accessToken');
  //     const res = await fetch('https://your-api.com/api/user/profile', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (!res.ok) throw new Error('Failed to load profile');
  //     const data = await res.json();
  //     setUser(data);
  //   } catch (e) {
  //     setError(e.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // ──────────────────────────────────────────────────────────────────────────

  const handleBack = useCallback(() => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  }, [navigation]);

  const handleSetting = useCallback((item) => {
    if (!item.screen) {
      // e.g. Rate the App
      Alert.alert('Rate Verbify', 'Opening app store…');
      return;
    }
    // TODO: navigation.navigate(item.screen)
    Alert.alert(item.label, 'Coming soon!');
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            // TODO: Backend logout + secure store clear
            // ─────────────────────────────────────────
            // try {
            //   const token = await SecureStore.getItemAsync('accessToken');
            //   await fetch('https://your-api.com/api/auth/logout', {
            //     method: 'POST',
            //     headers: { Authorization: `Bearer ${token}` },
            //   });
            // } catch (_) {}
            // await SecureStore.deleteItemAsync('accessToken');
            // await SecureStore.deleteItemAsync('refreshToken');
            // navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
            // ─────────────────────────────────────────
            Alert.alert('Logged out (TODO: wire backend)');
          },
        },
      ]
    );
  }, []);

  const handleRenew = useCallback(() => {
    // TODO: navigation.navigate('Subscription')
    Alert.alert('Subscription', 'Opening subscription screen…');
  }, []);

  const avatarColor = useMemo(() => getAvatarColor(user?.name), [user?.name]);
  const initials    = useMemo(() => getInitials(user?.name),    [user?.name]);

  // ── Error State ──
  if (error) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.errorWrap}>
          <Text style={s.errorIcon}>⚠️</Text>
          <Text style={s.errorTitle}>Couldn't load profile</Text>
          <Text style={s.errorSub}>{error}</Text>
          <TouchableOpacity
            style={s.retryBtn}
            // onPress={fetchProfile}
            onPress={() => setError(null)}
          >
            <Text style={s.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── STICKY NAVBAR ── */}
      <View style={s.navbar}>
        <Animated.View style={{ transform: [{ scale: backScale }] }}>
          <TouchableOpacity
            onPress={handleBack}
            style={s.navIconBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={s.navBackIcon}>‹</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Fades in as user scrolls past hero */}
        <Animated.Text
          style={[s.navTitle, { opacity: stickyOpacity }]}
          numberOfLines={1}
        >
          {user?.name ?? 'Profile'}
        </Animated.Text>

        <TouchableOpacity
          style={s.navIconBtn}
          onPress={() => handleSetting({ label: 'Edit Profile', screen: 'EditProfile' })}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
        >
          <Text style={s.navEditIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ProfileSkeleton /> : (
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {/* ── HERO ── */}
          <Animated.View style={[s.hero, { transform: [{ translateY: heroTranslate }] }]}>

            {/* Avatar */}
            <View style={s.avatarContainer}>
              <View style={[s.avatarRing, { borderColor: avatarColor + '30' }]}>
                <View style={[s.avatar, { backgroundColor: avatarColor }]}>
                  {user?.avatarUrl
                    ? <Image source={{ uri: user.avatarUrl }} style={s.avatarImg} />
                    : <Text style={s.avatarInitials}>{initials}</Text>
                  }
                </View>
              </View>
              {/* Camera edit button */}
              <TouchableOpacity
                style={s.avatarEditBtn}
                onPress={() => handleSetting({ label: 'Edit Profile', screen: 'EditProfile' })}
                accessibilityLabel="Change profile photo"
              >
                <Text style={s.avatarEditIcon}>📷</Text>
              </TouchableOpacity>
            </View>

            {/* Subscription badge */}
            {user?.subscription?.isActive && (
              <View style={s.planBadge}>
                <Text style={s.planBadgeText}>⭐ {user.subscription.plan}</Text>
              </View>
            )}

            <Text style={s.heroName}>{user?.name}</Text>
            <Text style={s.heroEmail}>{user?.email}</Text>

            <View style={s.heroMetaRow}>
              {user?.phone && (
                <View style={s.heroMetaChip}>
                  <Text style={s.heroMetaChipText}>📱 {user.phone}</Text>
                </View>
              )}
              {user?.targetExam && (
                <View style={[s.heroMetaChip, s.heroMetaChipGreen]}>
                  <Text style={[s.heroMetaChipText, { color: C.primary }]}>
                    🎯 {user.targetExam}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* ── STATS ── */}
          <View style={s.statsRow}>
            <StatCard
              value={`${user?.stats?.streak ?? 0}🔥`}
              label="Streak"
              accent={C.gold}
              bg={C.goldSoft}
              delay={0}
            />
            <StatCard
              value={user?.stats?.testsGiven ?? 0}
              label="Tests"
              accent={C.blue}
              bg={C.blueSoft}
              delay={70}
            />
            <StatCard
              value={`${user?.stats?.avgScore ?? 0}%`}
              label="Avg Score"
              accent={C.correct}
              bg={C.correctBg}
              delay={140}
            />
            <StatCard
              value={`#${user?.stats?.rank ?? '—'}`}
              label="Rank"
              accent={C.purple}
              bg={C.purpleSoft}
              delay={210}
            />
          </View>

          {/* ── SUBSCRIPTION CARD ── */}
          <View style={s.subCard}>
            <View style={s.subLeft}>
              <View style={s.subIconWrap}>
                <Text style={s.subIcon}>💎</Text>
              </View>
              <View>
                <Text style={s.subPlan}>
                  {user?.subscription?.plan ?? 'Free'} Plan
                </Text>
                <Text style={s.subExpiry}>
                  {user?.subscription?.isActive
                    ? `Valid till ${user.subscription.expiresAt}`
                    : 'No active plan'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={s.subBtn}
              onPress={handleRenew}
              activeOpacity={0.85}
            >
              <Text style={s.subBtnText}>
                {user?.subscription?.isActive ? 'Renew' : 'Upgrade'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── SETTINGS ── */}
          {SETTINGS.map(section => (
            <View key={section.title} style={s.section}>
              <Text style={s.sectionTitle}>{section.title}</Text>
              <View style={s.sectionCard}>
                {section.items.map((item, idx) => (
                  <SettingRow
                    key={item.id}
                    item={item}
                    isLast={idx === section.items.length - 1}
                    onPress={handleSetting}
                  />
                ))}
              </View>
            </View>
          ))}

          {/* ── LOGOUT ── */}
          <TouchableOpacity
            style={s.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Text style={s.logoutIcon}>🚪</Text>
            <Text style={s.logoutText}>Log Out</Text>
          </TouchableOpacity>

          {/* ── VERSION ── */}
          <Text style={s.version}>Verbify v1.0.0</Text>

        </Animated.ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // ── Navbar ──────────────────────────────────────────────────────────────────
  navbar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sc(16),
    paddingTop:    Platform.OS === 'android' ? sc(36) : sc(12),
    paddingBottom: sc(10),
    backgroundColor: C.bg,
  },
  navIconBtn: {
    width: sc(38), height: sc(38), borderRadius: sc(12),
    backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  navBackIcon: { fontSize: sc(24), color: C.text, lineHeight: sc(28), marginTop: -sc(1) },
  navEditIcon: { fontSize: sc(16) },
  navTitle: {
    flex: 1, textAlign: 'center',
    fontSize: sc(16), fontWeight: '800',
    color: C.text, letterSpacing: -0.3,
  },

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scroll: { paddingBottom: sc(48) },

  // ── Hero ────────────────────────────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    paddingTop: sc(12), paddingBottom: sc(24),
    paddingHorizontal: sc(20),
  },

  avatarContainer: { position: 'relative', marginBottom: sc(12) },
  avatarRing: {
    width: sc(100), height: sc(100), borderRadius: sc(50),
    borderWidth: sc(3.5),
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: sc(88), height: sc(88), borderRadius: sc(44),
    alignItems: 'center', justifyContent: 'center',
  },
  avatarImg: { width: sc(88), height: sc(88), borderRadius: sc(44) },
  avatarInitials: {
    fontSize: sc(28), fontWeight: '900',
    color: '#fff', letterSpacing: sc(0.5),
  },
  avatarEditBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: sc(28), height: sc(28), borderRadius: sc(9),
    backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  avatarEditIcon: { fontSize: sc(12) },

  planBadge: {
    backgroundColor: C.primary,
    paddingHorizontal: sc(12), paddingVertical: sc(4),
    borderRadius: sc(20), marginBottom: sc(10),
  },
  planBadgeText: { fontSize: sc(11), fontWeight: '800', color: '#fff' },

  heroName: {
    fontSize: sc(22), fontWeight: '900', color: C.text,
    letterSpacing: -0.4, marginBottom: sc(4),
  },
  heroEmail: {
    fontSize: sc(13), color: C.muted, fontWeight: '500',
    marginBottom: sc(14),
  },
  heroMetaRow:      { flexDirection: 'row', gap: sc(8), flexWrap: 'wrap', justifyContent: 'center' },
  heroMetaChip: {
    backgroundColor: C.surface, paddingHorizontal: sc(12), paddingVertical: sc(6),
    borderRadius: sc(20), borderWidth: 1, borderColor: C.border,
  },
  heroMetaChipGreen: { backgroundColor: C.primaryLight, borderColor: C.primaryMid + '40' },
  heroMetaChipText:  { fontSize: sc(12), fontWeight: '600', color: C.sub },

  // ── Stats ────────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: sc(16), gap: sc(8),
    marginBottom: sc(14),
  },
  statCard: {
    flex: 1, backgroundColor: C.surface,
    borderRadius: sc(14), paddingVertical: sc(12),
    alignItems: 'center', gap: sc(6),
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  statIconRow: {
    paddingHorizontal: sc(6), paddingVertical: sc(3),
    borderRadius: sc(8),
  },
  statValue: { fontSize: sc(15), fontWeight: '900', letterSpacing: -0.3 },
  statLabel: { fontSize: sc(10), color: C.muted, fontWeight: '600' },

  // ── Subscription ─────────────────────────────────────────────────────────────
  subCard: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primary,
    marginHorizontal: sc(16), marginBottom: sc(22),
    padding: sc(16), borderRadius: sc(18),
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
  },
  subLeft: { flexDirection: 'row', alignItems: 'center', gap: sc(12) },
  subIconWrap: {
    width: sc(42), height: sc(42), borderRadius: sc(12),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  subIcon:   { fontSize: sc(22) },
  subPlan:   { fontSize: sc(15), fontWeight: '800', color: '#fff' },
  subExpiry: { fontSize: sc(11), color: '#A7C4A7', marginTop: sc(2), fontWeight: '500' },
  subBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: sc(16), paddingVertical: sc(9),
    borderRadius: sc(12),
  },
  subBtnText: { fontSize: sc(13), fontWeight: '800', color: C.primary },

  // ── Settings ─────────────────────────────────────────────────────────────────
  section: { marginHorizontal: sc(16), marginBottom: sc(18) },
  sectionTitle: {
    fontSize: sc(11), fontWeight: '700', color: C.muted,
    letterSpacing: 0.8, marginBottom: sc(8),
    marginLeft: sc(4), textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: C.surface, borderRadius: sc(18),
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },

  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: sc(13), paddingHorizontal: sc(14),
    backgroundColor: C.surface,
  },
  settingIconWrap: {
    width: sc(36), height: sc(36), borderRadius: sc(10),
    backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center',
    marginRight: sc(12),
    borderWidth: 1, borderColor: C.borderLight,
  },
  settingIcon:  { fontSize: sc(16) },
  settingLabel: { flex: 1, fontSize: sc(14), fontWeight: '600', color: C.text },
  settingArrowWrap: {
    width: sc(24), height: sc(24), borderRadius: sc(7),
    backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.borderLight,
  },
  settingArrow: { fontSize: sc(15), color: C.muted, fontWeight: '600' },
  settingDivider: {
    height: 1, backgroundColor: C.borderLight, marginLeft: sc(62),
  },

  // ── Logout ───────────────────────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: sc(8),
    marginHorizontal: sc(16), marginTop: sc(4), marginBottom: sc(16),
    backgroundColor: C.wrongBg, borderRadius: sc(16),
    paddingVertical: sc(15), borderWidth: 1, borderColor: '#FEE2E2',
  },
  logoutIcon: { fontSize: sc(16) },
  logoutText: { fontSize: sc(15), fontWeight: '800', color: C.wrong },

  // ── Version ──────────────────────────────────────────────────────────────────
  version: {
    textAlign: 'center', fontSize: sc(11),
    color: C.muted, fontWeight: '500', marginBottom: sc(8),
  },

  // ── Error State ──────────────────────────────────────────────────────────────
  errorWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: sc(32), gap: sc(10),
  },
  errorIcon:  { fontSize: sc(40) },
  errorTitle: { fontSize: sc(18), fontWeight: '800', color: C.text },
  errorSub:   { fontSize: sc(13), color: C.muted, textAlign: 'center' },
  retryBtn: {
    marginTop: sc(8), backgroundColor: C.primary,
    paddingHorizontal: sc(24), paddingVertical: sc(12),
    borderRadius: sc(12),
  },
  retryText: { fontSize: sc(14), fontWeight: '800', color: '#fff' },
});