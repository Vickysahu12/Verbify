// SolutionScreen.js
// ─── ROUTE PARAMS ─────────────────────────────────────────────────────────────
//   mockId       — string, e.g. '1'
//   questionMeta — { [qId]: { status, selected, titaAnswer } }
//   examConfig   — full config from getExamData(mockId)

import React, { useState, useRef, useMemo, useCallback, memo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TouchableOpacity, SafeAreaView, StatusBar,
  Platform, Dimensions, LayoutAnimation, UIManager,
} from 'react-native';
import { getExamData, getPassage } from '../MockPortal/data/examData';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SW } = Dimensions.get('window');
const sc = n => (SW / 390) * n;

// ─── COLORS — same palette as ResultScreen ───────────────────────────────────
const C = {
  primary:       '#1F3B1F',
  primaryLight:  '#E8F5EE',
  primaryMid:    '#2EA86B',
  primarySoft:   '#F0FAF5',
  surface:       '#FFFFFF',
  bg:            '#F6F8F7',
  border:        '#E8EDEA',
  borderLight:   '#F0F4F2',
  text:          '#0D1F15',
  sub:           '#527A62',
  muted:         '#9DB5A5',
  correct:       '#16A34A',
  correctBg:     '#DCFCE7',
  wrong:         '#DC2626',
  wrongBg:       '#FEE2E2',
  unattempted:   '#94A3B8',
  unattemptedBg: '#F1F5F9',
  gold:          '#D97706',
  goldSoft:      '#FEF3C7',
  shadow:        '#0D1F15',
};

// ─── BACKEND INTEGRATION POINT ───────────────────────────────────────────────
// When your backend is ready, replace this function with an API call:
//   const res = await fetch(`${YOUR_API_BASE}/solutions/${questionId}`);
//   const data = await res.json();
//   return data; // { explanation: string, keyPoint?: string, difficulty?: 'easy'|'medium'|'hard' }
//
// You can also pre-fetch all explanations for a mock in one call:
//   GET /api/solutions?mockId=1
//   Returns: { [questionId]: { explanation, keyPoint, difficulty } }
const getExplanation = (_questionId) => {
  // Return null until backend is wired up — UI handles null gracefully
  return null;
};
// ─────────────────────────────────────────────────────────────────────────────

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

const TYPE_META = {
  mcq:          { label: 'MCQ',         color: C.primary,  bg: C.primaryLight  },
  tita:         { label: 'TITA',        color: '#7C3AED',  bg: '#EDE9FE'       },
  para_jumble:  { label: 'Para Jumble', color: C.gold,     bg: C.goldSoft      },
  para_summary: { label: 'Summary',     color: '#0284C7',  bg: '#E0F2FE'       },
  odd_one_out:  { label: 'Odd One Out', color: '#BE185D',  bg: '#FCE7F3'       },
};

const STATUS_CFG = {
  correct:     { label: 'Correct',     icon: '✓', color: C.correct,     bg: C.correctBg     },
  wrong:       { label: 'Wrong',       icon: '✗', color: C.wrong,       bg: C.wrongBg       },
  unattempted: { label: 'Unattempted', icon: '—', color: C.unattempted, bg: C.unattemptedBg },
};

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

const getQuestionStatus = (question, meta) => {
  if (
    !meta ||
    meta.status === 'not_visited' ||
    meta.status === 'visited_not_answered' ||
    (meta.status === 'marked_review' && meta.selected === null && !meta.titaAnswer?.trim())
  ) return 'unattempted';

  if (question.type === 'tita') {
    const ans     = (meta.titaAnswer ?? '').trim().toUpperCase();
    const correct = (question.correctAnswer ?? '').trim().toUpperCase();
    return ans === correct ? 'correct' : 'unattempted'; // TITA wrong = no negative, treat as unattempted for score
  }

  if (meta.selected === question.correctOption) return 'correct';
  if (meta.selected !== null)                   return 'wrong';
  return 'unattempted';
};

const getScoreImpact = (question, meta) => {
  const status  = getQuestionStatus(question, meta);
  if (status === 'correct') return { text: '+3', color: C.correct, bg: C.correctBg };
  const hasNeg = (question.marks?.incorrect ?? 0) < 0;
  if (status === 'wrong' && hasNeg) return { text: '−1', color: C.wrong, bg: C.wrongBg };
  return { text: '0', color: C.unattempted, bg: C.unattemptedBg };
};

// ─── PASSAGE CARD ─────────────────────────────────────────────────────────────

const PassageCard = ({ passageId, expanded, onToggle }) => {
  const passage = getPassage(passageId);
  if (!passage) return null;

  return (
    <View style={s.passageCard}>
      <TouchableOpacity onPress={onToggle} style={s.passageHeader} activeOpacity={0.75}>
        <View style={s.passageHeaderLeft}>
          <View style={s.passageIconWrap}>
            <Text style={s.passageEmoji}>📖</Text>
          </View>
          <View style={s.passageTitleGroup}>
            <Text style={s.passageMeta}>{passage.label}</Text>
            <Text style={s.passageTitle}>{passage.title}</Text>
          </View>
        </View>
        <View style={s.passageToggleBtn}>
          <Text style={s.passageToggleText}>{expanded ? 'Hide' : 'Read'}</Text>
          <Text style={s.passageChevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={s.passageBody}>
          <View style={s.passageDivider} />
          {passage.content.map((para, i) => (
            <Text key={i} style={[s.passagePara, i > 0 && { marginTop: sc(10) }]}>
              {para}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── TITA ANSWER ─────────────────────────────────────────────────────────────

const TitaAnswer = ({ question, meta }) => {
  const rawAns     = (meta?.titaAnswer ?? '').trim();
  const userAns    = rawAns || null;
  const correctAns = question.correctAnswer ?? '—';
  const isCorrect  = userAns && userAns.toUpperCase() === correctAns.toUpperCase();

  return (
    <View style={s.titaWrap}>
      <View style={[
        s.titaBox,
        {
          backgroundColor: userAns ? (isCorrect ? C.correctBg : C.wrongBg) : C.unattemptedBg,
          borderColor:      userAns ? (isCorrect ? C.correct : C.wrong)    : C.unattempted,
        },
      ]}>
        <Text style={s.titaBoxLabel}>Your Answer</Text>
        <Text style={[s.titaBoxValue, { color: userAns ? (isCorrect ? C.correct : C.wrong) : C.unattempted }]}>
          {userAns ?? 'Not Answered'}
        </Text>
      </View>

      <View style={[s.titaBox, { backgroundColor: C.correctBg, borderColor: C.correct }]}>
        <Text style={s.titaBoxLabel}>Correct Answer</Text>
        <Text style={[s.titaBoxValue, { color: C.correct }]}>{correctAns}</Text>
      </View>

      {question.hint && (
        <View style={s.titaHintRow}>
          <Text style={s.titaHintIcon}>💬</Text>
          <Text style={s.titaHintText}>Format hint: {question.hint}</Text>
        </View>
      )}
    </View>
  );
};

// ─── ODD ONE OUT OPTIONS ──────────────────────────────────────────────────────

const OddOneOutOptions = ({ question, meta }) => {
  const userSelected = meta?.selected ?? null;
  const { correctOption, options } = question;

  return (
    <View style={s.oooSection}>
      <Text style={s.oooInstruction}>Select the sentence that does not belong:</Text>
      <View style={s.oooRow}>
        {options.map((letter, idx) => {
          const isCorrect     = idx === correctOption;
          const isWrongPicked = idx === userSelected && !isCorrect;
          return (
            <View
              key={idx}
              style={[
                s.oooChip,
                isCorrect     && s.oooChipCorrect,
                isWrongPicked && s.oooChipWrong,
              ]}
            >
              <Text style={[
                s.oooChipLetter,
                isCorrect     && s.oooChipLetterCorrect,
                isWrongPicked && s.oooChipLetterWrong,
              ]}>
                {letter}
              </Text>
              {isCorrect     && <Text style={s.oooMark}>✓</Text>}
              {isWrongPicked && <Text style={[s.oooMark, { color: C.wrong }]}>✗</Text>}
            </View>
          );
        })}
      </View>
      {userSelected !== null && userSelected !== correctOption && (
        <View style={s.oooNote}>
          <Text style={s.oooNoteText}>
            You selected <Text style={{ fontWeight: '800', color: C.wrong }}>{OPTION_LETTERS[userSelected]}</Text>
            {'  ·  '}
            Correct answer is <Text style={{ fontWeight: '800', color: C.correct }}>{OPTION_LETTERS[correctOption]}</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

// ─── MCQ / PARA JUMBLE / SUMMARY OPTIONS ──────────────────────────────────────

const MCQOptions = ({ question, meta }) => {
  const userSelected = meta?.selected ?? null;
  const { correctOption, options } = question;

  return (
    <View style={s.optionsList}>
      {options.map((opt, idx) => {
        const isCorrect     = idx === correctOption;
        const isWrongPicked = idx === userSelected && !isCorrect;
        const isNeutral     = !isCorrect && !isWrongPicked;

        return (
          <View
            key={idx}
            style={[
              s.optionRow,
              isCorrect     && s.optionRowCorrect,
              isWrongPicked && s.optionRowWrong,
            ]}
          >
            {/* Letter bubble */}
            <View style={[
              s.optionBubble,
              isCorrect     && s.optionBubbleCorrect,
              isWrongPicked && s.optionBubbleWrong,
            ]}>
              <Text style={[
                s.optionLetter,
                isCorrect     && { color: '#fff' },
                isWrongPicked && { color: '#fff' },
                isNeutral     && { color: C.muted },
              ]}>
                {OPTION_LETTERS[idx]}
              </Text>
            </View>

            {/* Option text */}
            <Text style={[
              s.optionText,
              isCorrect     && { color: C.correct,     fontWeight: '600' },
              isWrongPicked && { color: C.wrong,       fontWeight: '600' },
              isNeutral     && { color: C.sub },
            ]}>
              {opt}
            </Text>

            {/* Status icon */}
            {isCorrect     && <Text style={[s.optionMark, { color: C.correct }]}>✓</Text>}
            {isWrongPicked && <Text style={[s.optionMark, { color: C.wrong   }]}>✗</Text>}
          </View>
        );
      })}

      {/* Missed correct answer callout (user skipped but question was answered wrong) */}
      {userSelected !== null && userSelected !== correctOption && (
        <View style={s.missedNote}>
          <Text style={s.missedNoteIcon}>💡</Text>
          <Text style={s.missedNoteText}>
            Correct answer was option{' '}
            <Text style={{ fontWeight: '800', color: C.correct }}>{OPTION_LETTERS[correctOption]}</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

// ─── ANSWER SECTION DISPATCHER ────────────────────────────────────────────────

const AnswerSection = ({ question, meta }) => {
  if (question.type === 'tita') {
    return <TitaAnswer question={question} meta={meta} />;
  }
  if (question.type === 'odd_one_out') {
    return <OddOneOutOptions question={question} meta={meta} />;
  }
  if (question.options) {
    return <MCQOptions question={question} meta={meta} />;
  }
  return null;
};

// ─── EXPLANATION SECTION ──────────────────────────────────────────────────────

const ExplanationSection = ({ questionId, expanded, onToggle }) => {
  const explanation = getExplanation(questionId);

  return (
    <View style={s.explanationWrap}>
      <TouchableOpacity onPress={onToggle} style={s.explanationTrigger} activeOpacity={0.75}>
        <View style={s.explanationTriggerLeft}>
          <View style={s.explanationIconWrap}>
            <Text style={s.explanationEmoji}>💡</Text>
          </View>
          <Text style={s.explanationLabel}>Explanation</Text>
        </View>
        <Text style={s.explanationChev}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={s.explanationBody}>
          {explanation ? (
            <>
              <Text style={s.explanationText}>{explanation.explanation}</Text>
              {explanation.keyPoint && (
                <View style={s.keyPointBox}>
                  <Text style={s.keyPointLabel}>🔑  Key Point</Text>
                  <Text style={s.keyPointText}>{explanation.keyPoint}</Text>
                </View>
              )}
              {explanation.difficulty && (
                <View style={s.difficultyRow}>
                  <Text style={s.difficultyLabel}>Difficulty:</Text>
                  <Text style={[s.difficultyVal, {
                    color: explanation.difficulty === 'easy'   ? C.correct :
                           explanation.difficulty === 'medium' ? C.gold    : C.wrong,
                  }]}>
                    {explanation.difficulty.charAt(0).toUpperCase() + explanation.difficulty.slice(1)}
                  </Text>
                </View>
              )}
            </>
          ) : (
            // ── Placeholder until backend is wired ──
            <View style={s.placeholderWrap}>
              <View style={s.placeholderIconWrap}>
                <Text style={s.placeholderIconText}>🔧</Text>
              </View>
              <Text style={s.placeholderTitle}>Expert Explanation Coming Soon</Text>
              <Text style={s.placeholderSub}>
                Our team is writing detailed, step-by-step solutions for every question.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// ─── QUESTION CARD ────────────────────────────────────────────────────────────
// memo → only re-renders when its OWN passage/explanation toggle changes,
// not when a different card's state changes.

const QuestionCard = memo(({
  question, meta,
  passageExpanded, onTogglePassage,
  explanationExpanded, onToggleExplanation,
  onLayout,
}) => {
  const status    = getQuestionStatus(question, meta);
  const statusCfg = STATUS_CFG[status];
  const score     = getScoreImpact(question, meta);
  const typeMeta  = TYPE_META[question.type] ?? TYPE_META.mcq;

  return (
    <View
      style={[s.card, { borderLeftColor: statusCfg.color }]}
      onLayout={onLayout}
    >
      {/* ── Card Header ── */}
      <View style={s.cardHeader}>
        <View style={s.cardHeaderLeft}>
          <View style={s.qBadge}>
            <Text style={s.qBadgeText}>Q{question.number}</Text>
          </View>
          <View style={[s.typePill, { backgroundColor: typeMeta.bg }]}>
            <Text style={[s.typePillText, { color: typeMeta.color }]}>{typeMeta.label}</Text>
          </View>
          {question.passageId && (
            <View style={s.rcPill}>
              <Text style={s.rcPillText}>RC</Text>
            </View>
          )}
        </View>

        <View style={s.cardHeaderRight}>
          <View style={[s.scorePill, { backgroundColor: score.bg }]}>
            <Text style={[s.scorePillText, { color: score.color }]}>{score.text}</Text>
          </View>
          <View style={[s.statusPill, { backgroundColor: statusCfg.bg }]}>
            <Text style={[s.statusPillText, { color: statusCfg.color }]}>
              {statusCfg.icon}  {statusCfg.label}
            </Text>
          </View>
        </View>
      </View>

      <View style={s.cardDivider} />

      {/* ── Passage (RC only) ── */}
      {question.passageId && (
        <PassageCard
          passageId={question.passageId}
          expanded={passageExpanded}
          onToggle={() => onTogglePassage(question.passageId)}
        />
      )}

      {/* ── Question Text ── */}
      <View style={s.questionBody}>
        <Text style={s.questionText}>{question.text}</Text>
      </View>

      {/* ── Answer / Options ── */}
      <View style={s.answerSection}>
        <AnswerSection question={question} meta={meta} />
      </View>

      {/* ── Explanation ── */}
      <ExplanationSection
        questionId={question.id}
        expanded={explanationExpanded}
        onToggle={() => onToggleExplanation(question.id)}
      />
    </View>
  );
});

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────

export default function SolutionScreen({ navigation, route }) {
  const mockId       = route?.params?.mockId ?? '1';
  const questionMeta = route?.params?.questionMeta ?? {};
  const examConfig   = route?.params?.examConfig ?? getExamData(mockId);

  const activeSection = examConfig.sections.find(sec => !sec.locked);
  const questions     = activeSection?.questions ?? [];

  // ── Pre-compute statuses for all questions ──
  const statuses = useMemo(() => {
    const map = {};
    questions.forEach(q => { map[q.id] = getQuestionStatus(q, questionMeta[q.id]); });
    return map;
  }, [questions, questionMeta]);

  const counts = useMemo(() => ({
    all:         questions.length,
    correct:     questions.filter(q => statuses[q.id] === 'correct').length,
    wrong:       questions.filter(q => statuses[q.id] === 'wrong').length,
    unattempted: questions.filter(q => statuses[q.id] === 'unattempted').length,
  }), [questions, statuses]);

  // ── State ──
  const [filter, setFilter]                           = useState('all');
  const [expandedPassages, setExpandedPassages]       = useState(new Set());
  const [expandedExplanations, setExpandedExplanations] = useState(new Set());

  // ── Refs ──
  const scrollRef      = useRef(null);
  const navScrollRef   = useRef(null);
  const itemPositions  = useRef({}); // { [questionId]: yPosition }
  const filterRef      = useRef(filter);
  filterRef.current    = filter;

  // ── Filtered list ──
  const filteredQuestions = useMemo(() => {
    if (filter === 'all') return questions;
    return questions.filter(q => statuses[q.id] === filter);
  }, [questions, statuses, filter]);

  // ── Toggle handlers ──
  const togglePassage = useCallback((pid) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedPassages(prev => {
      const next = new Set(prev);
      next.has(pid) ? next.delete(pid) : next.add(pid);
      return next;
    });
  }, []);

  const toggleExplanation = useCallback((qid) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedExplanations(prev => {
      const next = new Set(prev);
      next.has(qid) ? next.delete(qid) : next.add(qid);
      return next;
    });
  }, []);

  // ── Navigator tap → scroll to question ──
  const scrollToQuestion = useCallback((questionId) => {
    const doScroll = () => {
      const y = itemPositions.current[questionId] ?? 0;
      scrollRef.current?.scrollToOffset({ offset: Math.max(0, y - sc(12)), animated: true });
    };
    if (filterRef.current !== 'all') {
      setFilter('all');
      setTimeout(doScroll, 280);
    } else {
      doScroll();
    }
  }, []);

  // ── Navigator chip color ──
  const chipColor = (status) => {
    if (status === 'correct')     return C.correct;
    if (status === 'wrong')       return C.wrong;
    if (status === 'unattempted') return C.unattempted;
    return C.muted;
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* ── NAVBAR ── */}
      <View style={s.navbar}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={s.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={s.navCenter}>
          <Text style={s.navTitle}>Solutions</Text>
          <Text style={s.navSub} numberOfLines={1}>{examConfig.testTitle}</Text>
        </View>
        <View style={s.navBadge}>
          <Text style={s.navBadgeText}>{questions.length}Q</Text>
        </View>
      </View>

      {/* ── FILTER BAR ── */}
      <View style={s.filterBar}>
        {[
          { key: 'all',         label: 'All',         count: counts.all         },
          { key: 'correct',     label: 'Correct',     count: counts.correct     },
          { key: 'wrong',       label: 'Wrong',       count: counts.wrong       },
          { key: 'unattempted', label: 'Left',        count: counts.unattempted },
        ].map(tab => {
          const active = filter === tab.key;
          const accent =
            tab.key === 'correct'     ? C.correct :
            tab.key === 'wrong'       ? C.wrong   :
            tab.key === 'unattempted' ? C.unattempted :
            C.primary;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              style={[s.filterTab, active && { borderBottomColor: accent, borderBottomWidth: sc(2.5) }]}
              activeOpacity={0.7}
            >
              <View style={[s.filterCountPill, { backgroundColor: active ? accent + '18' : C.unattemptedBg }]}>
                <Text style={[s.filterCountText, { color: active ? accent : C.muted }]}>{tab.count}</Text>
              </View>
              <Text style={[s.filterLabel, { color: active ? accent : C.muted }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── QUESTION NAVIGATOR ── */}
      <View style={s.navStrip}>
        <ScrollView
          ref={navScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.navStripContent}
        >
          {questions.map((q) => {
            const color = chipColor(statuses[q.id]);
            return (
              <TouchableOpacity
                key={q.id}
                onPress={() => scrollToQuestion(q.id)}
                style={[s.navChip, { backgroundColor: color + '18', borderColor: color + '60' }]}
                activeOpacity={0.65}
              >
                <Text style={[s.navChipText, { color }]}>{q.number}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Legend */}
        <View style={s.legendRow}>
          {[
            { color: C.correct,     label: 'Correct'     },
            { color: C.wrong,       label: 'Wrong'       },
            { color: C.unattempted, label: 'Unattempted' },
          ].map(item => (
            <View key={item.label} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: item.color }]} />
              <Text style={s.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── SOLUTION LIST ── */}
      <FlatList
        ref={scrollRef}
        data={filteredQuestions}
        keyExtractor={item => item.id}
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={6}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>🔍</Text>
            <Text style={s.emptyTitle}>No questions here</Text>
            <Text style={s.emptySub}>Try a different filter above</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: sc(48) }} />}
        renderItem={({ item: question }) => (
          <QuestionCard
            key={question.id}
            question={question}
            meta={questionMeta[question.id]}
            passageExpanded={expandedPassages.has(question.passageId)}
            onTogglePassage={togglePassage}
            explanationExpanded={expandedExplanations.has(question.id)}
            onToggleExplanation={toggleExplanation}
            onLayout={(e) => {
              itemPositions.current[question.id] = e.nativeEvent.layout.y;
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // ── Navbar ──────────────────────────────────────────────────────────────────
  navbar: {
    backgroundColor: C.primary,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: sc(16),
    paddingTop:    Platform.OS === 'android' ? sc(36) : sc(12),
    paddingBottom: sc(14),
    gap: sc(10),
  },
  backBtn:  { width: sc(36), alignItems: 'flex-start' },
  backIcon: { fontSize: sc(28), color: '#fff', lineHeight: sc(32), marginTop: -sc(2) },
  navCenter: { flex: 1 },
  navTitle: { fontSize: sc(17), fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  navSub:   { fontSize: sc(10), fontWeight: '500', color: '#7BA882', marginTop: sc(1) },
  navBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: sc(10), paddingVertical: sc(5),
    borderRadius: sc(8),
  },
  navBadgeText: { fontSize: sc(12), fontWeight: '800', color: '#fff' },

  // ── Filter Bar ──────────────────────────────────────────────────────────────
  filterBar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  filterTab: {
    flex: 1, alignItems: 'center', paddingVertical: sc(10),
    borderBottomWidth: sc(2.5), borderBottomColor: 'transparent',
    gap: sc(4),
  },
  filterCountPill: {
    paddingHorizontal: sc(8), paddingVertical: sc(2),
    borderRadius: sc(6),
  },
  filterCountText: { fontSize: sc(13), fontWeight: '800' },
  filterLabel:     { fontSize: sc(10), fontWeight: '600' },

  // ── Question Navigator ───────────────────────────────────────────────────────
  navStrip: {
    backgroundColor: C.surface,
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingBottom: sc(10),
  },
  navStripContent: {
    paddingHorizontal: sc(14), paddingTop: sc(10),
    flexDirection: 'row', gap: sc(7),
  },
  navChip: {
    width: sc(32), height: sc(32), borderRadius: sc(8),
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  navChipText: { fontSize: sc(11), fontWeight: '800' },

  legendRow: {
    flexDirection: 'row', gap: sc(14),
    paddingHorizontal: sc(14), paddingTop: sc(6),
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: sc(5) },
  legendDot:  { width: sc(7), height: sc(7), borderRadius: sc(4) },
  legendText: { fontSize: sc(9), fontWeight: '600', color: C.muted },

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: sc(14), paddingTop: sc(14) },

  // ── Empty State ─────────────────────────────────────────────────────────────
  emptyState: { alignItems: 'center', paddingTop: sc(60), gap: sc(10) },
  emptyIcon:  { fontSize: sc(40) },
  emptyTitle: { fontSize: sc(16), fontWeight: '800', color: C.text },
  emptySub:   { fontSize: sc(13), color: C.muted },

  // ── Question Card ────────────────────────────────────────────────────────────
  card: {
    backgroundColor: C.surface,
    borderRadius: sc(16),
    borderWidth: 1, borderColor: C.border,
    borderLeftWidth: sc(4),
    marginBottom: sc(14),
    overflow: 'hidden',
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sc(14), paddingVertical: sc(12),
    gap: sc(8),
  },
  cardHeaderLeft:  { flexDirection: 'row', alignItems: 'center', gap: sc(7), flex: 1 },
  cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: sc(6) },

  qBadge: {
    backgroundColor: C.primary, borderRadius: sc(8),
    paddingHorizontal: sc(9), paddingVertical: sc(4),
  },
  qBadgeText: { fontSize: sc(12), fontWeight: '900', color: '#fff', letterSpacing: -0.2 },

  typePill: {
    paddingHorizontal: sc(8), paddingVertical: sc(4),
    borderRadius: sc(7),
  },
  typePillText: { fontSize: sc(10), fontWeight: '700', letterSpacing: 0.1 },

  rcPill: {
    backgroundColor: C.goldSoft,
    paddingHorizontal: sc(7), paddingVertical: sc(4),
    borderRadius: sc(7),
  },
  rcPillText: { fontSize: sc(10), fontWeight: '700', color: C.gold },

  scorePill: {
    paddingHorizontal: sc(8), paddingVertical: sc(4),
    borderRadius: sc(7),
  },
  scorePillText: { fontSize: sc(12), fontWeight: '900', letterSpacing: -0.2 },

  statusPill: {
    paddingHorizontal: sc(9), paddingVertical: sc(4),
    borderRadius: sc(7),
  },
  statusPillText: { fontSize: sc(10), fontWeight: '700' },

  cardDivider: { height: 1, backgroundColor: C.borderLight },

  // ── Passage Card ─────────────────────────────────────────────────────────────
  passageCard: {
    backgroundColor: C.primarySoft,
    marginHorizontal: sc(14), marginTop: sc(12),
    borderRadius: sc(12),
    borderWidth: 1, borderColor: C.primaryLight,
    overflow: 'hidden',
  },
  passageHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    padding: sc(12), gap: sc(10),
  },
  passageHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: sc(10), flex: 1 },
  passageIconWrap: {
    width: sc(34), height: sc(34), borderRadius: sc(9),
    backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center',
  },
  passageEmoji:  { fontSize: sc(16) },
  passageTitleGroup: {},
  passageMeta:   { fontSize: sc(9), fontWeight: '700', color: C.sub, letterSpacing: 0.6 },
  passageTitle:  { fontSize: sc(12), fontWeight: '700', color: C.primary, marginTop: sc(1) },
  passageToggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: sc(4),
    backgroundColor: C.primaryLight, paddingHorizontal: sc(10), paddingVertical: sc(5),
    borderRadius: sc(8),
  },
  passageToggleText: { fontSize: sc(11), fontWeight: '700', color: C.primary },
  passageChevron:    { fontSize: sc(9), color: C.primary },
  passageDivider:    { height: 1, backgroundColor: C.primaryLight },
  passageBody:       { padding: sc(14), paddingTop: sc(12) },
  passagePara:       { fontSize: sc(13), color: C.sub, lineHeight: sc(21), fontWeight: '400' },
  passageParaSpaced: { marginTop: sc(10) },

  // ── Question Body ────────────────────────────────────────────────────────────
  questionBody: {
    paddingHorizontal: sc(14), paddingTop: sc(14), paddingBottom: sc(4),
  },
  questionText: {
    fontSize: sc(14), color: C.text, lineHeight: sc(22),
    fontWeight: '500', letterSpacing: -0.1,
  },

  // ── Answer Section ───────────────────────────────────────────────────────────
  answerSection: {
    paddingHorizontal: sc(14), paddingTop: sc(12), paddingBottom: sc(4),
  },

  // ── MCQ Options ─────────────────────────────────────────────────────────────
  optionsList: { gap: sc(8) },
  optionRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: C.bg,
    borderRadius: sc(10), borderWidth: 1, borderColor: C.border,
    padding: sc(12), gap: sc(10),
  },
  optionRowCorrect: {
    backgroundColor: C.correctBg, borderColor: '#86EFAC',
  },
  optionRowWrong: {
    backgroundColor: C.wrongBg, borderColor: '#FCA5A5',
  },
  optionBubble: {
    width: sc(24), height: sc(24), borderRadius: sc(7),
    backgroundColor: C.border, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: sc(1),
  },
  optionBubbleCorrect: { backgroundColor: C.correct },
  optionBubbleWrong:   { backgroundColor: C.wrong   },
  optionLetter: { fontSize: sc(11), fontWeight: '800' },
  optionText:   { flex: 1, fontSize: sc(13), lineHeight: sc(20), fontWeight: '500' },
  optionMark:   { fontSize: sc(15), fontWeight: '900', flexShrink: 0, marginTop: sc(1) },

  missedNote: {
    flexDirection: 'row', alignItems: 'center', gap: sc(8),
    backgroundColor: C.primaryLight, borderRadius: sc(10),
    paddingHorizontal: sc(12), paddingVertical: sc(9),
    marginTop: sc(6),
    borderWidth: 1, borderColor: C.primaryMid + '40',
  },
  missedNoteIcon: { fontSize: sc(13) },
  missedNoteText: { fontSize: sc(12), color: C.sub, fontWeight: '500', flex: 1 },

  // ── ODD ONE OUT ──────────────────────────────────────────────────────────────
  oooSection:      { gap: sc(10) },
  oooInstruction:  { fontSize: sc(12), color: C.muted, fontWeight: '600' },
  oooRow:          { flexDirection: 'row', gap: sc(10) },
  oooChip: {
    width: sc(46), height: sc(46), borderRadius: sc(12),
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', gap: sc(2),
  },
  oooChipCorrect: { backgroundColor: C.correctBg, borderColor: '#86EFAC' },
  oooChipWrong:   { backgroundColor: C.wrongBg,   borderColor: '#FCA5A5' },
  oooChipLetter:  { fontSize: sc(15), fontWeight: '900', color: C.muted },
  oooChipLetterCorrect: { color: C.correct },
  oooChipLetterWrong:   { color: C.wrong   },
  oooMark: { fontSize: sc(10), fontWeight: '900', color: C.correct },

  oooNote: {
    backgroundColor: C.bg, borderRadius: sc(10),
    paddingHorizontal: sc(12), paddingVertical: sc(9),
    borderWidth: 1, borderColor: C.border,
  },
  oooNoteText: { fontSize: sc(12), color: C.sub, fontWeight: '500' },

  // ── TITA ────────────────────────────────────────────────────────────────────
  titaWrap: { gap: sc(10) },
  titaBox: {
    flex: 1, borderRadius: sc(12), borderWidth: 1.5,
    padding: sc(14), gap: sc(6),
  },
  titaBoxLabel: { fontSize: sc(10), fontWeight: '700', color: C.muted, letterSpacing: 0.5 },
  titaBoxValue: { fontSize: sc(20), fontWeight: '900', letterSpacing: -0.5 },
  titaHintRow:  { flexDirection: 'row', alignItems: 'center', gap: sc(6) },
  titaHintIcon: { fontSize: sc(12) },
  titaHintText: { fontSize: sc(11), color: C.muted, fontWeight: '500', fontStyle: 'italic' },

  // ── Explanation ─────────────────────────────────────────────────────────────
  explanationWrap: {
    marginTop: sc(12),
    borderTopWidth: 1, borderTopColor: C.borderLight,
  },
  explanationTrigger: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sc(14), paddingVertical: sc(12),
  },
  explanationTriggerLeft: { flexDirection: 'row', alignItems: 'center', gap: sc(8) },
  explanationIconWrap: {
    width: sc(28), height: sc(28), borderRadius: sc(8),
    backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center',
  },
  explanationEmoji: { fontSize: sc(14) },
  explanationLabel: { fontSize: sc(13), fontWeight: '700', color: C.text },
  explanationChev:  { fontSize: sc(11), color: C.muted },

  explanationBody: {
    paddingHorizontal: sc(14), paddingBottom: sc(16),
  },
  explanationText: {
    fontSize: sc(13), color: C.sub, lineHeight: sc(21), fontWeight: '400',
  },

  keyPointBox: {
    backgroundColor: C.primarySoft, borderRadius: sc(10),
    padding: sc(12), marginTop: sc(12),
    borderWidth: 1, borderColor: C.primaryLight, gap: sc(6),
  },
  keyPointLabel: { fontSize: sc(11), fontWeight: '800', color: C.primary },
  keyPointText:  { fontSize: sc(13), color: C.sub, lineHeight: sc(20) },

  difficultyRow:  { flexDirection: 'row', alignItems: 'center', gap: sc(6), marginTop: sc(10) },
  difficultyLabel:{ fontSize: sc(11), color: C.muted, fontWeight: '600' },
  difficultyVal:  { fontSize: sc(12), fontWeight: '800' },

  placeholderWrap: {
    alignItems: 'center', padding: sc(20), gap: sc(8),
  },
  placeholderIconWrap: {
    width: sc(48), height: sc(48), borderRadius: sc(14),
    backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center',
    marginBottom: sc(4),
  },
  placeholderIconText: { fontSize: sc(22) },
  placeholderTitle:    { fontSize: sc(14), fontWeight: '800', color: C.text },
  placeholderSub:      { fontSize: sc(12), color: C.muted, textAlign: 'center', lineHeight: sc(18) },
});