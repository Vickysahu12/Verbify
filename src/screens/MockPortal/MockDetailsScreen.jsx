/**
 * MockDetailScreen.jsx — BACKEND INTEGRATED
 * GET /mocks/{mockId} → detail, marking, rules, syllabus, instructions
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, SafeAreaView, Platform, Animated, Dimensions, ActivityIndicator,
} from 'react-native';
import { getMockDetail } from '../../services/mockService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary:       '#1F3B1F',
  primaryLight:  '#E8F5EE',
  primaryMid:    '#1F3B1F',
  danger:        '#E05252',
  dangerSoft:    '#FDEAEA',
  surface:       '#FFFFFF',
  surfaceAlt:    '#F4F8F5',
  border:        '#E0EDE6',
  borderLight:   '#EEF6F1',
  textPrimary:   '#0D1F15',
  textSecondary: '#527A62',
  textMuted:     '#9DB5A5',
  info:          '#3B82F6',
  infoSoft:      '#EFF6FF',
};

// ─── SUB-COMPONENTS (unchanged from original) ─────────────────────────────────

const SectionCard = ({ section, index }) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, delay: 200 + index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: 200 + index * 80, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[styles.sectionCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={[styles.sectionIconBg, { backgroundColor: (section.color || COLORS.primary) + '18' }]}>
        <Text style={styles.sectionIcon}>{section.icon}</Text>
      </View>
      <Text style={[styles.sectionLabel, { color: section.color || COLORS.primary }]}>{section.label}</Text>
      <Text style={styles.sectionDuration}>{section.duration}</Text>
      <View style={styles.sectionQBubble}>
        <Text style={styles.sectionQText}>{section.questions}Q</Text>
      </View>
      {section.breakdown && <Text style={styles.sectionBreakdown}>{section.breakdown}</Text>}
    </Animated.View>
  );
};

const SyllabusRow = ({ item }) => (
  <View style={styles.syllabusRow}>
    <View style={[styles.checkbox, item.covered && styles.checkboxChecked]}>
      {item.covered && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={[styles.syllabusLabel, !item.covered && styles.syllabusLabelMuted]}>
      {item.label}
    </Text>
  </View>
);

const RuleChip = ({ rule }) => (
  <View style={styles.ruleChip}>
    <Text style={styles.ruleChipIcon}>{rule.icon}</Text>
    <Text style={styles.ruleChipLabel}>{rule.label}</Text>
  </View>
);

const LastAttemptStrip = ({ lastScore, maxScore, onViewSolutions }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const pct  = (lastScore / maxScore) * 100;
  const color = pct >= 70 ? COLORS.primaryMid : pct >= 40 ? COLORS.primary : COLORS.danger;
  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 1000, delay: 400, useNativeDriver: false }).start();
  }, []);
  const barWidth = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View style={styles.lastAttemptStrip}>
      <View style={styles.lastAttemptLeft}>
        <Text style={styles.lastAttemptEyebrow}>Previous Attempt</Text>
        <Text style={[styles.lastAttemptScore, { color }]}>
          {lastScore}<Text style={styles.lastAttemptMax}>/{maxScore}</Text>
        </Text>
      </View>
      <View style={styles.lastAttemptRight}>
        <Text style={styles.lastAttemptPct}>{Math.round(pct)}% score</Text>
        <View style={styles.lastAttemptTrack}>
          <Animated.View style={[styles.lastAttemptFill, { width: barWidth, backgroundColor: color }]} />
        </View>
        <TouchableOpacity onPress={onViewSolutions}>
          <Text style={styles.lastAttemptView}>View Solutions →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SectionHeader = ({ label }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderDot} />
    <Text style={styles.sectionHeaderText}>{label}</Text>
  </View>
);

const MarkingCard = ({ marking }) => (
  <View style={styles.markingCardWrap}>
    <View style={styles.markingRow}>
      <View style={[styles.markingIconCircle, { backgroundColor: COLORS.primaryLight }]}>
        <Text style={styles.markingIconText}>＋</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.markingValue, { color: COLORS.primary }]}>{marking.correct}</Text>
        <Text style={styles.markingSub}>{marking.correct_sub}</Text>
      </View>
    </View>
    <View style={styles.markingDivider} />
    <View style={styles.markingRow}>
      <View style={[styles.markingIconCircle, { backgroundColor: COLORS.dangerSoft }]}>
        <Text style={[styles.markingIconText, { color: COLORS.danger }]}>−</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.markingValue, { color: COLORS.danger }]}>{marking.wrong}</Text>
        <Text style={styles.markingSub}>{marking.wrong_sub}</Text>
      </View>
    </View>
    {marking.has_tita && marking.tita !== 'N/A' && (
      <>
        <View style={styles.markingDivider} />
        <View style={styles.markingRow}>
          <View style={[styles.markingIconCircle, { backgroundColor: '#FEF9C3' }]}>
            <Text style={[styles.markingIconText, { color: '#CA8A04', fontSize: 13 }]}>T</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.markingValue, { color: '#CA8A04' }]}>{marking.tita}</Text>
            <Text style={styles.markingSub}>{marking.tita_sub}</Text>
          </View>
        </View>
      </>
    )}
  </View>
);

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

const MockDetailScreen = ({ navigation, route }) => {
  const mockId = route?.params?.mockId;

  const [mock,    setMock]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const headerFade  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-10)).current;
  const ctaFade     = useRef(new Animated.Value(0)).current;
  const ctaSlide    = useRef(new Animated.Value(60)).current;

  // ── Fetch detail ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getMockDetail(mockId);

        // ── Map backend → frontend shape ──
        setMock({
          id:             data.id,
          title:          data.title,
          description:    data.description,
          type:           data.type,
          icon:           data.icon,
          badge:          data.badge,
          attemptNumber:  data.attempt_number,
          totalDuration:  data.total_duration,
          durationSecs:   data.duration_secs,
          totalQuestions: data.total_questions,
          maxScore:       data.max_score,
          difficulty:     data.difficulty,
          isAttempted:    data.is_attempted,
          lastScore:      data.last_score,
          lastAttemptId:  data.last_attempt_id,
          sections:       (data.sections || []).map(s => ({
            id:        s.section_key,
            label:     s.label,
            icon:      s.icon,
            duration:  s.duration,
            questions: s.questions,
            color:     s.color,
            breakdown: s.breakdown,
            locked:    s.is_locked,
          })),
          marking:      data.marking,      // already display strings from backend
          rules:        data.rules || [],
          syllabus:     data.syllabus || [],
          instructions: data.instructions || [],
        });

        Animated.parallel([
          Animated.timing(headerFade,  { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(headerSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.timing(ctaFade,     { toValue: 1, duration: 400, delay: 600, useNativeDriver: true }),
          Animated.timing(ctaSlide,    { toValue: 0, duration: 400, delay: 600, useNativeDriver: true }),
        ]).start();

      } catch (e) {
        setError(e?.response?.data?.detail ?? 'Failed to load test details');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [mockId]);

  const handleBeginTest = () => {
    navigation?.navigate('TestInterface', { mockId: mock.id });
  };

  const handleViewSolutions = () => {
    if (mock?.lastAttemptId) {
      navigation?.navigate('solution', { attemptId: mock.lastAttemptId, mockId: mock.id });
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
            <View style={styles.backIconWrap}><Text style={styles.backIcon}>‹</Text></View>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Test Details</Text>
          <View style={styles.navRight} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !mock) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
            <View style={styles.backIconWrap}><Text style={styles.backIcon}>‹</Text></View>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Test Details</Text>
          <View style={styles.navRight} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 }}>
          <Text style={{ fontSize: 36 }}>⚠️</Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.textPrimary }}>Couldn't load test</Text>
          <Text style={{ fontSize: 13, color: COLORS.textMuted, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity
            style={{ backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
            onPress={() => navigation?.goBack()}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View style={styles.backIconWrap}>
            <Text style={styles.backIcon}>‹</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Test Details</Text>
        <View style={styles.navRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* HERO */}
        <Animated.View style={[styles.hero, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <View style={styles.heroTopRow}>
            <View style={styles.attemptBadge}>
              <Text style={styles.attemptBadgeText}>ATTEMPT #{mock.attemptNumber}</Text>
            </View>
            <Text style={styles.heroDurationPill}>⏱ {mock.totalDuration}</Text>
          </View>
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroIcon}>{mock.icon}</Text>
            <Text style={styles.heroTitle}>{mock.title}</Text>
          </View>
          <Text style={styles.heroDesc}>{mock.description}</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>{mock.totalQuestions}</Text>
              <Text style={styles.heroStatLabel}>Questions</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>{mock.maxScore}</Text>
              <Text style={styles.heroStatLabel}>Max Score</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatVal, {
                color: mock.difficulty === 'Hard'   ? COLORS.danger
                     : mock.difficulty === 'Medium' ? COLORS.primary
                     : COLORS.primaryMid,
              }]}>{mock.difficulty}</Text>
              <Text style={styles.heroStatLabel}>Difficulty</Text>
            </View>
          </View>
        </Animated.View>

        {/* LAST ATTEMPT */}
        {mock.isAttempted && mock.lastScore !== null && (
          <View style={styles.section}>
            <LastAttemptStrip
              lastScore={mock.lastScore}
              maxScore={mock.maxScore}
              onViewSolutions={handleViewSolutions}
            />
          </View>
        )}

        {/* TEST STRUCTURE */}
        <View style={styles.section}>
          <SectionHeader label="Test Structure" />
          <View style={styles.sectionCardsRow}>
            {mock.sections.map((s, i) => (
              <SectionCard key={s.id} section={s} index={i} />
            ))}
          </View>
        </View>

        {/* MARKING SCHEME */}
        {mock.marking && (
          <View style={styles.section}>
            <SectionHeader label="Marking Scheme" />
            <MarkingCard marking={mock.marking} />
          </View>
        )}

        {/* RULES */}
        {mock.rules.length > 0 && (
          <View style={styles.section}>
            <SectionHeader label="Test Rules" />
            <View style={styles.rulesGrid}>
              {mock.rules.map((r, i) => <RuleChip key={i} rule={r} />)}
            </View>
          </View>
        )}

        {/* SYLLABUS */}
        {mock.syllabus.length > 0 && (
          <View style={styles.section}>
            <SectionHeader label="Syllabus Covered" />
            <View style={styles.syllabusCard}>
              {mock.syllabus.map((s, i) => (
                <View key={i}>
                  <SyllabusRow item={s} />
                  {i < mock.syllabus.length - 1 && <View style={styles.syllabusDivider} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* INSTRUCTIONS */}
        {mock.instructions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.instructionsCard}>
              <View style={styles.instructionsHeader}>
                <Text style={styles.instructionsHeaderIcon}>ℹ️</Text>
                <Text style={styles.instructionsHeaderText}>Important Instructions</Text>
              </View>
              {mock.instructions.map((inst, i) => (
                <View key={i} style={styles.instructionRow}>
                  <View style={styles.instructionBullet} />
                  <Text style={styles.instructionText}>{inst}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* STICKY CTA */}
      <Animated.View style={[styles.ctaWrap, { opacity: ctaFade, transform: [{ translateY: ctaSlide }] }]}>
        <TouchableOpacity
          style={[styles.ctaBtn, mock.badge === 'locked' && styles.ctaBtnLocked]}
          onPress={mock.badge !== 'locked' ? handleBeginTest : undefined}
          activeOpacity={mock.badge === 'locked' ? 1 : 0.85}
        >
          <Text style={styles.ctaBtnText}>
            {mock.badge === 'locked' ? '🔒  Unlock to Attempt'
           : mock.isAttempted        ? 'Reattempt Test'
           :                           'Begin Test'}
          </Text>
          {mock.badge !== 'locked' && <Text style={styles.ctaBtnArrow}>→</Text>}
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surfaceAlt },
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingTop: 35, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { width: 36, alignItems: 'flex-start' },
  backIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 22, color: COLORS.textPrimary, lineHeight: 26, marginTop: -2 },
  navTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3, flex: 1, textAlign: 'center' },
  navRight: { width: 36 },
  scrollContent: { paddingBottom: 20 },
  hero: { backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 22, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  attemptBadge: { backgroundColor: COLORS.primaryLight, borderWidth: 1, borderColor: '#C5E8D4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  attemptBadgeText: { fontSize: 11, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.8 },
  heroDurationPill: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, backgroundColor: COLORS.surfaceAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  heroTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  heroIcon: { fontSize: 26, marginRight: 10 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.6, flex: 1 },
  heroDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, fontWeight: '500', marginBottom: 18 },
  heroStats: { flexDirection: 'row', backgroundColor: COLORS.surfaceAlt, borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: COLORS.border },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatVal: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4 },
  heroStatLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginTop: 2 },
  heroStatDivider: { width: 1, height: 32, backgroundColor: COLORS.border, alignSelf: 'center' },
  lastAttemptStrip: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, flexDirection: 'row', borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  lastAttemptLeft: { flex: 1, justifyContent: 'center' },
  lastAttemptEyebrow: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  lastAttemptScore: { fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  lastAttemptMax: { fontSize: 15, fontWeight: '600', color: COLORS.textMuted },
  lastAttemptRight: { flex: 1.2, justifyContent: 'center', alignItems: 'flex-end' },
  lastAttemptPct: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6 },
  lastAttemptTrack: { width: '100%', height: 7, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  lastAttemptFill: { height: '100%', borderRadius: 4 },
  lastAttemptView: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionHeaderDot: { width: 4, height: 18, borderRadius: 2, backgroundColor: COLORS.primary, marginRight: 10 },
  sectionHeaderText: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  sectionCardsRow: { flexDirection: 'row', gap: 10 },
  sectionCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  sectionIconBg: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  sectionIcon: { fontSize: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2, marginBottom: 2 },
  sectionDuration: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginBottom: 8 },
  sectionQBubble: { backgroundColor: COLORS.surfaceAlt, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: COLORS.border, marginBottom: 6 },
  sectionQText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  sectionBreakdown: { fontSize: 10, color: COLORS.textMuted, fontWeight: '500', textAlign: 'center', marginTop: 2, lineHeight: 14 },
  markingCardWrap: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  markingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  markingDivider: { height: 1, backgroundColor: COLORS.border },
  markingIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  markingIconText: { fontSize: 20, fontWeight: '700', color: COLORS.primary, lineHeight: 24 },
  markingValue: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  markingSub: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500', marginTop: 1 },
  rulesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  ruleChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: COLORS.border, gap: 8, width: (SCREEN_WIDTH - 32 - 10) / 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  ruleChipIcon: { fontSize: 16 },
  ruleChipLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, flex: 1 },
  syllabusCard: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  syllabusRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  syllabusDivider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surfaceAlt },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { fontSize: 13, color: '#fff', fontWeight: '800', lineHeight: 16 },
  syllabusLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, flex: 1, lineHeight: 18 },
  syllabusLabelMuted: { color: COLORS.textMuted },
  instructionsCard: { backgroundColor: COLORS.infoSoft, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#BFDBFE' },
  instructionsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  instructionsHeaderIcon: { fontSize: 16 },
  instructionsHeaderText: { fontSize: 14, fontWeight: '800', color: COLORS.info, letterSpacing: -0.2 },
  instructionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
  instructionBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.info, marginTop: 6 },
  instructionText: { fontSize: 13, color: '#1E40AF', fontWeight: '500', flex: 1, lineHeight: 19 },
  ctaWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'android' ? 16 : 28, borderTopWidth: 1, borderTopColor: COLORS.border },
  ctaBtn: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  ctaBtnLocked: { backgroundColor: COLORS.textMuted, shadowOpacity: 0, elevation: 0 },
  ctaBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.2 },
  ctaBtnArrow: { fontSize: 18, color: '#FFFFFF', fontWeight: '700' },
});

export default MockDetailScreen;