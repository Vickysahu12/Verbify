// ResultScreen.js
// Route params expected:
//   mockId       — string, e.g. '1'
//   questionMeta — object from ExamScreen { [qId]: { status, selected, titaAnswer } }
//   timeTaken    — seconds spent (totalSeconds - timeLeft)
//   examConfig   — full config object from getExamData(mockId)  [optional, fallback inside]

import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar,
  Platform, Animated, Dimensions,
} from 'react-native';
import { getExamData } from '../MockPortal/data/examData';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  primary:      '#1F3B1F',
  primaryLight: '#E8F5EE',
  primaryMid:   '#2EA86B',
  surface:      '#FFFFFF',
  bg:           '#F4F8F5',
  border:       '#E0EDE6',
  text:         '#0D1F15',
  sub:          '#527A62',
  muted:        '#9DB5A5',
  correct:      '#22C55E',
  wrong:        '#EF4444',
  marked:       '#7C3AED',
  unattempted:  '#D1D5DB',
  gold:         '#F59E0B',
  goldSoft:     '#FEF3DC',
};

const computeResult = (questionMeta, questions) => {
  let correct = 0, wrong = 0, unattempted = 0, tita_correct = 0;

  questions.forEach(q => {
    const meta = questionMeta?.[q.id];

    // NOT_VISITED ya VISITED_NOT_ANSWERED → unattempted
    // MARKED_REVIEW bina answer ke bhi → unattempted
    const hasNoAnswer =
      !meta ||
      meta.status === 'not_visited' ||
      meta.status === 'visited_not_answered' ||
      (meta.status === 'marked_review' && meta.selected === null && !meta.titaAnswer?.trim());

    if (hasNoAnswer) {
      unattempted++;
      return;
    }

    const isTita = q.type === 'tita';
    if (isTita) {
      const ans         = (meta.titaAnswer ?? '').trim().toUpperCase();
      const correct_ans = (q.correctAnswer ?? '').trim().toUpperCase();
      if (ans === correct_ans) { correct++; tita_correct++; }
      else unattempted++; // TITA wrong = no negative
    } else {
      if (meta.selected === q.correctOption) correct++;
      else if (meta.selected !== null)        wrong++;
      else                                    unattempted++;
    }
  });

  const score     = correct * 3 - wrong * 1;
  const maxScore  = questions.length * 3;
  const attempted = correct + wrong + tita_correct;
  const accuracy  = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  return { correct, wrong, unattempted, score, maxScore, attempted, accuracy, total: questions.length };
};

// RC vs VA split
const splitRCVA = (questionMeta, questions) => {
  const rc = questions.filter(q => q.passageId);
  const va = questions.filter(q => !q.passageId);
  return {
    rc: computeResult(questionMeta, rc),
    va: computeResult(questionMeta, va),
  };
};

const formatTime = secs => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
};

const getPerformanceLabel = pct => {
  if (pct >= 80) return { label: 'Excellent 🏆', color: C.primaryMid };
  if (pct >= 60) return { label: 'Good 👍',       color: C.primary    };
  if (pct >= 40) return { label: 'Average 📈',    color: C.gold       };
  return            { label: 'Needs Work 💪',    color: C.wrong      };
};

const getPercentile = pct => {
  if (pct >= 85) return '99+';
  if (pct >= 75) return '97';
  if (pct >= 65) return '93';
  if (pct >= 55) return '88';
  if (pct >= 45) return '78';
  if (pct >= 35) return '65';
  return '< 50';
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

// Animated score counter
const AnimatedScore = ({ score, maxScore }) => {
  const anim    = useRef(new Animated.Value(0)).current;
  const [disp, setDisp] = useState(0);

  useEffect(() => {
    Animated.timing(anim, { toValue: score, duration: 1200, delay: 300, useNativeDriver: false }).start();
    const id = anim.addListener(({ value }) => setDisp(Math.round(value)));
    return () => anim.removeListener(id);
  }, []);

  return (
    <View style={s.scoreBig}>
      <Text style={s.scoreNum}>{disp}</Text>
      <Text style={s.scoreMax}>/{maxScore}</Text>
    </View>
  );
};

// Progress bar with animation
const AnimBar = ({ pct, color, delay = 0, height = sc(8) }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 900, delay, useNativeDriver: false }).start();
  }, []);
  const w = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return (
    <View style={[s.barBg, { height }]}>
      <Animated.View style={[s.barFill, { width: w, backgroundColor: color, height }]} />
    </View>
  );
};

// Stat bubble
const StatBubble = ({ count, label, color, delay }) => {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(12)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[s.statBubble, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={[s.statDot, { backgroundColor: color }]} />
      <Text style={[s.statCount, { color }]}>{count}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </Animated.View>
  );
};

// Section row (RC / VA)
const SectionRow = ({ label, icon, res, delay }) => {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, delay, useNativeDriver: true }).start();
  }, []);
  const pct   = res.total > 0 ? Math.round((res.correct / res.total) * 100) : 0;
  const score = res.correct * 3 - res.wrong * 1;
  return (
    <Animated.View style={[s.secRow, { opacity: fade }]}>
      <View style={s.secLeft}>
        <Text style={s.secIcon}>{icon}</Text>
        <View>
          <Text style={s.secLabel}>{label}</Text>
          <Text style={s.secSub}>{res.total} Questions</Text>
        </View>
      </View>
      <View style={s.secMid}>
        <AnimBar pct={pct} color={pct >= 60 ? C.correct : pct >= 40 ? C.gold : C.wrong} delay={delay} height={sc(6)} />
        <Text style={s.secPct}>{pct}% accuracy</Text>
      </View>
      <View style={s.secRight}>
        <Text style={[s.secScore, { color: score >= 0 ? C.primary : C.wrong }]}>
          {score >= 0 ? '+' : ''}{score}
        </Text>
        <Text style={s.secScoreSub}>pts</Text>
      </View>
    </Animated.View>
  );
};

// Section header
const SecHeader = ({ label }) => (
  <View style={s.secHeader}>
    <View style={s.secHeaderDot} />
    <Text style={s.secHeaderText}>{label}</Text>
  </View>
);

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function ResultScreen({ navigation, route }) {
  const mockId       = route?.params?.mockId ?? '1';
  const questionMeta = route?.params?.questionMeta ?? {};
  const timeTaken    = route?.params?.timeTaken ?? 0;

  const examConfig   = route?.params?.examConfig ?? getExamData(mockId);
  const activeSection = examConfig.sections.find(s => !s.locked);
  const questions    = activeSection?.questions ?? [];

  // Compute results
  const result = computeResult(questionMeta, questions);
  const { rc, va } = splitRCVA(questionMeta, questions);

  const scorePct  = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
  const perf      = getPerformanceLabel(scorePct);
  const percentile = getPercentile(scorePct);

  // Animations
  const heroFade  = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(-16)).current;
  const ctaFade   = useRef(new Animated.Value(0)).current;
  const ctaSlide  = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(heroSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(ctaFade,   { toValue: 1, duration: 400, delay: 800, useNativeDriver: true }),
      Animated.timing(ctaSlide,  { toValue: 0, duration: 400, delay: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* ── NAVBAR ── */}
      <View style={s.navbar}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation?.navigate('TestMain')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={s.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={s.navTitle}>Result</Text>
        <View style={{ width: sc(36) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── HERO CARD ── */}
        <Animated.View style={[s.hero, { opacity: heroFade, transform: [{ translateY: heroSlide }] }]}>
          {/* Test name */}
          <Text style={s.heroTestName}>{examConfig.testTitle}</Text>
          <Text style={s.heroSection}>{activeSection?.label ?? 'VARC'} Section</Text>

          {/* Performance badge */}
          <View style={[s.perfBadge, { backgroundColor: perf.color + '22', borderColor: perf.color + '44' }]}>
            <Text style={[s.perfText, { color: perf.color }]}>{perf.label}</Text>
          </View>

          {/* Score */}
          <AnimatedScore score={result.score} maxScore={result.maxScore} />

          {/* Accuracy + Percentile row */}
          <View style={s.heroMetaRow}>
            <View style={s.heroMeta}>
              <Text style={s.heroMetaVal}>{result.accuracy}%</Text>
              <Text style={s.heroMetaLabel}>Accuracy</Text>
            </View>
            <View style={s.heroMetaDivider} />
            <View style={s.heroMeta}>
              <Text style={s.heroMetaVal}>{percentile}</Text>
              <Text style={s.heroMetaLabel}>Percentile ~</Text>
            </View>
            <View style={s.heroMetaDivider} />
            <View style={s.heroMeta}>
              <Text style={s.heroMetaVal}>{formatTime(timeTaken)}</Text>
              <Text style={s.heroMetaLabel}>Time Taken</Text>
            </View>
          </View>

          {/* Overall score bar */}
          <View style={s.scoreBarSection}>
            <View style={s.scoreBarLabelRow}>
              <Text style={s.scoreBarLabel}>Overall Score</Text>
              <Text style={s.scoreBarPct}>{scorePct}%</Text>
            </View>
            <AnimBar pct={Math.max(scorePct, 0)} color={C.primaryMid} delay={400} height={sc(10)} />
          </View>
        </Animated.View>

        {/* ── QUESTION STATS ── */}
        <View style={s.section}>
          <SecHeader label="Question Breakdown" />
          <View style={s.statGrid}>
            <StatBubble count={result.correct}     label="Correct"     color={C.correct}     delay={200} />
            <StatBubble count={result.wrong}        label="Wrong"       color={C.wrong}       delay={300} />
            <StatBubble count={result.unattempted}  label="Unattempted" color={C.unattempted} delay={400} />
            <StatBubble count={result.attempted}    label="Attempted"   color={C.primary}     delay={500} />
          </View>
        </View>

        {/* ── MARKS SUMMARY ── */}
        <View style={s.section}>
          <SecHeader label="Marks Summary" />
          <View style={s.marksCard}>
            <View style={s.marksRow}>
              <View style={s.marksLeft}>
                <Text style={s.marksIcon}>✅</Text>
                <Text style={s.marksLabel}>Correct (+3 each)</Text>
              </View>
              <Text style={[s.marksVal, { color: C.correct }]}>+{result.correct * 3}</Text>
            </View>
            <View style={s.marksDivider} />
            <View style={s.marksRow}>
              <View style={s.marksLeft}>
                <Text style={s.marksIcon}>❌</Text>
                <Text style={s.marksLabel}>Wrong (−1 each)</Text>
              </View>
              <Text style={[s.marksVal, { color: C.wrong }]}>−{result.wrong}</Text>
            </View>
            <View style={s.marksDivider} />
            <View style={[s.marksRow, s.marksTotal]}>
              <Text style={s.marksTotalLabel}>Total Score</Text>
              <Text style={[s.marksTotalVal, { color: result.score >= 0 ? C.primary : C.wrong }]}>
                {result.score >= 0 ? '+' : ''}{result.score} / {result.maxScore}
              </Text>
            </View>
          </View>
        </View>

        {/* ── SECTION BREAKDOWN — only if both RC & VA exist ── */}
        {rc.total > 0 && va.total > 0 && (
          <View style={s.section}>
            <SecHeader label="Section Breakdown" />
            <View style={s.secCard}>
              <SectionRow label="Reading Comprehension" icon="📖" res={rc} delay={200} />
              <View style={s.secDivider} />
              <SectionRow label="Verbal Ability"        icon="🔤" res={va} delay={350} />
            </View>
          </View>
        )}

        {/* ── QUICK INSIGHT ── */}
        <View style={s.section}>
          <SecHeader label="Quick Insight" />
          <View style={s.insightCard}>
            <InsightRow
              icon={result.accuracy >= 70 ? '🎯' : '⚠️'}
              text={
                result.accuracy >= 70
                  ? `Great accuracy at ${result.accuracy}%! Focus on attempting more questions.`
                  : `Accuracy needs work (${result.accuracy}%). Avoid guessing — negative marking hurts.`
              }
            />
            <InsightRow
              icon={result.unattempted > questions.length * 0.4 ? '📌' : '✅'}
              text={
                result.unattempted > questions.length * 0.4
                  ? `${result.unattempted} questions unattempted. Time management needs improvement.`
                  : `Good attempt rate! Only ${result.unattempted} questions left unattempted.`
              }
            />
            <InsightRow
              icon="📊"
              text={`Estimated percentile: ${percentile}. Review solutions to plug knowledge gaps.`}
            />
          </View>
        </View>

        <View style={{ height: sc(110) }} />
      </ScrollView>

      {/* ── STICKY CTA ── */}
      <Animated.View style={[s.ctaWrap, { opacity: ctaFade, transform: [{ translateY: ctaSlide }] }]}>
        <TouchableOpacity
          style={s.ctaSecondary}
          onPress={() => navigation?.navigate('TestInterface')}
          activeOpacity={0.8}
        >
          <Text style={s.ctaSecondaryText}>← Back to Tests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.ctaPrimary}
          onPress={() =>
            navigation?.navigate('SolutionScreen', {
              mockId,
              questionMeta,
              examConfig,
            })
          }
          activeOpacity={0.85}
        >
          <Text style={s.ctaPrimaryText}>View Solutions  →</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const InsightRow = ({ icon, text }) => (
  <View style={s.insightRow}>
    <Text style={s.insightIcon}>{icon}</Text>
    <Text style={s.insightText}>{text}</Text>
  </View>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Navbar — dark green
  navbar: {
    backgroundColor: C.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: sc(16),
    paddingTop: Platform.OS === 'android' ? sc(36) : sc(12),
    paddingBottom: sc(14),
  },
  backBtn:  { width: sc(36), alignItems: 'flex-start' },
  backIcon: { fontSize: sc(28), color: '#fff', lineHeight: sc(32), marginTop: -sc(2) },
  navTitle: { fontSize: sc(17), fontWeight: '800', color: '#fff', letterSpacing: -0.3 },

  scroll: { paddingBottom: sc(20) },

  // Hero
  hero: {
    backgroundColor: C.primary,
    paddingHorizontal: sc(20),
    paddingTop: sc(4),
    paddingBottom: sc(28),
    borderBottomLeftRadius: sc(28),
    borderBottomRightRadius: sc(28),
  },
  heroTestName: {
    fontSize: sc(13), fontWeight: '700', color: '#A7C4AD',
    letterSpacing: 0.5, marginBottom: sc(2),
  },
  heroSection: {
    fontSize: sc(11), fontWeight: '600', color: '#6B9A75',
    letterSpacing: 0.8, marginBottom: sc(16),
  },
  perfBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: sc(12), paddingVertical: sc(5),
    borderRadius: sc(10), borderWidth: 1,
    marginBottom: sc(14),
  },
  perfText: { fontSize: sc(13), fontWeight: '800', letterSpacing: 0.2 },

  // Score
  scoreBig: {
    flexDirection: 'row', alignItems: 'flex-end',
    marginBottom: sc(20),
  },
  scoreNum: {
    fontSize: sc(72), fontWeight: '900', color: '#fff',
    lineHeight: sc(80), letterSpacing: -3,
  },
  scoreMax: {
    fontSize: sc(22), fontWeight: '700', color: '#6B9A75',
    marginBottom: sc(10), marginLeft: sc(4),
  },

  // Hero meta row
  heroMetaRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: sc(14), paddingVertical: sc(12),
    marginBottom: sc(20),
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  heroMeta:        { flex: 1, alignItems: 'center' },
  heroMetaVal:     { fontSize: sc(16), fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  heroMetaLabel:   { fontSize: sc(10), fontWeight: '600', color: '#7BA882', marginTop: sc(2) },
  heroMetaDivider: { width: 1, height: sc(30), backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center' },

  // Score bar
  scoreBarSection: { gap: sc(8) },
  scoreBarLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreBarLabel:    { fontSize: sc(11), fontWeight: '600', color: '#7BA882', letterSpacing: 0.5 },
  scoreBarPct:      { fontSize: sc(12), fontWeight: '800', color: '#fff' },
  barBg:   { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: sc(10), overflow: 'hidden' },
  barFill: { borderRadius: sc(10) },

  // Section
  section:       { paddingHorizontal: sc(16), marginTop: sc(24) },
  secHeader:     { flexDirection: 'row', alignItems: 'center', marginBottom: sc(14) },
  secHeaderDot:  { width: sc(4), height: sc(18), borderRadius: sc(2), backgroundColor: C.primary, marginRight: sc(10) },
  secHeaderText: { fontSize: sc(17), fontWeight: '800', color: C.text, letterSpacing: -0.3 },

  // Stat grid
  statGrid: {
    flexDirection: 'row', gap: sc(10),
  },
  statBubble: {
    flex: 1, backgroundColor: C.surface, borderRadius: sc(14),
    paddingVertical: sc(14), alignItems: 'center',
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  statDot:   { width: sc(10), height: sc(10), borderRadius: sc(5), marginBottom: sc(6) },
  statCount: { fontSize: sc(22), fontWeight: '900', letterSpacing: -0.5, marginBottom: sc(2) },
  statLabel: { fontSize: sc(9), fontWeight: '700', color: C.muted, letterSpacing: 0.5, textAlign: 'center' },

  // Marks card
  marksCard: {
    backgroundColor: C.surface, borderRadius: sc(16),
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  marksRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: sc(16),
  },
  marksLeft:     { flexDirection: 'row', alignItems: 'center', gap: sc(10) },
  marksIcon:     { fontSize: sc(16) },
  marksLabel:    { fontSize: sc(13), fontWeight: '600', color: C.text },
  marksVal:      { fontSize: sc(16), fontWeight: '800', letterSpacing: -0.3 },
  marksDivider:  { height: 1, backgroundColor: C.border },
  marksTotal:    { backgroundColor: C.primaryLight },
  marksTotalLabel: { fontSize: sc(14), fontWeight: '800', color: C.primary },
  marksTotalVal:   { fontSize: sc(18), fontWeight: '900', letterSpacing: -0.5 },

  // Section breakdown card
  secCard: {
    backgroundColor: C.surface, borderRadius: sc(16),
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  secRow:     { flexDirection: 'row', alignItems: 'center', padding: sc(14), gap: sc(10) },
  secLeft:    { flexDirection: 'row', alignItems: 'center', gap: sc(10), width: sc(130) },
  secIcon:    { fontSize: sc(18) },
  secLabel:   { fontSize: sc(12), fontWeight: '700', color: C.text },
  secSub:     { fontSize: sc(10), color: C.muted, fontWeight: '500' },
  secMid:     { flex: 1, gap: sc(4) },
  secPct:     { fontSize: sc(10), color: C.sub, fontWeight: '600' },
  secRight:   { alignItems: 'flex-end', minWidth: sc(36) },
  secScore:   { fontSize: sc(16), fontWeight: '800', letterSpacing: -0.3 },
  secScoreSub:{ fontSize: sc(10), color: C.muted, fontWeight: '600' },
  secDivider: { height: 1, backgroundColor: C.border, marginHorizontal: sc(14) },

  // Insight
  insightCard: {
    backgroundColor: C.surface, borderRadius: sc(16),
    borderWidth: 1, borderColor: C.border, padding: sc(16),
    gap: sc(12),
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  insightRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: sc(10) },
  insightIcon: { fontSize: sc(16), marginTop: sc(1) },
  insightText: { flex: 1, fontSize: sc(13), color: C.sub, fontWeight: '500', lineHeight: sc(19) },

  // CTA
  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.surface, flexDirection: 'row',
    paddingHorizontal: sc(16), paddingTop: sc(12),
    paddingBottom: Platform.OS === 'ios' ? sc(28) : sc(16),
    borderTopWidth: 1, borderTopColor: C.border, gap: sc(10),
  },
  ctaSecondary: {
    flex: 1, paddingVertical: sc(14), borderRadius: sc(14),
    borderWidth: 1.5, borderColor: C.border, alignItems: 'center',
    backgroundColor: C.surface,
  },
  ctaSecondaryText: { fontSize: sc(13), fontWeight: '700', color: C.text },
  ctaPrimary: {
    flex: 1.8, paddingVertical: sc(14), borderRadius: sc(14),
    backgroundColor: C.primary, alignItems: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  ctaPrimaryText: { fontSize: sc(14), fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
});