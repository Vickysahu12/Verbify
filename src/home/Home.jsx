/**
 * HomeScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Production-ready | Backend-ready | Consistent with Verbify design system
 *
 * BACKEND INTEGRATION GUIDE:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. USER STATS     → GET /api/user/home-stats      (Bearer token)
 *    Response: { name, dayCount, streak, studyTime, todayProgress,
 *                practiceStats: { vocab, reading, rc, va },
 *                testStats: { rc, vocab, va },
 *                weekActivity: boolean[7] }
 *
 * 2. REFRESH        → Same endpoint, pull-to-refresh
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar,
  RefreshControl, Platform, Animated,
  Dimensions,
} from 'react-native';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
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
  gold:         '#D97706',
  goldSoft:     '#FEF3C7',
  blue:         '#2563EB',
  blueSoft:     '#EFF6FF',
  purple:       '#7C3AED',
  purpleSoft:   '#EDE9FE',
  shadow:       '#0D1F15',
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with → GET /api/user/home-stats
const MOCK_DATA = {
  name:          'Aryan',
  dayCount:      12,
  streak:        5,
  studyTime:     '4h 20m',
  todayProgress: 65,
  practiceStats: {
    vocab:   { done: 10, total: 20 },
    reading: { minutes: 12        },
    rc:      { passages: 2        },
    va:      { types: 'PJ • OOO'  },
  },
  testStats: {
    rc:    { label: 'Not attempted' },
    vocab: { label: 'Avg 62%'       },
    va:    { label: '2 days ago'    },
  },
  weekActivity: [true, true, true, true, true, false, false],
};

// ─── PRACTICE CARDS CONFIG ───────────────────────────────────────────────────
const PRACTICE_ITEMS = [
  {
    id: 'vocab',
    icon: '🔤', title: 'Vocabulary',
    getSubtitle: s => `${s.vocab.done} / ${s.vocab.total} words`,
    screen: 'PracticeMain',
    accent: C.purple, bg: C.purpleSoft,
  },
  {
    id: 'reading',
    icon: '📘', title: 'Reading',
    getSubtitle: s => `${s.reading.minutes} min article`,
    screen: 'PracticeMain',
    accent: C.blue, bg: C.blueSoft,
  },

  
  {
    id: 'rc',
    icon: '📄', title: 'RC Practice',
    getSubtitle: s => `${s.rc.passages} passages`,
    screen: 'PracticeMain',
    accent: C.correct, bg: C.correctBg,
  },
  {
    id: 'va',
    icon: '🧩', title: 'VA Practice',
    getSubtitle: s => s.va.types,
    screen: 'PracticeMain',
    accent: C.gold, bg: C.goldSoft,
  },
];

const TEST_ITEMS = [
  { id: 'rc',    icon: '📖', title: 'RC Test',    screen: 'TestMain'    },
  { id: 'vocab', icon: '📝', title: 'Vocab Test', screen: 'TestMain' },
  { id: 'va',    icon: '🧩', title: 'VA Test',    screen: 'TestMain'    },
];

// ─── SKELETON ────────────────────────────────────────────────────────────────
const SkeletonPulse = ({ style }) => {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1,   duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[{ backgroundColor: C.border, opacity: anim }, style]} />;
};

const HomeSkeleton = () => (
  <View style={{ paddingHorizontal: sc(16), paddingTop: sc(8), gap: sc(16) }}>
    {/* Focus card */}
    <SkeletonPulse style={{ height: sc(160), borderRadius: sc(20) }} />
    {/* Section */}
    <SkeletonPulse style={{ width: sc(80), height: sc(14), borderRadius: sc(7) }} />
    <View style={{ flexDirection: 'row', gap: sc(10) }}>
      {[0,1,2,3].map(i => (
        <SkeletonPulse key={i} style={{ flex: 1, height: sc(96), borderRadius: sc(16) }} />
      ))}
    </View>
    <SkeletonPulse style={{ width: sc(60), height: sc(14), borderRadius: sc(7) }} />
    <View style={{ flexDirection: 'row', gap: sc(10) }}>
      {[0,1,2].map(i => (
        <SkeletonPulse key={i} style={{ flex: 1, height: sc(80), borderRadius: sc(16) }} />
      ))}
    </View>
  </View>
);

// ─── GREETING ────────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return { text: 'Good Night',      emoji: '🌙' };
  if (h < 12) return { text: 'Good Morning',    emoji: '☀️' };
  if (h < 17) return { text: 'Good Afternoon',  emoji: '🌤️' };
  if (h < 21) return { text: 'Good Evening',    emoji: '🌆' };
  return              { text: 'Good Night',      emoji: '🌙' };
};

// ─── PRACTICE CARD ────────────────────────────────────────────────────────────
const PracticeCard = React.memo(({ item, subtitle, onPress, delay }) => {
  const fade  = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(sc(14))).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,   { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 350, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const onPressIn  = () =>
    Animated.spring(pressScale, { toValue: 0.95, useNativeDriver: true, speed: 60 }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, { toValue: 1,    useNativeDriver: true, speed: 60 }).start();

  return (
    <Animated.View style={{
      flex: 1,
      opacity: fade,
      transform: [{ translateY: slideY }, { scale: pressScale }],
    }}>
      <TouchableOpacity
        style={s.practiceCard}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <View style={[s.practiceIconWrap, { backgroundColor: item.bg }]}>
          <Text style={s.practiceIcon}>{item.icon}</Text>
        </View>
        <Text style={s.practiceTitle}>{item.title}</Text>
        <Text style={s.practiceSub} numberOfLines={1}>{subtitle}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── TEST CARD ────────────────────────────────────────────────────────────────
const TestCard = React.memo(({ item, statusLabel, onPress }) => {
  const pressScale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () =>
    Animated.spring(pressScale, { toValue: 0.95, useNativeDriver: true, speed: 60 }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, { toValue: 1,    useNativeDriver: true, speed: 60 }).start();

  const isNotAttempted = statusLabel === 'Not attempted';

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale: pressScale }] }}>
      <TouchableOpacity
        style={s.testCard}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}: ${statusLabel}`}
      >
        <Text style={s.testIcon}>{item.icon}</Text>
        <Text style={s.testTitle}>{item.title}</Text>
        <View style={[
          s.testStatusPill,
          { backgroundColor: isNotAttempted ? C.bg : C.primaryLight },
        ]}>
          <Text style={[
            s.testStatusText,
            { color: isNotAttempted ? C.muted : C.primary },
          ]} numberOfLines={1}>
            {statusLabel}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
const SectionHeader = ({ title, action, onAction }) => (
  <View style={s.sectionHeaderRow}>
    <View style={s.sectionHeaderLeft}>
      <View style={s.sectionHeaderBar} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
    {action && (
      <TouchableOpacity onPress={onAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={s.sectionAction}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const HomeScreen = ({ navigation }) => {
  const [data,      setData]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [error,     setError]     = useState(null);
  const [unreadCount, setUnreadCount] = useState(2); // TODO: from notifications API

  const progressAnim = useRef(new Animated.Value(0)).current;
  const headerFade   = useRef(new Animated.Value(0)).current;

  // ── Load data ──
  const loadData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    try {
      // TODO: Replace with API call
      // ─────────────────────────────────────────────────────────────
      // const token = await Keychain.getGenericPassword();
      // const res = await fetch(`${Config.API_BASE_URL}/api/user/home-stats`, {
      //   headers: { Authorization: `Bearer ${token.password}` },
      // });
      // if (!res.ok) throw new Error('Failed to load');
      // const json = await res.json();
      // setData(json);
      // ─────────────────────────────────────────────────────────────

      // Simulating network delay
      await new Promise(r => setTimeout(r, 600));
      setData(MOCK_DATA);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, []);

  // Animate header fade in
  useEffect(() => {
    if (!loading) {
      Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [loading]);

  // Progress bar animation
  useEffect(() => {
    if (data?.todayProgress != null) {
      Animated.timing(progressAnim, {
        toValue:  data.todayProgress,
        duration: 1000,
        delay:    300,
        useNativeDriver: false,
      }).start();
    }
  }, [data?.todayProgress]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData(true);
  }, [loadData]);

  const handlePractice = useCallback((screen) => {
    navigation.navigate(screen);
  }, [navigation]);

  const handleTest = useCallback((screen) => {
    navigation.navigate(screen);
  }, [navigation]);

  const greeting = getGreeting();

  // ── Error state ──
  if (error && !data) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.errorWrap}>
          <Text style={s.errorIcon}>⚠️</Text>
          <Text style={s.errorTitle}>Couldn't load your data</Text>
          <Text style={s.errorSub}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => loadData()}>
            <Text style={s.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── STICKY HEADER ── */}
      <View style={s.navbar}>
        <Animated.View style={[s.navLeft, { opacity: headerFade }]}>
          <Text style={s.greeting}>
            {greeting.emoji}  {greeting.text},{' '}
            <Text style={s.greetingName}>{data?.name ?? 'there'}</Text>
          </Text>
          <Text style={s.greetingSub}>
            Day {data?.dayCount ?? '—'}  ·  Keep the momentum going
          </Text>
        </Animated.View>

        {/* Notification bell */}
        <TouchableOpacity
          style={s.notifBtn}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.75}
          accessibilityLabel="Notifications"
        >
          <Text style={s.notifIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={s.notifBadge}>
              <Text style={s.notifBadgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── CONTENT ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[C.primary]}
            tintColor={C.primary}
          />
        }
      >
        {loading ? <HomeSkeleton /> : (
          <>
            {/* ── TODAY'S FOCUS CARD ── */}
            <View style={s.focusCard}>
              {/* Header row */}
              <View style={s.focusTopRow}>
                <View>
                  <Text style={s.focusEyebrow}>TODAY'S FOCUS</Text>
                  <Text style={s.focusDesc}>VARC Practice  ·  70 minutes</Text>
                </View>
                <View style={s.focusStreakBadge}>
                  <Text style={s.focusStreakText}>🔥 {data.streak}</Text>
                </View>
              </View>

              {/* Progress */}
              <View style={s.focusProgressSection}>
                <View style={s.focusProgressLabelRow}>
                  <Text style={s.focusProgressLabel}>Progress</Text>
                  <Text style={s.focusProgressPct}>{data.todayProgress}%</Text>
                </View>
                <View style={s.progressBarBg}>
                  <Animated.View style={[
                    s.progressBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange:  [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]} />
                </View>
              </View>

              {/* Stats row */}
              <View style={s.focusMetaRow}>
                <View style={s.focusMetaItem}>
                  <Text style={s.focusMetaVal}>⏱ {data.studyTime}</Text>
                  <Text style={s.focusMetaLabel}>Today</Text>
                </View>
                <View style={s.focusMetaDivider} />
                <View style={s.focusMetaItem}>
                  <Text style={s.focusMetaVal}>🔥 {data.streak} days</Text>
                  <Text style={s.focusMetaLabel}>Streak</Text>
                </View>
                <View style={s.focusMetaDivider} />
                <View style={s.focusMetaItem}>
                  <Text style={s.focusMetaVal}>📅 Day {data.dayCount}</Text>
                  <Text style={s.focusMetaLabel}>Journey</Text>
                </View>
              </View>

              {/* CTA */}
              <TouchableOpacity
                style={s.focusBtn}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('TestInterface')}
                accessibilityRole="button"
                accessibilityLabel="Continue learning"
              >
                <Text style={s.focusBtnText}>Continue Learning  →</Text>
              </TouchableOpacity>
            </View>

            {/* ── PRACTICE ── */}
            <SectionHeader
              title="Practice"
              action="See all"
              onAction={() => navigation.navigate('Practice')}
            />
            <View style={s.practiceGrid}>
              {PRACTICE_ITEMS.map((item, idx) => (
                <PracticeCard
                  key={item.id}
                  item={item}
                  subtitle={item.getSubtitle(data.practiceStats)}
                  onPress={() => handlePractice(item.screen)}
                  delay={idx * 60}
                />
              ))}
            </View>

            {/* ── TESTS ── */}
            <SectionHeader
              title="Tests"
              action="All tests"
              onAction={() => navigation.navigate('TestMain')}
            />
            <View style={s.testGrid}>
              {TEST_ITEMS.map(item => (
                <TestCard
                  key={item.id}
                  item={item}
                  statusLabel={data.testStats[item.id].label}
                  onPress={() => handleTest(item.screen)}
                />
              ))}
            </View>

            {/* ── WEEKLY SNAPSHOT ── */}
            <View style={s.weekCard}>
              <View style={s.weekHeader}>
                <View>
                  <Text style={s.weekEyebrow}>THIS WEEK</Text>
                  <Text style={s.weekTitle}>Activity</Text>
                </View>
                <View style={s.weekStatsRow}>
                  <View style={[s.weekStatPill, { backgroundColor: C.goldSoft }]}>
                    <Text style={[s.weekStatText, { color: C.gold }]}>
                      ⏱ {data.studyTime}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Day dots */}
              <View style={s.weekDaysRow}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                  const active = data.weekActivity[i];
                  const isToday = i === new Date().getDay() - 1;
                  return (
                    <View key={i} style={s.weekDayCol}>
                      <View style={[
                        s.weekDot,
                        active    && s.weekDotActive,
                        isToday   && !active && s.weekDotToday,
                      ]}>
                        {active && <Text style={s.weekDotCheck}>✓</Text>}
                      </View>
                      <Text style={[
                        s.weekDayLabel,
                        active  && { color: C.primary, fontWeight: '700' },
                        isToday && { color: C.primaryMid                 },
                      ]}>
                        {day}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* ── MOCK TEST BANNER ── */}
            <TouchableOpacity
              style={s.mockBanner}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('TestMain')}
              accessibilityRole="button"
              accessibilityLabel="Take a full mock test"
            >
              <View style={s.mockBannerLeft}>
                <Text style={s.mockBannerEyebrow}>READY FOR MORE?</Text>
                <Text style={s.mockBannerTitle}>Take a Full Mock Test</Text>
                <Text style={s.mockBannerSub}>CAT pattern  ·  40 minutes  ·  24 questions</Text>
              </View>
              <View style={s.mockBannerIcon}>
                <Text style={s.mockBannerIconText}>🎯</Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: sc(32) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // ── Navbar ──────────────────────────────────────────────────────────────────
  navbar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sc(18),
    paddingTop:    Platform.OS === 'android' ? sc(36) : sc(12),
    paddingBottom: sc(12),
    backgroundColor: C.bg,
  },
  navLeft:      { flex: 1 },
  greeting:     { fontSize: sc(13), fontWeight: '600', color: C.sub, marginBottom: sc(2) },
  greetingName: { fontSize: sc(13), fontWeight: '800', color: C.text },
  greetingSub:  { fontSize: sc(11), color: C.muted, fontWeight: '500' },

  notifBtn: {
    width: sc(40), height: sc(40), borderRadius: sc(13),
    backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  notifIcon:      { fontSize: sc(17) },
  notifBadge: {
    position: 'absolute', top: sc(-3), right: sc(-3),
    backgroundColor: C.wrong, borderRadius: sc(9),
    minWidth: sc(17), height: sc(17),
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: sc(3),
    borderWidth: 1.5, borderColor: C.bg,
  },
  notifBadgeText: { fontSize: sc(9), fontWeight: '800', color: '#fff' },

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scroll: { paddingHorizontal: sc(16), paddingTop: sc(6), paddingBottom: sc(48) },

  // ── Focus Card ──────────────────────────────────────────────────────────────
  focusCard: {
    backgroundColor: C.primary, borderRadius: sc(22),
    padding: sc(18), marginBottom: sc(24),
    shadowColor: C.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 16, elevation: 8,
  },
  focusTopRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: sc(18),
  },
  focusEyebrow: {
    fontSize: sc(9), fontWeight: '700',
    color: '#7BA882', letterSpacing: 1.2, marginBottom: sc(4),
  },
  focusDesc: { fontSize: sc(17), fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  focusStreakBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: sc(12), paddingVertical: sc(7),
    borderRadius: sc(12),
  },
  focusStreakText: { fontSize: sc(14), fontWeight: '800', color: '#fff' },

  focusProgressSection: { marginBottom: sc(16) },
  focusProgressLabelRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: sc(8),
  },
  focusProgressLabel: { fontSize: sc(11), fontWeight: '600', color: '#7BA882' },
  focusProgressPct:   { fontSize: sc(12), fontWeight: '800', color: '#fff' },
  progressBarBg: {
    height: sc(7), backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: sc(10), overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', backgroundColor: C.primaryMid, borderRadius: sc(10),
  },

  focusMetaRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: sc(14), paddingVertical: sc(12),
    marginBottom: sc(16),
  },
  focusMetaItem:    { flex: 1, alignItems: 'center' },
  focusMetaVal:     { fontSize: sc(12), fontWeight: '700', color: '#fff', marginBottom: sc(2) },
  focusMetaLabel:   { fontSize: sc(9),  fontWeight: '600', color: '#7BA882' },
  focusMetaDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', height: sc(28) },

  focusBtn: {
    backgroundColor: '#fff', paddingVertical: sc(14),
    borderRadius: sc(14), alignItems: 'center',
  },
  focusBtnText: { fontSize: sc(14), fontWeight: '800', color: C.primary, letterSpacing: -0.2 },

  // ── Section Header ──────────────────────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: sc(12),
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: sc(8) },
  sectionHeaderBar:  {
    width: sc(4), height: sc(16), borderRadius: sc(2),
    backgroundColor: C.primaryMid,
  },
  sectionTitle:  { fontSize: sc(16), fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  sectionAction: { fontSize: sc(12), fontWeight: '700', color: C.primaryMid },

  // ── Practice Grid ───────────────────────────────────────────────────────────
  practiceGrid: {
    flexDirection: 'row', gap: sc(10), marginBottom: sc(22),
  },
  practiceCard: {
    flex: 1, backgroundColor: C.surface,
    borderRadius: sc(16), padding: sc(12),
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    alignItems: 'flex-start',
  },
  practiceIconWrap: {
    width: sc(38), height: sc(38), borderRadius: sc(11),
    alignItems: 'center', justifyContent: 'center', marginBottom: sc(8),
  },
  practiceIcon:  { fontSize: sc(18) },
  practiceTitle: { fontSize: sc(12), fontWeight: '800', color: C.text, marginBottom: sc(3) },
  practiceSub:   { fontSize: sc(10), fontWeight: '500', color: C.muted },

  // ── Test Grid ───────────────────────────────────────────────────────────────
  testGrid: {
    flexDirection: 'row', gap: sc(10), marginBottom: sc(22),
  },
  testCard: {
    flex: 1, backgroundColor: C.surface,
    borderRadius: sc(16), padding: sc(12),
    borderWidth: 1, borderColor: C.border,
    alignItems: 'flex-start', gap: sc(4),
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  testIcon:  { fontSize: sc(18) },
  testTitle: { fontSize: sc(12), fontWeight: '800', color: C.text },
  testStatusPill: {
    paddingHorizontal: sc(6), paddingVertical: sc(3),
    borderRadius: sc(7),
  },
  testStatusText: { fontSize: sc(9), fontWeight: '700' },

  // ── Weekly Card ─────────────────────────────────────────────────────────────
  weekCard: {
    backgroundColor: C.surface, borderRadius: sc(20),
    padding: sc(16), marginBottom: sc(14),
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  weekHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: sc(16),
  },
  weekEyebrow: {
    fontSize: sc(9), fontWeight: '700', color: C.muted,
    letterSpacing: 1.1, marginBottom: sc(3),
  },
  weekTitle:    { fontSize: sc(15), fontWeight: '800', color: C.text },
  weekStatsRow: { flexDirection: 'row', gap: sc(6) },
  weekStatPill: {
    paddingHorizontal: sc(10), paddingVertical: sc(5), borderRadius: sc(10),
  },
  weekStatText: { fontSize: sc(12), fontWeight: '700' },

  weekDaysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekDayCol:  { alignItems: 'center', gap: sc(6) },
  weekDot: {
    width: sc(34), height: sc(34), borderRadius: sc(11),
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  weekDotActive: {
    backgroundColor: C.primary, borderColor: C.primary,
  },
  weekDotToday: {
    borderColor: C.primaryMid, borderWidth: 2,
    borderStyle: 'dashed',
  },
  weekDotCheck:  { fontSize: sc(13), color: '#fff', fontWeight: '800' },
  weekDayLabel:  { fontSize: sc(10), fontWeight: '600', color: C.muted },

  // ── Mock Banner ─────────────────────────────────────────────────────────────
  mockBanner: {
    backgroundColor: C.primarySoft,
    borderRadius: sc(20), padding: sc(18),
    borderWidth: 1, borderColor: C.primaryLight,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  mockBannerLeft:    { flex: 1 },
  mockBannerEyebrow: {
    fontSize: sc(9), fontWeight: '700', color: C.primaryMid,
    letterSpacing: 1.1, marginBottom: sc(4),
  },
  mockBannerTitle: { fontSize: sc(16), fontWeight: '900', color: C.primary, marginBottom: sc(4) },
  mockBannerSub:   { fontSize: sc(11), fontWeight: '500', color: C.sub },
  mockBannerIcon: {
    width: sc(52), height: sc(52), borderRadius: sc(16),
    backgroundColor: C.primaryLight, alignItems: 'center',
    justifyContent: 'center', marginLeft: sc(12),
  },
  mockBannerIconText: { fontSize: sc(26) },

  // ── Error ────────────────────────────────────────────────────────────────────
  errorWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: sc(32), gap: sc(10),
  },
  errorIcon:  { fontSize: sc(40) },
  errorTitle: { fontSize: sc(18), fontWeight: '800', color: C.text },
  errorSub:   { fontSize: sc(13), color: C.muted, textAlign: 'center' },
  retryBtn: {
    marginTop: sc(8), backgroundColor: C.primary,
    paddingHorizontal: sc(24), paddingVertical: sc(12), borderRadius: sc(12),
  },
  retryText: { fontSize: sc(14), fontWeight: '800', color: '#fff' },
});