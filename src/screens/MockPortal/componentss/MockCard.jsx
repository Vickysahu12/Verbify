import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

const COLORS = {
  primary: '#1A7A4A',
  primaryLight: '#E8F5EE',
  primaryMid: '#2EA86B',
  primaryDark: '#0F5C35',
  accent: '#F4A827',
  danger: '#E05252',
  dangerSoft: '#FDEAEA',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F8F5',
  border: '#E0EDE6',
  borderLight: '#EEF6F1',
  textPrimary: '#0D1F15',
  textSecondary: '#527A62',
  textMuted: '#9DB5A5',
};

const DIFFICULTY_COLORS = {
  Easy:   {bg: '#E8F5EE', color: '#1A7A4A'},
  Medium: {bg: '#FEF3DC', color: '#C87D0E'},
  Hard:   {bg: '#FDEAEA', color: '#C04040'},
};

// ─── ANIMATED SCORE BAR ───────────────────────────────────────────────────────
const ScoreBar = ({score, max}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const pct = (score / max) * 100;
  const color = pct >= 70 ? COLORS.primaryMid : pct >= 40 ? COLORS.accent : COLORS.danger;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, []);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.scoreBarWrap}>
      <View style={styles.scoreBarTrack}>
        <Animated.View style={[styles.scoreBarFill, {width, backgroundColor: color}]} />
      </View>
      <Text style={[styles.scoreBarLabel, {color}]}>{score}/{max}</Text>
    </View>
  );
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
const BadgeChip = ({type}) => {
  const config = {
    hot:    {label: '🔥 HOT', bg: COLORS.dangerSoft, color: COLORS.danger},
    new:    {label: '✨ NEW', bg: '#EEF0FF', color: '#4C5EDB'},
    locked: {label: '🔒 PRO', bg: '#F5F0FF', color: '#7B5EA7'},
  };
  const c = config[type];
  if (!c) return null;
  return (
    <View style={[styles.badge, {backgroundColor: c.bg}]}>
      <Text style={[styles.badgeText, {color: c.color}]}>{c.label}</Text>
    </View>
  );
};

// ─── MOCK CARD ────────────────────────────────────────────────────────────────
const MockCard = ({item, onPress, index}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const isLocked  = item.badge === 'locked';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 420,
        delay: index * 70,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 420,
        delay: index * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {toValue: 0.972, useNativeDriver: true, speed: 40}).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8}).start();
  };

  const typeColor = {
    full:  COLORS.primary,
    half:  COLORS.primaryMid,
    topic: COLORS.accent,
  };
  const stripColor = isLocked ? COLORS.textMuted : (typeColor[item.type] || COLORS.primary);
  const diff = DIFFICULTY_COLORS[item.difficulty] || DIFFICULTY_COLORS.Medium;

  return (
    <Animated.View
      style={[
        styles.cardWrap,
        {opacity: fadeAnim, transform: [{scale: scaleAnim}, {translateY: slideAnim}]},
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => !isLocked && onPress(item)}
        style={[styles.card, isLocked && styles.cardLocked]}>

        {/* Top color strip */}
        <View style={[styles.cardTopStrip, {backgroundColor: stripColor}]} />

        <View style={styles.cardInner}>
          {/* Row 1: Icon + Title + Badge */}
          <View style={styles.cardRow1}>
            <View style={[styles.iconBubble, {backgroundColor: isLocked ? '#F0F0F0' : COLORS.primaryLight}]}>
              <Text style={styles.iconEmoji}>{item.icon}</Text>
            </View>
            <View style={styles.titleBlock}>
              <Text
                style={[styles.cardTitle, isLocked && {color: COLORS.textMuted}]}
                numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
            {item.badge && <BadgeChip type={item.badge} />}
          </View>

          {/* Row 2: Meta pills */}
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>📝 {item.questions}Q</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>⏱ {item.duration}</Text>
            </View>
            {item.attempts && (
              <View style={styles.metaPill}>
                <Text style={styles.metaPillText}>👥 {item.attempts}</Text>
              </View>
            )}
            <View style={[styles.metaPill, {backgroundColor: diff.bg, borderColor: diff.bg}]}>
              <Text style={[styles.metaPillText, {color: diff.color}]}>{item.difficulty}</Text>
            </View>
          </View>

          {/* Topic tags */}
          {item.topics && (
            <View style={styles.topicRow}>
              {item.topics.map(t => (
                <View key={t} style={styles.topicTag}>
                  <Text style={styles.topicTagText}>{t}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Last attempt score */}
          {item.isAttempted && item.lastScore !== undefined && (
            <View style={styles.scoreSection}>
              <View style={styles.scoreLabelRow}>
                <Text style={styles.scoreSectionLabel}>Last Attempt</Text>
                <Text style={styles.scoreEstimate}>
                  ~{Math.round((item.lastScore / item.maxScore) * 100)}% score
                </Text>
              </View>
              <ScoreBar score={item.lastScore} max={item.maxScore} />
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* CTA */}
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              !isLocked && !item.isAttempted && styles.ctaBtnPrimary,
              isLocked && styles.ctaBtnLocked,
            ]}
            onPress={() => !isLocked && onPress(item)}
            disabled={isLocked}>
            <Text
              style={[
                styles.ctaBtnText,
                !isLocked && !item.isAttempted && styles.ctaBtnTextPrimary,
                isLocked && styles.ctaBtnTextLocked,
              ]}>
              {isLocked
                ? 'Unlock with Pro  🔒'
                : item.isAttempted
                ? 'Reattempt  →'
                : 'Start Test  →'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: 18,
    shadowColor: '#1A7A4A',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardLocked: {opacity: 0.65},
  cardTopStrip: {height: 3},
  cardInner: {padding: 16},
  cardRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {fontSize: 22},
  titleBlock: {flex: 1},
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaPill: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
    marginBottom: 4,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  topicTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C5E8D4',
    marginRight: 6,
    marginBottom: 4,
  },
  topicTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  scoreSection: {
    marginTop: 12,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  scoreEstimate: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  scoreBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBarTrack: {
    flex: 1,
    height: 7,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreBarLabel: {
    fontSize: 12,
    fontWeight: '800',
    minWidth: 52,
    textAlign: 'right',
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  ctaBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: '#C5E8D4',
  },
  ctaBtnPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ctaBtnLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  ctaBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.1,
  },
  ctaBtnTextPrimary: {color: '#FFFFFF'},
  ctaBtnTextLocked: {color: COLORS.textMuted},
});

export default MockCard;