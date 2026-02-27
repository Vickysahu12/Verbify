import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import MockCard from './componentss/MockCard';
import CategoryFilter from './componentss/CategoryFilters';

// ─── THEME ───────────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#1F3B1F',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F8F5',
  border: '#E0EDE6',
  textPrimary: '#0D1F15',
  textMuted: '#9DB5A5',
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// TODO: Replace with API call — GET /mocks/
const MOCK_DATA = [
  {
    id: '1',
    title: 'CAT Full Mock #1',
    subtitle: 'VARC · DILR · Quant',
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
    subtitle: 'VARC · DILR · Quant',
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
    subtitle: 'VARC · DILR',
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
    subtitle: 'VARC · DILR · Quant',
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
const MockListScreen = ({navigation}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered =
    activeFilter === 'all'
      ? MOCK_DATA
      : MOCK_DATA.filter(m => m.type === activeFilter);

  // Count per category for the filter badges
  const counts = {
    all:   MOCK_DATA.length,
    full:  MOCK_DATA.filter(m => m.type === 'full').length,
    half:  MOCK_DATA.filter(m => m.type === 'half').length,
    topic: MOCK_DATA.filter(m => m.type === 'topic').length,
  };

  const handleStartTest = item => {
    navigation?.navigate('MockDetail', {mockId: item.id});
  };

  // Sticky header = navbar + filter tabs rendered outside FlatList
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* ── STICKY NAVBAR ── */}
      <View style={styles.navbar}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <View style={styles.backIconWrap}>
            <Text style={styles.backIcon}>‹</Text>
          </View>
        </TouchableOpacity>

        {/* Centered title */}
        <Text style={styles.navTitle}>Mock Tests</Text>

        {/* Right spacer to keep title truly centered */}
        <View style={styles.navRight} />
      </View>

      {/* ── STICKY CATEGORY FILTER ── */}
      <CategoryFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {/* ── SCROLLABLE LIST ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <MockCard item={item} onPress={handleStartTest} index={index} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{height: 14}} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No tests found</Text>
            <Text style={styles.emptySubtitle}>Try a different category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
  },

  // Navbar
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    // Sticky — rendered outside FlatList so it never scrolls
    paddingTop:35
  },
  backBtn: {
    width: 36,
    alignItems: 'flex-start',
  },
  backIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.textPrimary,
    lineHeight: 26,
    marginTop: -2,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    textAlign: 'center',
    flex: 1,
  },
  navRight: {
    width: 36, // mirrors backBtn width to keep title centered
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Empty state
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});

export default MockListScreen;