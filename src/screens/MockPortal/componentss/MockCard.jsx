/**
 * MockCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * FIXES:
 * - sc() responsive scaling added — consistent with rest of app
 * - All hardcoded px values replaced with sc() equivalents
 * - Minor spacing tightened for consistency
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions,
} from 'react-native';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

const C = {
  primary:       '#1F3B1F',
  primaryLight:  '#E8F5EE',
  primaryMid:    '#1F3B1F',
  primaryDark:   '#0F5C35',
  accent:        '#1F3B1F',
  danger:        '#E05252',
  dangerSoft:    '#FDEAEA',
  surface:       '#FFFFFF',
  surfaceAlt:    '#F4F8F5',
  border:        '#E0EDE6',
  borderLight:   '#EEF6F1',
  textPrimary:   '#0D1F15',
  textSecondary: '#527A62',
  textMuted:     '#9DB5A5',
};

const DIFFICULTY_COLORS = {
  Easy:   { bg: '#E8F5EE', color: '#1A7A4A' },
  Medium: { bg: '#FEF3DC', color: '#C87D0E' },
  Hard:   { bg: '#FDEAEA', color: '#C04040' },
};

// ─── ANIMATED SCORE BAR ───────────────────────────────────────────────────────
const ScoreBar = ({ score, max }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const pct   = (score / max) * 100;
  const color = pct >= 70 ? C.primaryMid : pct >= 40 ? C.accent : C.danger;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 900, useNativeDriver: false }).start();
  }, []);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={s.scoreBarWrap}>
      <View style={s.scoreBarTrack}>
        <Animated.View style={[s.scoreBarFill, { width, backgroundColor: color }]} />
      </View>
      <Text style={[s.scoreBarLabel, { color }]}>{score}/{max}</Text>
    </View>
  );
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
const BadgeChip = ({ type }) => {
  const config = {
    hot:    { label: '🔥 HOT', bg: C.dangerSoft,  color: C.danger    },
    new:    { label: '✨ NEW', bg: '#EEF0FF',      color: '#4C5EDB'   },
    locked: { label: '🔒 PRO', bg: '#F5F0FF',      color: '#7B5EA7'   },
  };
  const c = config[type];
  if (!c) return null;
  return (
    <View style={[s.badge, { backgroundColor: c.bg }]}>
      <Text style={[s.badgeText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
};

// ─── MOCK CARD ────────────────────────────────────────────────────────────────
const MockCard = ({ item, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(sc(24))).current;
  const isLocked  = item.badge === 'locked';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1,    duration: 420, delay: index * 70, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0,    duration: 420, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePressIn  = () =>
    Animated.spring(scaleAnim, { toValue: 0.972, useNativeDriver: true, speed: 40 }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();

  const typeColor  = { full: C.primary, half: C.primaryMid, topic: C.accent };
  const stripColor = isLocked ? C.textMuted : (typeColor[item.type] || C.primary);
  const diff       = DIFFICULTY_COLORS[item.difficulty] || DIFFICULTY_COLORS.Medium;

  return (
    <Animated.View style={[s.cardWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => !isLocked && onPress(item)}
        style={[s.card, isLocked && s.cardLocked]}
      >
        {/* Top color strip */}
        <View style={[s.cardTopStrip, { backgroundColor: stripColor }]} />

        <View style={s.cardInner}>
          {/* Row 1: Icon + Title + Badge */}
          <View style={s.cardRow1}>
            <View style={[s.iconBubble, { backgroundColor: isLocked ? '#F0F0F0' : C.primaryLight }]}>
              <Text style={s.iconEmoji}>{item.icon}</Text>
            </View>
            <View style={s.titleBlock}>
              <Text
                style={[s.cardTitle, isLocked && { color: C.textMuted }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={s.cardSubtitle}>{item.subtitle}</Text>
            </View>
            {item.badge && <BadgeChip type={item.badge} />}
          </View>

          {/* Row 2: Meta pills */}
          <View style={s.metaRow}>
            <View style={s.metaPill}>
              <Text style={s.metaPillText}>📝 {item.questions}Q</Text>
            </View>
            <View style={s.metaPill}>
              <Text style={s.metaPillText}>⏱ {item.duration}</Text>
            </View>
            {item.attempts && (
              <View style={s.metaPill}>
                <Text style={s.metaPillText}>👥 {item.attempts}</Text>
              </View>
            )}
            <View style={[s.metaPill, { backgroundColor: diff.bg, borderColor: diff.bg }]}>
              <Text style={[s.metaPillText, { color: diff.color }]}>{item.difficulty}</Text>
            </View>
          </View>

          {/* Topic tags */}
          {item.topics && (
            <View style={s.topicRow}>
              {item.topics.map(t => (
                <View key={t} style={s.topicTag}>
                  <Text style={s.topicTagText}>{t}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Last attempt score */}
          {item.isAttempted && item.lastScore !== undefined && (
            <View style={s.scoreSection}>
              <View style={s.scoreLabelRow}>
                <Text style={s.scoreSectionLabel}>Last Attempt</Text>
                <Text style={s.scoreEstimate}>
                  ~{Math.round((item.lastScore / item.maxScore) * 100)}% score
                </Text>
              </View>
              <ScoreBar score={item.lastScore} max={item.maxScore} />
            </View>
          )}

          {/* Divider */}
          <View style={s.divider} />

          {/* CTA */}
          <TouchableOpacity
            style={[
              s.ctaBtn,
              !isLocked && !item.isAttempted && s.ctaBtnPrimary,
              isLocked && s.ctaBtnLocked,
            ]}
            onPress={() => !isLocked && onPress(item)}
            disabled={isLocked}
          >
            <Text style={[
              s.ctaBtnText,
              !isLocked && !item.isAttempted && s.ctaBtnTextPrimary,
              isLocked && s.ctaBtnTextLocked,
            ]}>
              {isLocked ? 'Unlock with Pro  🔒' : item.isAttempted ? 'Reattempt  →' : 'Start Test  →'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  cardWrap: {
    borderRadius: sc(18),
    shadowColor: '#1A7A4A',
    shadowOffset: { width: 0, height: sc(3) },
    shadowOpacity: 0.1, shadowRadius: sc(10), elevation: 4,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: sc(18),
    overflow: 'hidden',
    borderWidth: 1, borderColor: C.borderLight,
  },
  cardLocked: { opacity: 0.65 },

  cardTopStrip: { height: sc(3) },

  cardInner: { padding: sc(15) },

  // Row 1
  cardRow1: {
    flexDirection: 'row', alignItems: 'center', marginBottom: sc(11),
  },
  iconBubble: {
    width: sc(44), height: sc(44), borderRadius: sc(12),
    justifyContent: 'center', alignItems: 'center', marginRight: sc(11),
  },
  iconEmoji:  { fontSize: sc(21) },
  titleBlock: { flex: 1 },
  cardTitle: {
    fontSize: sc(15), fontWeight: '700',
    color: C.textPrimary, letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: sc(12), color: C.textSecondary,
    marginTop: sc(2), fontWeight: '500',
  },

  badge: {
    paddingHorizontal: sc(9), paddingVertical: sc(4),
    borderRadius: sc(8), marginLeft: sc(8),
  },
  badgeText: { fontSize: sc(10), fontWeight: '800', letterSpacing: 0.3 },

  // Meta pills
  metaRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: sc(5),
  },
  metaPill: {
    backgroundColor: C.surfaceAlt,
    paddingHorizontal: sc(10), paddingVertical: sc(5),
    borderRadius: sc(8), borderWidth: 1, borderColor: C.border,
  },
  metaPillText: { fontSize: sc(11), fontWeight: '600', color: C.textSecondary },

  // Topic tags
  topicRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: sc(7) },
  topicTag: {
    backgroundColor: C.primaryLight,
    paddingHorizontal: sc(10), paddingVertical: sc(4),
    borderRadius: sc(20), borderWidth: 1, borderColor: '#C5E8D4',
    marginRight: sc(6), marginBottom: sc(4),
  },
  topicTagText: { fontSize: sc(11), fontWeight: '700', color: C.primaryDark },

  // Score section
  scoreSection: {
    marginTop: sc(11),
    backgroundColor: C.surfaceAlt,
    borderRadius: sc(10), padding: sc(10),
    borderWidth: 1, borderColor: C.border,
  },
  scoreLabelRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: sc(7),
  },
  scoreSectionLabel: {
    fontSize: sc(11), fontWeight: '700', color: C.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  scoreEstimate: { fontSize: sc(10), fontWeight: '600', color: C.textSecondary },
  scoreBarWrap:  { flexDirection: 'row', alignItems: 'center' },
  scoreBarTrack: {
    flex: 1, height: sc(7), backgroundColor: C.border,
    borderRadius: sc(4), overflow: 'hidden', marginRight: sc(10),
  },
  scoreBarFill:  { height: '100%', borderRadius: sc(4) },
  scoreBarLabel: {
    fontSize: sc(12), fontWeight: '800', minWidth: sc(50),
    textAlign: 'right', letterSpacing: -0.3,
  },

  divider: { height: 1, backgroundColor: C.border, marginVertical: sc(11) },

  // CTA
  ctaBtn: {
    paddingVertical: sc(12), borderRadius: sc(12), alignItems: 'center',
    backgroundColor: C.primaryLight, borderWidth: 1.5, borderColor: '#C5E8D4',
  },
  ctaBtnPrimary: { backgroundColor: C.primary, borderColor: C.primary },
  ctaBtnLocked:  { backgroundColor: '#F5F5F5', borderColor: '#E0E0E0' },

  ctaBtnText:        { fontSize: sc(13), fontWeight: '700', color: C.primary, letterSpacing: 0.1 },
  ctaBtnTextPrimary: { color: '#fff' },
  ctaBtnTextLocked:  { color: C.textMuted },
});

export default MockCard;