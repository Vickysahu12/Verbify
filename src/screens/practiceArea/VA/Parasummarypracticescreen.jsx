/**
 * ParaSummaryPracticeScreen.jsx
 * Clean practice screen — only questions from backend
 * GET /va/questions?type=para_summary
 * POST /va/submit
 *
 * ✅ KEY: q.question = PASSAGE TEXT (not a question)
 *         q.options  = summary choices to pick from
 * 
 */

import React, { useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useVAQuestions } from './Usevaquestion';

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

const C = {
  accent: '#0a2540', accentMid: '#1e88e5', accentLight: '#EBF5FF',
  bg: '#F4F7FB', surface: '#FFFFFF', border: '#C5D9F0', borderLight: '#E2EAF2',
  text: '#111827', sub: '#374151', muted: '#6B7594',
  correct: '#16a34a', correctBg: '#F0FDF4', correctBdr: '#BBF7D0',
  wrong: '#dc2626', wrongBg: '#FEF2F2', wrongBdr: '#FECACA',
};

export default function ParaSummaryPracticeScreen({ navigation }) {
  const backScale  = useRef(new Animated.Value(1)).current;
  const shakeAnims = useRef({}).current;

  const {
    questions, loading, answers, loadQuestions,
    handleSelect, handleCheck, isChecked, getResult,
    totalCorrect, totalChecked,
  } = useVAQuestions('para_summary');

  useFocusEffect(useCallback(() => { loadQuestions(); }, [loadQuestions]));

  const getShakeAnim = (qId) => {
    if (!shakeAnims[qId]) shakeAnims[qId] = new Animated.Value(0);
    return shakeAnims[qId];
  };

  const onCheck = async (qId) => {
    await handleCheck(qId);
    const result = getResult(qId);
    if (result && !result.is_correct) {
      const anim = getShakeAnim(qId);
      Animated.sequence([
        Animated.timing(anim, { toValue: 9,  duration: 50, useNativeDriver: true }),
        Animated.timing(anim, { toValue: -9, duration: 50, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 6,  duration: 50, useNativeDriver: true }),
        Animated.timing(anim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0,  duration: 50, useNativeDriver: true }),
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
    const result = getResult(qId); const isSelected = answers[qId] === optId;
    if (!result) return isSelected ? [s.option, s.optionSelected] : [s.option];
    if (optId === result.correct) return [s.option, s.optionCorrect];
    if (isSelected)               return [s.option, s.optionWrong];
    return [s.option, s.optionDim];
  };

  const getLetterBg = (qId, optId) => {
    const result = getResult(qId); const isSelected = answers[qId] === optId;
    if (!result) return isSelected ? '#0f4c75' : '#B8D0E8';
    if (optId === result.correct) return C.correct;
    if (isSelected)               return C.wrong;
    return '#B8D0E8';
  };

  const allDone = questions.length > 0 && totalChecked === questions.length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.accent} />

      {/* Dark Navbar */}
      <View style={s.navbar}>
        <Animated.View style={{ transform: [{ scale: backScale }] }}>
          <TouchableOpacity onPress={handleBack} style={s.navBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={s.navBackIcon}>‹</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={s.navCenter} pointerEvents="none">
          <Text style={s.navTitle}>Para Summary Practice</Text>
          <Text style={s.navSub}>READ · SUMMARISE · MASTER</Text>
        </View>
        <View style={s.scorePill}>
          <Text style={s.scorePillText}>{totalCorrect}/{questions.length}</Text>
        </View>
      </View>

      <View style={s.progressBarBg}>
        <View style={[s.progressBarFill, {
          width: questions.length > 0 ? `${(totalChecked / questions.length) * 100}%` : '0%'
        }]} />
      </View>

      <View style={s.statsStrip}>
        {[
          { val: questions.length, label: 'Passages'  },
          { val: totalChecked,     label: 'Attempted' },
          { val: totalCorrect,     label: 'Correct'   },
          { val: totalChecked > 0 ? `${Math.round((totalCorrect / totalChecked) * 100)}%` : '—', label: 'Accuracy' },
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

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}
        style={s.scroll}>

        {/* Info banner */}
        <View style={s.infoBanner}>
          <Text style={s.infoBannerIcon}>📝</Text>
          <Text style={s.infoBannerText}>
            Read the passage carefully. Then choose the option that BEST captures the central idea — no distortion, no extra info.
          </Text>
        </View>

        {loading ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={C.accentMid} />
            <Text style={s.loadingText}>Loading passages...</Text>
          </View>
        ) : questions.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyEmoji}>📭</Text>
            <Text style={s.emptyTitle}>No passages yet</Text>
          </View>
        ) : (
          <>
            {questions.map((q, idx) => {
              const result     = getResult(q.id);
              const isCheckedQ = isChecked(q.id);
              const isCorrect  = result?.is_correct ?? false;

              return (
                <View key={q.id} style={s.questionBlock}>

                  {/* Q number + difficulty + strategy */}
                  <View style={s.qTopRow}>
                    <View style={s.qNumBadge}>
                      <Text style={s.qNumText}>Passage {idx + 1}</Text>
                    </View>
                    <View style={[s.diffBadge, {
                      backgroundColor: q.difficulty === 'Easy' ? '#DCFCE7' : q.difficulty === 'Hard' ? '#FEE2E2' : '#FEF3C7'
                    }]}>
                      <Text style={[s.diffText, {
                        color: q.difficulty === 'Easy' ? '#16A34A' : q.difficulty === 'Hard' ? '#DC2626' : '#D97706'
                      }]}>{q.difficulty}</Text>
                    </View>
                    {q.strategy && (
                      <View style={s.strategyChip}>
                        <Text style={s.strategyChipText}>{q.strategy.icon} {q.strategy.label}</Text>
                      </View>
                    )}
                  </View>

                  {/* ✅ PASSAGE BOX — q.question IS the passage */}
                  <View style={s.passageBox}>
                    <View style={s.passageLabelRow}>
                      <View style={s.passageLabelDot} />
                      <Text style={s.passageLabel}>PASSAGE</Text>
                    </View>
                    <Text style={s.passageText}>{q.question}</Text>
                  </View>

                  {/* Summary options */}
                  <Text style={s.optionsLabel}>Which option best summarises the passage?</Text>

                  <Animated.View style={{ transform: [{ translateX: getShakeAnim(q.id) }] }}>
                    {(q.options ?? []).map(opt => (
                      <TouchableOpacity key={opt.id}
                        activeOpacity={isCheckedQ ? 1 : 0.75}
                        onPress={() => handleSelect(q.id, opt.id)}
                        style={getOptionStyle(q.id, opt.id)}>
                        <View style={[s.optLetter, { backgroundColor: getLetterBg(q.id, opt.id) }]}>
                          <Text style={s.optLetterText}>{opt.id}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[s.optText, {
                            color: isCheckedQ && opt.id === result?.correct ? C.correct
                                 : isCheckedQ && opt.id === answers[q.id] && !isCorrect ? C.wrong
                                 : C.text
                          }]}>{opt.text}</Text>
                          {isCheckedQ && opt.id === result?.correct && (
                            <View style={s.correctTag}>
                              <Text style={s.correctTagText}>✓ Best Summary</Text>
                            </View>
                          )}
                          {isCheckedQ && opt.id === answers[q.id] && !isCorrect && (
                            <View style={s.wrongTag}>
                              <Text style={s.wrongTagText}>✗ Incorrect</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>

                  {/* Feedback */}
                  {isCheckedQ && (
                    <View style={[s.feedbackBox, isCorrect ? s.feedbackCorrect : s.feedbackWrong]}>
                      <Text style={s.feedbackEmoji}>{isCorrect ? '🎯' : '💡'}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={s.feedbackTitle}>
                          {isCorrect ? 'Excellent! You found the central idea.' : `Correct answer: ${result?.correct}`}
                        </Text>
                        <Text style={s.feedbackBody}>{result?.explanation?.why}</Text>
                      </View>
                    </View>
                  )}

                  {!isCheckedQ && (
                    <TouchableOpacity
                      style={[s.checkBtn, !answers[q.id] && s.checkBtnDisabled]}
                      onPress={() => onCheck(q.id)}
                      disabled={!answers[q.id]}>
                      <Text style={s.checkBtnText}>Check Answer ✓</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}

            {allDone && (
              <View style={s.finalCard}>
                <Text style={s.finalEmoji}>
                  {totalCorrect === questions.length ? '🏆' : totalCorrect >= questions.length / 2 ? '💪' : '📚'}
                </Text>
                <Text style={s.finalTitle}>
                  {totalCorrect === questions.length ? 'Perfect Score!' : totalCorrect >= questions.length / 2 ? 'Good Job!' : 'Keep Practising!'}
                </Text>
                <Text style={s.finalScore}>{totalCorrect}/{questions.length}</Text>
                <Text style={s.finalAccuracy}>Accuracy: {Math.round((totalCorrect / questions.length) * 100)}%</Text>
                <TouchableOpacity style={s.retryBtn} onPress={loadQuestions}>
                  <Text style={s.retryBtnText}>↺  Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        <View style={{ height: sc(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.accent },
  scroll: { flex: 1, backgroundColor: C.bg },
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: sc(16), paddingTop: sc(10), paddingBottom: sc(12), backgroundColor: C.accent },
  navBtn: { width: sc(36), height: sc(36), borderRadius: sc(11), backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  navBackIcon: { fontSize: sc(22), color: '#fff', lineHeight: sc(26), marginTop: -sc(1) },
  navCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: sc(15), fontWeight: '800', color: '#fff' },
  navSub: { fontSize: sc(9), fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: 1, marginTop: sc(1) },
  scorePill: { backgroundColor: C.accentMid, borderRadius: sc(20), paddingHorizontal: sc(12), paddingVertical: sc(5) },
  scorePillText: { fontSize: sc(13), fontWeight: '800', color: '#fff' },
  progressBarBg: { height: sc(3), backgroundColor: 'rgba(255,255,255,0.2)' },
  progressBarFill: { height: sc(3), backgroundColor: '#38bdf8', borderRadius: sc(2) },
  statsStrip: { flexDirection: 'row', backgroundColor: '#0f3460', paddingVertical: sc(10), paddingHorizontal: sc(16), alignItems: 'center', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: sc(14), fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: sc(10), fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginTop: sc(1) },
  statDiv: { width: 1, height: sc(24), backgroundColor: 'rgba(255,255,255,0.12)' },
  scrollContent: { paddingHorizontal: sc(16), paddingTop: sc(16), paddingBottom: sc(20) },
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: sc(10), backgroundColor: C.accentLight, borderRadius: sc(14), padding: sc(14), marginBottom: sc(16), borderWidth: 1, borderColor: C.border },
  infoBannerIcon: { fontSize: sc(20), marginTop: sc(1) },
  infoBannerText: { flex: 1, fontSize: sc(13), color: '#0f4c75', fontWeight: '500', lineHeight: sc(19) },
  loadingWrap: { paddingVertical: sc(60), alignItems: 'center', gap: sc(12) },
  loadingText: { fontSize: sc(13), color: C.muted },
  emptyWrap: { paddingVertical: sc(60), alignItems: 'center', gap: sc(8) },
  emptyEmoji: { fontSize: sc(48) },
  emptyTitle: { fontSize: sc(17), fontWeight: '800', color: C.text },
  questionBlock: { backgroundColor: C.surface, borderRadius: sc(18), padding: sc(16), marginBottom: sc(20), elevation: 4, borderWidth: 1, borderColor: C.borderLight },
  qTopRow: { flexDirection: 'row', alignItems: 'center', gap: sc(8), marginBottom: sc(12), flexWrap: 'wrap' },
  qNumBadge: { backgroundColor: C.accentMid, paddingHorizontal: sc(10), paddingVertical: sc(4), borderRadius: sc(20) },
  qNumText: { fontSize: sc(11), fontWeight: '800', color: '#fff' },
  diffBadge: { paddingHorizontal: sc(9), paddingVertical: sc(4), borderRadius: sc(20) },
  diffText: { fontSize: sc(10), fontWeight: '700' },
  strategyChip: { backgroundColor: C.accentLight, paddingHorizontal: sc(10), paddingVertical: sc(4), borderRadius: sc(20), flex: 1 },
  strategyChipText: { fontSize: sc(11), fontWeight: '600', color: '#0f4c75' },

  // ✅ Passage box — prominent, clearly readable
  passageBox: {
    backgroundColor: '#F0F6FF', borderRadius: sc(14),
    padding: sc(14), marginBottom: sc(16),
    borderWidth: 1.5, borderColor: C.border,
    borderLeftWidth: sc(4), borderLeftColor: C.accentMid,
  },
  passageLabelRow: { flexDirection: 'row', alignItems: 'center', gap: sc(6), marginBottom: sc(8) },
  passageLabelDot: { width: sc(6), height: sc(6), borderRadius: sc(3), backgroundColor: C.accentMid },
  passageLabel: { fontSize: sc(10), fontWeight: '800', color: C.accentMid, letterSpacing: 1.2 },
  passageText: { fontSize: sc(14), lineHeight: sc(24), color: C.text, fontStyle: 'italic', fontWeight: '400' },

  optionsLabel: { fontSize: sc(11), fontWeight: '700', color: C.muted, marginBottom: sc(10), letterSpacing: 0.5 },
  option: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F7F9FC', borderRadius: sc(13), padding: sc(13), marginBottom: sc(8), gap: sc(12), borderWidth: 1.5, borderColor: C.borderLight },
  optionSelected: { borderColor: '#0f4c75', backgroundColor: C.accentLight },
  optionCorrect: { borderColor: C.correct, backgroundColor: C.correctBg },
  optionWrong: { borderColor: C.wrong, backgroundColor: C.wrongBg },
  optionDim: { borderColor: C.borderLight, backgroundColor: '#FAFBFC', opacity: 0.5 },
  optLetter: { width: sc(28), height: sc(28), borderRadius: sc(8), alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: sc(1) },
  optLetterText: { fontSize: sc(12), fontWeight: '800', color: '#fff' },
  optText: { flex: 1, fontSize: sc(13), lineHeight: sc(20), color: C.text },
  correctTag: { marginTop: sc(5), backgroundColor: '#DCFCE7', borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start' },
  correctTagText: { fontSize: sc(10), fontWeight: '800', color: '#15803d' },
  wrongTag: { marginTop: sc(5), backgroundColor: '#FEE2E2', borderRadius: sc(5), paddingHorizontal: sc(7), paddingVertical: sc(2), alignSelf: 'flex-start' },
  wrongTagText: { fontSize: sc(10), fontWeight: '800', color: '#b91c1c' },
  feedbackBox: { flexDirection: 'row', borderRadius: sc(12), padding: sc(13), gap: sc(10), alignItems: 'flex-start', marginTop: sc(10) },
  feedbackCorrect: { backgroundColor: C.correctBg, borderWidth: 1, borderColor: C.correctBdr },
  feedbackWrong: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A' },
  feedbackEmoji: { fontSize: sc(20) },
  feedbackTitle: { fontSize: sc(13), fontWeight: '800', color: C.text, marginBottom: sc(3) },
  feedbackBody: { fontSize: sc(12), lineHeight: sc(18), color: C.sub },
  checkBtn: { backgroundColor: '#0f4c75', borderRadius: sc(13), height: sc(50), alignItems: 'center', justifyContent: 'center', marginTop: sc(10), elevation: 4 },
  checkBtnDisabled: { backgroundColor: '#9CA3AF', elevation: 0 },
  checkBtnText: { fontSize: sc(14), fontWeight: '800', color: '#fff' },
  finalCard: { backgroundColor: C.accent, borderRadius: sc(20), padding: sc(24), alignItems: 'center', marginTop: sc(8), elevation: 6 },
  finalEmoji: { fontSize: sc(44), marginBottom: sc(8) },
  finalTitle: { fontSize: sc(20), fontWeight: '900', color: '#fff', marginBottom: sc(6) },
  finalScore: { fontSize: sc(40), fontWeight: '900', color: '#38bdf8', marginBottom: sc(4) },
  finalAccuracy: { fontSize: sc(13), color: 'rgba(255,255,255,0.7)', marginBottom: sc(16) },
  retryBtn: { backgroundColor: '#fff', paddingHorizontal: sc(28), paddingVertical: sc(12), borderRadius: sc(12) },
  retryBtnText: { fontSize: sc(14), fontWeight: '800', color: C.accent },
});