/**
 * OddOneOutScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * IMPROVEMENTS:
 * - sc() responsive scaling — works on all screen sizes
 * - SafeAreaView replaces hardcoded paddingTop: 52
 * - Navbar title absolutely centered (no more alignment bugs)
 * - Unified spacing, border radius, typography with design system
 * - Stats strip added for context
 * ─────────────────────────────────────────────────────────────────────────────
 * BACKEND: swap LEARN_CARDS + QUESTIONS imports with API data when ready
 */

import React, { useState, useRef } from 'react';
import { LEARN_CARDS, QUESTIONS } from './dataa/content';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  accent:      '#1a3c8f',
  accentLight: '#EEF2FF',
  accentMid:   '#3B5FDB',
  bg:          '#F7F8FC',
  surface:     '#FFFFFF',
  border:      '#E8EBF4',
  borderLight: '#F0F2FA',
  text:        '#111827',
  sub:         '#374151',
  muted:       '#6B7594',
  correct:     '#16a34a',
  correctBg:   '#F0FDF4',
  correctBdr:  '#BBF7D0',
  wrong:       '#dc2626',
  wrongBg:     '#FEF2F2',
  wrongBdr:    '#FECACA',
  odd:         '#EF4444',
  oddBg:       '#FEF2F2',
  shadow:      '#1a3c8f',
};

// ─── DYNAMIC INIT ─────────────────────────────────────────────────────────────
const initAnswers    = Object.fromEntries(QUESTIONS.map(q => [q.id, null]));
const initChecked    = Object.fromEntries(QUESTIONS.map(q => [q.id, false]));
const initShakeAnims = Object.fromEntries(QUESTIONS.map(q => [q.id, new Animated.Value(0)]));

// ─── SCREEN ───────────────────────────────────────────────────────────────────
export default function OddOneOutScreen({ navigation }) {
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
        Animated.timing(shakeAnims[qId], { toValue: 8,  duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: -8, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: 6,  duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: -6, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: 0,  duration: 55, useNativeDriver: true }),
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
    if (!isCheckedQ) return isSelected ? C.accent : '#C9D0E8';
    if (optId === correctId) return C.correct;
    if (isSelected)          return C.wrong;
    return '#C9D0E8';
  };

  const totalProgress = Math.round(((activeLearnTab + 1) / LEARN_CARDS.length) * 100);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── NAVBAR ── */}
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
          <Text style={s.navTitle}>Odd One Out</Text>
          <Text style={s.navSub}>VERBAL ABILITY PREP</Text>
        </View>

        <View style={s.navInfoBtn}>
          <Text style={s.navInfoText}>ⓘ</Text>
        </View>
      </View>

      {/* ── PROGRESS BAR ── */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${totalProgress}%` }]} />
      </View>

      {/* ── STATS STRIP ── */}
      <View style={s.statsStrip}>
        {[
          { val: LEARN_CARDS.length, label: 'Strategies' },
          { val: QUESTIONS.length,   label: 'Exercises'  },
          { val: '~6 min',           label: 'Est. Time'  },
        ].map((st, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={s.statDiv} />}
            <View style={s.statItem}>
              <Text style={s.statVal}>{st.val}</Text>
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
        {currentCard.example.sentences.map((sent, i) => {
          const letter = String.fromCharCode(65 + i);
          return (
            <View
              key={i}
              style={[
                s.exRow,
                sent.isOdd && { backgroundColor: C.oddBg, borderColor: C.odd, borderWidth: sc(2) },
              ]}
            >
              <View style={[s.exLetter, { backgroundColor: sent.isOdd ? C.odd : currentCard.accentColor }]}>
                <Text style={s.exLetterText}>{letter}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.exText, sent.isOdd && { color: '#B91C1C' }]}>{sent.text}</Text>
                {sent.isOdd && (
                  <View style={s.oddBadge}>
                    <Text style={s.oddBadgeText}>🚫 ODD ONE OUT</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {/* Explanation */}
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
            <View
              key={i}
              style={[s.dot, activeLearnTab === i && { backgroundColor: currentCard.accentColor, width: sc(22) }]}
            />
          ))}
        </View>

        {/* ════ PRACTICE SECTION ════ */}
        <View style={[s.sectionHeader, { marginTop: sc(28) }]}>
          <View style={s.sectionLeft}>
            <View style={[s.sectionDot, { backgroundColor: C.correct }]} />
            <Text style={s.sectionTitle}>PRACTICE QUESTIONS</Text>
          </View>
          <Text style={s.sectionSub}>Try what you learned</Text>
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
                <Text style={s.qCounter}>{q.qNum} of {q.total}</Text>
              </View>

              <Text style={s.qTitle}>Identify the Intruder</Text>
              <Text style={s.qInstruction}>Tap the sentence that does not fit the context of the others.</Text>

              {/* Options */}
              <Animated.View style={{ transform: [{ translateX: shakeAnims[q.id] }] }}>
                {q.options.map(opt => (
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
                      {isCheckedQ && opt.id === q.explanation.correct && (
                        <View style={s.correctTag}><Text style={s.correctTagText}>✓ Correct Answer</Text></View>
                      )}
                      {isCheckedQ && opt.id === answers[q.id] && !isCorrect && (
                        <View style={s.wrongTag}><Text style={s.wrongTagText}>✗ Incorrect</Text></View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </Animated.View>

              {/* Feedback */}
              {isCheckedQ && (
                <View style={[s.feedbackBox, isCorrect ? s.feedbackCorrect : s.feedbackWrong]}>
                  <Text style={s.feedbackEmoji}>{isCorrect ? '🎉' : '😅'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.feedbackTitle}>
                      {isCorrect ? 'Correct! Well done.' : `Correct answer is ${q.explanation.correct}`}
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

        <View style={{ height: sc(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: sc(16), paddingTop: sc(18), paddingBottom: sc(20) },

  // ── Navbar ──
  navbar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sc(16),
    paddingTop: sc(10), paddingBottom: sc(10),
    backgroundColor: C.bg,
    borderBottomWidth: 1, borderBottomColor: C.borderLight,
  },
  navBtn: {
    width: sc(36), height: sc(36), borderRadius: sc(11),
    backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  navBackIcon: { fontSize: sc(22), color: C.text, lineHeight: sc(26), marginTop: -sc(1) },
  navCenter: {
    position: 'absolute', left: 0, right: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: sc(15), fontWeight: '800', color: C.accent, letterSpacing: -0.2 },
  navSub:   { fontSize: sc(9),  fontWeight: '700', color: C.muted,  letterSpacing: 1.1, marginTop: sc(1) },
  navInfoBtn: {
    width: sc(36), height: sc(36), borderRadius: sc(11),
    backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  navInfoText: { fontSize: sc(15), color: '#fff', fontWeight: '800' },

  // ── Progress ──
  progressTrack: { height: sc(3), backgroundColor: C.borderLight },
  progressFill:  { height: sc(3), backgroundColor: C.accentMid, borderRadius: sc(2) },

  // ── Stats Strip ──
  statsStrip: {
    flexDirection: 'row', backgroundColor: C.accent,
    paddingVertical: sc(10), paddingHorizontal: sc(16),
    alignItems: 'center', justifyContent: 'space-around',
  },
  statItem:  { alignItems: 'center' },
  statVal:   { fontSize: sc(14), fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: sc(10), fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginTop: sc(1) },
  statDiv:   { width: 1, height: sc(24), backgroundColor: 'rgba(255,255,255,0.15)' },

  // ── Section Header ──
  sectionHeader: { marginBottom: sc(12) },
  sectionLeft:   { flexDirection: 'row', alignItems: 'center', gap: sc(8), marginBottom: sc(3) },
  sectionDot:    { width: sc(8), height: sc(8), borderRadius: sc(4), backgroundColor: C.accent },
  sectionTitle:  { fontSize: sc(11), fontWeight: '800', color: C.muted, letterSpacing: 1.4 },
  sectionSub:    { fontSize: sc(12), fontWeight: '600', color: C.sub, marginLeft: sc(16) },

  // ── Tabs ──
  tabRow:     { flexDirection: 'row', gap: sc(8), marginBottom: sc(12) },
  tabPill:    { flex: 1, paddingVertical: sc(9), borderRadius: sc(22), backgroundColor: C.border, alignItems: 'center' },
  tabPillText:{ fontSize: sc(12), fontWeight: '700', color: C.muted },

  // ── Badge ──
  badge:     { alignSelf: 'flex-start', paddingHorizontal: sc(12), paddingVertical: sc(5), borderRadius: sc(20), marginBottom: sc(10) },
  badgeText: { fontSize: sc(11), fontWeight: '800', letterSpacing: 0.8 },

  // ── Hero Card ──
  heroCard: {
    backgroundColor: C.surface, borderRadius: sc(16), padding: sc(16),
    borderLeftWidth: sc(4), marginBottom: sc(16),
    shadowColor: C.shadow, shadowOffset: { width: 0, height: sc(4) },
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

  // ── Example Rows ──
  exRow: {
    flexDirection: 'row', backgroundColor: C.surface, borderRadius: sc(12),
    padding: sc(12), marginBottom: sc(7), gap: sc(10),
    borderWidth: 1, borderColor: C.border,
  },
  exLetter:     { width: sc(26), height: sc(26), borderRadius: sc(7), alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  exLetterText: { fontSize: sc(12), fontWeight: '800', color: '#fff' },
  exText:       { fontSize: sc(13), lineHeight: sc(20), color: C.sub },
  oddBadge:     { marginTop: sc(5), backgroundColor: '#FEE2E2', borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start' },
  oddBadgeText: { fontSize: sc(10), fontWeight: '800', color: '#991B1B' },

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
  dot:     { width: sc(8), height: sc(8), borderRadius: sc(4), backgroundColor: '#C9D0E8' },

  // ── Question Block ──
  questionBlock: {
    backgroundColor: C.surface, borderRadius: sc(18), padding: sc(15), marginBottom: sc(18),
    shadowColor: '#000', shadowOffset: { width: 0, height: sc(2) },
    shadowOpacity: 0.06, shadowRadius: sc(8), elevation: 3,
  },
  strategyBanner: {
    flexDirection: 'row', alignItems: 'center', gap: sc(8),
    backgroundColor: C.accentLight, borderRadius: sc(10),
    paddingHorizontal: sc(12), paddingVertical: sc(8), marginBottom: sc(12),
  },
  strategyIcon:  { fontSize: sc(14) },
  strategyLabel: { fontSize: sc(12), fontWeight: '700', color: C.accent },

  qMeta:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: sc(4) },
  exerciseBadge:     { backgroundColor: C.accentLight, paddingHorizontal: sc(9), paddingVertical: sc(3), borderRadius: sc(6) },
  exerciseBadgeText: { fontSize: sc(10), fontWeight: '800', color: C.accentMid, letterSpacing: 0.7 },
  qCounter:          { fontSize: sc(11), fontWeight: '600', color: C.muted },

  qTitle:       { fontSize: sc(20), fontWeight: '900', color: C.text, marginBottom: sc(3), letterSpacing: -0.3 },
  qInstruction: { fontSize: sc(12), fontStyle: 'italic', color: C.muted, marginBottom: sc(12), lineHeight: sc(18) },

  // Options
  option:         { flexDirection: 'row', backgroundColor: '#F7F8FC', borderRadius: sc(13), padding: sc(13), marginBottom: sc(8), alignItems: 'flex-start', gap: sc(10), borderWidth: 1.5, borderColor: C.border },
  optionSelected: { borderColor: C.accent, backgroundColor: C.accentLight },
  optionCorrect:  { borderColor: C.correct, backgroundColor: C.correctBg },
  optionWrong:    { borderColor: C.wrong,   backgroundColor: C.wrongBg },
  optionDim:      { borderColor: C.border,  backgroundColor: '#FAFAFA', opacity: 0.55 },

  optLetter:     { width: sc(30), height: sc(30), borderRadius: sc(9), alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optLetterText: { fontSize: sc(13), fontWeight: '800', color: '#fff' },
  optText:       { fontSize: sc(13), lineHeight: sc(20), color: C.text },
  highlight:     { color: C.accent, fontWeight: '700' },

  correctTag:     { marginTop: sc(4), backgroundColor: '#DCFCE7', borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start' },
  correctTagText: { fontSize: sc(10), fontWeight: '800', color: '#15803d' },
  wrongTag:       { marginTop: sc(4), backgroundColor: '#FEE2E2', borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start' },
  wrongTagText:   { fontSize: sc(10), fontWeight: '800', color: '#b91c1c' },

  feedbackBox:     { flexDirection: 'row', borderRadius: sc(12), padding: sc(13), gap: sc(10), alignItems: 'flex-start', marginTop: sc(10) },
  feedbackCorrect: { backgroundColor: C.correctBg, borderWidth: 1, borderColor: C.correctBdr },
  feedbackWrong:   { backgroundColor: C.wrongBg,   borderWidth: 1, borderColor: C.wrongBdr   },
  feedbackEmoji:   { fontSize: sc(20) },
  feedbackTitle:   { fontSize: sc(13), fontWeight: '800', color: C.text,   marginBottom: sc(3) },
  feedbackBody:    { fontSize: sc(12), lineHeight:  sc(18), color: C.sub },

  checkBtn:         { backgroundColor: C.accent, borderRadius: sc(13), height: sc(50), alignItems: 'center', justifyContent: 'center', marginTop: sc(10), shadowColor: C.shadow, shadowOffset: { width: 0, height: sc(5) }, shadowOpacity: 0.25, shadowRadius: sc(10), elevation: 6 },
  checkBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  checkBtnText:     { fontSize: sc(14), fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});