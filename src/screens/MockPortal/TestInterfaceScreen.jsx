/**
 * TestInterfaceScreen.jsx — BACKEND INTEGRATED
 * GET /mocks/{mockId}/exam-config  → passages + questions + attemptId
 * POST /attempts/{attemptId}/submit → on SubmitModal confirm
 * POST /attempts/{attemptId}/save  → auto-save every 30s
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Dimensions, Modal, FlatList, Platform,
  StatusBar, TextInput, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getExamConfig, submitAttempt, saveProgress } from '../services/mockService';

const { width, height } = Dimensions.get('window');
const scale = s => (width / 390) * s;

const COLORS = {
  primary:        '#1F3B1F',
  primaryLight:   '#EEF0FD',
  background:     '#ECEEF5',
  white:          '#FFFFFF',
  darkText:       '#111827',
  subText:        '#6B7280',
  border:         '#E2E4EC',
  answered:       '#22C55E',
  notAnswered:    '#EF4444',
  marked:         '#7C3AED',
  notVisited:     '#D1D5DB',
  notVisitedText: '#374151',
  timerBox:       '#F3F4F6',
  passageBadge:   '#F0F1F5',
  tabActive:      '#2B3DE8',
  tabInactive:    '#9CA3AF',
  progressBg:     '#DDE1F5',
  timerWarning:   '#EF4444',
};

const Q_STATUS = {
  NOT_VISITED:          'not_visited',
  VISITED_NOT_ANSWERED: 'visited_not_answered',
  ANSWERED:             'answered',
  MARKED_REVIEW:        'marked_review',
  ANSWERED_MARKED:      'answered_marked',
};

const buildInitialMeta = questions => {
  const meta = {};
  questions.forEach(q => {
    meta[q.id] = { status: Q_STATUS.NOT_VISITED, selected: null, titaAnswer: '' };
  });
  return meta;
};

const getStatusColor = status => {
  switch (status) {
    case Q_STATUS.ANSWERED:             return COLORS.answered;
    case Q_STATUS.VISITED_NOT_ANSWERED: return COLORS.notAnswered;
    case Q_STATUS.MARKED_REVIEW:        return COLORS.marked;
    case Q_STATUS.ANSWERED_MARKED:      return COLORS.marked;
    default:                            return COLORS.notVisited;
  }
};
const getStatusTextColor = status =>
  status === Q_STATUS.NOT_VISITED ? COLORS.notVisitedText : COLORS.white;

const getQuestionTypeLabel = type => {
  switch (type) {
    case 'mcq':          return 'Single Correct Choice';
    case 'tita':         return 'Type In The Answer';
    case 'para_jumble':  return 'Para Jumble';
    case 'para_summary': return 'Para Summary';
    case 'odd_one_out':  return 'Odd One Out';
    default:             return 'MCQ';
  }
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function TestInterfaceScreen({ route }) {
  const navigation = useNavigation();
  const mockId     = route?.params?.mockId ?? '1';

  // ── API State ──
  const [examConfig,   setExamConfig]   = useState(null);
  const [attemptId,    setAttemptId]    = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [submitting,   setSubmitting]   = useState(false);

  // ── Test State ──
  const [activeSectionId,    setActiveSectionId]    = useState(null);
  const [currentQIndex,      setCurrentQIndex]      = useState(0);
  const [questionMeta,       setQuestionMeta]       = useState({});
  const [timeLeft,           setTimeLeft]           = useState(0);
  const [paletteVisible,     setPaletteVisible]     = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [passageFontSize,    setPassageFontSize]    = useState(scale(15));

  const scrollRef     = useRef(null);
  const autoSaveTimer = useRef(null);

  // ── Fetch exam config on mount ─────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getExamConfig(mockId);

        // Build passage lookup map: passage_key → passage object
        const passageMap = {};
        data.sections.forEach(sec => {
          (sec.passages || []).forEach(p => {
            passageMap[p.passage_key] = p;
          });
        });

        // Normalise sections to match frontend shape
        const sections = data.sections.map(sec => ({
          id:             sec.section_key,
          label:          sec.label,
          icon:           sec.icon,
          locked:         sec.is_locked,
          totalQuestions: sec.total_questions,
          durationSecs:   sec.duration_secs,
          passages:       sec.passages || [],
          questions:      (sec.questions || []).map(q => ({
            ...q,
            // passage_id from API is the passage_key string
            passageId: q.passage_id ?? null,
          })),
        }));

        const config = {
          mockId:       data.mock_id,
          testTitle:    data.test_title,
          subject:      data.subject,
          totalSeconds: data.total_seconds,
          sections,
          passageMap,
        };

        const firstUnlocked = sections.find(s => !s.locked);
        setExamConfig(config);
        setAttemptId(data.attempt_id);
        setActiveSectionId(firstUnlocked?.id ?? sections[0].id);
        setTimeLeft(data.total_seconds);

        const allQuestions = firstUnlocked?.questions ?? [];
        setQuestionMeta(buildInitialMeta(allQuestions));

      } catch (e) {
        setError(e?.response?.data?.detail ?? 'Failed to load test');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [mockId]);

  // ── Auto-save every 30s ────────────────────────────────────────────────────
  useEffect(() => {
    if (!attemptId) return;
    autoSaveTimer.current = setInterval(async () => {
      try {
        const timeTaken = (examConfig?.totalSeconds ?? 0) - timeLeft;
        await saveProgress(attemptId, buildSubmitMeta(questionMeta), timeTaken);
      } catch (_) {}
    }, 30000);
    return () => clearInterval(autoSaveTimer.current);
  }, [attemptId, questionMeta, timeLeft]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); setSubmitModalVisible(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const activeSection  = examConfig?.sections.find(s => s.id === activeSectionId);
  const QUESTIONS_DATA = activeSection?.questions ?? [];
  const ALL_Q_NUMBERS  = QUESTIONS_DATA.map(q => q.number);
  const currentQuestion = QUESTIONS_DATA[currentQIndex];
  const currentMeta     = currentQuestion
    ? (questionMeta[currentQuestion.id] ?? { status: Q_STATUS.NOT_VISITED, selected: null, titaAnswer: '' })
    : null;

  // Passage lookup
  const currentPassage = currentQuestion?.passageId
    ? (examConfig?.passageMap?.[currentQuestion.passageId] ?? null)
    : null;

  const allMeta          = Object.values(questionMeta);
  const answeredCount    = allMeta.filter(m => m.status === Q_STATUS.ANSWERED || m.status === Q_STATUS.ANSWERED_MARKED).length;
  const markedCount      = allMeta.filter(m => m.status === Q_STATUS.MARKED_REVIEW || m.status === Q_STATUS.ANSWERED_MARKED).length;
  const notAnsweredCount = allMeta.filter(m => m.status === Q_STATUS.VISITED_NOT_ANSWERED).length;
  const notVisitedCount  = allMeta.filter(m => m.status === Q_STATUS.NOT_VISITED).length;

  const minutes    = Math.floor(timeLeft / 60);
  const seconds    = timeLeft % 60;
  const isTimerLow = timeLeft < 5 * 60;

  // ── Map questionMeta to backend format ────────────────────────────────────
  const buildSubmitMeta = (meta) => {
    const out = {};
    Object.entries(meta).forEach(([qId, m]) => {
      out[qId] = {
        status:      m.status,
        selected:    m.selected,
        tita_answer: m.titaAnswer || null,
        time_spent:  0,
      };
    });
    return out;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const updateMeta = useCallback((qId, patch) => {
    setQuestionMeta(prev => ({ ...prev, [qId]: { ...prev[qId], ...patch } }));
  }, []);

  useEffect(() => {
    if (!currentQuestion) return;
    const meta = questionMeta[currentQuestion.id];
    if (meta?.status === Q_STATUS.NOT_VISITED) {
      updateMeta(currentQuestion.id, { status: Q_STATUS.VISITED_NOT_ANSWERED });
    }
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentQIndex]);

  const handleOptionSelect = optionIndex => {
    const meta = questionMeta[currentQuestion.id];
    updateMeta(currentQuestion.id, {
      selected: optionIndex,
      status:   meta?.status === Q_STATUS.MARKED_REVIEW ? Q_STATUS.ANSWERED_MARKED : Q_STATUS.ANSWERED,
    });
  };

  const handleTitaChange = text => {
    const meta = questionMeta[currentQuestion.id];
    updateMeta(currentQuestion.id, {
      titaAnswer: text,
      status: text.trim().length > 0
        ? (meta?.status === Q_STATUS.MARKED_REVIEW ? Q_STATUS.ANSWERED_MARKED : Q_STATUS.ANSWERED)
        : Q_STATUS.VISITED_NOT_ANSWERED,
    });
  };

  const handleSaveAndNext = () => {
    const meta = questionMeta[currentQuestion.id];
    const hasAnswer = meta?.selected !== null || (meta?.titaAnswer && meta.titaAnswer.trim().length > 0);
    if (!hasAnswer) updateMeta(currentQuestion.id, { status: Q_STATUS.VISITED_NOT_ANSWERED });
    if (currentQIndex < QUESTIONS_DATA.length - 1) setCurrentQIndex(i => i + 1);
  };

  const handleMarkForReview = () => {
    const meta = questionMeta[currentQuestion.id];
    const isAnswered = meta?.status === Q_STATUS.ANSWERED || meta?.status === Q_STATUS.ANSWERED_MARKED;
    updateMeta(currentQuestion.id, {
      status: isAnswered ? Q_STATUS.ANSWERED_MARKED : Q_STATUS.MARKED_REVIEW,
    });
    if (currentQIndex < QUESTIONS_DATA.length - 1) setCurrentQIndex(i => i + 1);
  };

  const handleClearResponse = () => {
    updateMeta(currentQuestion.id, { selected: null, titaAnswer: '', status: Q_STATUS.VISITED_NOT_ANSWERED });
  };

  const handleJumpToQuestion = qNumber => {
    const idx = QUESTIONS_DATA.findIndex(q => q.number === qNumber);
    if (idx !== -1) { setCurrentQIndex(idx); setPaletteVisible(false); }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitModalVisible(false);

      const timeTaken = (examConfig?.totalSeconds ?? 0) - timeLeft;
      const result    = await submitAttempt(
        attemptId,
        buildSubmitMeta(questionMeta),
        timeTaken,
      );

      // Navigate to Result with backend result + local meta (for solutions)
      navigation.navigate('Result', {
        mockId,
        attemptId,
        questionMeta,
        timeTaken,
        examConfig,
        // Pass backend result too so ResultScreen can use it directly
        backendResult: result,
      });

    } catch (e) {
      setSubmitting(false);
      setSubmitModalVisible(true);
      console.error('Submit failed:', e);
    }
  };

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ color: COLORS.subText, fontSize: scale(13) }}>Loading test...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !currentQuestion) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 }}>
          <Text style={{ fontSize: 36 }}>⚠️</Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.darkText }}>
            {error || 'No questions available'}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerClose} onPress={() => setSubmitModalVisible(true)} activeOpacity={0.7}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{examConfig.testTitle}</Text>
          <Text style={styles.headerSubject}>{examConfig.subject}</Text>
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={() => setSubmitModalVisible(true)} activeOpacity={0.85}>
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* TIMER + PROGRESS */}
      <View style={styles.timerRow}>
        <View style={styles.timerLeft}>
          <View style={[styles.timerBox, isTimerLow && styles.timerBoxWarning]}>
            <Text style={[styles.timerNum, isTimerLow && styles.timerNumWarning]}>
              {String(minutes).padStart(2, '0')}
            </Text>
          </View>
          <Text style={[styles.timerColon, isTimerLow && { color: COLORS.timerWarning }]}>:</Text>
          <View style={[styles.timerBox, isTimerLow && styles.timerBoxWarning]}>
            <Text style={[styles.timerNum, isTimerLow && styles.timerNumWarning]}>
              {String(seconds).padStart(2, '00')}
            </Text>
          </View>
          <Text style={styles.remainingLabel}>REMAINING</Text>
        </View>
        <View style={styles.progressRight}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>PROGRESS</Text>
            <Text style={styles.progressCount}>{answeredCount}/{activeSection?.totalQuestions ?? QUESTIONS_DATA.length}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(answeredCount / (activeSection?.totalQuestions || QUESTIONS_DATA.length)) * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* SECTION TABS */}
      <View style={styles.tabsRow}>
        {examConfig.sections.map(section => {
          const isActive = activeSectionId === section.id;
          return (
            <TouchableOpacity key={section.id} style={styles.tab}
              onPress={() => !section.locked && setActiveSectionId(section.id)}
              activeOpacity={section.locked ? 1 : 0.7}>
              <View style={styles.tabInner}>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive, section.locked && styles.tabLabelLocked]}>
                  {section.label}
                </Text>
                {section.locked && <Text style={styles.lockIcon}>🔒</Text>}
              </View>
              {isActive && !section.locked && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.divider} />

      {/* SCROLLABLE BODY */}
      <ScrollView ref={scrollRef} style={styles.body} showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bodyContent}>

        {/* PASSAGE CARD */}
        {currentPassage && (
          <View style={styles.passageCard}>
            <View style={styles.passageHeader}>
              <View style={styles.passageBadge}>
                <Text style={styles.passageBadgeText}>{currentPassage.label || 'Passage'}</Text>
              </View>
              <View style={styles.passageActions}>
                <TouchableOpacity onPress={() => setPassageFontSize(f => Math.min(f + scale(2), scale(22)))} style={styles.fontBtn}>
                  <Text style={styles.fontBtnText}>A+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPassageFontSize(f => Math.max(f - scale(2), scale(12)))} style={styles.fontBtn}>
                  <Text style={[styles.fontBtnText, { fontSize: scale(11) }]}>A−</Text>
                </TouchableOpacity>
              </View>
            </View>
            {(currentPassage.content || []).map((para, idx) => (
              <Text key={idx} style={[styles.passageText, { fontSize: passageFontSize }]}>{para}</Text>
            ))}
          </View>
        )}

        {/* QUESTION CARD */}
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.qNumBadge}><Text style={styles.qNumText}>Q{currentQuestion.number}</Text></View>
            <Text style={styles.questionType}>{getQuestionTypeLabel(currentQuestion.type)}</Text>
            <View style={styles.marksBadge}>
              <Text style={styles.marksText}>
                +{currentQuestion.marks?.correct ?? 3}
                {'  '}
                <Text style={{ color: COLORS.notAnswered }}>{currentQuestion.marks?.incorrect ?? -1}</Text>
              </Text>
            </View>
          </View>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>

          {/* MCQ / Para Jumble / Para Summary / Odd One Out */}
          {(['mcq', 'para_jumble', 'para_summary', 'odd_one_out'].includes(currentQuestion.type)) &&
            currentQuestion.options && (
            <View style={styles.optionsList}>
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = currentMeta?.selected === idx;
                return (
                  <TouchableOpacity key={idx}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                    onPress={() => handleOptionSelect(idx)} activeOpacity={0.75}>
                    <View style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}>
                      {isSelected && <View style={styles.optionCircleDot} />}
                    </View>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* TITA */}
          {currentQuestion.type === 'tita' && (
            <View style={styles.titaContainer}>
              {currentQuestion.hint && <Text style={styles.titaHint}>{currentQuestion.hint}</Text>}
              <TextInput
                style={styles.titaInput}
                value={currentMeta?.titaAnswer ?? ''}
                onChangeText={handleTitaChange}
                placeholder="Type your answer here..."
                placeholderTextColor={COLORS.subText}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
          )}

          {(currentMeta?.selected !== null || (currentMeta?.titaAnswer && currentMeta.titaAnswer.length > 0)) && (
            <TouchableOpacity onPress={handleClearResponse} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕  Clear Response</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ height: scale(16) }} />
      </ScrollView>

      {/* PALETTE STRIP */}
      <View style={styles.paletteStrip}>
        <View style={styles.paletteTitleRow}>
          <Text style={styles.paletteTitleText}>QUESTION PALETTE</Text>
          <TouchableOpacity onPress={() => setPaletteVisible(true)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paletteScrollContent}>
          {ALL_Q_NUMBERS.map(n => {
            const q = QUESTIONS_DATA.find(q => q.number === n);
            const meta = q ? (questionMeta[q.id] ?? { status: Q_STATUS.NOT_VISITED }) : { status: Q_STATUS.NOT_VISITED };
            const isCurrent = currentQuestion.number === n;
            return (
              <TouchableOpacity key={n}
                style={[styles.paletteBubble, { backgroundColor: getStatusColor(meta.status) }, isCurrent && styles.paletteBubbleCurrent]}
                onPress={() => handleJumpToQuestion(n)} activeOpacity={0.75}>
                <Text style={[styles.paletteBubbleText, { color: isCurrent ? COLORS.primary : getStatusTextColor(meta.status) }, isCurrent && { fontWeight: '800' }]}>
                  {n}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.reviewBtn} onPress={handleMarkForReview} activeOpacity={0.8}>
          <Text style={styles.reviewIcon}>🔖</Text>
          <Text style={styles.reviewBtnText}>Review</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveNextBtn} onPress={handleSaveAndNext} activeOpacity={0.85}>
          <Text style={styles.saveNextBtnText}>Save & Next  ›</Text>
        </TouchableOpacity>
      </View>

      {/* PALETTE MODAL */}
      <PaletteModal
        visible={paletteVisible}
        onClose={() => setPaletteVisible(false)}
        questionMeta={questionMeta}
        questionsData={QUESTIONS_DATA}
        allQNumbers={ALL_Q_NUMBERS}
        currentQNumber={currentQuestion.number}
        onJump={handleJumpToQuestion}
        answeredCount={answeredCount}
        notAnsweredCount={notAnsweredCount}
        markedCount={markedCount}
        notVisitedCount={notVisitedCount}
      />

      {/* SUBMIT MODAL */}
      <SubmitModal
        visible={submitModalVisible}
        onClose={() => setSubmitModalVisible(false)}
        onConfirm={handleSubmit}
        submitting={submitting}
        answeredCount={answeredCount}
        totalQuestions={activeSection?.totalQuestions ?? QUESTIONS_DATA.length}
        notAnsweredCount={notAnsweredCount + notVisitedCount}
        markedCount={markedCount}
      />
    </SafeAreaView>
  );
}

// ─── PALETTE MODAL ───────────────────────────────────────────────────────────
const PaletteModal = ({ visible, onClose, questionMeta, questionsData, allQNumbers, currentQNumber, onJump, answeredCount, notAnsweredCount, markedCount, notVisitedCount }) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <View style={modal.overlay}>
      <View style={modal.sheet}>
        <View style={modal.handle} />
        <Text style={modal.title}>Question Palette</Text>
        <View style={modal.legend}>
          {[
            { color: COLORS.answered,    label: `${answeredCount} Answered` },
            { color: COLORS.notAnswered, label: `${notAnsweredCount} Not Answered` },
            { color: COLORS.marked,      label: `${markedCount} Marked` },
            { color: COLORS.notVisited,  label: `${notVisitedCount} Not Visited` },
          ].map(item => (
            <View key={item.label} style={modal.legendItem}>
              <View style={[modal.legendDot, { backgroundColor: item.color }]} />
              <Text style={modal.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
        <View style={modal.divider} />
        <FlatList
          data={allQNumbers}
          numColumns={6}
          keyExtractor={n => String(n)}
          contentContainerStyle={modal.grid}
          renderItem={({ item: n }) => {
            const q    = questionsData.find(q => q.number === n);
            const meta = q ? (questionMeta[q.id] ?? { status: Q_STATUS.NOT_VISITED }) : { status: Q_STATUS.NOT_VISITED };
            const isCurrent = currentQNumber === n;
            return (
              <TouchableOpacity
                style={[modal.bubble, { backgroundColor: getStatusColor(meta.status) }, isCurrent && modal.bubbleCurrent]}
                onPress={() => onJump(n)} activeOpacity={0.75}>
                <Text style={[modal.bubbleText, { color: isCurrent ? COLORS.primary : getStatusTextColor(meta.status) }, isCurrent && { fontWeight: '800' }]}>{n}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <TouchableOpacity style={modal.closeBtn} onPress={onClose} activeOpacity={0.85}>
          <Text style={modal.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ─── SUBMIT MODAL ─────────────────────────────────────────────────────────────
const SubmitModal = ({ visible, onClose, onConfirm, submitting, answeredCount, totalQuestions, notAnsweredCount, markedCount }) => (
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View style={submitM.overlay}>
      <View style={submitM.card}>
        <Text style={submitM.title}>Submit Test?</Text>
        <Text style={submitM.subtitle}>Please review your attempt before submitting.</Text>
        <View style={submitM.statsRow}>
          <StatPill color={COLORS.answered}    count={answeredCount}    label="Answered" />
          <StatPill color={COLORS.notAnswered} count={notAnsweredCount} label="Unanswered" />
          <StatPill color={COLORS.marked}      count={markedCount}      label="Marked" />
        </View>
        <Text style={submitM.warning}>
          Unanswered questions carry no marks. Marked-for-review questions are evaluated only if answered.
        </Text>
        <View style={submitM.actions}>
          <TouchableOpacity style={submitM.cancelBtn} onPress={onClose} activeOpacity={0.8} disabled={submitting}>
            <Text style={submitM.cancelText}>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={submitM.confirmBtn} onPress={onConfirm} activeOpacity={0.85} disabled={submitting}>
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={submitM.confirmText}>Submit  ›</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const StatPill = ({ color, count, label }) => (
  <View style={submitM.pill}>
    <View style={[submitM.pillDot, { backgroundColor: color }]} />
    <Text style={submitM.pillCount}>{count}</Text>
    <Text style={submitM.pillLabel}>{label}</Text>
  </View>
);

// ─── STYLES (same as original) ────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: scale(16), paddingVertical: scale(12), paddingTop: Platform.OS === 'android' ? scale(38) : scale(22), borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerClose: { width: scale(36), height: scale(36), borderRadius: scale(18), backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  closeIcon: { fontSize: scale(14), color: COLORS.darkText, fontWeight: '700' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: scale(14), fontWeight: '700', color: COLORS.darkText, letterSpacing: 0.2 },
  headerSubject: { fontSize: scale(12), fontWeight: '700', color: COLORS.primary, marginTop: 1, letterSpacing: 0.5 },
  submitBtn: { backgroundColor: COLORS.primaryLight, paddingHorizontal: scale(14), paddingVertical: scale(8), borderRadius: scale(20), borderWidth: 1.5, borderColor: COLORS.primary },
  submitBtnText: { color: COLORS.primary, fontSize: scale(13), fontWeight: '700' },
  timerRow: { backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: scale(16), paddingVertical: scale(12), borderBottomWidth: 1, borderBottomColor: COLORS.border },
  timerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  timerBox: { backgroundColor: COLORS.timerBox, borderRadius: scale(8), paddingHorizontal: scale(10), paddingVertical: scale(6), minWidth: scale(42), alignItems: 'center' },
  timerBoxWarning: { backgroundColor: '#FEE2E2' },
  timerNum: { fontSize: scale(20), fontWeight: '800', color: COLORS.darkText, letterSpacing: 1 },
  timerNumWarning: { color: COLORS.timerWarning },
  timerColon: { fontSize: scale(20), fontWeight: '800', color: COLORS.darkText, marginHorizontal: scale(4) },
  remainingLabel: { fontSize: scale(10), fontWeight: '600', color: COLORS.subText, marginLeft: scale(8), letterSpacing: 0.8 },
  progressRight: { flex: 1.2, alignItems: 'flex-end' },
  progressLabelRow: { flexDirection: 'row', alignItems: 'center', gap: scale(6), marginBottom: scale(6) },
  progressLabel: { fontSize: scale(10), fontWeight: '600', color: COLORS.subText, letterSpacing: 0.8 },
  progressCount: { fontSize: scale(12), fontWeight: '700', color: COLORS.primary },
  progressBarBg: { width: scale(120), height: scale(5), backgroundColor: COLORS.progressBg, borderRadius: 10, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 10 },
  tabsRow: { backgroundColor: COLORS.white, flexDirection: 'row', paddingHorizontal: scale(16) },
  tab: { marginRight: scale(24), paddingTop: scale(8) },
  tabInner: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingBottom: scale(8) },
  tabLabel: { fontSize: scale(13), fontWeight: '700', color: COLORS.tabInactive, letterSpacing: 0.5 },
  tabLabelActive: { color: COLORS.tabActive },
  tabLabelLocked: { color: COLORS.notVisited },
  lockIcon: { fontSize: scale(10) },
  tabUnderline: { height: 2.5, backgroundColor: COLORS.primary, borderRadius: 2, marginTop: -1 },
  divider: { height: 1, backgroundColor: COLORS.border },
  body: { flex: 1 },
  bodyContent: { padding: scale(14) },
  passageCard: { backgroundColor: COLORS.white, borderRadius: scale(14), padding: scale(16), marginBottom: scale(12), ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  passageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(14) },
  passageBadge: { backgroundColor: COLORS.passageBadge, paddingHorizontal: scale(10), paddingVertical: scale(4), borderRadius: scale(6) },
  passageBadgeText: { fontSize: scale(11), fontWeight: '700', color: COLORS.darkText, letterSpacing: 0.5 },
  passageActions: { flexDirection: 'row', gap: scale(8) },
  fontBtn: { backgroundColor: COLORS.background, paddingHorizontal: scale(8), paddingVertical: scale(4), borderRadius: scale(6) },
  fontBtnText: { fontSize: scale(13), fontWeight: '700', color: COLORS.primary },
  passageText: { color: COLORS.darkText, lineHeight: scale(24), marginBottom: scale(14), fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  questionCard: { backgroundColor: COLORS.white, borderRadius: scale(14), padding: scale(16), ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 }, android: { elevation: 2 } }) },
  questionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: scale(12), gap: scale(8) },
  qNumBadge: { backgroundColor: COLORS.primary, borderRadius: scale(8), paddingHorizontal: scale(10), paddingVertical: scale(4) },
  qNumText: { color: COLORS.white, fontSize: scale(13), fontWeight: '800' },
  questionType: { flex: 1, fontSize: scale(11), color: COLORS.subText, fontWeight: '600', letterSpacing: 0.3 },
  marksBadge: { backgroundColor: COLORS.background, paddingHorizontal: scale(8), paddingVertical: scale(3), borderRadius: scale(6) },
  marksText: { fontSize: scale(11), fontWeight: '700', color: COLORS.answered },
  questionText: { fontSize: scale(14.5), color: COLORS.darkText, lineHeight: scale(22), fontWeight: '500', marginBottom: scale(18) },
  optionsList: { gap: scale(10) },
  optionRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.background, borderRadius: scale(10), padding: scale(12), borderWidth: 1.5, borderColor: 'transparent', gap: scale(12) },
  optionRowSelected: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  optionCircle: { width: scale(20), height: scale(20), borderRadius: scale(10), borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginTop: scale(1), flexShrink: 0 },
  optionCircleSelected: { borderColor: COLORS.primary },
  optionCircleDot: { width: scale(9), height: scale(9), borderRadius: scale(4.5), backgroundColor: COLORS.primary },
  optionText: { flex: 1, fontSize: scale(14), color: COLORS.darkText, lineHeight: scale(20) },
  optionTextSelected: { color: COLORS.primary, fontWeight: '600' },
  titaContainer: { marginTop: scale(4) },
  titaHint: { fontSize: scale(12), color: COLORS.subText, marginBottom: scale(8), fontStyle: 'italic' },
  titaInput: { backgroundColor: COLORS.background, borderRadius: scale(10), padding: scale(14), fontSize: scale(16), fontWeight: '700', color: COLORS.primary, borderWidth: 1.5, borderColor: COLORS.primary, letterSpacing: 2 },
  clearBtn: { marginTop: scale(14), alignSelf: 'flex-start', paddingHorizontal: scale(12), paddingVertical: scale(6), borderRadius: scale(8), borderWidth: 1, borderColor: COLORS.notAnswered },
  clearBtnText: { fontSize: scale(12), color: COLORS.notAnswered, fontWeight: '600' },
  paletteStrip: { backgroundColor: COLORS.white, paddingTop: scale(10), paddingBottom: scale(6), borderTopWidth: 1, borderTopColor: COLORS.border },
  paletteTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: scale(16), marginBottom: scale(8) },
  paletteTitleText: { fontSize: scale(10), fontWeight: '700', color: COLORS.subText, letterSpacing: 1 },
  viewAllText: { fontSize: scale(12), fontWeight: '700', color: COLORS.primary },
  paletteScrollContent: { paddingHorizontal: scale(12), gap: scale(7) },
  paletteBubble: { width: scale(36), height: scale(36), borderRadius: scale(18), justifyContent: 'center', alignItems: 'center' },
  paletteBubbleCurrent: { backgroundColor: COLORS.white, borderWidth: 2.5, borderColor: COLORS.primary },
  paletteBubbleText: { fontSize: scale(12), fontWeight: '700' },
  bottomBar: { flexDirection: 'row', padding: scale(12), paddingBottom: Platform.OS === 'ios' ? scale(4) : scale(12), backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border, gap: scale(12) },
  reviewBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: scale(14), borderRadius: scale(14), backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border, gap: scale(6) },
  reviewIcon: { fontSize: scale(16) },
  reviewBtnText: { fontSize: scale(14), fontWeight: '700', color: COLORS.darkText },
  saveNextBtn: { flex: 2.2, alignItems: 'center', justifyContent: 'center', paddingVertical: scale(14), borderRadius: scale(14), backgroundColor: COLORS.primary, ...Platform.select({ ios: { shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 }, android: { elevation: 5 } }) },
  saveNextBtnText: { fontSize: scale(15), fontWeight: '800', color: COLORS.white, letterSpacing: 0.3 },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: scale(24), borderTopRightRadius: scale(24), paddingHorizontal: scale(20), paddingBottom: scale(32), maxHeight: height * 0.8 },
  handle: { width: scale(40), height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginVertical: scale(12) },
  title: { fontSize: scale(16), fontWeight: '800', color: COLORS.darkText, marginBottom: scale(14) },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(8), marginBottom: scale(14) },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
  legendDot: { width: scale(12), height: scale(12), borderRadius: scale(6) },
  legendText: { fontSize: scale(11), fontWeight: '600', color: COLORS.subText },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: scale(14) },
  grid: { gap: scale(10), paddingBottom: scale(16) },
  bubble: { width: scale(46), height: scale(46), borderRadius: scale(23), justifyContent: 'center', alignItems: 'center', margin: scale(4) },
  bubbleCurrent: { backgroundColor: COLORS.white, borderWidth: 2.5, borderColor: COLORS.primary },
  bubbleText: { fontSize: scale(13), fontWeight: '700' },
  closeBtn: { backgroundColor: COLORS.primary, borderRadius: scale(14), paddingVertical: scale(14), alignItems: 'center', marginTop: scale(8) },
  closeBtnText: { color: COLORS.white, fontSize: scale(15), fontWeight: '700' },
});

const submitM = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: scale(20) },
  card: { backgroundColor: COLORS.white, borderRadius: scale(20), padding: scale(24), width: '100%' },
  title: { fontSize: scale(18), fontWeight: '800', color: COLORS.darkText, marginBottom: scale(6) },
  subtitle: { fontSize: scale(13), color: COLORS.subText, marginBottom: scale(20) },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: scale(20) },
  pill: { alignItems: 'center', gap: scale(4) },
  pillDot: { width: scale(28), height: scale(28), borderRadius: scale(14), marginBottom: scale(4) },
  pillCount: { fontSize: scale(16), fontWeight: '800', color: COLORS.darkText },
  pillLabel: { fontSize: scale(11), color: COLORS.subText, fontWeight: '600' },
  warning: { fontSize: scale(12), color: COLORS.subText, lineHeight: scale(18), backgroundColor: '#FFFBEB', padding: scale(12), borderRadius: scale(10), borderLeftWidth: 3, borderLeftColor: '#F59E0B', marginBottom: scale(20) },
  actions: { flexDirection: 'row', gap: scale(12) },
  cancelBtn: { flex: 1, paddingVertical: scale(14), borderRadius: scale(12), borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
  cancelText: { fontSize: scale(14), fontWeight: '700', color: COLORS.darkText },
  confirmBtn: { flex: 1.5, paddingVertical: scale(14), borderRadius: scale(12), backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  confirmText: { fontSize: scale(14), fontWeight: '800', color: COLORS.white },
});