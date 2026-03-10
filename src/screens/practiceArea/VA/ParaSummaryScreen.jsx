/**
 * ParaSummaryScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * IMPROVEMENTS:
 * - sc() responsive scaling — works on all screen sizes
 * - SafeAreaView replaces hardcoded paddingTop: 52
 * - Navbar title absolutely centered (no more alignment bugs)
 * - Unified spacing, border radius, typography across all 3 screens
 * - Dark header retained (keeps identity) but properly safe-area handled
 * ─────────────────────────────────────────────────────────────────────────────
 * BACKEND: swap PS_LEARN_CARDS + PS_QUESTIONS imports with API data when ready
 */

import React, { useState, useRef } from 'react';
import { PS_LEARN_CARDS as LEARN_CARDS, PS_QUESTIONS as QUESTIONS } from './dataa/summaryContent';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  dark:        '#0a2540',
  darkMid:     '#0f3460',
  accent:      '#1e88e5',
  accentLight: '#EBF5FF',
  accentBright:'#38bdf8',
  bg:          '#F4F7FB',
  surface:     '#FFFFFF',
  border:      '#C5D9F0',
  borderLight: '#E2EAF2',
  text:        '#111827',
  sub:         '#374151',
  muted:       '#6B7594',
  correct:     '#16a34a',
  correctBg:   '#F0FDF4',
  correctBdr:  '#BBF7D0',
  wrong:       '#dc2626',
  wrongBg:     '#FEF2F2',
  wrongBdr:    '#FECACA',
};

// ─── TRAP COLORS ─────────────────────────────────────────────────────────────
const TRAP_COLORS = {
  'TOO NARROW': { bg: '#FFF3CD', text: '#92400E' },
  'INTRODUCED': { bg: '#FCE7F3', text: '#9D174D' },
  'DISTORTED':  { bg: '#F3E8FF', text: '#6B21A8' },
  'WRONG TONE': { bg: '#FFE4E1', text: '#991B1B' },
};

// ─── DYNAMIC INIT ─────────────────────────────────────────────────────────────
const initAnswers    = Object.fromEntries(QUESTIONS.map(q => [q.id, null]));
const initChecked    = Object.fromEntries(QUESTIONS.map(q => [q.id, false]));
const initShakeAnims = Object.fromEntries(QUESTIONS.map(q => [q.id, new Animated.Value(0)]));

// ─── SCREEN ───────────────────────────────────────────────────────────────────
export default function ParaSummaryScreen({ navigation }) {
  const [activeLearnTab, setActiveLearnTab] = useState(0);
  const [answers, setAnswers] = useState(initAnswers);
  const [checked, setChecked] = useState(initChecked);
  const scrollRef  = useRef(null);
  const shakeAnims = useRef(initShakeAnims).current;
  const backScale  = useRef(new Animated.Value(1)).current;

  const currentCard = LEARN_CARDS[activeLearnTab];

  const goToLearnTab = i => {
    setActiveLearnTab(i);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSelect = (qId, optId) => {
    if (checked[qId]) return;
    setAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const handleCheck = qId => {
    if (!answers[qId]) return;
    const q = QUESTIONS.find(q => q.id === qId);
    const isCorrect = answers[qId] === q.explanation.correct;
    setChecked(prev => ({ ...prev, [qId]: true }));
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

  const handleBack = () => {
    Animated.sequence([
      Animated.timing(backScale, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.timing(backScale, { toValue: 1,    duration: 70, useNativeDriver: true }),
    ]).start(() => navigation?.goBack());
  };

  const getOptionStyle = (qId, optId) => {
    const isCheckedQ = checked[qId];
    const isSelected = answers[qId] === optId;
    const correctId  = QUESTIONS.find(q => q.id === qId).explanation.correct;
    if (!isCheckedQ) return isSelected ? [s.option, s.optionSelected] : [s.option];
    if (optId === correctId) return [s.option, s.optionCorrect];
    if (isSelected)          return [s.option, s.optionWrong];
    return [s.option, s.optionDim];
  };

  const getLetterBg = (qId, optId) => {
    const isCheckedQ = checked[qId];
    const isSelected = answers[qId] === optId;
    const correctId  = QUESTIONS.find(q => q.id === qId).explanation.correct;
    if (!isCheckedQ) return isSelected ? '#0f4c75' : '#C2D4E4';
    if (optId === correctId) return C.correct;
    if (isSelected)          return C.wrong;
    return '#C2D4E4';
  };

  const totalCorrect  = QUESTIONS.filter(q => checked[q.id] && answers[q.id] === q.explanation.correct).length;
  const totalChecked  = Object.values(checked).filter(Boolean).length;
  const totalProgress = Math.round(((activeLearnTab + 1) / LEARN_CARDS.length) * 100);

  return (
    // ✅ Dark header screen — SafeAreaView bg = dark so status bar area matches
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.dark} />

      {/* ── DARK NAVBAR ── */}
      <View style={s.navbar}>
        <Animated.View style={{ transform: [{ scale: backScale }], zIndex: 1 }}>
          <TouchableOpacity
            onPress={handleBack} style={s.navBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={s.navBackIcon}>‹</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={s.navCenter} pointerEvents="none">
          <Text style={s.navTitle}>Para Summary</Text>
          <Text style={s.navSub}>VERBAL ABILITY · CAT PREP</Text>
        </View>

        <View style={s.scorePill}>
          <Text style={s.scorePillText}>{totalCorrect}/{QUESTIONS.length}</Text>
        </View>
      </View>

      {/* ── PROGRESS BAR ── */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${totalProgress}%` }]} />
      </View>

      {/* ── STATS STRIP (dark) ── */}
      <View style={s.statsStrip}>
        {[
          { val: LEARN_CARDS.length,  label: 'Strategies' },
          { val: QUESTIONS.length,    label: 'Exercises'  },
          { val: totalCorrect > 0 ? totalCorrect : '—', label: 'Correct', green: totalCorrect > 0 },
          { val: '~8 min',            label: 'Est. Time'  },
        ].map((st, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={s.statDiv} />}
            <View style={s.statItem}>
              <Text style={[s.statVal, st.green && { color: '#4ade80' }]}>{st.val}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      <ScrollView
        ref={scrollRef}
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── What is Para Summary? ── */}
        <View style={s.introCard}>
          <View style={s.introLeft}>
            <Text style={s.introEmoji}>📝</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.introTitle}>What is Para Summary?</Text>
            <Text style={s.introBody}>
              You are given a short passage (4–6 sentences) and must choose the option that BEST summarises it. CAT tests your ability to distill the central idea without distortion.
            </Text>
          </View>
        </View>

        {/* ── Trap Quick Reference ── */}
        <View style={s.trapRefCard}>
          <Text style={s.trapRefTitle}>⚠️ Know the 4 Trap Types</Text>
          <View style={s.trapRefGrid}>
            {[
              { type: 'TOO NARROW', desc: 'Only one detail' },
              { type: 'TOO BROAD',  desc: 'Overclaims scope' },
              { type: 'INTRODUCED', desc: 'Unsaid info added' },
              { type: 'DISTORTED',  desc: 'Tone/conclusion twisted' },
            ].map(t => (
              <View key={t.type} style={[s.trapRefChip, { backgroundColor: TRAP_COLORS[t.type]?.bg ?? '#F1F5F9' }]}>
                <Text style={[s.trapRefChipType, { color: TRAP_COLORS[t.type]?.text ?? '#374151' }]}>{t.type}</Text>
                <Text style={s.trapRefChipDesc}>{t.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ════ LEARN SECTION ════ */}
        <View style={s.sectionHeader}>
          <View style={s.sectionLeft}>
            <View style={s.sectionDot} />
            <Text style={s.sectionTitle}>LEARN THE STRATEGIES</Text>
          </View>
        </View>

        {/* Tab Pills */}
        <View style={s.tabRow}>
          {LEARN_CARDS.map((card, i) => (
            <TouchableOpacity
              key={card.id} onPress={() => goToLearnTab(i)}
              style={[s.tabPill, activeLearnTab === i && { backgroundColor: card.accentColor }]}
            >
              <Text style={[s.tabPillText, activeLearnTab === i && { color: '#fff' }]}>
                {card.icon}  S0{card.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Badge */}
        <View style={[s.badge, { backgroundColor: currentCard.bgColor }]}>
          <Text style={[s.badgeText, { color: currentCard.accentColor }]}>{currentCard.badge}</Text>
        </View>

        {/* Hero Card */}
        <View style={[s.heroCard, { borderLeftColor: currentCard.accentColor }]}>
          <View style={s.heroTopRow}>
            <Text style={s.heroIcon}>{currentCard.icon}</Text>
            <Text style={[s.heroTitle, { color: currentCard.accentColor }]}>{currentCard.title}</Text>
          </View>
          <Text style={s.heroDesc}>{currentCard.description}</Text>
        </View>

        {/* Steps */}
        <Text style={s.subHeading}>Step-by-Step Approach</Text>
        {currentCard.steps.map((step, i) => (
          <View key={i} style={s.stepRow}>
            <View style={[s.stepNum, { backgroundColor: currentCard.accentColor }]}>
              <Text style={s.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={s.stepText}>{step}</Text>
          </View>
        ))}

        {/* Tip */}
        <View style={[s.tipCard, { backgroundColor: currentCard.bgColor, borderColor: currentCard.accentColor }]}>
          <Text style={s.tipIcon}>💡</Text>
          <Text style={[s.tipText, { color: currentCard.accentColor }]}>{currentCard.tip}</Text>
        </View>

        {/* Example */}
        <Text style={s.subHeading}>See It In Action</Text>

        <View style={[s.passageBox, { borderLeftColor: currentCard.accentColor }]}>
          <Text style={[s.passageLabel, { color: currentCard.accentColor }]}>PASSAGE</Text>
          <Text style={s.passageText}>{currentCard.example.passage}</Text>
        </View>

        {currentCard.example.options.map((opt, i) => (
          <View key={i} style={[s.exRow, opt.role === 'CORRECT' && { borderColor: currentCard.accentColor, borderWidth: sc(2) }]}>
            <View style={[s.exLetter, { backgroundColor: opt.role === 'CORRECT' ? currentCard.accentColor : '#C2D4E4' }]}>
              <Text style={s.exLetterText}>{opt.label}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.exText}>{opt.text}</Text>
              {opt.role && opt.role !== 'CORRECT' && (
                <View style={[s.trapBadge, { backgroundColor: TRAP_COLORS[opt.role.replace('TRAP: ', '')]?.bg ?? '#F1F5F9' }]}>
                  <Text style={[s.trapBadgeText, { color: TRAP_COLORS[opt.role.replace('TRAP: ', '')]?.text ?? '#374151' }]}>
                    ✗ {opt.role}
                  </Text>
                </View>
              )}
              {opt.role === 'CORRECT' && (
                <View style={[s.correctBadge, { backgroundColor: currentCard.bgColor }]}>
                  <Text style={[s.correctBadgeText, { color: currentCard.accentColor }]}>✓ BEST SUMMARY</Text>
                </View>
              )}
              {opt.note && <Text style={s.exNote}>{opt.note}</Text>}
            </View>
          </View>
        ))}

        <View style={[s.explanationBox, { borderLeftColor: currentCard.accentColor }]}>
          <Text style={s.explanationIcon}>📌</Text>
          <Text style={s.explanationText}>{currentCard.example.explanation}</Text>
        </View>

        {/* Learn Nav */}
        <View style={s.learnNavRow}>
          {activeLearnTab > 0 && (
            <TouchableOpacity
              style={[s.learnNavOutline, { borderColor: currentCard.accentColor }]}
              onPress={() => goToLearnTab(activeLearnTab - 1)}
            >
              <Text style={[s.learnNavOutlineText, { color: currentCard.accentColor }]}>← Prev</Text>
            </TouchableOpacity>
          )}
          {activeLearnTab < LEARN_CARDS.length - 1 && (
            <TouchableOpacity
              style={[s.learnNavFill, { backgroundColor: currentCard.accentColor }]}
              onPress={() => goToLearnTab(activeLearnTab + 1)}
            >
              <Text style={s.learnNavFillText}>Next Strategy →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dots */}
        <View style={s.dotsRow}>
          {LEARN_CARDS.map((_, i) => (
            <View key={i} style={[s.dot, activeLearnTab === i && { backgroundColor: currentCard.accentColor, width: sc(22) }]} />
          ))}
        </View>

        {/* ════ PRACTICE SECTION ════ */}
        <View style={[s.sectionHeader, { marginTop: sc(28) }]}>
          <View style={s.sectionLeft}>
            <View style={[s.sectionDot, { backgroundColor: C.correct }]} />
            <Text style={s.sectionTitle}>PRACTICE QUESTIONS</Text>
          </View>
          <Text style={s.sectionSub}>Apply the strategies</Text>
        </View>

        {QUESTIONS.map(q => {
          const isCheckedQ = checked[q.id];
          const isCorrect  = answers[q.id] === q.explanation.correct;

          return (
            <View key={q.id} style={s.questionBlock}>
              {/* Strategy hint */}
              <View style={s.strategyBanner}>
                <Text style={s.strategyIcon}>{q.strategy.icon}</Text>
                <Text style={s.strategyLabel}>{q.strategy.label}</Text>
              </View>

              {/* Meta */}
              <View style={s.qMeta}>
                <View style={s.exerciseBadge}>
                  <Text style={s.exerciseBadgeText}>{q.exerciseNo}</Text>
                </View>
                <Text style={s.qCounter}>{q.id} of {q.total}</Text>
              </View>

              <Text style={s.qTitle}>Para Summary</Text>
              <Text style={s.qInstruction}>{q.instruction}</Text>

              {/* Passage */}
              <View style={s.qPassageBox}>
                <View style={s.qPassageLabelRow}>
                  <View style={s.qPassageLabelDot} />
                  <Text style={s.qPassageLabel}>PASSAGE</Text>
                </View>
                <Text style={s.qPassageText}>{q.passage}</Text>
              </View>

              <Text style={s.chooseLabel}>Choose the best summary:</Text>

              {/* Options */}
              <Animated.View style={{ transform: [{ translateX: shakeAnims[q.id] }] }}>
                {q.options.map(opt => {
                  const isRight    = opt.id === q.explanation.correct;
                  const isSelected = answers[q.id] === opt.id;

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      activeOpacity={isCheckedQ ? 1 : 0.75}
                      onPress={() => handleSelect(q.id, opt.id)}
                      style={getOptionStyle(q.id, opt.id)}
                    >
                      <View style={[s.optLetter, { backgroundColor: getLetterBg(q.id, opt.id) }]}>
                        <Text style={s.optLetterText}>{opt.id}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        {opt.highlight ? (
                          <Text style={s.optText}>
                            <Text style={s.highlight}>{opt.highlight}</Text>
                            {opt.text.replace(opt.highlight, '')}
                          </Text>
                        ) : (
                          <Text style={s.optText}>{opt.text}</Text>
                        )}
                        {isCheckedQ && !isRight && opt.trapType && (
                          <View style={[s.trapTag, { backgroundColor: TRAP_COLORS[opt.trapType]?.bg ?? '#F1F5F9' }]}>
                            <Text style={[s.trapTagText, { color: TRAP_COLORS[opt.trapType]?.text ?? '#374151' }]}>✗ {opt.trapType}</Text>
                          </View>
                        )}
                        {isCheckedQ && isSelected && !isRight && opt.reason && (
                          <Text style={s.reasonText}>↳ {opt.reason}</Text>
                        )}
                        {isCheckedQ && isRight && (
                          <View style={s.correctTag}><Text style={s.correctTagText}>✓ Best Summary</Text></View>
                        )}
                        {isCheckedQ && isSelected && !isRight && (
                          <View style={s.wrongTag}><Text style={s.wrongTagText}>✗ Incorrect</Text></View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>

              {/* Feedback */}
              {isCheckedQ && (
                <View style={[s.feedbackBox, isCorrect ? s.feedbackCorrect : s.feedbackWrong]}>
                  <Text style={s.feedbackEmoji}>{isCorrect ? '🎯' : '💡'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.feedbackTitle}>
                      {isCorrect ? 'Excellent! You found the central idea.' : `Correct answer is ${q.explanation.correct}`}
                    </Text>
                    <Text style={s.feedbackBody}>{q.explanation.why}</Text>
                  </View>
                </View>
              )}

              {/* Check Button */}
              {!isCheckedQ && (
                <TouchableOpacity
                  style={[s.checkBtn, !answers[q.id] && s.checkBtnDisabled]}
                  onPress={() => handleCheck(q.id)}
                  disabled={!answers[q.id]}
                >
                  <Text style={s.checkBtnText}>Check Answer ✓</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Final Score Card */}
        {totalChecked === QUESTIONS.length && (
          <View style={s.finalCard}>
            <Text style={s.finalEmoji}>
              {totalCorrect === QUESTIONS.length ? '🏆' : totalCorrect >= QUESTIONS.length / 2 ? '💪' : '📚'}
            </Text>
            <Text style={s.finalTitle}>
              {totalCorrect === QUESTIONS.length ? 'Perfect Score!' : totalCorrect >= QUESTIONS.length / 2 ? 'Good Progress!' : 'Keep Practising!'}
            </Text>
            <Text style={s.finalScore}>{totalCorrect} / {QUESTIONS.length}</Text>
            <Text style={s.finalSubtitle}>Para Summary exercises completed</Text>
          </View>
        )}

        <View style={{ height: sc(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // ✅ Safe area bg = dark so the status bar area matches the dark navbar
  safe:   { flex: 1, backgroundColor: C.dark },
  scroll: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingHorizontal: sc(16), paddingTop: sc(18), paddingBottom: sc(20) },

  // ── Navbar (dark) ──
  navbar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sc(16),
    paddingTop: sc(10), paddingBottom: sc(12),
    backgroundColor: C.dark,
  },
  navBtn: {
    width: sc(36), height: sc(36), borderRadius: sc(11),
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  navBackIcon: { fontSize: sc(22), color: '#fff', lineHeight: sc(26), marginTop: -sc(1) },
  navCenter: {
    position: 'absolute', left: 0, right: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: sc(15), fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
  navSub:   { fontSize: sc(9),  fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: 1.1, marginTop: sc(1) },
  scorePill: {
    backgroundColor: C.accent, borderRadius: sc(20),
    paddingHorizontal: sc(12), paddingVertical: sc(5), zIndex: 1,
  },
  scorePillText: { fontSize: sc(13), fontWeight: '800', color: '#fff' },

  // ── Progress ──
  progressTrack: { height: sc(3), backgroundColor: '#1e3a5f' },
  progressFill:  { height: sc(3), backgroundColor: C.accentBright, borderRadius: sc(2) },

  // ── Stats Strip (dark) ──
  statsStrip: {
    flexDirection: 'row', backgroundColor: C.darkMid,
    paddingVertical: sc(10), paddingHorizontal: sc(16),
    alignItems: 'center', justifyContent: 'space-around',
  },
  statItem:  { alignItems: 'center' },
  statVal:   { fontSize: sc(13), fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: sc(9), fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginTop: sc(1) },
  statDiv:   { width: 1, height: sc(22), backgroundColor: 'rgba(255,255,255,0.12)' },

  // ── Intro Card ──
  introCard: {
    flexDirection: 'row', backgroundColor: C.surface, borderRadius: sc(16),
    padding: sc(14), marginBottom: sc(12), gap: sc(12), alignItems: 'flex-start',
    shadowColor: C.dark, shadowOffset: { width: 0, height: sc(3) },
    shadowOpacity: 0.07, shadowRadius: sc(10), elevation: 3,
  },
  introLeft:  { width: sc(42), height: sc(42), borderRadius: sc(12), backgroundColor: '#EBF5FF', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  introEmoji: { fontSize: sc(20) },
  introTitle: { fontSize: sc(13), fontWeight: '800', color: C.dark, marginBottom: sc(3) },
  introBody:  { fontSize: sc(12), lineHeight: sc(19), color: C.sub },

  // ── Trap Quick Reference ──
  trapRefCard: {
    backgroundColor: C.surface, borderRadius: sc(16), padding: sc(13), marginBottom: sc(16),
    shadowColor: '#000', shadowOffset: { width: 0, height: sc(2) }, shadowOpacity: 0.05, shadowRadius: sc(8), elevation: 2,
  },
  trapRefTitle:    { fontSize: sc(12), fontWeight: '800', color: C.text, marginBottom: sc(9) },
  trapRefGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: sc(7) },
  trapRefChip:     { borderRadius: sc(10), paddingHorizontal: sc(10), paddingVertical: sc(7), flex: 1, minWidth: '45%' },
  trapRefChipType: { fontSize: sc(10), fontWeight: '800', letterSpacing: 0.4, marginBottom: sc(2) },
  trapRefChipDesc: { fontSize: sc(10), color: '#6B7280', fontWeight: '500' },

  // ── Section Header ──
  sectionHeader: { marginBottom: sc(12) },
  sectionLeft:   { flexDirection: 'row', alignItems: 'center', gap: sc(8), marginBottom: sc(3) },
  sectionDot:    { width: sc(8), height: sc(8), borderRadius: sc(4), backgroundColor: '#0f4c75' },
  sectionTitle:  { fontSize: sc(11), fontWeight: '800', color: C.muted, letterSpacing: 1.4 },
  sectionSub:    { fontSize: sc(12), fontWeight: '600', color: C.sub, marginLeft: sc(16) },

  // ── Tabs ──
  tabRow:     { flexDirection: 'row', gap: sc(8), marginBottom: sc(12) },
  tabPill:    { flex: 1, paddingVertical: sc(9), borderRadius: sc(22), backgroundColor: '#E2EAF2', alignItems: 'center' },
  tabPillText:{ fontSize: sc(12), fontWeight: '700', color: C.muted },

  // ── Badge ──
  badge:     { alignSelf: 'flex-start', paddingHorizontal: sc(12), paddingVertical: sc(5), borderRadius: sc(20), marginBottom: sc(10) },
  badgeText: { fontSize: sc(11), fontWeight: '800', letterSpacing: 0.8 },

  // ── Hero Card ──
  heroCard: {
    backgroundColor: C.surface, borderRadius: sc(16), padding: sc(16),
    borderLeftWidth: sc(4), marginBottom: sc(16),
    shadowColor: C.dark, shadowOffset: { width: 0, height: sc(4) },
    shadowOpacity: 0.07, shadowRadius: sc(10), elevation: 3,
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: sc(8), gap: sc(10) },
  heroIcon:   { fontSize: sc(24) },
  heroTitle:  { fontSize: sc(17), fontWeight: '800', letterSpacing: 0.1, flex: 1 },
  heroDesc:   { fontSize: sc(13), lineHeight: sc(21), color: C.sub },

  // ── Steps ──
  subHeading: { fontSize: sc(14), fontWeight: '800', color: C.text, marginBottom: sc(10), marginTop: sc(2) },
  stepRow:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: sc(9), gap: sc(11) },
  stepNum:    { width: sc(26), height: sc(26), borderRadius: sc(13), alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: sc(1) },
  stepNumText:{ fontSize: sc(12), fontWeight: '800', color: '#fff' },
  stepText:   { flex: 1, fontSize: sc(13), lineHeight: sc(20), color: C.sub },

  // ── Tip ──
  tipCard: { flexDirection: 'row', gap: sc(8), borderRadius: sc(12), padding: sc(13), borderWidth: 1.5, marginBottom: sc(18), marginTop: sc(4), alignItems: 'flex-start' },
  tipIcon: { fontSize: sc(14), marginTop: sc(1) },
  tipText: { flex: 1, fontSize: sc(13), lineHeight: sc(20), fontWeight: '500' },

  // ── Passage Box (Learn) ──
  passageBox: {
    backgroundColor: C.surface, borderRadius: sc(13), padding: sc(14),
    borderLeftWidth: sc(3), marginBottom: sc(12),
    shadowColor: '#000', shadowOffset: { width: 0, height: sc(2) }, shadowOpacity: 0.05, shadowRadius: sc(6), elevation: 2,
  },
  passageLabel: { fontSize: sc(10), fontWeight: '800', letterSpacing: 1, marginBottom: sc(7) },
  passageText:  { fontSize: sc(13), lineHeight: sc(21), color: C.text, fontStyle: 'italic' },

  // ── Example Rows ──
  exRow: {
    flexDirection: 'row', backgroundColor: C.surface, borderRadius: sc(12),
    padding: sc(12), marginBottom: sc(7), gap: sc(10),
    borderWidth: 1, borderColor: C.borderLight,
  },
  exLetter:       { width: sc(26), height: sc(26), borderRadius: sc(7), alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  exLetterText:   { fontSize: sc(12), fontWeight: '800', color: '#fff' },
  exText:         { fontSize: sc(13), lineHeight: sc(19), color: C.sub, marginBottom: sc(4) },
  trapBadge:      { borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start', marginBottom: sc(2) },
  trapBadgeText:  { fontSize: sc(10), fontWeight: '800' },
  correctBadge:   { borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start', marginBottom: sc(2) },
  correctBadgeText:{ fontSize: sc(10), fontWeight: '800' },
  exNote:         { fontSize: sc(11), color: C.muted, lineHeight: sc(16), fontStyle: 'italic' },

  // ── Explanation ──
  explanationBox: {
    flexDirection: 'row', backgroundColor: C.surface, borderRadius: sc(12),
    padding: sc(13), marginBottom: sc(18), borderLeftWidth: sc(3),
    gap: sc(8), alignItems: 'flex-start',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, elevation: 1,
  },
  explanationIcon: { fontSize: sc(14), marginTop: sc(1) },
  explanationText: { flex: 1, fontSize: sc(13), lineHeight: sc(20), color: C.sub, fontStyle: 'italic' },

  // ── Learn Nav ──
  learnNavRow:         { flexDirection: 'row', gap: sc(10), marginBottom: sc(12) },
  learnNavOutline:     { flex: 1, height: sc(48), borderRadius: sc(13), alignItems: 'center', justifyContent: 'center', borderWidth: sc(2), backgroundColor: 'transparent' },
  learnNavOutlineText: { fontSize: sc(14), fontWeight: '700' },
  learnNavFill:        { flex: 1, height: sc(48), borderRadius: sc(13), alignItems: 'center', justifyContent: 'center' },
  learnNavFillText:    { fontSize: sc(14), fontWeight: '800', color: '#fff' },

  // ── Dots ──
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: sc(6), marginBottom: sc(4) },
  dot:     { width: sc(8), height: sc(8), borderRadius: sc(4), backgroundColor: '#C2D4E4' },

  // ── Question Block ──
  questionBlock: {
    backgroundColor: C.surface, borderRadius: sc(18), padding: sc(15), marginBottom: sc(18),
    shadowColor: '#000', shadowOffset: { width: 0, height: sc(2) },
    shadowOpacity: 0.06, shadowRadius: sc(10), elevation: 3,
  },
  strategyBanner: {
    flexDirection: 'row', alignItems: 'center', gap: sc(8),
    backgroundColor: '#EBF5FF', borderRadius: sc(10),
    paddingHorizontal: sc(12), paddingVertical: sc(8), marginBottom: sc(12),
  },
  strategyIcon:  { fontSize: sc(14) },
  strategyLabel: { fontSize: sc(12), fontWeight: '700', color: '#0f4c75' },

  qMeta:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: sc(4) },
  exerciseBadge:     { backgroundColor: '#EBF5FF', paddingHorizontal: sc(9), paddingVertical: sc(3), borderRadius: sc(6) },
  exerciseBadgeText: { fontSize: sc(10), fontWeight: '800', color: '#0f4c75', letterSpacing: 0.7 },
  qCounter:          { fontSize: sc(11), fontWeight: '600', color: C.muted },

  qTitle:       { fontSize: sc(20), fontWeight: '900', color: C.text, marginBottom: sc(3), letterSpacing: -0.3 },
  qInstruction: { fontSize: sc(12), fontStyle: 'italic', color: C.muted, marginBottom: sc(12), lineHeight: sc(18) },

  qPassageBox: {
    backgroundColor: '#F0F6FF', borderRadius: sc(13), padding: sc(13),
    marginBottom: sc(12), borderWidth: 1, borderColor: C.border,
  },
  qPassageLabelRow: { flexDirection: 'row', alignItems: 'center', gap: sc(6), marginBottom: sc(7) },
  qPassageLabelDot: { width: sc(6), height: sc(6), borderRadius: sc(3), backgroundColor: '#0f4c75' },
  qPassageLabel:    { fontSize: sc(10), fontWeight: '800', color: '#0f4c75', letterSpacing: 1 },
  qPassageText:     { fontSize: sc(13), lineHeight: sc(21), color: C.text, fontStyle: 'italic' },

  chooseLabel: { fontSize: sc(11), fontWeight: '700', color: C.muted, marginBottom: sc(9), letterSpacing: 0.5 },

  // Options
  option:         { flexDirection: 'row', backgroundColor: '#F7F9FC', borderRadius: sc(13), padding: sc(13), marginBottom: sc(8), alignItems: 'flex-start', gap: sc(10), borderWidth: 1.5, borderColor: C.borderLight },
  optionSelected: { borderColor: '#0f4c75', backgroundColor: '#EBF5FF' },
  optionCorrect:  { borderColor: C.correct, backgroundColor: C.correctBg },
  optionWrong:    { borderColor: C.wrong,   backgroundColor: C.wrongBg },
  optionDim:      { borderColor: C.borderLight, backgroundColor: '#FAFBFC', opacity: 0.5 },

  optLetter:     { width: sc(30), height: sc(30), borderRadius: sc(9), alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optLetterText: { fontSize: sc(13), fontWeight: '800', color: '#fff' },
  optText:       { fontSize: sc(13), lineHeight: sc(20), color: C.text },
  highlight:     { color: '#0f4c75', fontWeight: '700' },

  trapTag:      { borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start', marginTop: sc(4) },
  trapTagText:  { fontSize: sc(10), fontWeight: '800' },
  reasonText:   { fontSize: sc(11), color: '#b91c1c', lineHeight: sc(16), marginTop: sc(3), fontStyle: 'italic' },
  correctTag:   { marginTop: sc(4), backgroundColor: '#DCFCE7', borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start' },
  correctTagText:{ fontSize: sc(10), fontWeight: '800', color: '#15803d' },
  wrongTag:     { marginTop: sc(4), backgroundColor: '#FEE2E2', borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start' },
  wrongTagText: { fontSize: sc(10), fontWeight: '800', color: '#b91c1c' },

  feedbackBox:     { flexDirection: 'row', borderRadius: sc(12), padding: sc(13), gap: sc(10), alignItems: 'flex-start', marginTop: sc(10) },
  feedbackCorrect: { backgroundColor: C.correctBg, borderWidth: 1, borderColor: C.correctBdr },
  feedbackWrong:   { backgroundColor: '#FFFBEB',   borderWidth: 1, borderColor: '#FDE68A' },
  feedbackEmoji:   { fontSize: sc(20) },
  feedbackTitle:   { fontSize: sc(13), fontWeight: '800', color: C.text,  marginBottom: sc(3) },
  feedbackBody:    { fontSize: sc(12), lineHeight: sc(18), color: C.sub },

  checkBtn:         { backgroundColor: '#0f4c75', borderRadius: sc(13), height: sc(50), alignItems: 'center', justifyContent: 'center', marginTop: sc(10), shadowColor: '#0f4c75', shadowOffset: { width: 0, height: sc(5) }, shadowOpacity: 0.25, shadowRadius: sc(10), elevation: 6 },
  checkBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  checkBtnText:     { fontSize: sc(14), fontWeight: '800', color: '#fff', letterSpacing: 0.2 },

  // ── Final Card ──
  finalCard: {
    backgroundColor: C.dark, borderRadius: sc(20), padding: sc(26),
    alignItems: 'center', marginTop: sc(4),
    shadowColor: C.dark, shadowOffset: { width: 0, height: sc(6) },
    shadowOpacity: 0.25, shadowRadius: sc(14), elevation: 8,
  },
  finalEmoji:    { fontSize: sc(40), marginBottom: sc(7) },
  finalTitle:    { fontSize: sc(19), fontWeight: '900', color: '#fff', marginBottom: sc(5) },
  finalScore:    { fontSize: sc(38), fontWeight: '900', color: C.accentBright, marginBottom: sc(4) },
  finalSubtitle: { fontSize: sc(12), color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
});