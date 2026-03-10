/**
 * MockListScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * FIXES:
 * - paddingTop defined twice in navbar (Platform.OS one + hardcoded 35) → removed
 * - SafeAreaView imported from react-native-safe-area-context (not react-native)
 * - sc() responsive scaling added throughout
 * - Navbar title absolutely centered (consistent with rest of app)
 * ─────────────────────────────────────────────────────────────────────────────
 * BACKEND: Replace MOCK_DATA with → GET /mocks/  (Bearer token)
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MockCard from './componentss/MockCard';
import CategoryFilter from './componentss/CategoryFilters';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  primary:     '#1F3B1F',
  surface:     '#FFFFFF',
  surfaceAlt:  '#FFFFFF',
  border:      '#E0EDE6',
  borderLight: '#EEF6F1',
  textPrimary: '#0D1F15',
  textMuted:   '#9DB5A5',
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with → GET /mocks/  (Bearer token)
const MOCK_DATA = [
  {
    id: '1',
    title: 'CAT Full Mock #1',
    subtitle: 'VARC',
    type: 'full',
    questions: 76,
    duration: '120 min',
    attempts: '1.2k',
    badge: 'hot',
    icon: '🔥',
    isAttempted: true,
    lastScore: 127,
    maxScore: 228,
    difficulty: 'Hard',
  },
  {
    id: '2',
    title: 'CAT Full Mock #2',
    subtitle: 'VARC',
    type: 'full',
    questions: 76,
    duration: '120 min',
    attempts: '980',
    badge: null,
    icon: '📋',
    isAttempted: false,
    maxScore: 228,
    difficulty: 'Hard',
  },
  {
    id: '3',
    title: 'Half Length Mock #1',
    subtitle: 'VARC',
    type: 'half',
    questions: 38,
    duration: '60 min',
    attempts: '2.1k',
    badge: 'hot',
    icon: '⚡',
    isAttempted: true,
    lastScore: 72,
    maxScore: 114,
    difficulty: 'Medium',
  },
  {
    id: '4',
    title: 'Half Length Mock #3',
    subtitle: 'VARC Focus',
    type: 'half',
    questions: 38,
    duration: '60 min',
    attempts: null,
    badge: 'new',
    icon: '⚡',
    isAttempted: false,
    maxScore: 114,
    difficulty: 'Medium',
  },
  {
    id: '5',
    title: 'RC — Inference Questions',
    subtitle: 'Reading Comprehension',
    type: 'topic',
    questions: 20,
    duration: '30 min',
    attempts: '3.4k',
    badge: null,
    icon: '📖',
    topics: ['RC', 'Inference'],
    isAttempted: false,
    maxScore: 60,
    difficulty: 'Medium',
  },
  {
    id: '6',
    title: 'Para Jumbles',
    subtitle: 'Verbal Ability',
    type: 'topic',
    questions: 15,
    duration: '20 min',
    attempts: '2.8k',
    badge: null,
    icon: '🔀',
    topics: ['VA', 'Para Jumbles'],
    isAttempted: true,
    lastScore: 30,
    maxScore: 45,
    difficulty: 'Easy',
  },
  {
    id: '9',
    title: 'Vocab',
    subtitle: 'Vocabulary',
    type: 'topic',
    questions: 15,
    duration: '20 min',
    attempts: '2.8k',
    badge: null,
    icon: '🔀',
    topics: ['Vocabulary', 'Vocab'],
    isAttempted: true,
    lastScore: 30,
    maxScore: 45,
    difficulty: 'Easy',
  },
  {
    id: '7',
    title: 'Summary Questions',
    subtitle: 'Verbal Ability',
    type: 'topic',
    questions: 15,
    duration: '20 min',
    attempts: '1.9k',
    badge: 'new',
    icon: '📝',
    topics: ['VA', 'Summary'],
    isAttempted: false,
    maxScore: 45,
    difficulty: 'Easy',
  },
  {
    id: '8',
    title: 'CAT Full Mock #3',
    subtitle: 'VARC',
    type: 'full',
    questions: 76,
    duration: '120 min',
    attempts: null,
    badge: 'locked',
    icon: '🔒',
    isAttempted: false,
    maxScore: 228,
    difficulty: 'Hard',
  },
];

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const MockListScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered =
    activeFilter === 'all'
      ? MOCK_DATA
      : MOCK_DATA.filter(m => m.type === activeFilter);

  const counts = {
    all:   MOCK_DATA.length,
    full:  MOCK_DATA.filter(m => m.type === 'full').length,
    half:  MOCK_DATA.filter(m => m.type === 'half').length,
    topic: MOCK_DATA.filter(m => m.type === 'topic').length,
  };

  const handleStartTest = item => {
    navigation?.navigate('MockDetail', { mockId: item.id });
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* ── NAVBAR ── */}
      <View style={s.navbar}>
        {/* Back btn — fixed width so title stays centered */}
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={s.backIconWrap}>
            <Text style={s.backIcon}>‹</Text>
          </View>
        </TouchableOpacity>

        {/* ✅ Absolutely centered title — not affected by back btn width */}
        <View style={s.navCenter} pointerEvents="none">
          <Text style={s.navTitle}>Mock Tests</Text>
        </View>

        {/* Right spacer — same width as back btn to balance */}
        <View style={s.navRight} />
      </View>

      {/* ── CATEGORY FILTER (sticky — outside FlatList) ── */}
      <CategoryFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {/* ── SCROLLABLE LIST ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <MockCard item={item} onPress={handleStartTest} index={index} />
        )}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: sc(14) }} />}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Text style={s.emptyIcon}>🔍</Text>
            <Text style={s.emptyTitle}>No tests found</Text>
            <Text style={s.emptySubtitle}>Try a different category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surfaceAlt },

  // ── Navbar ──
  // ✅ FIX: paddingTop was defined TWICE before:
  //    Platform.OS === 'android' ? 14 : 8  AND  paddingTop: 35  (second one won)
  //    Now SafeAreaView edges={['top']} handles status bar — uniform sc(10) here
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface,
    paddingHorizontal: sc(16),
    paddingTop:    sc(10),
    paddingBottom: sc(12),
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: sc(36),
    alignItems: 'flex-start',
    zIndex: 1,
  },
  backIconWrap: {
    width: sc(34), height: sc(34),
    borderRadius: sc(10),
    backgroundColor: C.surfaceAlt,
    borderWidth: 1, borderColor: C.border,
    justifyContent: 'center', alignItems: 'center',
  },
  backIcon: {
    fontSize: sc(22), color: C.textPrimary,
    lineHeight: sc(26), marginTop: -sc(1),
  },

  // Absolutely centered title — mathematically center, works on all screen sizes
  navCenter: {
    position: 'absolute',
    left: 0, right: 0,
    alignItems: 'center',
  },
  navTitle: {
    fontSize: sc(17), fontWeight: '800',
    color: C.textPrimary, letterSpacing: -0.3,
  },

  navRight: { width: sc(36), zIndex: 1 },

  // ── List ──
  listContent: {
    paddingHorizontal: sc(16),
    paddingTop: sc(16),
    paddingBottom: sc(40),
  },

  // ── Empty state ──
  emptyWrap: {
    alignItems: 'center',
    paddingTop: sc(80),
  },
  emptyIcon:     { fontSize: sc(38), marginBottom: sc(12) },
  emptyTitle:    { fontSize: sc(16), fontWeight: '700', color: C.textPrimary, marginBottom: sc(4) },
  emptySubtitle: { fontSize: sc(13), color: C.textMuted, fontWeight: '500' },
});

export default MockListScreen;