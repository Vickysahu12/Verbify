/**
 * VaScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Production-ready | Backend-ready | Consistent with Verbify design system
 *
 * BACKEND INTEGRATION GUIDE:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. VA STATS        → GET /api/practice/va/stats         (Bearer token)
 *    Response: { solved, accuracy, rank, streak,
 *                categories: { paraJumbles, oddOneOut, paraSummary }
 *                  each: { progress, attempted, correct } }
 *
 * 2. DAILY DRILL     → GET /api/practice/va/daily         (Bearer token)
 *    Response: { title, desc, type, questionCount, estimatedMins }
 *
 * 3. START PRACTICE  → POST /api/practice/va/session      (Bearer token)
 *    Body: { category: 'para_jumble'|'odd_one_out'|'para_summary' }
 *    Response: { sessionId, questions[] }
 *
 * 4. START DAILY     → POST /api/practice/va/daily/start  (Bearer token)
 *    Response: { sessionId, questions[] }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar,
  Platform, Dimensions, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
  wrongBg:      '#FEE2E2',
  gold:         '#D97706',
  goldSoft:     '#FEF3C7',
  blue:         '#2563EB',
  blueSoft:     '#EFF6FF',
  purple:       '#7C3AED',
  purpleSoft:   '#EDE9FE',
  shadow:       '#0D1F15',
};

// ─── CATEGORIES CONFIG ───────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id:       'para_jumble',
    title:    'Para Jumbles',
    desc:     'Reorder sentences to form a coherent paragraph.',
    icon:     '🔀',
    accent:   C.purple,
    bg:       C.purpleSoft,
    tip:      'Look for the opening sentence — it sets the context.',
    // TODO: from API → progress, attempted, correct
    progress:  60,
    attempted: 124,
    correct:   88,
  },
  {
    id:       'odd_one_out',
    title:    'Odd One Out',
    desc:     'Identify the sentence that doesnt fit the group.',
    icon:     '🎯',
    accent:   C.blue,
    bg:       C.blueSoft,
    tip:      'Focus on topic, tone, and transition words.',
    progress:  45,
    attempted: 96,
    correct:   61,
  },
  {
    id:       'para_summary',
    title:    'Para Summary',
    desc:     'Condense the paragraph into the best summary.',
    icon:     '📝',
    accent:   C.gold,
    bg:       C.goldSoft,
    tip:      'The correct option captures the central idea — not details.',
    progress:  30,
    attempted: 72,
    correct:   42,
  },
];

// ─── MOCK STATS ───────────────────────────────────────────────────────────────
// TODO: Replace with → GET /api/practice/va/stats
const MOCK_STATS = {
  solved:   450,
  accuracy: 78,
  rank:     '15%',
  streak:   7,
};

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

const VaSkeleton = () => (
  <View style={{ padding: sc(16), gap: sc(16) }}>
    <View style={{ flexDirection: 'row', gap: sc(10) }}>
      {[0,1,2,3].map(i => (
        <SkeletonPulse key={i} style={{ flex: 1, height: sc(88), borderRadius: sc(16) }} />
      ))}
    </View>
    {[0,1,2].map(i => (
      <SkeletonPulse key={i} style={{ height: sc(120), borderRadius: sc(18) }} />
    ))}
    <SkeletonPulse style={{ height: sc(140), borderRadius: sc(20) }} />
  </View>
);

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
const SectionHeader = ({ title, sub }) => (
  <View style={s.sectionHeaderRow}>
    <View style={s.sectionBar} />
    <View>
      <Text style={s.sectionTitle}>{title}</Text>
      {sub && <Text style={s.sectionSub}>{sub}</Text>}
    </View>
  </View>
);

// ─── STAT CARD ───────────────────────────────────────────────────────────────
const StatCard = React.memo(({ label, value, sub, icon, bg, color }) => (
  <View style={[s.statCard, { backgroundColor: bg }]}>
    <Text style={s.statIcon}>{icon}</Text>
    <Text style={[s.statValue, { color }]}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
    <Text style={[s.statSub, { color }]}>{sub}</Text>
  </View>
));

// ─── CATEGORY CARD ───────────────────────────────────────────────────────────
const CategoryCard = React.memo(({ item, onPress }) => {
  const pressScale = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue:  item.progress,
      duration: 900,
      delay:    300,
      useNativeDriver: false,
    }).start();
  }, []);

  const onPressIn  = () =>
    Animated.spring(pressScale, { toValue: 0.97, useNativeDriver: true, speed: 60 }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, { toValue: 1,    useNativeDriver: true, speed: 60 }).start();

  const accuracy = item.attempted > 0
    ? Math.round((item.correct / item.attempted) * 100)
    : 0;

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <TouchableOpacity
        style={s.catCard}
        onPress={() => onPress(item)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        {/* Left accent */}
        <View style={[s.catAccent, { backgroundColor: item.accent }]} />

        <View style={s.catInner}>
          {/* Header row */}
          <View style={s.catTopRow}>
            <View style={[s.catIconWrap, { backgroundColor: item.bg }]}>
              <Text style={s.catIcon}>{item.icon}</Text>
            </View>
            <View style={s.catMeta}>
              <Text style={s.catTitle}>{item.title}</Text>
              <Text style={s.catDesc} numberOfLines={1}>{item.desc}</Text>
            </View>
            {/* Progress % badge */}
            <View style={[s.catProgressBadge, { backgroundColor: item.bg }]}>
              <Text style={[s.catProgressBadgeText, { color: item.accent }]}>
                {item.progress}%
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={s.catProgressBg}>
            <Animated.View style={[
              s.catProgressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100], outputRange: ['0%', '100%'],
                }),
                backgroundColor: item.accent,
              },
            ]} />
          </View>

          {/* Stats row */}
          <View style={s.catStatsRow}>
            <View style={s.catStatItem}>
              <Text style={s.catStatVal}>{item.attempted}</Text>
              <Text style={s.catStatLabel}>Attempted</Text>
            </View>
            <View style={s.catStatDivider} />
            <View style={s.catStatItem}>
              <Text style={s.catStatVal}>{item.correct}</Text>
              <Text style={s.catStatLabel}>Correct</Text>
            </View>
            <View style={s.catStatDivider} />
            <View style={s.catStatItem}>
              <Text style={[s.catStatVal, {
                color: accuracy >= 70 ? C.correct : accuracy >= 50 ? C.gold : C.wrong,
              }]}>
                {accuracy}%
              </Text>
              <Text style={s.catStatLabel}>Accuracy</Text>
            </View>
            {/* CTA arrow */}
            <View style={[s.catArrow, { backgroundColor: item.bg }]}>
              <Text style={[s.catArrowText, { color: item.accent }]}>→</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── CATEGORY DETAIL VIEW ────────────────────────────────────────────────────
const CategoryDetail = ({ item, onBack, onStartPractice }) => {
  const slideAnim = useRef(new Animated.Value(SC_W)).current;
  const SC_W = SW;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0, useNativeDriver: true, speed: 16, bounciness: 4,
    }).start();
  }, []);

  const handleBack = () => {
    Animated.timing(slideAnim, { toValue: SC_W, duration: 220, useNativeDriver: true })
      .start(() => onBack());
  };

  const accuracy = item.attempted > 0
    ? Math.round((item.correct / item.attempted) * 100)
    : 0;

  return (
    <Animated.View style={[s.detailRoot, { transform: [{ translateX: slideAnim }] }]}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Navbar */}
        <View style={s.detailNavbar}>
          <TouchableOpacity
            onPress={handleBack}
            style={s.navBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={s.navBackIcon}>‹</Text>
          </TouchableOpacity>
          <View style={s.navCenter}>
            <Text style={s.detailNavTitle}>{item.title}</Text>
          </View>
          <View style={[s.detailNavBadge, { backgroundColor: item.bg }]}>
            <Text style={[s.detailNavBadgeText, { color: item.accent }]}>
              {item.progress}%
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.detailScroll}
        >
          {/* Hero */}
          <View style={[s.detailHero, { backgroundColor: item.accent }]}>
            <View style={s.detailHeroLeft}>
              <Text style={s.detailHeroEyebrow}>VA PRACTICE</Text>
              <Text style={s.detailHeroTitle}>{item.title}</Text>
              <Text style={s.detailHeroDesc}>{item.desc}</Text>
            </View>
            <View style={[s.detailHeroIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
              <Text style={s.detailHeroIconText}>{item.icon}</Text>
            </View>
          </View>

          {/* Stats cards */}
          <View style={s.detailStatsRow}>
            {[
              { label: 'Attempted', val: item.attempted, icon: '📋' },
              { label: 'Correct',   val: item.correct,   icon: '✅' },
              { label: 'Accuracy',  val: `${accuracy}%`, icon: '🎯' },
            ].map((st, i) => (
              <View key={i} style={s.detailStatCard}>
                <Text style={s.detailStatIcon}>{st.icon}</Text>
                <Text style={[s.detailStatVal, { color: item.accent }]}>{st.val}</Text>
                <Text style={s.detailStatLabel}>{st.label}</Text>
              </View>
            ))}
          </View>

          {/* Progress */}
          <View style={s.detailProgressCard}>
            <View style={s.detailProgressRow}>
              <Text style={s.detailProgressLabel}>Overall Progress</Text>
              <Text style={[s.detailProgressPct, { color: item.accent }]}>
                {item.progress}%
              </Text>
            </View>
            <View style={s.detailProgressBg}>
              <View style={[
                s.detailProgressFill,
                { width: `${item.progress}%`, backgroundColor: item.accent },
              ]} />
            </View>
          </View>

          {/* CAT Tip */}
          <View style={s.detailTipCard}>
            <View style={s.detailTipHeader}>
              <View style={[s.detailTipIcon, { backgroundColor: C.goldSoft }]}>
                <Text>💡</Text>
              </View>
              <View>
                <Text style={s.detailTipEyebrow}>CAT STRATEGY</Text>
                <Text style={s.detailTipTitle}>Key Tip</Text>
              </View>
            </View>
            <Text style={s.detailTipText}>{item.tip}</Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[s.detailCTA, { backgroundColor: item.accent }]}
            activeOpacity={0.88}
            onPress={() => onStartPractice(item)}
            accessibilityLabel={`Start ${item.title} practice`}
          >
            <View>
              <Text style={s.detailCTAEyebrow}>READY?</Text>
              <Text style={s.detailCTATitle}>Start Practice →</Text>
            </View>
            <View style={s.detailCTAIcon}>
              <Text style={s.detailCTAIconText}>{item.icon}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const VaScreen = () => {
  const navigation = useNavigation();

  const [stats,    setStats]    = useState(MOCK_STATS);
  const [loading,  setLoading]  = useState(false);
  const [selected, setSelected] = useState(null);

  const backScale = useRef(new Animated.Value(1)).current;

  // ── TODO: Fetch stats from backend ────────────────────────────────────────
  // useEffect(() => { fetchStats(); }, []);
  // const fetchStats = async () => {
  //   setLoading(true);
  //   try {
  //     const token = await Keychain.getGenericPassword();
  //     const res = await fetch(`${Config.API_BASE_URL}/api/practice/va/stats`, {
  //       headers: { Authorization: `Bearer ${token.password}` },
  //     });
  //     const data = await res.json();
  //     setStats(data);
  //   } catch (e) { console.error(e); }
  //   finally     { setLoading(false); }
  // };
  // ──────────────────────────────────────────────────────────────────────────

  const handleBack = useCallback(() => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  }, [navigation]);

  const handleStartPractice = useCallback((item) => {
    // TODO: POST /api/practice/va/session { category: item.id }
    // navigation.navigate('VaPracticeSession', { sessionId, category: item.id })
    console.log('Start practice:', item.id);
  }, []);

  const handleDailyDrill = useCallback(() => {
    // TODO: POST /api/practice/va/daily/start
    // navigation.navigate('VaPracticeSession', { sessionId, isDaily: true })
    console.log('Start daily drill');
  }, []);

  // ── Detail view ──
  if (selected) {
    return (
      <CategoryDetail
        item={selected}
        onBack={() => setSelected(null)}
        onStartPractice={(item) => {
          setSelected(null);
          handleStartPractice(item);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── NAVBAR ── */}
      <View style={s.navbar}>
        <Animated.View style={{ transform: [{ scale: backScale }] }}>
          <TouchableOpacity
            onPress={handleBack}
            style={s.navBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel="Go back"
          >
            <Text style={s.navBackIcon}>‹</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={s.navCenter}>
          <Text style={s.navTitle}>VA Practice</Text>
          <Text style={s.navSub}>Verbal Ability</Text>
        </View>

        {/* Streak badge */}
        <View style={s.navStreakBadge}>
          <Text style={s.navStreakText}>🔥 {stats.streak}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {loading ? <VaSkeleton /> : (
          <>
            {/* ── STATS ROW ── */}
            <View style={s.statsRow}>
              <StatCard
                icon="✅" label="Solved"
                value={stats.solved} sub="+12 today"
                bg={C.primaryLight} color={C.primary}
              />
              <StatCard
                icon="🎯" label="Accuracy"
                value={`${stats.accuracy}%`} sub="Top 15%"
                bg={C.goldSoft} color={C.gold}
              />
              <StatCard
                icon="🔥" label="Streak"
                value={`${stats.streak}d`} sub="Keep it up!"
                bg={C.correctBg} color={C.correct}
              />
              <StatCard
                icon="🏆" label="Rank"
                value={`${stats.rank}`} sub="This week"
                bg={C.purpleSoft} color={C.purple}
              />
            </View>

            {/* ── CATEGORIES ── */}
            <SectionHeader
              title="Practice Categories"
              sub="Tap a category to start"
            />
            {CATEGORIES.map(item => (
              <CategoryCard
                key={item.id}
                item={item}
                onPress={setSelected}
              />
            ))}

            {/* ── DAILY FOCUS ── */}
            <SectionHeader title="Daily Focus" />
            <TouchableOpacity
              style={s.dailyCard}
              activeOpacity={0.88}
              onPress={handleDailyDrill}
              accessibilityLabel="Start daily drill"
            >
              <View style={s.dailyTop}>
                <View style={s.dailyLeft}>
                  <Text style={s.dailyEyebrow}>TODAY'S DRILL</Text>
                  <Text style={s.dailyTitle}>5-Min Summary Sprint</Text>
                  <Text style={s.dailySub}>
                    High-yield paragraphs curated for CAT VARC speed and clarity.
                  </Text>
                </View>
                <View style={s.dailyIconWrap}>
                  <Text style={s.dailyIcon}>⚡</Text>
                </View>
              </View>

              {/* Meta pills */}
              <View style={s.dailyMetaRow}>
                <View style={s.dailyMetaPill}>
                  <Text style={s.dailyMetaText}>⏱ 5 mins</Text>
                </View>
                <View style={s.dailyMetaPill}>
                  <Text style={s.dailyMetaText}>📝 8 questions</Text>
                </View>
                <View style={s.dailyMetaPill}>
                  <Text style={s.dailyMetaText}>🎯 Mixed</Text>
                </View>
              </View>

              <View style={s.dailyBtn}>
                <Text style={s.dailyBtnText}>Start Now  →</Text>
              </View>
            </TouchableOpacity>

            {/* ── CAT TIP BANNER ── */}
            <View style={s.tipBanner}>
              <View style={s.tipBannerLeft}>
                <Text style={s.tipBannerEyebrow}>💡 CAT TIP</Text>
                <Text style={s.tipBannerText}>
                  In Para Jumbles, always find the mandatory first sentence — it sets the context and makes everything else fall in place.
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={{ height: sc(32) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VaScreen;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // ── Navbar ──────────────────────────────────────────────────────────────────
  navbar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sc(16),
    paddingTop:    Platform.OS === 'android' ? sc(36) : sc(12),
    paddingBottom: sc(12),
    backgroundColor: C.bg,
  },
  navBtn: {
    width: sc(38), height: sc(38), borderRadius: sc(12),
    backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  navBackIcon: { fontSize: sc(24), color: C.text, lineHeight: sc(28), marginTop: -sc(1) },
  navCenter:   { alignItems: 'center' },
  navTitle:    { fontSize: sc(16), fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  navSub:      { fontSize: sc(10), fontWeight: '500', color: C.muted, marginTop: sc(1) },
  navStreakBadge: {
    backgroundColor: C.goldSoft,
    paddingHorizontal: sc(12), paddingVertical: sc(7),
    borderRadius: sc(12), borderWidth: 1, borderColor: '#FDE68A',
  },
  navStreakText: { fontSize: sc(13), fontWeight: '800', color: C.gold },

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scroll: { paddingHorizontal: sc(16), paddingTop: sc(6), paddingBottom: sc(48) },

  // ── Stats Row ───────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row', gap: sc(8), marginBottom: sc(24),
  },
  statCard: {
    flex: 1, borderRadius: sc(14), padding: sc(10),
    alignItems: 'center', gap: sc(2),
    borderWidth: 1, borderColor: C.border,
  },
  statIcon:  { fontSize: sc(16), marginBottom: sc(2) },
  statValue: { fontSize: sc(16), fontWeight: '900', letterSpacing: -0.5 },
  statLabel: { fontSize: sc(9),  fontWeight: '600', color: C.muted },
  statSub:   { fontSize: sc(9),  fontWeight: '700' },

  // ── Section Header ──────────────────────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: sc(8), marginBottom: sc(12), marginTop: sc(4),
  },
  sectionBar:  { width: sc(4), height: sc(18), borderRadius: sc(2), backgroundColor: C.primaryMid },
  sectionTitle:{ fontSize: sc(16), fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  sectionSub:  { fontSize: sc(10), fontWeight: '500', color: C.muted, marginTop: sc(1) },

  // ── Category Card ────────────────────────────────────────────────────────────
  catCard: {
    flexDirection: 'row', backgroundColor: C.surface,
    borderRadius: sc(18), marginBottom: sc(12),
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  catAccent: { width: sc(4), borderRadius: 0 },
  catInner:  { flex: 1, padding: sc(14) },

  catTopRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: sc(10), marginBottom: sc(12),
  },
  catIconWrap: {
    width: sc(42), height: sc(42), borderRadius: sc(13),
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  catIcon: { fontSize: sc(20) },
  catMeta: { flex: 1 },
  catTitle:{ fontSize: sc(14), fontWeight: '800', color: C.text, marginBottom: sc(2) },
  catDesc: { fontSize: sc(11), fontWeight: '500', color: C.muted },

  catProgressBadge: {
    paddingHorizontal: sc(9), paddingVertical: sc(5),
    borderRadius: sc(9),
  },
  catProgressBadgeText: { fontSize: sc(12), fontWeight: '800' },

  catProgressBg: {
    height: sc(5), backgroundColor: C.bg,
    borderRadius: sc(3), marginBottom: sc(12), overflow: 'hidden',
  },
  catProgressFill: { height: '100%', borderRadius: sc(3) },

  catStatsRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  catStatItem:    { flex: 1, alignItems: 'center' },
  catStatVal:     { fontSize: sc(13), fontWeight: '800', color: C.text },
  catStatLabel:   { fontSize: sc(9),  fontWeight: '600', color: C.muted, marginTop: sc(2) },
  catStatDivider: { width: 1, height: sc(24), backgroundColor: C.border, marginHorizontal: sc(4) },
  catArrow: {
    width: sc(28), height: sc(28), borderRadius: sc(8),
    alignItems: 'center', justifyContent: 'center', marginLeft: sc(8),
  },
  catArrowText: { fontSize: sc(14), fontWeight: '800' },

  // ── Daily Card ───────────────────────────────────────────────────────────────
  dailyCard: {
    backgroundColor: C.primary, borderRadius: sc(20),
    padding: sc(18), marginBottom: sc(14),
    shadowColor: C.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 14, elevation: 8,
  },
  dailyTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: sc(14),
  },
  dailyLeft:    { flex: 1, marginRight: sc(12) },
  dailyEyebrow: { fontSize: sc(9), fontWeight: '700', color: '#7BA882', letterSpacing: 1.2, marginBottom: sc(4) },
  dailyTitle:   { fontSize: sc(18), fontWeight: '800', color: '#fff', marginBottom: sc(6), letterSpacing: -0.3 },
  dailySub:     { fontSize: sc(12), color: 'rgba(255,255,255,0.65)', lineHeight: sc(18), fontWeight: '500' },
  dailyIconWrap:{
    width: sc(48), height: sc(48), borderRadius: sc(14),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  dailyIcon: { fontSize: sc(24) },

  dailyMetaRow: { flexDirection: 'row', gap: sc(7), marginBottom: sc(16) },
  dailyMetaPill:{
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: sc(10), paddingVertical: sc(5), borderRadius: sc(20),
  },
  dailyMetaText: { fontSize: sc(11), fontWeight: '700', color: '#fff' },

  dailyBtn: {
    backgroundColor: '#fff', paddingVertical: sc(13),
    borderRadius: sc(12), alignItems: 'center',
  },
  dailyBtnText: { fontSize: sc(14), fontWeight: '800', color: C.primary, letterSpacing: -0.2 },

  // ── Tip Banner ──────────────────────────────────────────────────────────────
  tipBanner: {
    backgroundColor: C.primarySoft,
    borderRadius: sc(16), padding: sc(16),
    borderWidth: 1, borderColor: C.primaryLight,
    flexDirection: 'row', gap: sc(12),
  },
  tipBannerLeft:    { flex: 1 },
  tipBannerEyebrow: { fontSize: sc(11), fontWeight: '800', color: C.primaryMid, marginBottom: sc(6) },
  tipBannerText:    { fontSize: sc(13), lineHeight: sc(20), color: C.sub, fontWeight: '500' },

  // ── Detail View ─────────────────────────────────────────────────────────────
  detailRoot: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.bg, zIndex: 100,
  },
  detailNavbar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sc(16),
    paddingTop:    Platform.OS === 'android' ? sc(36) : sc(12),
    paddingBottom: sc(12),
    backgroundColor: C.bg,
  },
  detailNavTitle:     { fontSize: sc(16), fontWeight: '800', color: C.text },
  detailNavBadge:     { paddingHorizontal: sc(10), paddingVertical: sc(6), borderRadius: sc(10) },
  detailNavBadgeText: { fontSize: sc(12), fontWeight: '800' },
  detailScroll:       { paddingBottom: sc(48) },

  detailHero: {
    margin: sc(16), borderRadius: sc(20), padding: sc(20),
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 14, elevation: 6,
  },
  detailHeroLeft:    { flex: 1, marginRight: sc(12) },
  detailHeroEyebrow: { fontSize: sc(9), fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 1.2, marginBottom: sc(4) },
  detailHeroTitle:   { fontSize: sc(22), fontWeight: '900', color: '#fff', letterSpacing: -0.5, marginBottom: sc(6) },
  detailHeroDesc:    { fontSize: sc(12), color: 'rgba(255,255,255,0.75)', lineHeight: sc(18), fontWeight: '500' },
  detailHeroIcon:    { width: sc(52), height: sc(52), borderRadius: sc(16), alignItems: 'center', justifyContent: 'center' },
  detailHeroIconText:{ fontSize: sc(28) },

  detailStatsRow: {
    flexDirection: 'row', gap: sc(10),
    paddingHorizontal: sc(16), marginBottom: sc(14),
  },
  detailStatCard: {
    flex: 1, backgroundColor: C.surface, borderRadius: sc(16),
    padding: sc(12), alignItems: 'center', gap: sc(4),
    borderWidth: 1, borderColor: C.border,
  },
  detailStatIcon:  { fontSize: sc(18) },
  detailStatVal:   { fontSize: sc(18), fontWeight: '900', letterSpacing: -0.5 },
  detailStatLabel: { fontSize: sc(10), fontWeight: '600', color: C.muted },

  detailProgressCard: {
    backgroundColor: C.surface, marginHorizontal: sc(16),
    marginBottom: sc(14), padding: sc(16), borderRadius: sc(18),
    borderWidth: 1, borderColor: C.border,
  },
  detailProgressRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: sc(10) },
  detailProgressLabel:{ fontSize: sc(13), fontWeight: '700', color: C.text },
  detailProgressPct:  { fontSize: sc(13), fontWeight: '900' },
  detailProgressBg:   { height: sc(8), backgroundColor: C.bg, borderRadius: sc(4), overflow: 'hidden' },
  detailProgressFill: { height: '100%', borderRadius: sc(4) },

  detailTipCard: {
    backgroundColor: C.goldSoft, marginHorizontal: sc(16),
    marginBottom: sc(14), padding: sc(16), borderRadius: sc(18),
    borderWidth: 1, borderColor: '#FDE68A',
  },
  detailTipHeader:  { flexDirection: 'row', alignItems: 'center', gap: sc(10), marginBottom: sc(10) },
  detailTipIcon:    { width: sc(34), height: sc(34), borderRadius: sc(10), alignItems: 'center', justifyContent: 'center' },
  detailTipEyebrow: { fontSize: sc(9), fontWeight: '700', color: C.gold, letterSpacing: 1 },
  detailTipTitle:   { fontSize: sc(14), fontWeight: '800', color: '#92400E' },
  detailTipText:    { fontSize: sc(13), lineHeight: sc(20), color: '#92400E', fontWeight: '500' },

  detailCTA: {
    marginHorizontal: sc(16), padding: sc(18), borderRadius: sc(18),
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
  },
  detailCTAEyebrow: { fontSize: sc(9), fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 1.2, marginBottom: sc(4) },
  detailCTATitle:   { fontSize: sc(16), fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
  detailCTAIcon:    { width: sc(44), height: sc(44), borderRadius: sc(13), backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  detailCTAIconText:{ fontSize: sc(22) },
});