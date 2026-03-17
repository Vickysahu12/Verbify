/**
 * NotificationScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Production-ready | Backend-ready | Consistent with Verbify design system
 *
 * BACKEND INTEGRATION GUIDE:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. FETCH ALL      → GET   /api/notifications          (Bearer token)
 *    Response: { notifications: Notification[], unreadCount: number }
 *
 * 2. MARK ONE READ  → PATCH /api/notifications/:id/read  (Bearer token)
 *
 * 3. MARK ALL READ  → POST  /api/notifications/read-all  (Bearer token)
 *
 * 4. DISMISS ONE   → DELETE /api/notifications/:id       (Bearer token)
 *
 * Notification shape:
 * {
 *   id: string, category: 'mock'|'study'|'achievement'|'update',
 *   icon: string (emoji), title: string, desc: string,
 *   time: string, unread: boolean, actionScreen?: string
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
  useState, useCallback, useRef, useMemo, useEffect,
} from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView, StatusBar,
  Dimensions, Platform, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

// ─── DESIGN TOKENS — same as entire app ──────────────────────────────────────
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
  wrong:        '#DC2626',
  wrongBg:      '#FEE2E2',
  gold:         '#D97706',
  goldSoft:     '#FEF3C7',
  blue:         '#2563EB',
  blueSoft:     '#EFF6FF',
  purple:       '#7C3AED',
  purpleSoft:   '#EDE9FE',
  green:        '#059669',
  greenSoft:    '#ECFDF5',
  shadow:       '#0D1F15',
};

// ─── CATEGORY CONFIG ─────────────────────────────────────────────────────────
const CAT = {
  mock:        { label: 'Mock Tests',   accent: C.blue,   bg: C.blueSoft,   emoji: '🧪' },
  study:       { label: 'Study',        accent: C.gold,   bg: C.goldSoft,   emoji: '📚' },
  achievement: { label: 'Achievements', accent: C.purple, bg: C.purpleSoft, emoji: '🏆' },
  update:      { label: 'Updates',      accent: C.green,  bg: C.greenSoft,  emoji: '✨' },
};

// ─── TABS ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'all',         label: 'All'         },
  { key: 'unread',      label: 'Unread'      },
  { key: 'mock',        label: '🧪 Mocks'    },
  { key: 'study',       label: '📚 Study'    },
  { key: 'achievement', label: '🏆 Awards'   },
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with → GET /api/notifications
const MOCK_NOTIFICATIONS = [
  {
    id: 'n1', category: 'mock', icon: '📘',
    title: 'VARC Sectional Mock 12 Live',
    desc: 'New reading comprehension focus test is now available. Time: 40 mins.',
    time: '10 min ago', unread: true, actionScreen: 'TestInterface',
  },
  {
    id: 'n2', category: 'mock', icon: '📊',
    title: 'Results: Full Mock #08',
    desc: 'Your performance analysis is ready. View your rank and breakdown now.',
    time: 'Yesterday', unread: false, actionScreen: 'ResultScreen',
  },
  {
    id: 'n3', category: 'study', icon: '⏰',
    title: 'Daily Vocab Practice',
    desc: "Don't break your streak! Spend 10 mins on hard words.",
    time: '2 hrs ago', unread: true, actionScreen: 'VocabLearning',
  },
  {
    id: 'n4', category: 'study', icon: '📝',
    title: 'Review Incorrect Answers',
    desc: 'You have 15 pending questions from your last session.',
    time: 'Yesterday', unread: false, actionScreen: null,
  },
  {
    id: 'n5', category: 'achievement', icon: '🏆',
    title: '7-Day Streak Achieved!',
    desc: "You've practiced 7 days in a row. Keep the momentum going!",
    time: '3 hrs ago', unread: true, actionScreen: null,
  },
  {
    id: 'n6', category: 'achievement', icon: '🎯',
    title: 'Top 10% This Week',
    desc: 'You ranked in the top 10% of all mock test takers this week.',
    time: '2 days ago', unread: false, actionScreen: null,
  },
  {
    id: 'n7', category: 'update', icon: '✨',
    title: 'New: Solution Explanations',
    desc: 'Detailed expert solutions are now live for all VARC mocks.',
    time: '2 days ago', unread: false, actionScreen: null,
  },
  {
    id: 'n8', category: 'update', icon: '🚀',
    title: 'App Updated to v1.0',
    desc: 'Faster performance, new article reader, and several bug fixes.',
    time: '3 days ago', unread: false, actionScreen: null,
  },
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

const NotificationSkeleton = () => (
  <View style={{ paddingHorizontal: sc(16), paddingTop: sc(14), gap: sc(16) }}>
    {[0, 1].map(g => (
      <View key={g}>
        <SkeletonPulse style={{ width: sc(90), height: sc(22), borderRadius: sc(11), marginBottom: sc(10) }} />
        <View style={{ backgroundColor: C.surface, borderRadius: sc(18), overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
          {[0, 1, 2].map((i, _, arr) => (
            <View key={i}>
              <View style={{ flexDirection: 'row', padding: sc(14), gap: sc(12), alignItems: 'center' }}>
                <SkeletonPulse style={{ width: sc(42), height: sc(42), borderRadius: sc(13) }} />
                <View style={{ flex: 1, gap: sc(8) }}>
                  <SkeletonPulse style={{ width: '70%', height: sc(12), borderRadius: sc(6) }} />
                  <SkeletonPulse style={{ width: '90%', height: sc(10), borderRadius: sc(5) }} />
                  <SkeletonPulse style={{ width: sc(60), height: sc(9),  borderRadius: sc(4) }} />
                </View>
              </View>
              {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: C.borderLight, marginLeft: sc(68) }} />}
            </View>
          ))}
        </View>
      </View>
    ))}
  </View>
);

// ─── NOTIFICATION CARD ────────────────────────────────────────────────────────
const NotificationCard = React.memo(({ item, onPress, onDismiss, isLast }) => {
  const pressScale = useRef(new Animated.Value(1)).current;
  const slideX     = useRef(new Animated.Value(0)).current;
  const fadeOut    = useRef(new Animated.Value(1)).current;

  const cat = CAT[item.category] ?? { accent: C.muted, bg: C.bg, emoji: '🔔' };

  const onPressIn  = () =>
    Animated.spring(pressScale, { toValue: 0.978, useNativeDriver: true, speed: 60 }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, speed: 60 }).start();

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideX,   { toValue: SW,  duration: 240, useNativeDriver: true }),
      Animated.timing(fadeOut,  { toValue: 0,   duration: 220, useNativeDriver: true }),
    ]).start(() => onDismiss(item.id));
  };

  return (
    <Animated.View style={{
      transform: [{ scale: pressScale }, { translateX: slideX }],
      opacity: fadeOut,
    }}>
      <TouchableOpacity
        style={[s.card, item.unread && s.cardUnread]}
        onPress={() => onPress(item)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        {/* Unread left accent bar */}
        {item.unread && (
          <View style={[s.unreadBar, { backgroundColor: cat.accent }]} />
        )}

        {/* Icon box */}
        <View style={[s.iconBox, { backgroundColor: cat.bg }]}>
          <Text style={s.iconEmoji}>{item.icon}</Text>
        </View>

        {/* Body */}
        <View style={s.cardBody}>
          <View style={s.titleRow}>
            <Text
              style={[s.cardTitle, item.unread && s.cardTitleUnread]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {item.unread && (
              <View style={[s.unreadDot, { backgroundColor: cat.accent }]} />
            )}
          </View>

          <Text style={s.cardDesc} numberOfLines={2}>{item.desc}</Text>

          <View style={s.cardFooter}>
            <Text style={s.cardTime}>{item.time}</Text>
            {item.actionScreen && (
              <View style={[s.actionPill, { backgroundColor: cat.bg }]}>
                <Text style={[s.actionText, { color: cat.accent }]}>View →</Text>
              </View>
            )}
          </View>
        </View>

        {/* Dismiss button */}
        <TouchableOpacity
          onPress={handleDismiss}
          style={s.dismissBtn}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 8 }}
          accessibilityLabel="Dismiss notification"
        >
          <View style={s.dismissWrap}>
            <Text style={s.dismissIcon}>✕</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>

      {!isLast && (
        <View style={s.cardDivider} />
      )}
    </Animated.View>
  );
});

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
const EmptyState = ({ tab }) => (
  <View style={s.emptyWrap}>
    <View style={s.emptyIconWrap}>
      <Text style={s.emptyEmoji}>
        {tab === 'unread' ? '✅' : '🔔'}
      </Text>
    </View>
    <Text style={s.emptyTitle}>
      {tab === 'unread' ? 'All caught up!' : 'Nothing here'}
    </Text>
    <Text style={s.emptyDesc}>
      {tab === 'unread'
        ? "You've read all your notifications."
        : 'No notifications in this category yet.'}
    </Text>
  </View>
);

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function NotificationScreen() {
  const navigation = useNavigation();

  // ── State ──
  // TODO: Replace MOCK_NOTIFICATIONS with API fetch
  // useEffect(() => { fetchNotifications(); }, []);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab,     setActiveTab]     = useState('all');
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);

  // ── Animations ──
  const backScale = useRef(new Animated.Value(1)).current;

  // ── TODO: Fetch from backend ───────────────────────────────────────────────
  // const fetchNotifications = async () => {
  //   setLoading(true); setError(null);
  //   try {
  //     const token = await SecureStore.getItemAsync('accessToken');
  //     const res = await fetch('https://your-api.com/api/notifications', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (!res.ok) throw new Error('Failed to load notifications');
  //     const data = await res.json();
  //     setNotifications(data.notifications);
  //   } catch (e) { setError(e.message); }
  //   finally     { setLoading(false); }
  // };
  // ──────────────────────────────────────────────────────────────────────────

  const unreadCount = useMemo(
    () => notifications.filter(n => n.unread).length,
    [notifications]
  );

  // ── Filtered list ──
  const filtered = useMemo(() => {
    if (activeTab === 'all')    return notifications;
    if (activeTab === 'unread') return notifications.filter(n => n.unread);
    return notifications.filter(n => n.category === activeTab);
  }, [notifications, activeTab]);

  // ── Grouped (only for 'all' tab) ──
  const groups = useMemo(() => {
    if (activeTab !== 'all') {
      return [{ category: null, items: filtered }];
    }
    const map = {};
    filtered.forEach(n => {
      if (!map[n.category]) map[n.category] = [];
      map[n.category].push(n);
    });
    return ['mock', 'study', 'achievement', 'update']
      .filter(cat => map[cat])
      .map(cat => ({ category: cat, items: map[cat] }));
  }, [filtered, activeTab]);

  // ── Handlers ──
  const handleBack = useCallback(() => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]).start(() => navigation.goBack());
  }, [navigation]);

  const handleMarkAllRead = useCallback(() => {
    // TODO: POST /api/notifications/read-all
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  const handlePress = useCallback((item) => {
    // TODO: PATCH /api/notifications/:id/read
    setNotifications(prev =>
      prev.map(n => n.id === item.id ? { ...n, unread: false } : n)
    );
    if (item.actionScreen) {
      navigation.navigate(item.actionScreen);
    }
  }, [navigation]);

  const handleDismiss = useCallback((id) => {
    // TODO: DELETE /api/notifications/:id
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // ── Error state ──
  if (error) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.errorWrap}>
          <Text style={s.errorIcon}>⚠️</Text>
          <Text style={s.errorTitle}>Couldn't load notifications</Text>
          <Text style={s.errorSub}>{error}</Text>
          <TouchableOpacity
            style={s.retryBtn}
            onPress={() => setError(null)} // TODO: onPress={fetchNotifications}
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

      {/* ── NAVBAR ── */}
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

        <View style={s.navCenter}>
          <Text style={s.navTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={s.navBadge}>
              <Text style={s.navBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {/* Settings shortcut */}
        <TouchableOpacity
          style={s.navIconBtn}
          onPress={() => navigation.navigate('Notifications')} // NotificationSettings
          accessibilityLabel="Notification settings"
        >
          <Text style={s.navSettingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* ── TABS ── */}
      <View style={s.tabsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabsContent}
        >
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            const cat    = CAT[tab.key];
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  s.tab,
                  active && s.tabActive,
                  active && cat && { backgroundColor: cat.accent },
                ]}
                activeOpacity={0.75}
              >
                <Text style={[s.tabText, active && s.tabTextActive]}>
                  {tab.label}
                  {tab.key === 'unread' && unreadCount > 0
                    ? `  ${unreadCount}` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── CONTENT ── */}
      {loading ? <NotificationSkeleton /> : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
        >
          {/* Mark all read bar */}
          {unreadCount > 0 && (
            <View style={s.markAllRow}>
              <View style={s.markAllLeft}>
                <View style={s.markAllDot} />
                <Text style={s.markAllCount}>{unreadCount} unread</Text>
              </View>
              <TouchableOpacity
                onPress={handleMarkAllRead}
                style={s.markAllBtn}
                activeOpacity={0.7}
              >
                <Text style={s.markAllBtnText}>Mark all read</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Empty state */}
          {filtered.length === 0 && <EmptyState tab={activeTab} />}

          {/* Notification groups */}
          {groups.map(({ category, items }) => {
            const meta = category ? CAT[category] : null;
            return (
              <View key={category ?? 'flat'} style={s.group}>

                {/* Category pill — only in 'all' tab */}
                {meta && (
                  <View style={s.catPillRow}>
                    <View style={[s.catPill, { backgroundColor: meta.bg }]}>
                      <Text style={s.catPillEmoji}>{meta.emoji}</Text>
                      <Text style={[s.catPillText, { color: meta.accent }]}>
                        {meta.label}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Cards container */}
                <View style={s.cardGroup}>
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
            );
          })}

          <View style={{ height: sc(32) }} />
        </ScrollView>
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
  navBackIcon:     { fontSize: sc(24), color: C.text, lineHeight: sc(28), marginTop: -sc(1) },
  navSettingsIcon: { fontSize: sc(16) },
  navCenter: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: sc(7),
  },
  navTitle:     { fontSize: sc(17), fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  navBadge: {
    backgroundColor: C.wrong, borderRadius: sc(9),
    minWidth: sc(18), height: sc(18),
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: sc(4),
  },
  navBadgeText: { fontSize: sc(10), fontWeight: '800', color: '#fff' },

  // ── Tabs ────────────────────────────────────────────────────────────────────
  tabsWrap: {
    backgroundColor: C.surface,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  tabsContent: {
    paddingHorizontal: sc(16), paddingVertical: sc(10), gap: sc(7),
  },
  tab: {
    paddingHorizontal: sc(14), paddingVertical: sc(7),
    borderRadius: sc(20),
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
  },
  tabActive: { backgroundColor: C.primary, borderColor: 'transparent' },
  tabText:       { fontSize: sc(12), fontWeight: '600', color: C.muted },
  tabTextActive: { color: '#fff', fontWeight: '700' },

  // ── List ────────────────────────────────────────────────────────────────────
  listContent: { paddingTop: sc(14), paddingBottom: sc(48) },

  // ── Mark all read ────────────────────────────────────────────────────────────
  markAllRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: sc(16), marginBottom: sc(12),
    backgroundColor: C.surface,
    borderRadius: sc(12), padding: sc(12),
    borderWidth: 1, borderColor: C.border,
  },
  markAllLeft: { flexDirection: 'row', alignItems: 'center', gap: sc(7) },
  markAllDot:  { width: sc(7), height: sc(7), borderRadius: sc(4), backgroundColor: C.wrong },
  markAllCount:{ fontSize: sc(12), fontWeight: '600', color: C.sub },
  markAllBtn: {
    backgroundColor: C.primaryLight, paddingHorizontal: sc(12), paddingVertical: sc(6),
    borderRadius: sc(8),
  },
  markAllBtnText: { fontSize: sc(12), fontWeight: '800', color: C.primary },

  // ── Group ────────────────────────────────────────────────────────────────────
  group: { marginBottom: sc(16), paddingHorizontal: sc(16) },

  catPillRow: { marginBottom: sc(8) },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: sc(5),
    paddingHorizontal: sc(10), paddingVertical: sc(5),
    borderRadius: sc(20), alignSelf: 'flex-start',
  },
  catPillEmoji: { fontSize: sc(11) },
  catPillText:  { fontSize: sc(11), fontWeight: '700', letterSpacing: 0.2 },

  // ── Card group ────────────────────────────────────────────────────────────────
  cardGroup: {
    backgroundColor: C.surface,
    borderRadius: sc(18), overflow: 'hidden',
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },

  // ── Card ────────────────────────────────────────────────────────────────────
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surface,
    paddingVertical: sc(13), paddingRight: sc(12), paddingLeft: sc(14),
  },
  cardUnread: { backgroundColor: C.primarySoft },

  unreadBar: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: sc(3),
  },

  iconBox: {
    width: sc(42), height: sc(42), borderRadius: sc(13),
    alignItems: 'center', justifyContent: 'center',
    marginRight: sc(12), flexShrink: 0,
  },
  iconEmoji: { fontSize: sc(19) },

  cardBody:   { flex: 1 },
  titleRow:   { flexDirection: 'row', alignItems: 'center', gap: sc(6), marginBottom: sc(3) },
  cardTitle: {
    flex: 1, fontSize: sc(13), fontWeight: '600', color: C.sub,
  },
  cardTitleUnread: { fontWeight: '800', color: C.text },
  unreadDot: {
    width: sc(7), height: sc(7), borderRadius: sc(4), flexShrink: 0,
  },
  cardDesc: {
    fontSize: sc(12), color: C.muted, lineHeight: sc(17), marginBottom: sc(6),
  },
  cardFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  cardTime: { fontSize: sc(11), color: C.muted, fontWeight: '500' },
  actionPill: {
    paddingHorizontal: sc(8), paddingVertical: sc(3), borderRadius: sc(7),
  },
  actionText: { fontSize: sc(11), fontWeight: '800' },

  dismissBtn: { paddingLeft: sc(8), paddingVertical: sc(6) },
  dismissWrap: {
    width: sc(22), height: sc(22), borderRadius: sc(7),
    backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.borderLight,
  },
  dismissIcon: { fontSize: sc(9), color: C.muted, fontWeight: '700' },

  cardDivider: { height: 1, backgroundColor: C.borderLight, marginLeft: sc(68) },

  emptyWrap: { alignItems: 'center', paddingTop: sc(72), paddingHorizontal: sc(40), gap: sc(10) },
  emptyIconWrap: {
    width: sc(72), height: sc(72), borderRadius: sc(22),
    backgroundColor: C.primaryLight, alignItems: 'center',
    justifyContent: 'center', marginBottom: sc(6),
  },
  emptyEmoji: { fontSize: sc(32) },
  emptyTitle: { fontSize: sc(17), fontWeight: '800', color: C.text, textAlign: 'center' },
  emptyDesc:  { fontSize: sc(13), color: C.muted,  lineHeight: sc(20), textAlign: 'center', fontWeight: '500' },

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