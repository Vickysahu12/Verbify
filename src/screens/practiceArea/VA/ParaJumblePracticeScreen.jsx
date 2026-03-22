/**
 * ParaJumblePracticeScreen.jsx
 * Clean practice screen — only questions from backend
 * GET /va/questions?type=para_jumble
 * POST /va/submit
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
  accent: '#1a3c8f', accentLight: '#EEF2FF', accentMid: '#3B5FDB',
  bg: '#F7F8FC', surface: '#FFFFFF', border: '#E8EBF4', borderLight: '#F0F2FA',
  text: '#111827', sub: '#374151', muted: '#6B7594',
  correct: '#16a34a', correctBg: '#F0FDF4', correctBdr: '#BBF7D0',
  wrong: '#dc2626', wrongBg: '#FEF2F2', wrongBdr: '#FECACA',
};

export default function ParaJumblePracticeScreen({ navigation }) {
  const backScale  = useRef(new Animated.Value(1)).current;
  const shakeAnims = useRef({}).current;

  const {
    questions, loading, answers, loadQuestions,
    handleSelect, handleCheck, isChecked, getResult,
    totalCorrect, totalChecked,
  } = useVAQuestions('para_jumble');

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
        Animated.timing(anim, { toValue: 8,  duration: 55, useNativeDriver: true }),
        Animated.timing(anim, { toValue: -8, duration: 55, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 6,  duration: 55, useNativeDriver: true }),
        Animated.timing(anim, { toValue: -6, duration: 55, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0,  duration: 55, useNativeDriver: true }),
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
    if (!result) return isSelected ? C.accent : '#C9D0E8';
    if (optId === result.correct) return C.correct;
    if (isSelected)               return C.wrong;
    return '#C9D0E8';
  };

  const allDone = questions.length > 0 && totalChecked === questions.length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Navbar */}
      <View style={s.navbar}>
        <Animated.View style={{ transform: [{ scale: backScale }] }}>
          <TouchableOpacity onPress={handleBack} style={s.navBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={s.navBackIcon}>‹</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={s.navCenter} pointerEvents="none">
          <Text style={s.navTitle}>Para Jumble Practice</Text>
          <Text style={s.navSub}>ARRANGE THE SENTENCES</Text>
        </View>
        <View style={s.scorePill}>
          <Text style={s.scorePillText}>{totalCorrect}/{questions.length}</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={s.progressBarBg}>
        <View style={[s.progressBarFill, {
          width: questions.length > 0 ? `${(totalChecked / questions.length) * 100}%` : '0%'
        }]} />
      </View>

      {/* Stats strip */}
      <View style={s.statsStrip}>
        {[
          { val: questions.length, label: 'Questions' },
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

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Info banner */}
        <View style={s.infoBanner}>
          <Text style={s.infoBannerIcon}>🔀</Text>
          <Text style={s.infoBannerText}>
            Four sentences A, B, C, D are given. Choose the correct order to form a coherent paragraph.
          </Text>
        </View>

        {loading ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={C.accent} />
            <Text style={s.loadingText}>Loading questions...</Text>
          </View>
        ) : questions.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyEmoji}>📭</Text>
            <Text style={s.emptyTitle}>No questions yet</Text>
            <Text style={s.emptySub}>Questions will appear here once added.</Text>
          </View>
        ) : (
          <>
            {questions.map((q, idx) => {
              const result     = getResult(q.id);
              const isCheckedQ = isChecked(q.id);
              const isCorrect  = result?.is_correct ?? false;

              return (
                <View key={q.id} style={s.questionBlock}>
                  {/* Q number + difficulty */}
                  <View style={s.qTopRow}>
                    <View style={s.qNumBadge}>
                      <Text style={s.qNumText}>Q{idx + 1}</Text>
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

                  {/* Instruction */}
                  <Text style={s.qInstruction}>{q.question}</Text>
                  {/* Sentences (IMPORTANT) */}
{q.sentences && (
  <View style={{ marginBottom: 12 }}>
    {q.sentences.map((s) => (
      <View key={s.label} style={{ flexDirection: 'row', marginBottom: 6 }}>
        <Text style={{ fontWeight: '700', marginRight: 6 }}>
          {s.label}.
        </Text>
        <Text style={{ flex: 1 }}>
          {s.text}
        </Text>
      </View>
    ))}
  </View>
)}

                  {/* Options */}
                  <Text style={s.optionsLabel}>Select the correct order:</Text>
                  <Animated.View style={{ transform: [{ translateX: getShakeAnim(q.id) }] }}>
                    {(q.options ?? []).map(opt => (
                      <TouchableOpacity key={opt.id}
                        activeOpacity={isCheckedQ ? 1 : 0.75}
                        onPress={() => handleSelect(q.id, opt.id)}
                        style={getOptionStyle(q.id, opt.id)}>
                        <View style={[s.optLetter, { backgroundColor: getLetterBg(q.id, opt.id) }]}>
                          <Text style={s.optLetterText}>{opt.id}</Text>
                        </View>
                        <Text style={[s.optText, {
                          color: isCheckedQ && opt.id === result?.correct ? C.correct
                               : isCheckedQ && opt.id === answers[q.id] && !isCorrect ? C.wrong
                               : C.text
                        }]}>{opt.text}</Text>
                        {isCheckedQ && opt.id === result?.correct && (
                          <Text style={s.checkIcon}>✓</Text>
                        )}
                        {isCheckedQ && opt.id === answers[q.id] && !isCorrect && (
                          <Text style={[s.checkIcon, { color: C.wrong }]}>✕</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </Animated.View>

                  {/* Feedback */}
                  {isCheckedQ && (
                    <View style={[s.feedbackBox, isCorrect ? s.feedbackCorrect : s.feedbackWrong]}>
                      <Text style={s.feedbackEmoji}>{isCorrect ? '🎉' : '😅'}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={s.feedbackTitle}>
                          {isCorrect ? 'Spot on! Great logical thinking.' : `Correct order: ${result?.correct}`}
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

            {/* Final score card */}
            {allDone && (
              <View style={s.finalCard}>
                <Text style={s.finalEmoji}>
                  {totalCorrect === questions.length ? '🏆' : totalCorrect >= questions.length / 2 ? '💪' : '📚'}
                </Text>
                <Text style={s.finalTitle}>
                  {totalCorrect === questions.length ? 'Perfect Score!' : totalCorrect >= questions.length / 2 ? 'Good Job!' : 'Keep Practising!'}
                </Text>
                <Text style={s.finalScore}>{totalCorrect}/{questions.length}</Text>
                <Text style={s.finalAccuracy}>
                  Accuracy: {Math.round((totalCorrect / questions.length) * 100)}%
                </Text>
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
  safe: { flex: 1, backgroundColor: C.bg },
  navbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: sc(16), paddingTop: sc(10), paddingBottom: sc(10), backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.borderLight },
  navBtn: { width: sc(36), height: sc(36), borderRadius: sc(11), backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, elevation: 2 },
  navBackIcon: { fontSize: sc(22), color: C.text, lineHeight: sc(26), marginTop: -sc(1) },
  navCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: sc(15), fontWeight: '800', color: C.accent },
  navSub: { fontSize: sc(9), fontWeight: '700', color: C.muted, letterSpacing: 1, marginTop: sc(1) },
  scorePill: { backgroundColor: C.accent, borderRadius: sc(20), paddingHorizontal: sc(12), paddingVertical: sc(5) },
  scorePillText: { fontSize: sc(13), fontWeight: '800', color: '#fff' },
  progressBarBg: { height: sc(3), backgroundColor: C.borderLight },
  progressBarFill: { height: sc(3), backgroundColor: C.accentMid, borderRadius: sc(2) },
  statsStrip: { flexDirection: 'row', backgroundColor: C.accent, paddingVertical: sc(10), paddingHorizontal: sc(16), alignItems: 'center', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: sc(14), fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: sc(10), fontWeight: '600', color: 'rgba(255,255,255,0.55)', marginTop: sc(1) },
  statDiv: { width: 1, height: sc(24), backgroundColor: 'rgba(255,255,255,0.15)' },
  scrollContent: { paddingHorizontal: sc(16), paddingTop: sc(16), paddingBottom: sc(20) },
  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: sc(10), backgroundColor: C.accentLight, borderRadius: sc(14), padding: sc(14), marginBottom: sc(16), borderWidth: 1, borderColor: '#C7D7F5' },
  infoBannerIcon: { fontSize: sc(20) },
  infoBannerText: { flex: 1, fontSize: sc(13), color: C.accent, fontWeight: '500', lineHeight: sc(19) },
  loadingWrap: { paddingVertical: sc(60), alignItems: 'center', gap: sc(12) },
  loadingText: { fontSize: sc(13), color: C.muted },
  emptyWrap: { paddingVertical: sc(60), alignItems: 'center', gap: sc(8) },
  emptyEmoji: { fontSize: sc(48) },
  emptyTitle: { fontSize: sc(17), fontWeight: '800', color: C.text },
  emptySub: { fontSize: sc(13), color: C.muted, textAlign: 'center' },
  questionBlock: { backgroundColor: C.surface, borderRadius: sc(18), padding: sc(16), marginBottom: sc(16), elevation: 3, borderWidth: 1, borderColor: C.borderLight },
  qTopRow: { flexDirection: 'row', alignItems: 'center', gap: sc(8), marginBottom: sc(12), flexWrap: 'wrap' },
  qNumBadge: { backgroundColor: C.accent, paddingHorizontal: sc(10), paddingVertical: sc(4), borderRadius: sc(20) },
  qNumText: { fontSize: sc(11), fontWeight: '800', color: '#fff' },
  diffBadge: { paddingHorizontal: sc(9), paddingVertical: sc(4), borderRadius: sc(20) },
  diffText: { fontSize: sc(10), fontWeight: '700' },
  strategyChip: { backgroundColor: C.accentLight, paddingHorizontal: sc(10), paddingVertical: sc(4), borderRadius: sc(20), flex: 1 },
  strategyChipText: { fontSize: sc(11), fontWeight: '600', color: C.accent },
  qInstruction: { fontSize: sc(14), fontWeight: '600', color: C.sub, marginBottom: sc(14), lineHeight: sc(21) },
  optionsLabel: { fontSize: sc(11), fontWeight: '700', color: C.muted, marginBottom: sc(8), letterSpacing: 0.5 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F8FC', borderRadius: sc(13), padding: sc(13), marginBottom: sc(8), gap: sc(12), borderWidth: 1.5, borderColor: C.border },
  optionSelected: { borderColor: C.accent, backgroundColor: C.accentLight },
  optionCorrect: { borderColor: C.correct, backgroundColor: C.correctBg },
  optionWrong: { borderColor: C.wrong, backgroundColor: C.wrongBg },
  optionDim: { borderColor: C.border, backgroundColor: '#FAFAFA', opacity: 0.55 },
  optLetter: { width: sc(30), height: sc(30), borderRadius: sc(9), alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optLetterText: { fontSize: sc(13), fontWeight: '800', color: '#fff' },
  optText: { flex: 1, fontSize: sc(14), fontWeight: '600', color: C.text, letterSpacing: 0.5 },
  checkIcon: { fontSize: sc(16), fontWeight: '800', color: C.correct, flexShrink: 0 },
  feedbackBox: { flexDirection: 'row', borderRadius: sc(12), padding: sc(13), gap: sc(10), alignItems: 'flex-start', marginTop: sc(10) },
  feedbackCorrect: { backgroundColor: C.correctBg, borderWidth: 1, borderColor: C.correctBdr },
  feedbackWrong: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: C.wrongBdr },
  feedbackEmoji: { fontSize: sc(20) },
  feedbackTitle: { fontSize: sc(13), fontWeight: '800', color: C.text, marginBottom: sc(3) },
  feedbackBody: { fontSize: sc(12), lineHeight: sc(18), color: C.sub },
  checkBtn: { backgroundColor: C.accent, borderRadius: sc(13), height: sc(50), alignItems: 'center', justifyContent: 'center', marginTop: sc(10), elevation: 4 },
  checkBtnDisabled: { backgroundColor: '#9CA3AF', elevation: 0 },
  checkBtnText: { fontSize: sc(14), fontWeight: '800', color: '#fff' },
  finalCard: { backgroundColor: C.accent, borderRadius: sc(20), padding: sc(24), alignItems: 'center', marginTop: sc(8), elevation: 6 },
  finalEmoji: { fontSize: sc(44), marginBottom: sc(8) },
  finalTitle: { fontSize: sc(20), fontWeight: '900', color: '#fff', marginBottom: sc(6) },
  finalScore: { fontSize: sc(40), fontWeight: '900', color: '#FFD700', marginBottom: sc(4) },
  finalAccuracy: { fontSize: sc(13), color: 'rgba(255,255,255,0.7)', marginBottom: sc(16) },
  retryBtn: { backgroundColor: '#fff', paddingHorizontal: sc(28), paddingVertical: sc(12), borderRadius: sc(12) },
  retryBtnText: { fontSize: sc(14), fontWeight: '800', color: C.accent },
});