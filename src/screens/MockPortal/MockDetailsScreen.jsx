import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// ─── THEME ───────────────────────────────────────────────────────────────────
const COLORS = {
  primary:       '#1F3B1F',
  primaryLight:  '#E8F5EE',
  primaryMid:    '#1F3B1F',
  primaryDark:   '#0F5C35',
  accent:        '#1F3B1F',
  accentSoft:    '#FEF3DC',
  danger:        '#E05252',
  dangerSoft:    '#FDEAEA',
  surface:       '#FFFFFF',
  surfaceAlt:    '#F4F8F5',
  border:        '#E0EDE6',
  borderLight:   '#EEF6F1',
  textPrimary:   '#0D1F15',
  textSecondary: '#527A62',
  textMuted:     '#9DB5A5',
  info:          '#3B82F6',
  infoSoft:      '#EFF6FF',
};

// ─── MOCK DETAILS — VARC ONLY ─────────────────────────────────────────────────
// TODO: Replace with API call — GET /mocks/{mockId}
const MOCK_DETAILS = {

  // ── FULL MOCKS ──────────────────────────────────────────────────────────────
  '1': {
    id: '1',
    title: 'CAT Full Mock #1',
    description: 'Full-length CAT simulation. VARC section live — DILR & QA unlock after launch.',
    type: 'full',
    icon: '🔥',
    badge: 'hot',
    attemptNumber: 2,
    totalDuration: '40 Minutes',
    totalQuestions: 24,
    maxScore: 72,
    difficulty: 'Hard',
    isAttempted: true,
    lastScore: 51,
    sections: [
      {
        id: 'varc', label: 'VARC', icon: '📖',
        duration: '40 mins', questions: 24,
        color: COLORS.primary,
        breakdown: '3 RC Passages (15Q) + 9 VA Questions',
      },
    ],
    marking: {
      correct: '+3 Marks', correctSub: 'For every correct answer',
      wrong: '-1 Mark',    wrongSub: 'For every wrong MCQ answer',
      tita: '0 Marks',     titaSub: 'No negative marking for TITA',
    },
    rules: [
      {icon: '📖', label: '3 RC Passages'},
      {icon: '🔀', label: 'Para Jumbles (TITA)'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Reading Comprehension — Inference', covered: true},
      {label: 'Reading Comprehension — Main Idea', covered: true},
      {label: 'Para Jumbles (TITA)',                covered: true},
      {label: 'Para Summary',                       covered: true},
      {label: 'Odd Sentence Out',                   covered: true},
      {label: 'Vocabulary in Context',              covered: false},
    ],
    instructions: [
      'VARC section auto-submits after 40 minutes.',
      'RC questions carry negative marking (−1 per wrong).',
      'TITA questions (Para Jumbles, Odd One Out) have NO negative marking.',
      'You cannot pause the test once started.',
      'Read each passage carefully before attempting questions.',
    ],
  },

  '2': {
    id: '2',
    title: 'CAT Full Mock #2',
    description: 'Second full-length mock. Fresh passages and updated VA question set.',
    type: 'full',
    icon: '📋',
    badge: null,
    attemptNumber: 1,
    totalDuration: '40 Minutes',
    totalQuestions: 24,
    maxScore: 72,
    difficulty: 'Hard',
    isAttempted: false,
    lastScore: null,
    sections: [
      {
        id: 'varc', label: 'VARC', icon: '📖',
        duration: '40 mins', questions: 24,
        color: COLORS.primary,
        breakdown: '3 RC Passages (15Q) + 9 VA Questions',
      },
    ],
    marking: {
      correct: '+3 Marks', correctSub: 'For every correct answer',
      wrong: '-1 Mark',    wrongSub: 'For every wrong MCQ answer',
      tita: '0 Marks',     titaSub: 'No negative marking for TITA',
    },
    rules: [
      {icon: '📖', label: '3 RC Passages'},
      {icon: '🔀', label: 'Para Jumbles (TITA)'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Reading Comprehension — Inference',  covered: true},
      {label: 'Reading Comprehension — Main Idea',  covered: true},
      {label: 'Para Jumbles (TITA)',                 covered: true},
      {label: 'Para Summary',                        covered: true},
      {label: 'Odd Sentence Out',                    covered: true},
      {label: 'Vocabulary in Context',               covered: false},
    ],
    instructions: [
      'VARC section auto-submits after 40 minutes.',
      'RC questions carry negative marking (−1 per wrong).',
      'TITA questions have NO negative marking.',
      'You cannot pause the test once started.',
    ],
  },

  '8': {
    id: '8',
    title: 'CAT Full Mock #3',
    description: 'Third full-length mock — harder passages, advanced VA question types.',
    type: 'full',
    icon: '🔒',
    badge: 'locked',
    attemptNumber: 1,
    totalDuration: '40 Minutes',
    totalQuestions: 24,
    maxScore: 72,
    difficulty: 'Hard',
    isAttempted: false,
    lastScore: null,
    sections: [
      {
        id: 'varc', label: 'VARC', icon: '📖',
        duration: '40 mins', questions: 24,
        color: COLORS.primary,
        breakdown: '3 RC Passages (15Q) + 9 VA Questions',
      },
    ],
    marking: {
      correct: '+3 Marks', correctSub: 'For every correct answer',
      wrong: '-1 Mark',    wrongSub: 'For every wrong MCQ answer',
      tita: '0 Marks',     titaSub: 'No negative marking for TITA',
    },
    rules: [
      {icon: '📖', label: '3 RC Passages'},
      {icon: '🔒', label: 'Premium Content'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Reading Comprehension — Inference',  covered: true},
      {label: 'Reading Comprehension — Tone',       covered: true},
      {label: 'Para Jumbles (TITA)',                 covered: true},
      {label: 'Para Summary',                        covered: true},
      {label: 'Odd Sentence Out',                    covered: true},
      {label: 'Vocabulary in Context',               covered: true},
    ],
    instructions: [
      'VARC section auto-submits after 40 minutes.',
      'This mock is locked — unlock with a premium plan.',
      'Hardest difficulty — ideal for final stage prep.',
      'You cannot pause the test once started.',
    ],
  },

  // ── HALF MOCKS ──────────────────────────────────────────────────────────────
  '3': {
    id: '3',
    title: 'Half Length Mock #1',
    description: 'A 30-minute VARC-only mock — great for focused verbal practice.',
    type: 'half',
    icon: '⚡',
    badge: 'hot',
    attemptNumber: 3,
    totalDuration: '30 Minutes',
    totalQuestions: 16,
    maxScore: 48,
    difficulty: 'Medium',
    isAttempted: true,
    lastScore: 30,
    sections: [
      {
        id: 'varc', label: 'VARC', icon: '📖',
        duration: '30 mins', questions: 16,
        color: COLORS.primary,
        breakdown: '2 RC Passages (10Q) + 6 VA Questions',
      },
    ],
    marking: {
      correct: '+3 Marks', correctSub: 'For every correct answer',
      wrong: '-1 Mark',    wrongSub: 'For every wrong MCQ answer',
      tita: '0 Marks',     titaSub: 'No negative marking for TITA',
    },
    rules: [
      {icon: '📖', label: '2 RC Passages'},
      {icon: '🔀', label: 'Para Jumbles (TITA)'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Reading Comprehension — Inference',  covered: true},
      {label: 'Reading Comprehension — Main Idea',  covered: true},
      {label: 'Para Jumbles (TITA)',                 covered: true},
      {label: 'Para Summary',                        covered: false},
      {label: 'Odd Sentence Out',                    covered: false},
      {label: 'Vocabulary in Context',               covered: false},
    ],
    instructions: [
      'Test auto-submits after 30 minutes.',
      'RC questions carry negative marking (−1 per wrong).',
      'TITA questions have NO negative marking.',
      'Half-length format — ideal for time-limited practice.',
    ],
  },

  '4': {
    id: '4',
    title: 'Half Length Mock #3',
    description: 'VARC-focused half mock with heavy VA component — sharpen your verbal accuracy.',
    type: 'half',
    icon: '⚡',
    badge: 'new',
    attemptNumber: 1,
    totalDuration: '30 Minutes',
    totalQuestions: 16,
    maxScore: 48,
    difficulty: 'Medium',
    isAttempted: false,
    lastScore: null,
    sections: [
      {
        id: 'varc', label: 'VARC', icon: '📖',
        duration: '30 mins', questions: 16,
        color: COLORS.primary,
        breakdown: '1 RC Passage (6Q) + 5 PJ + 5 Summary',
      },
    ],
    marking: {
      correct: '+3 Marks', correctSub: 'For every correct answer',
      wrong: '-1 Mark',    wrongSub: 'For every wrong MCQ answer',
      tita: '0 Marks',     titaSub: 'No negative marking for TITA',
    },
    rules: [
      {icon: '🔀', label: 'VA-Heavy Format'},
      {icon: '✨', label: 'Freshly Added'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Reading Comprehension — Inference', covered: true},
      {label: 'Para Jumbles (TITA)',                covered: true},
      {label: 'Para Summary',                       covered: true},
      {label: 'Odd Sentence Out',                   covered: false},
      {label: 'Vocabulary in Context',              covered: false},
    ],
    instructions: [
      'Test auto-submits after 30 minutes.',
      'Heavy VA focus — 10 out of 16 questions are VA.',
      'Para Jumbles are TITA — no negative marking.',
      'Summary questions are MCQ — negative marking applies.',
    ],
  },

  // ── TOPIC TESTS ─────────────────────────────────────────────────────────────
  '5': {
    id: '5',
    title: 'RC — Inference Questions',
    description: 'Master inference-based RC — the most frequently asked RC type in CAT VARC.',
    type: 'topic',
    icon: '📖',
    badge: null,
    attemptNumber: 1,
    totalDuration: '30 Minutes',
    totalQuestions: 10,
    maxScore: 30,
    difficulty: 'Medium',
    isAttempted: false,
    lastScore: null,
    sections: [
      {
        id: 'rc', label: 'RC', icon: '📖',
        duration: '30 mins', questions: 10,
        color: COLORS.primary,
        breakdown: '2 Passages × 5 Inference Questions',
      },
    ],
    marking: {
      correct: '+3 Marks', correctSub: 'For every correct answer',
      wrong: '-1 Mark',    wrongSub: 'For every wrong MCQ answer',
      tita: 'N/A',         titaSub: 'No TITA in this test',
    },
    rules: [
      {icon: '📖', label: 'RC Only'},
      {icon: '🎯', label: 'Inference Focus'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Inference from Passage',           covered: true},
      {label: 'Author Tone & Attitude',            covered: true},
      {label: "Author's Primary Purpose",          covered: true},
      {label: 'Vocabulary in Context',             covered: false},
      {label: 'Passage Structure Questions',       covered: false},
    ],
    instructions: [
      'Test auto-submits after 30 minutes.',
      'All 10 questions are inference-based RC.',
      'Negative marking applies (−1 per wrong MCQ).',
      'Passages are 300–500 words each.',
      'Re-read the passage for inference questions — do not assume.',
    ],
  },

  '6': {
    id: '6',
    title: 'Para Jumbles',
    description: 'CAT-level para jumbles — both MCQ sequences and TITA open-order questions.',
    type: 'topic',
    icon: '🔀',
    badge: null,
    attemptNumber: 4,
    totalDuration: '20 Minutes',
    totalQuestions: 10,
    maxScore: 30,
    difficulty: 'Easy',
    isAttempted: true,
    lastScore: 21,
    sections: [
      {
        id: 'va', label: 'VA', icon: '🔤',
        duration: '20 mins', questions: 10,
        color: COLORS.primaryMid,
        breakdown: '5 MCQ Sequences + 5 TITA Open Order',
      },
    ],
    marking: {
      correct: '+3 Marks', correctSub: 'For MCQ correct answers',
      wrong: '-1 Mark',    wrongSub: 'For wrong MCQ answers only',
      tita: '0 Marks',     titaSub: 'TITA questions — no negative marking',
    },
    rules: [
      {icon: '🔀', label: 'Para Jumbles Only'},
      {icon: '✅', label: 'TITA — No Negatives'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: '5-Sentence Para Jumbles (MCQ)',   covered: true},
      {label: 'TITA Open Order Para Jumbles',    covered: true},
      {label: 'Odd Sentence Out',                covered: false},
      {label: 'Para Completion',                 covered: false},
    ],
    instructions: [
      'Test auto-submits after 20 minutes.',
      'MCQ questions: pick the correct sequence from 4 options.',
      'TITA questions: type the sequence (e.g., BCDE) — no negative marking.',
      'Look for logical connectors and topic continuity.',
      'Opening and closing sentences are usually easier to spot.',
    ],
  },

  '7': {
    id: '7',
    title: 'Summary Questions',
    description: 'Para summary practice — a key VARC component that trips up most CAT takers.',
    type: 'topic',
    icon: '📝',
    badge: 'new',
    attemptNumber: 1,
    totalDuration: '20 Minutes',
    totalQuestions: 8,
    maxScore: 24,
    difficulty: 'Easy',
    isAttempted: false,
    lastScore: null,
    sections: [
      {
        id: 'va', label: 'VA', icon: '📝',
        duration: '20 mins', questions: 8,
        color: COLORS.primaryMid,
        breakdown: '8 MCQ Para Summary Questions',
      },
    ],
    marking: {
      correct: '+3 Marks', correctSub: 'For every correct answer',
      wrong: '-1 Mark',    wrongSub: 'For every wrong answer',
      tita: 'N/A',         titaSub: 'All MCQ — negative marking applies',
    },
    rules: [
      {icon: '📝', label: 'Summary MCQ Only'},
      {icon: '⚠️', label: 'Negative Marking'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '✨', label: 'Freshly Added'},
    ],
    syllabus: [
      {label: 'Short Paragraph Summary',          covered: true},
      {label: 'Long Paragraph Summary',           covered: true},
      {label: 'Eliminating Extreme Options',      covered: true},
      {label: 'Critical Reasoning',               covered: false},
    ],
    instructions: [
      'Test auto-submits after 20 minutes.',
      'All 8 questions are MCQ — negative marking applies.',
      'Choose the option that captures the MAIN idea.',
      'Avoid options with absolute language (always/never).',
      'Eliminate options that are too narrow or too broad.',
    ],
  },

  '9': {
    id: '9',
    title: 'Vocab',
    description: 'High-frequency CAT vocabulary — synonyms, antonyms and contextual usage.',
    type: 'topic',
    icon: '📚',
    badge: null,
    attemptNumber: 2,
    totalDuration: '20 Minutes',
    totalQuestions: 15,
    maxScore: 45,
    difficulty: 'Easy',
    isAttempted: true,
    lastScore: 30,
    sections: [
      {
        id: 'vocab', label: 'Vocab', icon: '📚',
        duration: '20 mins', questions: 15,
        color: COLORS.primaryMid,
        breakdown: 'Synonyms + Antonyms + Contextual Usage',
      },
    ],
    marking: {
      correct: '+3 Marks', correctSub: 'For every correct answer',
      wrong: '-1 Mark',    wrongSub: 'For every wrong answer',
      tita: 'N/A',         titaSub: 'All MCQ — negative marking applies',
    },
    rules: [
      {icon: '📚', label: 'Vocabulary Focus'},
      {icon: '🎯', label: 'MCQ Format'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Synonyms & Word Meanings',         covered: true},
      {label: 'Antonyms',                          covered: true},
      {label: 'Contextual Sentence Usage',         covered: true},
      {label: 'Idioms & Phrases',                  covered: false},
      {label: 'One-word Substitutions',            covered: false},
    ],
    instructions: [
      'Test auto-submits after 20 minutes.',
      'Negative marking applies (−1 per wrong MCQ).',
      'Use context clues in sentence-based questions.',
      'Eliminate clearly wrong options first.',
      'CAT-level vocab — focus on formal/literary words.',
    ],
  },
};

const FALLBACK_DETAIL = MOCK_DETAILS['1'];
const getMockDetail   = mockId => MOCK_DETAILS[String(mockId)] || FALLBACK_DETAIL;

// ─── SECTION CARD ────────────────────────────────────────────────────────────
const SectionCard = ({section, index}) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  {toValue: 1, duration: 400, delay: 200 + index * 80, useNativeDriver: true}),
      Animated.timing(slideAnim, {toValue: 0, duration: 400, delay: 200 + index * 80, useNativeDriver: true}),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.sectionCard, {opacity: fadeAnim, transform: [{translateY: slideAnim}]}]}>
      <View style={[styles.sectionIconBg, {backgroundColor: section.color + '18'}]}>
        <Text style={styles.sectionIcon}>{section.icon}</Text>
      </View>
      <Text style={[styles.sectionLabel, {color: section.color}]}>{section.label}</Text>
      <Text style={styles.sectionDuration}>{section.duration}</Text>
      <View style={styles.sectionQBubble}>
        <Text style={styles.sectionQText}>{section.questions}Q</Text>
      </View>
      {section.breakdown && (
        <Text style={styles.sectionBreakdown}>{section.breakdown}</Text>
      )}
    </Animated.View>
  );
};

// ─── SYLLABUS ROW ─────────────────────────────────────────────────────────────
const SyllabusRow = ({item}) => (
  <View style={styles.syllabusRow}>
    <View style={[styles.checkbox, item.covered && styles.checkboxChecked]}>
      {item.covered && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={[styles.syllabusLabel, !item.covered && styles.syllabusLabelMuted]}>
      {item.label}
    </Text>
  </View>
);

// ─── RULE CHIP ────────────────────────────────────────────────────────────────
const RuleChip = ({rule}) => (
  <View style={styles.ruleChip}>
    <Text style={styles.ruleChipIcon}>{rule.icon}</Text>
    <Text style={styles.ruleChipLabel}>{rule.label}</Text>
  </View>
);

// ─── LAST ATTEMPT STRIP ───────────────────────────────────────────────────────
const LastAttemptStrip = ({lastScore, maxScore, onViewSolutions}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const pct  = (lastScore / maxScore) * 100;
  const color = pct >= 70 ? COLORS.primaryMid : pct >= 40 ? COLORS.accent : COLORS.danger;

  useEffect(() => {
    Animated.timing(anim, {toValue: pct, duration: 1000, delay: 400, useNativeDriver: false}).start();
  }, []);

  const barWidth = anim.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']});

  return (
    <View style={styles.lastAttemptStrip}>
      <View style={styles.lastAttemptLeft}>
        <Text style={styles.lastAttemptEyebrow}>Previous Attempt</Text>
        <Text style={[styles.lastAttemptScore, {color}]}>
          {lastScore}
          <Text style={styles.lastAttemptMax}>/{maxScore}</Text>
        </Text>
      </View>
      <View style={styles.lastAttemptRight}>
        <Text style={styles.lastAttemptPct}>{Math.round(pct)}% score</Text>
        <View style={styles.lastAttemptTrack}>
          <Animated.View style={[styles.lastAttemptFill, {width: barWidth, backgroundColor: color}]} />
        </View>
        <TouchableOpacity onPress={onViewSolutions} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Text style={styles.lastAttemptView}>View Solutions →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── SECTION HEADER LABEL ─────────────────────────────────────────────────────
const SectionHeader = ({label}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderDot} />
    <Text style={styles.sectionHeaderText}>{label}</Text>
  </View>
);

// ─── MARKING CARD ─────────────────────────────────────────────────────────────
const MarkingCard = ({marking}) => (
  <View style={styles.markingCardWrap}>
    {/* Correct */}
    <View style={styles.markingRow}>
      <View style={[styles.markingIconCircle, {backgroundColor: COLORS.primaryLight}]}>
        <Text style={styles.markingIconText}>＋</Text>
      </View>
      <View style={{flex: 1}}>
        <Text style={[styles.markingValue, {color: COLORS.primary}]}>{marking.correct}</Text>
        <Text style={styles.markingSub}>{marking.correctSub}</Text>
      </View>
    </View>

    <View style={styles.markingDivider} />

    {/* Wrong */}
    <View style={styles.markingRow}>
      <View style={[styles.markingIconCircle, {backgroundColor: COLORS.dangerSoft}]}>
        <Text style={[styles.markingIconText, {color: COLORS.danger}]}>−</Text>
      </View>
      <View style={{flex: 1}}>
        <Text style={[styles.markingValue, {color: COLORS.danger}]}>{marking.wrong}</Text>
        <Text style={styles.markingSub}>{marking.wrongSub}</Text>
      </View>
    </View>

    {/* TITA — only if relevant */}
    {marking.tita !== 'N/A' && (
      <>
        <View style={styles.markingDivider} />
        <View style={styles.markingRow}>
          <View style={[styles.markingIconCircle, {backgroundColor: '#FEF9C3'}]}>
            <Text style={[styles.markingIconText, {color: '#CA8A04', fontSize: 13}]}>T</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.markingValue, {color: '#CA8A04'}]}>{marking.tita}</Text>
            <Text style={styles.markingSub}>{marking.titaSub}</Text>
          </View>
        </View>
      </>
    )}
  </View>
);

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
const MockDetailScreen = ({navigation, route}) => {
  const mockId = route?.params?.mockId;
  const mock   = getMockDetail(mockId);

  const headerFade  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-10)).current;
  const ctaFade     = useRef(new Animated.Value(0)).current;
  const ctaSlide    = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade,  {toValue: 1, duration: 500, useNativeDriver: true}),
      Animated.timing(headerSlide, {toValue: 0, duration: 500, useNativeDriver: true}),
      Animated.timing(ctaFade,     {toValue: 1, duration: 400, delay: 600, useNativeDriver: true}),
      Animated.timing(ctaSlide,    {toValue: 0, duration: 400, delay: 600, useNativeDriver: true}),
    ]).start();
  }, []);

  const handleBeginTest = () => {
    navigation?.navigate('TestInterface', {mockId: mock.id});
  };

  const handleViewSolutions = () => {
    navigation?.navigate('Solutions', {mockId: mock.id});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* ── NAVBAR ── */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <View style={styles.backIconWrap}>
            <Text style={styles.backIcon}>‹</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Test Details</Text>
        <View style={styles.navRight} />
      </View>

      {/* ── SCROLL BODY ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── HERO ── */}
        <Animated.View style={[styles.hero, {opacity: headerFade, transform: [{translateY: headerSlide}]}]}>
          <View style={styles.heroTopRow}>
            <View style={styles.attemptBadge}>
              <Text style={styles.attemptBadgeText}>ATTEMPT #{mock.attemptNumber}</Text>
            </View>
            <Text style={styles.heroDurationPill}>⏱ {mock.totalDuration}</Text>
          </View>

          <View style={styles.heroTitleRow}>
            <Text style={styles.heroIcon}>{mock.icon}</Text>
            <Text style={styles.heroTitle}>{mock.title}</Text>
          </View>

          <Text style={styles.heroDesc}>{mock.description}</Text>

          {/* Stats row */}
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>{mock.totalQuestions}</Text>
              <Text style={styles.heroStatLabel}>Questions</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>{mock.maxScore}</Text>
              <Text style={styles.heroStatLabel}>Max Score</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={[
                styles.heroStatVal,
                {
                  color: mock.difficulty === 'Hard'   ? COLORS.danger
                       : mock.difficulty === 'Medium' ? COLORS.accent
                       : COLORS.primaryMid,
                },
              ]}>
                {mock.difficulty}
              </Text>
              <Text style={styles.heroStatLabel}>Difficulty</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── LAST ATTEMPT ── */}
        {mock.isAttempted && mock.lastScore !== null && (
          <View style={styles.section}>
            <LastAttemptStrip
              lastScore={mock.lastScore}
              maxScore={mock.maxScore}
              onViewSolutions={handleViewSolutions}
            />
          </View>
        )}

        {/* ── TEST STRUCTURE ── */}
        <View style={styles.section}>
          <SectionHeader label="Test Structure" />
          <View style={styles.sectionCardsRow}>
            {mock.sections.map((s, i) => (
              <SectionCard key={s.id} section={s} index={i} />
            ))}
          </View>
        </View>

        {/* ── MARKING SCHEME ── */}
        <View style={styles.section}>
          <SectionHeader label="Marking Scheme" />
          <MarkingCard marking={mock.marking} />
        </View>

        {/* ── RULES ── */}
        <View style={styles.section}>
          <SectionHeader label="Test Rules" />
          <View style={styles.rulesGrid}>
            {mock.rules.map((r, i) => <RuleChip key={i} rule={r} />)}
          </View>
        </View>

        {/* ── SYLLABUS ── */}
        <View style={styles.section}>
          <SectionHeader label="Syllabus Covered" />
          <View style={styles.syllabusCard}>
            {mock.syllabus.map((s, i) => (
              <View key={i}>
                <SyllabusRow item={s} />
                {i < mock.syllabus.length - 1 && <View style={styles.syllabusDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* ── INSTRUCTIONS ── */}
        <View style={styles.section}>
          <View style={styles.instructionsCard}>
            <View style={styles.instructionsHeader}>
              <Text style={styles.instructionsHeaderIcon}>ℹ️</Text>
              <Text style={styles.instructionsHeaderText}>Important Instructions</Text>
            </View>
            {mock.instructions.map((inst, i) => (
              <View key={i} style={styles.instructionRow}>
                <View style={styles.instructionBullet} />
                <Text style={styles.instructionText}>{inst}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{height: 110}} />
      </ScrollView>

      {/* ── STICKY CTA ── */}
      <Animated.View style={[styles.ctaWrap, {opacity: ctaFade, transform: [{translateY: ctaSlide}]}]}>
        <TouchableOpacity
          style={[styles.ctaBtn, mock.badge === 'locked' && styles.ctaBtnLocked]}
          onPress={mock.badge !== 'locked' ? handleBeginTest : undefined}
          activeOpacity={mock.badge === 'locked' ? 1 : 0.85}
        >
          <Text style={styles.ctaBtnText}>
            {mock.badge === 'locked'  ? '🔒  Unlock to Attempt'
           : mock.isAttempted         ? 'Reattempt Test'
           :                            'Begin Test'}
          </Text>
          {mock.badge !== 'locked' && <Text style={styles.ctaBtnArrow}>→</Text>}
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.surfaceAlt},

  navbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16, paddingTop: 35, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    
  },
  backBtn: {width: 36, alignItems: 'flex-start'},
  backIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  backIcon: {fontSize: 22, color: COLORS.textPrimary, lineHeight: 26, marginTop: -2},
  navTitle: {
    fontSize: 17, fontWeight: '800', color: COLORS.textPrimary,
    letterSpacing: -0.3, flex: 1, textAlign: 'center',
  },
  navRight: {width: 36},

  scrollContent: {paddingBottom: 20},

  // Hero
  hero: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 22,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  heroTopRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },
  attemptBadge: {
    backgroundColor: COLORS.primaryLight, borderWidth: 1, borderColor: '#C5E8D4',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  attemptBadgeText: {fontSize: 11, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.8},
  heroDurationPill: {
    fontSize: 12, fontWeight: '600', color: COLORS.textSecondary,
    backgroundColor: COLORS.surfaceAlt, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  heroTitleRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  heroIcon:  {fontSize: 26, marginRight: 10},
  heroTitle: {fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.6, flex: 1},
  heroDesc:  {fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, fontWeight: '500', marginBottom: 18},
  heroStats: {
    flexDirection: 'row', backgroundColor: COLORS.surfaceAlt,
    borderRadius: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  heroStat: {flex: 1, alignItems: 'center'},
  heroStatVal: {fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4},
  heroStatLabel: {fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginTop: 2},
  heroStatDivider: {width: 1, height: 32, backgroundColor: COLORS.border, alignSelf: 'center'},

  // Last attempt
  lastAttemptStrip: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    flexDirection: 'row', borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  lastAttemptLeft:    {flex: 1, justifyContent: 'center'},
  lastAttemptEyebrow: {
    fontSize: 10, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4,
  },
  lastAttemptScore: {fontSize: 28, fontWeight: '800', letterSpacing: -0.8},
  lastAttemptMax:   {fontSize: 15, fontWeight: '600', color: COLORS.textMuted},
  lastAttemptRight: {flex: 1.2, justifyContent: 'center', alignItems: 'flex-end'},
  lastAttemptPct:   {fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6},
  lastAttemptTrack: {
    width: '100%', height: 7, backgroundColor: COLORS.border,
    borderRadius: 4, overflow: 'hidden', marginBottom: 8,
  },
  lastAttemptFill: {height: '100%', borderRadius: 4},
  lastAttemptView: {fontSize: 11, fontWeight: '700', color: COLORS.primary},

  // Section
  section: {paddingHorizontal: 16, marginTop: 24},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 14},
  sectionHeaderDot: {width: 4, height: 18, borderRadius: 2, backgroundColor: COLORS.primary, marginRight: 10},
  sectionHeaderText: {fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3},

  // Section card (test structure)
  sectionCardsRow: {flexDirection: 'row', gap: 10},
  sectionCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  sectionIconBg: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  sectionIcon:      {fontSize: 20},
  sectionLabel:     {fontSize: 14, fontWeight: '800', letterSpacing: -0.2, marginBottom: 2},
  sectionDuration:  {fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginBottom: 8},
  sectionQBubble:   {
    backgroundColor: COLORS.surfaceAlt, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 6,
  },
  sectionQText:     {fontSize: 11, fontWeight: '700', color: COLORS.textSecondary},
  sectionBreakdown: {
    fontSize: 10, color: COLORS.textMuted, fontWeight: '500',
    textAlign: 'center', marginTop: 2, lineHeight: 14,
  },

  // Marking
  markingCardWrap: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  markingRow: {flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12},
  markingDivider: {height: 1, backgroundColor: COLORS.border},
  markingIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  markingIconText:  {fontSize: 20, fontWeight: '700', color: COLORS.primary, lineHeight: 24},
  markingValue:     {fontSize: 14, fontWeight: '800', letterSpacing: -0.2},
  markingSub:       {fontSize: 11, color: COLORS.textMuted, fontWeight: '500', marginTop: 1},

  // Rules
  rulesGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  ruleChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: COLORS.border, gap: 8,
    width: (SCREEN_WIDTH - 32 - 10) / 2,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  ruleChipIcon:  {fontSize: 16},
  ruleChipLabel: {fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, flex: 1},

  // Syllabus
  syllabusCard: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  syllabusRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  syllabusDivider: {height: 1, backgroundColor: COLORS.border, marginHorizontal: 16},
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
  },
  checkboxChecked:    {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  checkmark:          {fontSize: 13, color: '#fff', fontWeight: '800', lineHeight: 16},
  syllabusLabel:      {fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, flex: 1, lineHeight: 18},
  syllabusLabelMuted: {color: COLORS.textMuted},

  // Instructions
  instructionsCard: {
    backgroundColor: COLORS.infoSoft, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: '#BFDBFE',
  },
  instructionsHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8},
  instructionsHeaderIcon: {fontSize: 16},
  instructionsHeaderText: {fontSize: 14, fontWeight: '800', color: COLORS.info, letterSpacing: -0.2},
  instructionRow:   {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10},
  instructionBullet:{width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.info, marginTop: 6},
  instructionText:  {fontSize: 13, color: '#1E40AF', fontWeight: '500', flex: 1, lineHeight: 19},

  // CTA
  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16, paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 16 : 28,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: COLORS.primary, shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  ctaBtnLocked: {
    backgroundColor: COLORS.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaBtnText:  {fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.2},
  ctaBtnArrow: {fontSize: 18, color: '#FFFFFF', fontWeight: '700'},
});

export default MockDetailScreen;