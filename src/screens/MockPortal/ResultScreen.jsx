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
  marked:       '#7C3AED',
  unattempted:  '#94A3B8',
  unattemptedBg:'#F1F5F9',
  gold:         '#D97706',
  goldSoft:     '#FEF3C7',
  shadow:       '#0D1F15',
};

const computeResult = (questionMeta, questions) => {
  let correct = 0, wrong = 0, unattempted = 0, tita_correct = 0;

  questions.forEach(q => {
    const meta = questionMeta?.[q.id];

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
      else unattempted++;
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
  if (pct >= 80) return { label: 'Excellent', emoji: '🏆', color: C.primaryMid, bg: C.primaryLight };
  if (pct >= 60) return { label: 'Good',       emoji: '👍', color: C.primary,    bg: C.primaryLight };
  if (pct >= 40) return { label: 'Average',    emoji: '📈', color: C.gold,       bg: C.goldSoft    };
  return            { label: 'Needs Work',   emoji: '💪', color: C.wrong,      bg: C.wrongBg     };
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
      <Text style={[s.scoreNum, { color: score >= 0 ? C.primary : C.wrong }]}>{disp}</Text>
      <Text style={s.scoreMax}>/{maxScore}</Text>
    </View>
  );
};

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

const StatBubble = ({ count, label, color, bg, delay }) => {
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
      <View style={[s.statIconWrap, { backgroundColor: bg }]}>
        <View style={[s.statDot, { backgroundColor: color }]} />
      </View>
      <Text style={[s.statCount, { color }]}>{count}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </Animated.View>
  );
};

const SectionRow = ({ label, icon, res, delay }) => {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, delay, useNativeDriver: true }).start();
  }, []);
  const pct      = res.total > 0 ? Math.round((res.correct / res.total) * 100) : 0;
  const score    = res.correct * 3 - res.wrong * 1;
  const barColor = pct >= 60 ? C.correct : pct >= 40 ? C.gold : C.wrong;
  const scorePosColor = score >= 0 ? C.correct : C.wrong;
  const scoreBg       = score >= 0 ? C.correctBg : C.wrongBg;

  return (
    <Animated.View style={[s.secRow, { opacity: fade }]}>

      {/* ── Top: icon + label + score pill ── */}
      <View style={s.secTopRow}>
        <View style={s.secTitleGroup}>
          <View style={s.secIconWrap}>
            <Text style={s.secIcon}>{icon}</Text>
          </View>
          <View>
            <Text style={s.secLabel}>{label}</Text>
            <Text style={s.secSub}>{res.total} Qs · {res.correct}C · {res.wrong}W · {res.unattempted}U</Text>
          </View>
        </View>
        <View style={[s.secScorePill, { backgroundColor: scoreBg }]}>
          <Text style={[s.secScore, { color: scorePosColor }]}>
            {score >= 0 ? '+' : ''}{score} pts
          </Text>
        </View>
      </View>

      {/* ── Bottom: progress bar + accuracy ── */}
      <View style={s.secBarSection}>
        <AnimBar pct={pct} color={barColor} delay={delay} height={sc(6)} />
        <View style={s.secBarFooter}>
          <Text style={[s.secPct, { color: barColor }]}>{pct}% accuracy</Text>
          <Text style={s.secAttempted}>{res.attempted}/{res.total} attempted</Text>
        </View>
      </View>

    </Animated.View>
  );
};

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

  const examConfig    = route?.params?.examConfig ?? getExamData(mockId);
  const activeSection = examConfig.sections.find(s => !s.locked);
  const questions     = activeSection?.questions ?? [];

  const result = computeResult(questionMeta, questions);
  const { rc, va } = splitRCVA(questionMeta, questions);

  const scorePct   = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
  const perf       = getPerformanceLabel(scorePct);
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

          {/* Top label row */}
          <View style={s.heroTopRow}>
            <View>
              <Text style={s.heroTestName}>{examConfig.testTitle}</Text>
              <Text style={s.heroSection}>{activeSection?.label ?? 'VARC'} Section</Text>
            </View>
            <View style={[s.perfBadge, { backgroundColor: perf.bg }]}>
              <Text style={s.perfEmoji}>{perf.emoji}</Text>
              <Text style={[s.perfText, { color: perf.color }]}>{perf.label}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={s.heroDivider} />

          {/* Score + bar */}
          <View style={s.heroScoreSection}>
            <View style={s.heroScoreLeft}>
              <Text style={s.heroScoreLabel}>YOUR SCORE</Text>
              <AnimatedScore score={result.score} maxScore={result.maxScore} />
            </View>
            <View style={s.heroScoreRight}>
              <View style={s.heroRingWrap}>
                <Text style={s.heroRingPct}>{scorePct}%</Text>
                <Text style={s.heroRingLabel}>of max</Text>
              </View>
            </View>
          </View>

          {/* Overall progress bar */}
          <View style={s.heroBarWrap}>
            <AnimBar pct={Math.max(scorePct, 0)} color={C.primaryMid} delay={400} height={sc(7)} />
          </View>

          {/* Divider */}
          <View style={s.heroDivider} />

          {/* Metrics row */}
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
        </Animated.View>

        {/* ── QUESTION STATS ── */}
        <View style={s.section}>
          <SecHeader label="Question Breakdown" />
          <View style={s.statGrid}>
            <StatBubble count={result.correct}    label="Correct"     color={C.correct}     bg={C.correctBg}     delay={200} />
            <StatBubble count={result.wrong}       label="Wrong"       color={C.wrong}       bg={C.wrongBg}       delay={300} />
            <StatBubble count={result.unattempted} label="Unattempted" color={C.unattempted} bg={C.unattemptedBg} delay={400} />
            <StatBubble count={result.attempted}   label="Attempted"   color={C.primary}     bg={C.primaryLight}  delay={500} />
          </View>
        </View>

        {/* ── MARKS SUMMARY ── */}
        <View style={s.section}>
          <SecHeader label="Marks Summary" />
          <View style={s.marksCard}>
            <View style={s.marksRow}>
              <View style={s.marksLeft}>
                <View style={[s.marksIconWrap, { backgroundColor: C.correctBg }]}>
                  <Text style={s.marksIcon}>✅</Text>
                </View>
                <View>
                  <Text style={s.marksLabel}>Correct</Text>
                  <Text style={s.marksSubLabel}>+3 marks each</Text>
                </View>
              </View>
              <View style={s.marksValWrap}>
                <Text style={[s.marksVal, { color: C.correct }]}>+{result.correct * 3}</Text>
              </View>
            </View>
            <View style={s.marksDivider} />
            <View style={s.marksRow}>
              <View style={s.marksLeft}>
                <View style={[s.marksIconWrap, { backgroundColor: C.wrongBg }]}>
                  <Text style={s.marksIcon}>❌</Text>
                </View>
                <View>
                  <Text style={s.marksLabel}>Wrong</Text>
                  <Text style={s.marksSubLabel}>−1 mark each</Text>
                </View>
              </View>
              <View style={s.marksValWrap}>
                <Text style={[s.marksVal, { color: C.wrong }]}>−{result.wrong}</Text>
              </View>
            </View>
            <View style={s.marksDivider} />
            <View style={[s.marksRow, s.marksTotal]}>
              <View style={s.marksLeft}>
                <View style={[s.marksIconWrap, { backgroundColor: C.primaryLight }]}>
                  <Text style={s.marksIcon}>🏅</Text>
                </View>
                <Text style={s.marksTotalLabel}>Total Score</Text>
              </View>
              <Text style={[s.marksTotalVal, { color: result.score >= 0 ? C.primary : C.wrong }]}>
                {result.score >= 0 ? '+' : ''}{result.score} / {result.maxScore}
              </Text>
            </View>
          </View>
        </View>

        {/* ── SECTION BREAKDOWN ── */}
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
              color={result.accuracy >= 70 ? C.correctBg : C.goldSoft}
              text={
                result.accuracy >= 70
                  ? `Great accuracy at ${result.accuracy}%! Focus on attempting more questions.`
                  : `Accuracy needs work (${result.accuracy}%). Avoid guessing — negative marking hurts.`
              }
            />
            <InsightRow
              icon={result.unattempted > questions.length * 0.4 ? '📌' : '✅'}
              color={result.unattempted > questions.length * 0.4 ? C.goldSoft : C.correctBg}
              text={
                result.unattempted > questions.length * 0.4
                  ? `${result.unattempted} questions unattempted. Time management needs improvement.`
                  : `Good attempt rate! Only ${result.unattempted} questions left unattempted.`
              }
            />
            <InsightRow
              icon="📊"
              color={C.primaryLight}
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
            navigation?.navigate('solution', {
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

const InsightRow = ({ icon, text, color }) => (
  <View style={s.insightRow}>
    <View style={[s.insightIconWrap, { backgroundColor: color }]}>
      <Text style={s.insightIcon}>{icon}</Text>
    </View>
    <Text style={s.insightText}>{text}</Text>
  </View>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Navbar
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

  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: C.surface,
    marginHorizontal: sc(16),
    marginTop: sc(16),
    borderRadius: sc(20),
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  // Hero top row
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: sc(18),
    paddingBottom: sc(14),
  },
  heroTestName: {
    fontSize: sc(13), fontWeight: '700', color: C.text,
    letterSpacing: -0.1, marginBottom: sc(3),
  },
  heroSection: {
    fontSize: sc(11), fontWeight: '600', color: C.muted, letterSpacing: 0.5,
  },
  perfBadge: {
    flexDirection: 'row', alignItems: 'center', gap: sc(5),
    paddingHorizontal: sc(10), paddingVertical: sc(6),
    borderRadius: sc(10),
  },
  perfEmoji: { fontSize: sc(13) },
  perfText:  { fontSize: sc(12), fontWeight: '800', letterSpacing: -0.1 },

  heroDivider: { height: 1, backgroundColor: C.borderLight, marginHorizontal: sc(18) },

  // Hero score section
  heroScoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sc(18),
    paddingTop: sc(16),
    paddingBottom: sc(12),
  },
  heroScoreLeft:  { flex: 1 },
  heroScoreLabel: {
    fontSize: sc(10), fontWeight: '700', color: C.muted,
    letterSpacing: 1.2, marginBottom: sc(4),
  },
  scoreBig: {
    flexDirection: 'row', alignItems: 'flex-end',
  },
  scoreNum: {
    fontSize: sc(64), fontWeight: '900',
    lineHeight: sc(70), letterSpacing: -3,
  },
  scoreMax: {
    fontSize: sc(20), fontWeight: '700', color: C.muted,
    marginBottom: sc(8), marginLeft: sc(3),
  },

  heroScoreRight: { alignItems: 'center', justifyContent: 'center' },
  heroRingWrap: {
    width: sc(72), height: sc(72),
    borderRadius: sc(36),
    borderWidth: sc(5),
    borderColor: C.primaryMid,
    backgroundColor: C.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  heroRingPct:   { fontSize: sc(17), fontWeight: '900', color: C.primary, letterSpacing: -0.5 },
  heroRingLabel: { fontSize: sc(9), fontWeight: '600', color: C.sub },

  // Hero bar
  heroBarWrap: {
    paddingHorizontal: sc(18),
    paddingBottom: sc(16),
  },
  barBg:   { backgroundColor: C.primaryLight, borderRadius: sc(10), overflow: 'hidden' },
  barFill: { borderRadius: sc(10) },

  // Hero metrics row
  heroMetaRow: {
    flexDirection: 'row',
    paddingVertical: sc(14),
    paddingHorizontal: sc(8),
  },
  heroMeta:        { flex: 1, alignItems: 'center' },
  heroMetaVal:     { fontSize: sc(15), fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  heroMetaLabel:   { fontSize: sc(10), fontWeight: '600', color: C.muted, marginTop: sc(2) },
  heroMetaDivider: {
    width: 1, height: sc(28),
    backgroundColor: C.border,
    alignSelf: 'center',
  },

  // ── SECTIONS ──────────────────────────────────────────────────────────────
  section:       { paddingHorizontal: sc(16), marginTop: sc(24) },
  secHeader:     { flexDirection: 'row', alignItems: 'center', marginBottom: sc(14) },
  secHeaderDot:  {
    width: sc(4), height: sc(16), borderRadius: sc(2),
    backgroundColor: C.primaryMid, marginRight: sc(10),
  },
  secHeaderText: { fontSize: sc(16), fontWeight: '800', color: C.text, letterSpacing: -0.3 },

  // Stat grid
  statGrid: { flexDirection: 'row', gap: sc(10) },
  statBubble: {
    flex: 1, backgroundColor: C.surface, borderRadius: sc(14),
    paddingVertical: sc(14), alignItems: 'center',
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  statIconWrap: {
    width: sc(28), height: sc(28), borderRadius: sc(8),
    alignItems: 'center', justifyContent: 'center', marginBottom: sc(8),
  },
  statDot:   { width: sc(10), height: sc(10), borderRadius: sc(5) },
  statCount: { fontSize: sc(22), fontWeight: '900', letterSpacing: -0.5, marginBottom: sc(2) },
  statLabel: { fontSize: sc(9), fontWeight: '700', color: C.muted, letterSpacing: 0.3, textAlign: 'center' },

  // Marks card
  marksCard: {
    backgroundColor: C.surface, borderRadius: sc(16),
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  marksRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: sc(14), paddingHorizontal: sc(16),
  },
  marksLeft:    { flexDirection: 'row', alignItems: 'center', gap: sc(12) },
  marksIconWrap:{
    width: sc(36), height: sc(36), borderRadius: sc(10),
    alignItems: 'center', justifyContent: 'center',
  },
  marksIcon:    { fontSize: sc(16) },
  marksLabel:   { fontSize: sc(13), fontWeight: '700', color: C.text },
  marksSubLabel:{ fontSize: sc(10), fontWeight: '500', color: C.muted, marginTop: sc(1) },
  marksValWrap: {
    backgroundColor: C.bg, paddingHorizontal: sc(12), paddingVertical: sc(6),
    borderRadius: sc(10), borderWidth: 1, borderColor: C.border,
  },
  marksVal:     { fontSize: sc(16), fontWeight: '800', letterSpacing: -0.3 },
  marksDivider: { height: 1, backgroundColor: C.borderLight },
  marksTotal:   { backgroundColor: C.primarySoft },
  marksTotalLabel: { fontSize: sc(14), fontWeight: '800', color: C.primary },
  marksTotalVal:   { fontSize: sc(18), fontWeight: '900', letterSpacing: -0.5 },

  // Section breakdown
  secCard: {
    backgroundColor: C.surface, borderRadius: sc(16),
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  secRow: { padding: sc(16), gap: sc(12) },
  secTopRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: sc(10),
  },
  secTitleGroup: {
    flexDirection: 'row', alignItems: 'center',
    gap: sc(10), flex: 1,
  },
  secIconWrap: {
    width: sc(38), height: sc(38), borderRadius: sc(10),
    backgroundColor: C.primaryLight, alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  secIcon:  { fontSize: sc(18) },
  secLabel: { fontSize: sc(13), fontWeight: '800', color: C.text, letterSpacing: -0.2 },
  secSub:   { fontSize: sc(10), color: C.muted, fontWeight: '500', marginTop: sc(2) },
  secScorePill: {
    paddingHorizontal: sc(10), paddingVertical: sc(5),
    borderRadius: sc(10), flexShrink: 0,
  },
  secScore: { fontSize: sc(14), fontWeight: '800', letterSpacing: -0.3 },
  secBarSection: { gap: sc(6) },
  secBarFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  secPct:      { fontSize: sc(11), fontWeight: '700' },
  secAttempted:{ fontSize: sc(11), fontWeight: '600', color: C.muted },
  secDivider:  { height: 1, backgroundColor: C.borderLight },

  // Insight
  insightCard: {
    backgroundColor: C.surface, borderRadius: sc(16),
    borderWidth: 1, borderColor: C.border, padding: sc(14),
    gap: sc(10),
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  insightRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: sc(12) },
  insightIconWrap:{
    width: sc(34), height: sc(34), borderRadius: sc(10),
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  insightIcon: { fontSize: sc(16) },
  insightText: { flex: 1, fontSize: sc(13), color: C.sub, fontWeight: '500', lineHeight: sc(19), paddingTop: sc(7) },

  // CTA
  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.surface, flexDirection: 'row',
    paddingHorizontal: sc(16), paddingTop: sc(12),
    paddingBottom: Platform.OS === 'ios' ? sc(28) : sc(16),
    borderTopWidth: 1, borderTopColor: C.border, gap: sc(10),
    shadowColor: C.shadow, shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06, shadowRadius: 12,
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
    shadowOpacity: 0.30, shadowRadius: 12, elevation: 6,
  },
  ctaPrimaryText: { fontSize: sc(14), fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
});