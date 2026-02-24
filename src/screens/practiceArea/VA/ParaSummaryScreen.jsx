import React, { useState, useRef } from 'react';
import { PS_LEARN_CARDS as LEARN_CARDS, PS_QUESTIONS as QUESTIONS } from './dataa/summaryContent';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── DYNAMIC INIT ────────────────────────────────────────────────────────────

const initAnswers    = Object.fromEntries(QUESTIONS.map((q) => [q.id, null]));
const initChecked    = Object.fromEntries(QUESTIONS.map((q) => [q.id, false]));
const initShakeAnims = Object.fromEntries(QUESTIONS.map((q) => [q.id, new Animated.Value(0)]));

// ─── TRAP TYPE BADGE COLORS ──────────────────────────────────────────────────

const TRAP_COLORS = {
  'TOO NARROW':  { bg: '#FFF3CD', text: '#92400E' },
  'INTRODUCED':  { bg: '#FCE7F3', text: '#9D174D' },
  'DISTORTED':   { bg: '#F3E8FF', text: '#6B21A8' },
  'WRONG TONE':  { bg: '#FFE4E1', text: '#991B1B' },
};

// ─── SCREEN ───────────────────────────────────────────────────────────────────

export default function ParaSummaryScreen({ navigation }) {
  const [activeLearnTab, setActiveLearnTab] = useState(0);
  const [answers, setAnswers]   = useState(initAnswers);
  const [checked, setChecked]   = useState(initChecked);
  const scrollRef = useRef(null);
  const shakeAnims = useRef(initShakeAnims).current;

  const currentCard = LEARN_CARDS[activeLearnTab];

  const goToLearnTab = (i) => {
    setActiveLearnTab(i);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSelect = (qId, optId) => {
    if (checked[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleCheck = (qId) => {
    if (!answers[qId]) return;
    const q = QUESTIONS.find((q) => q.id === qId);
    const isCorrect = answers[qId] === q.explanation.correct;
    setChecked((prev) => ({ ...prev, [qId]: true }));
    if (!isCorrect) {
      Animated.sequence([
        Animated.timing(shakeAnims[qId], { toValue: 9,  duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: -9, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: 6,  duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: 0,  duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  const getOptionStyle = (qId, optId) => {
    const isCheckedQ = checked[qId];
    const isSelected = answers[qId] === optId;
    const correctId  = QUESTIONS.find((q) => q.id === qId).explanation.correct;
    if (!isCheckedQ) return isSelected ? [styles.option, styles.optionSelected] : [styles.option];
    if (optId === correctId) return [styles.option, styles.optionCorrect];
    if (isSelected)          return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDim];
  };

  const getLetterBg = (qId, optId) => {
    const isCheckedQ = checked[qId];
    const isSelected = answers[qId] === optId;
    const correctId  = QUESTIONS.find((q) => q.id === qId).explanation.correct;
    if (!isCheckedQ) return isSelected ? '#0f4c75' : '#C2D4E4';
    if (optId === correctId) return '#16a34a';
    if (isSelected)          return '#dc2626';
    return '#C2D4E4';
  };

  const totalAnswered = Object.values(answers).filter(Boolean).length;
  const totalChecked  = Object.values(checked).filter(Boolean).length;
  const totalCorrect  = QUESTIONS.filter(q => checked[q.id] && answers[q.id] === q.explanation.correct).length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>Para Summary</Text>
          <Text style={styles.headerSub}>VERBAL ABILITY · CAT PREP</Text>
        </View>
        <View style={styles.scorePill}>
          <Text style={styles.scorePillText}>{totalCorrect}/{QUESTIONS.length}</Text>
        </View>
      </View>

      {/* ── PROGRESS BAR ── */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((activeLearnTab + 1) / LEARN_CARDS.length) * 100}%` },
          ]}
        />
      </View>

      {/* ── QUICK STATS BAR ── */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{LEARN_CARDS.length}</Text>
          <Text style={styles.statLabel}>Strategies</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{QUESTIONS.length}</Text>
          <Text style={styles.statLabel}>Exercises</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: totalCorrect > 0 ? '#16a34a' : '#94A3B8' }]}>
            {totalCorrect}
          </Text>
          <Text style={styles.statLabel}>Correct</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>~8 min</Text>
          <Text style={styles.statLabel}>Est. Time</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ════════ WHAT IS PARA SUMMARY? ════════ */}

        <View style={styles.introCard}>
          <View style={styles.introLeft}>
            <Text style={styles.introEmoji}>📝</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.introTitle}>What is Para Summary?</Text>
            <Text style={styles.introBody}>
              You are given a short passage (4–6 sentences) and must choose the option that BEST summarises it in one sentence. CAT tests your ability to distill the central idea without distortion or omission.
            </Text>
          </View>
        </View>

        {/* Trap Quick Reference */}
        <View style={styles.trapRefWrap}>
          <Text style={styles.trapRefTitle}>⚠️ Know the 4 Trap Types</Text>
          <View style={styles.trapRefGrid}>
            {[
              { type: 'TOO NARROW', desc: 'Only one detail' },
              { type: 'TOO BROAD',  desc: 'Overclaims scope' },
              { type: 'INTRODUCED', desc: 'Unsaid info added' },
              { type: 'DISTORTED',  desc: 'Tone/conclusion twisted' },
            ].map((t) => (
              <View key={t.type} style={[styles.trapRefChip, { backgroundColor: TRAP_COLORS[t.type]?.bg ?? '#F1F5F9' }]}>
                <Text style={[styles.trapRefChipType, { color: TRAP_COLORS[t.type]?.text ?? '#374151' }]}>
                  {t.type}
                </Text>
                <Text style={styles.trapRefChipDesc}>{t.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ════════ LEARN SECTION ════════ */}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionHeaderText}>LEARN THE STRATEGIES</Text>
          </View>
        </View>

        {/* Strategy Tab Pills */}
        <View style={styles.tabRow}>
          {LEARN_CARDS.map((card, i) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => goToLearnTab(i)}
              style={[
                styles.tabPill,
                activeLearnTab === i && { backgroundColor: card.accentColor },
              ]}
            >
              <Text style={[styles.tabPillText, activeLearnTab === i && { color: '#fff' }]}>
                {card.icon}  S0{card.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Badge */}
        <View style={[styles.badgeWrap, { backgroundColor: currentCard.bgColor }]}>
          <Text style={[styles.badgeText, { color: currentCard.accentColor }]}>
            {currentCard.badge}
          </Text>
        </View>

        {/* Hero Card */}
        <View style={[styles.heroCard, { borderLeftColor: currentCard.accentColor }]}>
          <View style={styles.heroTopRow}>
            <Text style={styles.heroIcon}>{currentCard.icon}</Text>
            <Text style={[styles.heroTitle, { color: currentCard.accentColor }]}>
              {currentCard.title}
            </Text>
          </View>
          <Text style={styles.heroDesc}>{currentCard.description}</Text>
        </View>

        {/* Steps */}
        <Text style={styles.stepsHeading}>Step-by-Step Approach</Text>
        {currentCard.steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={[styles.stepNum, { backgroundColor: currentCard.accentColor }]}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        {/* Tip */}
        <View style={[styles.tipCard, { backgroundColor: currentCard.bgColor, borderColor: currentCard.accentColor }]}>
          <Text style={[styles.tipText, { color: currentCard.accentColor }]}>{currentCard.tip}</Text>
        </View>

        {/* Example */}
        <Text style={styles.stepsHeading}>See It In Action</Text>

        {/* Passage Box */}
        <View style={[styles.passageBox, { borderLeftColor: currentCard.accentColor }]}>
          <Text style={[styles.passageLabel, { color: currentCard.accentColor }]}>PASSAGE</Text>
          <Text style={styles.passageText}>{currentCard.example.passage}</Text>
        </View>

        {/* Example Options */}
        {currentCard.example.options.map((s, i) => (
          <View
            key={i}
            style={[
              styles.exRow,
              s.role === 'CORRECT' && { borderColor: currentCard.accentColor, borderWidth: 1.8 },
            ]}
          >
            <View style={[
              styles.exLetter,
              { backgroundColor: s.role === 'CORRECT' ? currentCard.accentColor : '#C2D4E4' },
            ]}>
              <Text style={styles.exLetterText}>{s.label}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.exText}>{s.text}</Text>
              {s.role && s.role !== 'CORRECT' && (
                <View style={[
                  styles.trapBadge,
                  { backgroundColor: TRAP_COLORS[s.role.replace('TRAP: ', '')]?.bg ?? '#F1F5F9' },
                ]}>
                  <Text style={[
                    styles.trapBadgeText,
                    { color: TRAP_COLORS[s.role.replace('TRAP: ', '')]?.text ?? '#374151' },
                  ]}>
                    ✗ {s.role}
                  </Text>
                </View>
              )}
              {s.role === 'CORRECT' && (
                <View style={[styles.correctBadge, { backgroundColor: currentCard.bgColor }]}>
                  <Text style={[styles.correctBadgeText, { color: currentCard.accentColor }]}>
                    ✓ BEST SUMMARY
                  </Text>
                </View>
              )}
              <Text style={styles.exNote}>{s.note}</Text>
            </View>
          </View>
        ))}

        {/* Explanation */}
        <View style={[styles.explanationBox, { borderLeftColor: currentCard.accentColor }]}>
          <Text style={styles.exIcon}>📌</Text>
          <Text style={styles.exExplanation}>{currentCard.example.explanation}</Text>
        </View>

        {/* Learn Nav */}
        <View style={styles.learnNavRow}>
          {activeLearnTab > 0 && (
            <TouchableOpacity
              style={[styles.learnNavBtn, styles.learnNavOutline, { borderColor: currentCard.accentColor }]}
              onPress={() => goToLearnTab(activeLearnTab - 1)}
            >
              <Text style={[styles.learnNavOutlineText, { color: currentCard.accentColor }]}>
                ← Prev
              </Text>
            </TouchableOpacity>
          )}
          {activeLearnTab < LEARN_CARDS.length - 1 && (
            <TouchableOpacity
              style={[styles.learnNavBtn, { backgroundColor: currentCard.accentColor, flex: 1 }]}
              onPress={() => goToLearnTab(activeLearnTab + 1)}
            >
              <Text style={styles.learnNavFillText}>Next Strategy →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {LEARN_CARDS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeLearnTab === i && { backgroundColor: currentCard.accentColor, width: 22 },
              ]}
            />
          ))}
        </View>

        {/* ════════ PRACTICE SECTION ════════ */}

        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.sectionDot, { backgroundColor: '#16a34a' }]} />
            <Text style={styles.sectionHeaderText}>PRACTICE QUESTIONS</Text>
          </View>
          <Text style={styles.sectionHeaderSub}>Apply the strategies</Text>
        </View>

        {QUESTIONS.map((q) => {
          const isCheckedQ = checked[q.id];
          const isCorrect  = answers[q.id] === q.explanation.correct;

          return (
            <View key={q.id} style={styles.questionBlock}>

              {/* Strategy hint banner */}
              <View style={styles.strategyBanner}>
                <Text style={styles.strategyIcon}>{q.strategy.icon}</Text>
                <Text style={styles.strategyLabel}>{q.strategy.label}</Text>
              </View>

              {/* Meta row */}
              <View style={styles.qMeta}>
                <View style={styles.exerciseBadge}>
                  <Text style={styles.exerciseBadgeText}>{q.exerciseNo}</Text>
                </View>
                <Text style={styles.qCounter}>{q.id} of {q.total}</Text>
              </View>

              <Text style={styles.qTitle}>Para Summary</Text>
              <Text style={styles.qInstruction}>{q.instruction}</Text>

              {/* Passage */}
              <View style={styles.qPassageBox}>
                <View style={styles.qPassageLabelRow}>
                  <View style={styles.qPassageLabelDot} />
                  <Text style={styles.qPassageLabel}>PASSAGE</Text>
                </View>
                <Text style={styles.qPassageText}>{q.passage}</Text>
              </View>

              {/* Options */}
              <Text style={styles.chooseLabel}>Choose the best summary:</Text>

              <Animated.View style={{ transform: [{ translateX: shakeAnims[q.id] }] }}>
                {q.options.map((opt) => {
                  const isChecked  = isCheckedQ;
                  const isSelected = answers[q.id] === opt.id;
                  const isRight    = opt.id === q.explanation.correct;

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      activeOpacity={isCheckedQ ? 1 : 0.75}
                      onPress={() => handleSelect(q.id, opt.id)}
                      style={getOptionStyle(q.id, opt.id)}
                    >
                      <View style={[styles.optLetter, { backgroundColor: getLetterBg(q.id, opt.id) }]}>
                        <Text style={styles.optLetterText}>{opt.id}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        {opt.highlight ? (
                          <Text style={styles.optText}>
                            <Text style={styles.highlight}>{opt.highlight}</Text>
                            {opt.text.replace(opt.highlight, '')}
                          </Text>
                        ) : (
                          <Text style={styles.optText}>{opt.text}</Text>
                        )}

                        {/* After check: show trap type badge on wrong options */}
                        {isChecked && !isRight && opt.trapType && (
                          <View style={[
                            styles.trapTag,
                            { backgroundColor: TRAP_COLORS[opt.trapType]?.bg ?? '#F1F5F9' },
                          ]}>
                            <Text style={[
                              styles.trapTagText,
                              { color: TRAP_COLORS[opt.trapType]?.text ?? '#374151' },
                            ]}>
                              ✗ {opt.trapType}
                            </Text>
                          </View>
                        )}

                        {/* After check: reason for wrong selected */}
                        {isChecked && isSelected && !isRight && opt.reason && (
                          <Text style={styles.reasonText}>↳ {opt.reason}</Text>
                        )}

                        {/* Correct tag */}
                        {isChecked && isRight && (
                          <View style={styles.correctTag}>
                            <Text style={styles.correctTagText}>✓ Best Summary</Text>
                          </View>
                        )}

                        {/* Wrong selected tag */}
                        {isChecked && isSelected && !isRight && (
                          <View style={styles.wrongTag}>
                            <Text style={styles.wrongTagText}>✗ Incorrect</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>

              {/* Feedback after check */}
              {isCheckedQ && (
                <View style={[styles.feedbackBox, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
                  <Text style={styles.feedbackEmoji}>{isCorrect ? '🎯' : '💡'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.feedbackTitle}>
                      {isCorrect
                        ? 'Excellent! You found the central idea.'
                        : `Correct answer is ${q.explanation.correct}`}
                    </Text>
                    <Text style={styles.feedbackBody}>{q.explanation.why}</Text>
                  </View>
                </View>
              )}

              {/* Check Button */}
              {!isCheckedQ && (
                <TouchableOpacity
                  style={[styles.checkBtn, !answers[q.id] && styles.checkBtnDisabled]}
                  onPress={() => handleCheck(q.id)}
                  disabled={!answers[q.id]}
                >
                  <Text style={styles.checkBtnText}>Check Answer ✓✓</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* ── Final Score Card ── */}
        {totalChecked === QUESTIONS.length && (
          <View style={styles.finalCard}>
            <Text style={styles.finalEmoji}>
              {totalCorrect === QUESTIONS.length ? '🏆' : totalCorrect >= QUESTIONS.length / 2 ? '💪' : '📚'}
            </Text>
            <Text style={styles.finalTitle}>
              {totalCorrect === QUESTIONS.length
                ? 'Perfect Score!'
                : totalCorrect >= QUESTIONS.length / 2
                ? 'Good Progress!'
                : 'Keep Practising!'}
            </Text>
            <Text style={styles.finalScore}>{totalCorrect} / {QUESTIONS.length}</Text>
            <Text style={styles.finalSubtitle}>Para Summary exercises completed</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F7FB' },

  // ─── HEADER ───
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14,
    backgroundColor: '#0a2540',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, color: '#fff', fontWeight: '700' },
  headerMid: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
  headerSub:   { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.55)', letterSpacing: 1.2, marginTop: 2 },
  scorePill: {
    backgroundColor: '#1e88e5', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  scorePillText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  progressTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.15)', backgroundColor: '#1e3a5f' },
  progressFill:  { height: 3, backgroundColor: '#38bdf8', borderRadius: 2 },

  // ─── STATS BAR ───
  statsBar: {
    flexDirection: 'row', backgroundColor: '#0f3460',
    paddingVertical: 10, paddingHorizontal: 16,
    alignItems: 'center', justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statNum:  { fontSize: 14, fontWeight: '800', color: '#fff' },
  statLabel:{ fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.12)' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 18 },

  // ─── INTRO CARD ───
  introCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16,
    padding: 16, marginBottom: 14, gap: 12, alignItems: 'flex-start',
    shadowColor: '#0a2540', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  introLeft: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#EBF5FF',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  introEmoji: { fontSize: 22 },
  introTitle: { fontSize: 14, fontWeight: '800', color: '#0a2540', marginBottom: 4 },
  introBody:  { fontSize: 13, lineHeight: 20, color: '#4B5563' },

  // ─── TRAP QUICK REFERENCE ───
  trapRefWrap: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  trapRefTitle: { fontSize: 13, fontWeight: '800', color: '#111827', marginBottom: 10 },
  trapRefGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trapRefChip:  { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, flex: 1, minWidth: '45%' },
  trapRefChipType: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
  trapRefChipDesc: { fontSize: 11, color: '#6B7280', fontWeight: '500' },

  // ─── SECTION HEADER ───
  sectionHeader: { marginBottom: 14 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  sectionDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0f4c75' },
  sectionHeaderText: { fontSize: 11, fontWeight: '800', color: '#6B7594', letterSpacing: 1.4 },
  sectionHeaderSub:  { fontSize: 13, fontWeight: '600', color: '#374151', marginLeft: 16 },

  // ─── TABS ───
  tabRow:     { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tabPill:    { flex: 1, paddingVertical: 9, borderRadius: 22, backgroundColor: '#E2EAF2', alignItems: 'center' },
  tabPillText:{ fontSize: 12, fontWeight: '700', color: '#6B7594' },

  // ─── BADGE ───
  badgeWrap: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 10 },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },

  // ─── HERO CARD ───
  heroCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    borderLeftWidth: 4, marginBottom: 18,
    shadowColor: '#0a2540', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  heroTopRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  heroIcon:    { fontSize: 26 },
  heroTitle:   { fontSize: 18, fontWeight: '800', letterSpacing: 0.1, flex: 1 },
  heroDesc:    { fontSize: 14, lineHeight: 22, color: '#374151' },

  // ─── STEPS ───
  stepsHeading: { fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 12 },
  stepRow:  { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 12 },
  stepNum:  {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  stepNumText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  stepText:    { flex: 1, fontSize: 13.5, lineHeight: 21, color: '#374151' },

  // ─── TIP ───
  tipCard: { borderRadius: 12, padding: 14, borderWidth: 1.5, marginBottom: 20, marginTop: 4 },
  tipText: { fontSize: 13, lineHeight: 20, fontWeight: '500' },

  // ─── PASSAGE BOX (Learn) ───
  passageBox: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    borderLeftWidth: 3, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  passageLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  passageText:  { fontSize: 13.5, lineHeight: 22, color: '#1F2937', fontStyle: 'italic' },

  // ─── EXAMPLE ROWS ───
  exRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 13,
    padding: 13, marginBottom: 8, gap: 10, borderWidth: 1, borderColor: '#E2EAF2',
  },
  exLetter:     { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  exLetterText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  exText:       { fontSize: 13.5, lineHeight: 20, color: '#374151', marginBottom: 5 },

  trapBadge: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 3 },
  trapBadgeText: { fontSize: 10, fontWeight: '800' },

  correctBadge: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 3 },
  correctBadgeText: { fontSize: 10, fontWeight: '800' },

  exNote: { fontSize: 12, color: '#6B7594', lineHeight: 17, fontStyle: 'italic' },

  // ─── EXPLANATION BOX ───
  explanationBox: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12,
    padding: 13, marginTop: 2, marginBottom: 20, borderLeftWidth: 3,
    gap: 8, alignItems: 'flex-start',
  },
  exIcon:        { fontSize: 15, marginTop: 1 },
  exExplanation: { flex: 1, fontSize: 13.5, lineHeight: 20, color: '#374151', fontStyle: 'italic' },

  // ─── LEARN NAV ───
  learnNavRow:       { flexDirection: 'row', gap: 10, marginBottom: 12 },
  learnNavBtn:       { flex: 1, height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  learnNavOutline:   { borderWidth: 2, backgroundColor: 'transparent' },
  learnNavOutlineText:{ fontSize: 14, fontWeight: '700' },
  learnNavFillText:  { fontSize: 14, fontWeight: '800', color: '#fff' },

  // ─── DOTS ───
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C2D4E4' },

  // ─── PRACTICE QUESTION BLOCK ───
  questionBlock: {
    backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  strategyBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#EBF5FF', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 14,
  },
  strategyIcon:  { fontSize: 15 },
  strategyLabel: { fontSize: 12, fontWeight: '700', color: '#0f4c75' },

  qMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  exerciseBadge: { backgroundColor: '#EBF5FF', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6 },
  exerciseBadgeText: { fontSize: 10, fontWeight: '800', color: '#0f4c75', letterSpacing: 0.7 },
  qCounter: { fontSize: 12, fontWeight: '600', color: '#8A93B0' },

  qTitle:       { fontSize: 22, fontWeight: '900', color: '#111827', marginBottom: 4, letterSpacing: -0.3 },
  qInstruction: { fontSize: 13, fontStyle: 'italic', color: '#6B7594', marginBottom: 14, lineHeight: 19 },

  // ─── PRACTICE PASSAGE BOX ───
  qPassageBox: {
    backgroundColor: '#F0F6FF', borderRadius: 14, padding: 14,
    marginBottom: 14, borderWidth: 1, borderColor: '#C5D9F0',
  },
  qPassageLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  qPassageLabelDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0f4c75' },
  qPassageLabel:    { fontSize: 10, fontWeight: '800', color: '#0f4c75', letterSpacing: 1 },
  qPassageText:     { fontSize: 13.5, lineHeight: 22, color: '#1F2937', fontStyle: 'italic' },

  chooseLabel: { fontSize: 12, fontWeight: '700', color: '#6B7594', marginBottom: 10, letterSpacing: 0.5 },

  // ─── OPTIONS ───
  option: {
    flexDirection: 'row', backgroundColor: '#F7F9FC', borderRadius: 14,
    padding: 13, marginBottom: 8, alignItems: 'flex-start', gap: 10,
    borderWidth: 1.5, borderColor: '#E2EAF2',
  },
  optionSelected: { borderColor: '#0f4c75', backgroundColor: '#EBF5FF' },
  optionCorrect:  { borderColor: '#16a34a', backgroundColor: '#F0FDF4' },
  optionWrong:    { borderColor: '#dc2626', backgroundColor: '#FEF2F2' },
  optionDim:      { borderColor: '#E2EAF2', backgroundColor: '#FAFBFC', opacity: 0.5 },

  optLetter:     { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optLetterText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  optText:       { fontSize: 13.5, lineHeight: 21, color: '#1F2937' },

  highlight: { color: '#0f4c75', fontWeight: '700' },

  // ─── TRAP TAGS ───
  trapTag: { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 5 },
  trapTagText: { fontSize: 10, fontWeight: '800' },

  reasonText: { fontSize: 12, color: '#b91c1c', lineHeight: 17, marginTop: 4, fontStyle: 'italic' },

  correctTag: {
    marginTop: 5, backgroundColor: '#DCFCE7', borderRadius: 5,
    paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start',
  },
  correctTagText: { fontSize: 10, fontWeight: '800', color: '#15803d' },

  wrongTag: {
    marginTop: 5, backgroundColor: '#FEE2E2', borderRadius: 5,
    paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start',
  },
  wrongTagText: { fontSize: 10, fontWeight: '800', color: '#b91c1c' },

  // ─── FEEDBACK ───
  feedbackBox: {
    flexDirection: 'row', borderRadius: 13, padding: 14,
    gap: 10, alignItems: 'flex-start', marginTop: 10,
  },
  feedbackCorrect: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' },
  feedbackWrong:   { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A' },
  feedbackEmoji:  { fontSize: 22 },
  feedbackTitle:  { fontSize: 14, fontWeight: '800', color: '#111827', marginBottom: 4 },
  feedbackBody:   { fontSize: 13, lineHeight: 20, color: '#374151' },

  // ─── CHECK BUTTON ───
  checkBtn: {
    backgroundColor: '#0f4c75', borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
    shadowColor: '#0f4c75', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28, shadowRadius: 10, elevation: 6,
  },
  checkBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  checkBtnText: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },

  // ─── FINAL SCORE CARD ───
  finalCard: {
    backgroundColor: '#0a2540', borderRadius: 20, padding: 28,
    alignItems: 'center', marginTop: 4,
    shadowColor: '#0a2540', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 14, elevation: 8,
  },
  finalEmoji:    { fontSize: 42, marginBottom: 8 },
  finalTitle:    { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 6 },
  finalScore:    { fontSize: 40, fontWeight: '900', color: '#38bdf8', marginBottom: 4 },
  finalSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
});