import React, { useState, useRef } from 'react';
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
import { LEARN_CARDS, QUESTIONS } from './dataa/content';

const { width } = Dimensions.get('window');

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

const initAnswers    = Object.fromEntries(QUESTIONS.map((q) => [q.id, null]));
const initChecked    = Object.fromEntries(QUESTIONS.map((q) => [q.id, false]));
const initShakeAnims = Object.fromEntries(QUESTIONS.map((q) => [q.id, new Animated.Value(0)]));

export default function OddOneOutScreen({ navigation }) {
  const [activeLearnTab, setActiveLearnTab] = useState(0);
  const [answers, setAnswers] = useState(initAnswers);
  const [checked, setChecked] = useState(initChecked);
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
        Animated.timing(shakeAnims[qId], { toValue: 8, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: -8, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: 6, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: -6, duration: 55, useNativeDriver: true }),
        Animated.timing(shakeAnims[qId], { toValue: 0, duration: 55, useNativeDriver: true }),
      ]).start();
    }
  };

  const getOptionStyle = (qId, optId, isOdd) => {
    const isChecked = checked[qId];
    const isSelected = answers[qId] === optId;
    if (!isChecked) return isSelected ? [styles.option, styles.optionSelected] : [styles.option];
    if (optId === QUESTIONS.find((q) => q.id === qId).explanation.correct) return [styles.option, styles.optionCorrect];
    if (isSelected) return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDim];
  };

  const getLetterBg = (qId, optId) => {
    const isChecked = checked[qId];
    const isSelected = answers[qId] === optId;
    const correctId = QUESTIONS.find((q) => q.id === qId).explanation.correct;
    if (!isChecked) return isSelected ? '#1a3c8f' : '#C9D0E8';
    if (optId === correctId) return '#16a34a';
    if (isSelected) return '#dc2626';
    return '#C9D0E8';
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FC" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>Odd One Out Strategy</Text>
          <Text style={styles.headerSub}>VERBAL ABILITY PREP</Text>
        </View>
        <TouchableOpacity style={styles.infoBtn}>
          <Text style={styles.infoBtnText}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      {/* ── PROGRESS BAR ── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((activeLearnTab + 1) / LEARN_CARDS.length) * 100}%` }]} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ════════════════════════════════════════
            LEARN SECTION
        ════════════════════════════════════════ */}

        {/* Section Header */}
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
          <Text style={[styles.badgeText, { color: currentCard.accentColor }]}>{currentCard.badge}</Text>
        </View>

        {/* Hero Card */}
        <View style={[styles.heroCard, { borderLeftColor: currentCard.accentColor }]}>
          <View style={styles.heroTopRow}>
            <Text style={styles.heroIcon}>{currentCard.icon}</Text>
            <Text style={[styles.heroTitle, { color: currentCard.accentColor }]}>{currentCard.title}</Text>
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
        {currentCard.example.sentences.map((s, i) => {
          const letter = String.fromCharCode(65 + i);
          return (
            <View
              key={i}
              style={[
                styles.exRow,
                s.isOdd && { backgroundColor: '#FEF2F2', borderColor: '#EF4444', borderWidth: 1.5 },
              ]}
            >
              <View style={[styles.exLetter, { backgroundColor: s.isOdd ? '#EF4444' : currentCard.accentColor }]}>
                <Text style={styles.exLetterText}>{letter}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.exText, s.isOdd && { color: '#B91C1C' }]}>{s.text}</Text>
                {s.isOdd && (
                  <View style={styles.oddBadge}>
                    <Text style={styles.oddBadgeText}>🚫 ODD ONE OUT</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {/* Explanation box */}
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
              <Text style={[styles.learnNavOutlineText, { color: currentCard.accentColor }]}>← Prev</Text>
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
              style={[styles.dot, activeLearnTab === i && { backgroundColor: currentCard.accentColor, width: 20 }]}
            />
          ))}
        </View>

        {/* ════════════════════════════════════════
            PRACTICE SECTION
        ════════════════════════════════════════ */}

        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.sectionDot, { backgroundColor: '#16a34a' }]} />
            <Text style={styles.sectionHeaderText}>PRACTICE QUESTIONS</Text>
          </View>
          <Text style={styles.sectionHeaderSub}>Try what you learned</Text>
        </View>

        {QUESTIONS.map((q) => {
          const isChecked = checked[q.id];
          const isCorrect = answers[q.id] === q.explanation.correct;

          return (
            <View key={q.id} style={styles.questionBlock}>

              {/* Strategy hint */}
              <View style={styles.strategyBanner}>
                <Text style={styles.strategyIcon}>{q.strategy.icon}</Text>
                <Text style={styles.strategyLabel}>{q.strategy.label}</Text>
              </View>

              {/* Meta */}
              <View style={styles.qMeta}>
                <View style={styles.exerciseBadge}>
                  <Text style={styles.exerciseBadgeText}>{q.exerciseNo}</Text>
                </View>
                <Text style={styles.qCounter}>{q.qNum} of {q.total}</Text>
              </View>

              <Text style={styles.qTitle}>Identify the Intruder</Text>
              <Text style={styles.qInstruction}>Tap the sentence that does not fit the context of the others.</Text>

              {/* Options */}
              <Animated.View style={{ transform: [{ translateX: shakeAnims[q.id] }] }}>
                {q.options.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={isChecked ? 1 : 0.75}
                    onPress={() => handleSelect(q.id, opt.id)}
                    style={getOptionStyle(q.id, opt.id, opt.isOdd)}
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
                      {isChecked && opt.id === q.explanation.correct && (
                        <View style={styles.correctTag}>
                          <Text style={styles.correctTagText}>✓ Correct Answer</Text>
                        </View>
                      )}
                      {isChecked && opt.id === answers[q.id] && !isCorrect && (
                        <View style={styles.wrongTag}>
                          <Text style={styles.wrongTagText}>✗ Incorrect</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </Animated.View>

              {/* Explanation after check */}
              {isChecked && (
                <View style={[styles.feedbackBox, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
                  <Text style={styles.feedbackEmoji}>{isCorrect ? '🎉' : '😅'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.feedbackTitle}>
                      {isCorrect ? 'Correct! Well done.' : `Correct answer is ${q.explanation.correct}`}
                    </Text>
                    <Text style={styles.feedbackBody}>{q.explanation.why}</Text>
                  </View>
                </View>
              )}

              {/* Check Answer Button */}
              {!isChecked && (
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

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F8FC' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: '#F7F8FC',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E8EBF4',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 18, color: '#1a3c8f', fontWeight: '700' },
  headerMid: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1a3c8f', letterSpacing: 0.2 },
  headerSub: { fontSize: 10, fontWeight: '600', color: '#8A93B0', letterSpacing: 1.2, marginTop: 1 },
  infoBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#1a3c8f',
    alignItems: 'center', justifyContent: 'center',
  },
  infoBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },

  // Progress
  progressTrack: { height: 3, backgroundColor: '#DDE2F0' },
  progressFill: { height: 3, backgroundColor: '#1a3c8f', borderRadius: 2 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },

  // Section Headers
  sectionHeader: { marginBottom: 14 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  sectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1a3c8f' },
  sectionHeaderText: { fontSize: 11, fontWeight: '800', color: '#6B7594', letterSpacing: 1.4 },
  sectionHeaderSub: { fontSize: 13, fontWeight: '600', color: '#374151', marginLeft: 16 },

  // Learn - Tabs
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tabPill: {
    flex: 1, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#E8EBF4', alignItems: 'center',
  },
  tabPillText: { fontSize: 12, fontWeight: '700', color: '#6B7594' },

  // Badge
  badgeWrap: {
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, marginBottom: 10,
  },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },

  // Hero Card
  heroCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    borderLeftWidth: 4, marginBottom: 18,
    shadowColor: '#1a3c8f', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  heroIcon: { fontSize: 24 },
  heroTitle: { fontSize: 18, fontWeight: '800', letterSpacing: 0.1 },
  heroDesc: { fontSize: 14, lineHeight: 21, color: '#374151' },

  // Steps
  stepsHeading: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 12 },
  stepNum: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  stepNumText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  stepText: { flex: 1, fontSize: 14, lineHeight: 21, color: '#374151' },

  // Tip
  tipCard: { borderRadius: 12, padding: 14, borderWidth: 1.5, marginBottom: 20, marginTop: 4 },
  tipText: { fontSize: 13, lineHeight: 20, fontWeight: '500' },

  // Example
  exRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12,
    padding: 13, marginBottom: 7, gap: 10, borderWidth: 1, borderColor: '#E8EBF4',
  },
  exLetter: {
    width: 26, height: 26, borderRadius: 7,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  exLetterText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  exText: { fontSize: 13.5, lineHeight: 20, color: '#374151' },
  oddBadge: {
    marginTop: 5, backgroundColor: '#FEE2E2', borderRadius: 5,
    paddingHorizontal: 7, paddingVertical: 2, alignSelf: 'flex-start',
  },
  oddBadgeText: { fontSize: 10, fontWeight: '800', color: '#991B1B' },

  // Explanation box
  explanationBox: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12,
    padding: 13, marginTop: 2, marginBottom: 20, borderLeftWidth: 3,
    gap: 8, alignItems: 'flex-start',
  },
  exIcon: { fontSize: 15, marginTop: 1 },
  exExplanation: { flex: 1, fontSize: 13.5, lineHeight: 20, color: '#374151', fontStyle: 'italic' },

  // Learn Nav
  learnNavRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  learnNavBtn: { flex: 1, height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  learnNavOutline: { borderWidth: 2, backgroundColor: 'transparent' },
  learnNavOutlineText: { fontSize: 14, fontWeight: '700' },
  learnNavFillText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  // Dots
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C9D0E8' },

  // ── Practice ──

  questionBlock: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16,
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  strategyBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#EEF2FF', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 14,
  },
  strategyIcon: { fontSize: 16 },
  strategyLabel: { fontSize: 12, fontWeight: '700', color: '#1a3c8f' },

  qMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  exerciseBadge: {
    backgroundColor: '#EEF2FF', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6,
  },
  exerciseBadgeText: { fontSize: 10, fontWeight: '800', color: '#3B5FDB', letterSpacing: 0.7 },
  qCounter: { fontSize: 12, fontWeight: '600', color: '#8A93B0' },

  qTitle: { fontSize: 22, fontWeight: '900', color: '#111827', marginBottom: 4, letterSpacing: -0.3 },
  qInstruction: { fontSize: 13, fontStyle: 'italic', color: '#6B7594', marginBottom: 16, lineHeight: 19 },

  // Options
  option: {
    flexDirection: 'row', backgroundColor: '#F7F8FC', borderRadius: 13,
    padding: 14, marginBottom: 8, alignItems: 'flex-start', gap: 10,
    borderWidth: 1.5, borderColor: '#E8EBF4',
  },
  optionSelected: { borderColor: '#1a3c8f', backgroundColor: '#F0F4FF' },
  optionCorrect: { borderColor: '#16a34a', backgroundColor: '#F0FDF4' },
  optionWrong: { borderColor: '#dc2626', backgroundColor: '#FEF2F2' },
  optionDim: { borderColor: '#E8EBF4', backgroundColor: '#FAFAFA', opacity: 0.55 },

  optLetter: {
    width: 30, height: 30, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  optLetterText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  optText: { fontSize: 14, lineHeight: 21, color: '#1F2937' },

  highlight: {
    color: '#1a3c8f', fontWeight: '700',
    backgroundColor: '#DDE6FF', borderRadius: 3,
  },

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

  // Feedback
  feedbackBox: {
    flexDirection: 'row', borderRadius: 12, padding: 14,
    gap: 10, alignItems: 'flex-start', marginTop: 10,
  },
  feedbackCorrect: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' },
  feedbackWrong: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  feedbackEmoji: { fontSize: 22 },
  feedbackTitle: { fontSize: 14, fontWeight: '800', color: '#111827', marginBottom: 4 },
  feedbackBody: { fontSize: 13, lineHeight: 19, color: '#374151' },

  // Check btn
  checkBtn: {
    backgroundColor: '#1a3c8f', borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
    shadowColor: '#1a3c8f', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28, shadowRadius: 10, elevation: 6,
  },
  checkBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  checkBtnText: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});