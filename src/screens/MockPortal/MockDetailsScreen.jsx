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
  primaryMid:    '#2EA86B',
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

// ─── MOCK DETAILS DATABASE ────────────────────────────────────────────────────
// TODO: Replace with API call — GET /mocks/{mockId}
// Each key maps to a mockId from MockListScreen's MOCK_DATA
const MOCK_DETAILS = {
  '1': {
    id: '1',
    title: 'CAT Full Mock #1',
    description: 'Simulating the actual CAT 2025 interface and difficulty level.',
    type: 'full',
    icon: '🔥',
    badge: 'hot',
    attemptNumber: 2,
    totalDuration: '120 Minutes',
    totalQuestions: 76,
    maxScore: 228,
    difficulty: 'Hard',
    isAttempted: true,
    lastScore: 127,
    sections: [
      {id: 'varc', label: 'VARC', icon: '📖', duration: '40 mins', questions: 24, color: COLORS.primary},
      {id: 'dilr', label: 'DILR', icon: '📊', duration: '40 mins', questions: 20, color: COLORS.accent},
      {id: 'qa',   label: 'QA',   icon: '🔢', duration: '40 mins', questions: 32, color: '#7B5EA7'},
    ],
    marking: {correct: '+3 Marks', correctSub: 'For every correct answer', wrong: '-1 Mark', wrongSub: 'For every wrong MCQ'},
    rules: [
      {icon: '🧮', label: 'On-screen Calculator'},
      {icon: '🚫', label: 'No Section Switching'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Reading Comprehension & Verbal Ability', covered: true},
      {label: 'Data Interpretation & Logical Reasoning', covered: true},
      {label: 'Arithmetic, Algebra & Geometry', covered: true},
      {label: 'Modern Maths & Number Systems', covered: false},
    ],
    instructions: [
      'The test will automatically submit after 120 minutes.',
      'TITA questions have no negative marking.',
      'Ensure a stable internet connection before beginning.',
      'You cannot pause the test once started.',
      'Each section must be completed before moving to the next.',
    ],
  },

  '2': {
    id: '2',
    title: 'CAT Full Mock #2',
    description: 'Advanced level full mock covering all 3 sections with updated 2025 pattern.',
    type: 'full',
    icon: '📋',
    badge: null,
    attemptNumber: 1,
    totalDuration: '120 Minutes',
    totalQuestions: 76,
    maxScore: 228,
    difficulty: 'Hard',
    isAttempted: false,
    lastScore: null,
    sections: [
      {id: 'varc', label: 'VARC', icon: '📖', duration: '40 mins', questions: 24, color: COLORS.primary},
      {id: 'dilr', label: 'DILR', icon: '📊', duration: '40 mins', questions: 20, color: COLORS.accent},
      {id: 'qa',   label: 'QA',   icon: '🔢', duration: '40 mins', questions: 32, color: '#7B5EA7'},
    ],
    marking: {correct: '+3 Marks', correctSub: 'For every correct answer', wrong: '-1 Mark', wrongSub: 'For every wrong MCQ'},
    rules: [
      {icon: '🧮', label: 'On-screen Calculator'},
      {icon: '🚫', label: 'No Section Switching'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Reading Comprehension & Verbal Ability', covered: true},
      {label: 'Data Interpretation & Logical Reasoning', covered: true},
      {label: 'Arithmetic, Algebra & Geometry', covered: true},
      {label: 'Modern Maths & Number Systems', covered: true},
    ],
    instructions: [
      'The test will automatically submit after 120 minutes.',
      'TITA questions have no negative marking.',
      'Ensure a stable internet connection before beginning.',
      'You cannot pause the test once started.',
    ],
  },

  '3': {
    id: '3',
    title: 'Half Length Mock #1',
    description: 'A focused 60-minute test covering VARC and DILR sections only.',
    type: 'half',
    icon: '⚡',
    badge: 'hot',
    attemptNumber: 3,
    totalDuration: '60 Minutes',
    totalQuestions: 38,
    maxScore: 114,
    difficulty: 'Medium',
    isAttempted: true,
    lastScore: 72,
    sections: [
      {id: 'varc', label: 'VARC', icon: '📖', duration: '30 mins', questions: 20, color: COLORS.primary},
      {id: 'dilr', label: 'DILR', icon: '📊', duration: '30 mins', questions: 18, color: COLORS.accent},
    ],
    marking: {correct: '+3 Marks', correctSub: 'For every correct answer', wrong: '-1 Mark', wrongSub: 'For every wrong MCQ'},
    rules: [
      {icon: '🧮', label: 'On-screen Calculator'},
      {icon: '🔀', label: 'Section Switching Allowed'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Reading Comprehension & Verbal Ability', covered: true},
      {label: 'Data Interpretation & Logical Reasoning', covered: true},
      {label: 'Arithmetic, Algebra & Geometry', covered: false},
      {label: 'Modern Maths & Number Systems', covered: false},
    ],
    instructions: [
      'The test will automatically submit after 60 minutes.',
      'TITA questions have no negative marking.',
      'This is a half-length test covering VARC & DILR only.',
      'You cannot pause the test once started.',
    ],
  },

  '4': {
    id: '4',
    title: 'Half Length Mock #3',
    description: 'Intensive VARC-focused half mock to sharpen your verbal skills.',
    type: 'half',
    icon: '⚡',
    badge: 'new',
    attemptNumber: 1,
    totalDuration: '60 Minutes',
    totalQuestions: 38,
    maxScore: 114,
    difficulty: 'Medium',
    isAttempted: false,
    lastScore: null,
    sections: [
      {id: 'varc', label: 'VARC', icon: '📖', duration: '40 mins', questions: 26, color: COLORS.primary},
      {id: 'dilr', label: 'DILR', icon: '📊', duration: '20 mins', questions: 12, color: COLORS.accent},
    ],
    marking: {correct: '+3 Marks', correctSub: 'For every correct answer', wrong: '-1 Mark', wrongSub: 'For every wrong MCQ'},
    rules: [
      {icon: '🚫', label: 'No Section Switching'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
      {icon: '✨', label: 'Freshly Added Test'},
    ],
    syllabus: [
      {label: 'Reading Comprehension & Verbal Ability', covered: true},
      {label: 'Data Interpretation & Logical Reasoning', covered: true},
      {label: 'Arithmetic, Algebra & Geometry', covered: false},
      {label: 'Modern Maths & Number Systems', covered: false},
    ],
    instructions: [
      'The test will automatically submit after 60 minutes.',
      'Heavy focus on VARC — ideal for verbal practice.',
      'TITA questions have no negative marking.',
      'You cannot pause the test once started.',
    ],
  },

  '5': {
    id: '5',
    title: 'RC — Inference Questions',
    description: 'Master inference-based RC questions — the most asked type in CAT.',
    type: 'topic',
    icon: '📖',
    badge: null,
    attemptNumber: 1,
    totalDuration: '30 Minutes',
    totalQuestions: 20,
    maxScore: 60,
    difficulty: 'Medium',
    isAttempted: false,
    lastScore: null,
    sections: [
      {id: 'rc', label: 'RC', icon: '📖', duration: '30 mins', questions: 20, color: COLORS.primary},
    ],
    marking: {correct: '+3 Marks', correctSub: 'For every correct answer', wrong: '-1 Mark', wrongSub: 'For every wrong MCQ'},
    rules: [
      {icon: '📖', label: 'RC Passages Only'},
      {icon: '🎯', label: 'Inference Focus'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Inference-based RC Questions', covered: true},
      {label: 'Tone & Attitude Questions', covered: true},
      {label: 'Author\'s Argument Questions', covered: true},
      {label: 'Vocabulary in Context', covered: false},
    ],
    instructions: [
      'Test auto-submits after 30 minutes.',
      'All 20 questions are inference-based RC.',
      'Passages are 300–500 words each.',
      'No TITA questions in this topic test.',
    ],
  },

  '6': {
    id: '6',
    title: 'Para Jumbles',
    description: 'Sharpen your para jumble skills with 15 high-quality CAT-level questions.',
    type: 'topic',
    icon: '🔀',
    badge: null,
    attemptNumber: 4,
    totalDuration: '20 Minutes',
    totalQuestions: 15,
    maxScore: 45,
    difficulty: 'Easy',
    isAttempted: true,
    lastScore: 30,
    sections: [
      {id: 'va', label: 'VA', icon: '🔤', duration: '20 mins', questions: 15, color: COLORS.primaryMid},
    ],
    marking: {correct: '+3 Marks', correctSub: 'For every correct answer', wrong: '0 Marks', wrongSub: 'No negative marking (TITA)'},
    rules: [
      {icon: '🔀', label: 'Para Jumbles Only'},
      {icon: '✅', label: 'No Negative Marking'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: '4-Sentence Para Jumbles', covered: true},
      {label: '5-Sentence Para Jumbles', covered: true},
      {label: 'Odd Sentence Out', covered: false},
      {label: 'Para Completion', covered: false},
    ],
    instructions: [
      'Test auto-submits after 20 minutes.',
      'All questions are TITA — no negative marking.',
      'Arrange the sentences in the correct order.',
      'Focus on logical flow and connectors.',
    ],
  },

  '7': {
    id: '7',
    title: 'Summary Questions',
    description: 'Practice paragraph summary questions — a key CAT VARC component.',
    type: 'topic',
    icon: '📝',
    badge: 'new',
    attemptNumber: 1,
    totalDuration: '20 Minutes',
    totalQuestions: 15,
    maxScore: 45,
    difficulty: 'Easy',
    isAttempted: false,
    lastScore: null,
    sections: [
      {id: 'va', label: 'VA', icon: '📝', duration: '20 mins', questions: 15, color: COLORS.primaryMid},
    ],
    marking: {correct: '+3 Marks', correctSub: 'For every correct answer', wrong: '-1 Mark', wrongSub: 'For every wrong MCQ'},
    rules: [
      {icon: '📝', label: 'Summary Only'},
      {icon: '🎯', label: 'MCQ Format'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '✨', label: 'Freshly Added Test'},
    ],
    syllabus: [
      {label: 'Short Paragraph Summaries', covered: true},
      {label: 'Long Paragraph Summaries', covered: true},
      {label: 'Eliminating Wrong Options', covered: true},
      {label: 'Critical Reasoning', covered: false},
    ],
    instructions: [
      'Test auto-submits after 20 minutes.',
      'Negative marking applies — choose carefully.',
      'Pick the option that best summarises the paragraph.',
      'Avoid options with extreme language.',
    ],
  },

  '9': {
    id: '9',
    title: 'Vocab',
    description: 'Build your CAT vocabulary with high-frequency words and usage patterns.',
    type: 'topic',
    icon: '🔀',
    badge: null,
    attemptNumber: 2,
    totalDuration: '20 Minutes',
    totalQuestions: 15,
    maxScore: 45,
    difficulty: 'Easy',
    isAttempted: true,
    lastScore: 30,
    sections: [
      {id: 'va', label: 'VA', icon: '🔤', duration: '20 mins', questions: 15, color: COLORS.primaryMid},
    ],
    marking: {correct: '+3 Marks', correctSub: 'For every correct answer', wrong: '-1 Mark', wrongSub: 'For every wrong MCQ'},
    rules: [
      {icon: '📚', label: 'Vocabulary Focus'},
      {icon: '🎯', label: 'MCQ Format'},
      {icon: '⏸️', label: 'Cannot Pause Test'},
      {icon: '📱', label: 'Auto-submit on Timeout'},
    ],
    syllabus: [
      {label: 'Word Meanings & Synonyms', covered: true},
      {label: 'Antonyms & Contextual Use', covered: true},
      {label: 'Idioms & Phrases', covered: false},
      {label: 'One-word Substitutions', covered: false},
    ],
    instructions: [
      'Test auto-submits after 20 minutes.',
      'Negative marking applies.',
      'Focus on context clues in the sentences.',
      'Eliminate clearly wrong options first.',
    ],
  },
};

// Fallback for unknown IDs
const FALLBACK_DETAIL = MOCK_DETAILS['1'];

const getMockDetail = mockId => MOCK_DETAILS[mockId] || FALLBACK_DETAIL;

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
    </Animated.View>
  );
};

// ─── SYLLABUS ROW ────────────────────────────────────────────────────────────
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

// ─── RULE CHIP ───────────────────────────────────────────────────────────────
const RuleChip = ({rule}) => (
  <View style={styles.ruleChip}>
    <Text style={styles.ruleChipIcon}>{rule.icon}</Text>
    <Text style={styles.ruleChipLabel}>{rule.label}</Text>
  </View>
);

// ─── LAST ATTEMPT STRIP ───────────────────────────────────────────────────────
const LastAttemptStrip = ({lastScore, maxScore, onViewSolutions}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const pct   = (lastScore / maxScore) * 100;
  const color = pct >= 70 ? COLORS.primaryMid : pct >= 40 ? COLORS.accent : COLORS.danger;

  useEffect(() => {
    Animated.timing(anim, {toValue: pct, duration: 1000, delay: 400, useNativeDriver: false}).start();
  }, []);

  const width = anim.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']});

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
          <Animated.View style={[styles.lastAttemptFill, {width, backgroundColor: color}]} />
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

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
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

      {/* ── STICKY NAVBAR ── */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <View style={styles.backIconWrap}>
            <Text style={styles.backIcon}>‹</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Mock Test Details</Text>
        <View style={styles.navRight} />
      </View>

      {/* ── SCROLLABLE BODY ── */}
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
              <Text style={[styles.heroStatVal, {
                color: mock.difficulty === 'Hard'   ? COLORS.danger
                     : mock.difficulty === 'Medium' ? COLORS.accent
                     : COLORS.primaryMid,
              }]}>
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
            {mock.sections.map((s, i) => <SectionCard key={s.id} section={s} index={i} />)}
          </View>
        </View>

        {/* ── MARKING & RULES ── */}
        <View style={styles.section}>
          <SectionHeader label="Marking & Rules" />
          <View style={styles.markingCard}>
            <View style={styles.markingHalf}>
              <View style={[styles.markingIconCircle, {backgroundColor: COLORS.primaryLight}]}>
                <Text style={styles.markingIconText}>＋</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.markingValue, {color: COLORS.primary}]}>{mock.marking.correct}</Text>
                <Text style={styles.markingSub}>{mock.marking.correctSub}</Text>
              </View>
            </View>
            <View style={styles.markingDivider} />
            <View style={styles.markingHalf}>
              <View style={[styles.markingIconCircle, {backgroundColor: COLORS.dangerSoft}]}>
                <Text style={[styles.markingIconText, {color: COLORS.danger}]}>−</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={[styles.markingValue, {color: COLORS.danger}]}>{mock.marking.wrong}</Text>
                <Text style={styles.markingSub}>{mock.marking.wrongSub}</Text>
              </View>
            </View>
          </View>
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
        <TouchableOpacity style={styles.ctaBtn} onPress={handleBeginTest} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>{mock.isAttempted ? 'Reattempt Test' : 'Begin Test'}</Text>
          <Text style={styles.ctaBtnArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.surfaceAlt},

  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop:35
  },
  backBtn: {width: 36, alignItems: 'flex-start'},
  backIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  backIcon: {fontSize: 22, color: COLORS.textPrimary, lineHeight: 26, marginTop: -2},
  navTitle: {fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3, flex: 1, textAlign: 'center'},
  navRight: {width: 36},

  scrollContent: {paddingBottom: 20},

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
  heroIcon: {fontSize: 26, marginRight: 10},
  heroTitle: {fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.6, flex: 1},
  heroDesc: {fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, fontWeight: '500', marginBottom: 18},
  heroStats: {
    flexDirection: 'row', backgroundColor: COLORS.surfaceAlt,
    borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  heroStat: {flex: 1, alignItems: 'center'},
  heroStatVal: {fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.4},
  heroStatLabel: {fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginTop: 2},
  heroStatDivider: {width: 1, height: 32, backgroundColor: COLORS.border, alignSelf: 'center'},

  lastAttemptStrip: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    flexDirection: 'row', borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  lastAttemptLeft:  {flex: 1, justifyContent: 'center'},
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
  lastAttemptFill:  {height: '100%', borderRadius: 4},
  lastAttemptView:  {fontSize: 11, fontWeight: '700', color: COLORS.primary},

  section: {paddingHorizontal: 16, marginTop: 24},

  sectionHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 14},
  sectionHeaderDot: {width: 4, height: 18, borderRadius: 2, backgroundColor: COLORS.primary, marginRight: 10},
  sectionHeaderText: {fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3},

  sectionCardsRow: {flexDirection: 'row', gap: 10},
  sectionCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 16, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  sectionIconBg: {width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8},
  sectionIcon: {fontSize: 20},
  sectionLabel: {fontSize: 14, fontWeight: '800', letterSpacing: -0.2, marginBottom: 2},
  sectionDuration: {fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginBottom: 8},
  sectionQBubble: {
    backgroundColor: COLORS.surfaceAlt, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: COLORS.border,
  },
  sectionQText: {fontSize: 11, fontWeight: '700', color: COLORS.textSecondary},

  markingCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, flexDirection: 'row',
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: 12,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  markingHalf: {flex: 1, flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12},
  markingDivider: {width: 1, height: 56, backgroundColor: COLORS.border},
  markingIconCircle: {width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center'},
  markingIconText: {fontSize: 20, fontWeight: '700', color: COLORS.primary, lineHeight: 24},
  markingValue: {fontSize: 14, fontWeight: '800', letterSpacing: -0.2},
  markingSub: {fontSize: 11, color: COLORS.textMuted, fontWeight: '500', marginTop: 1},

  rulesGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  ruleChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: COLORS.border, gap: 8,
    width: (SCREEN_WIDTH - 32 - 10) / 2,
    shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  ruleChipIcon: {fontSize: 16},
  ruleChipLabel: {fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, flex: 1},

  syllabusCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  syllabusRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12},
  syllabusDivider: {height: 1, backgroundColor: COLORS.border, marginHorizontal: 16},
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surfaceAlt,
  },
  checkboxChecked: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  checkmark: {fontSize: 13, color: '#fff', fontWeight: '800', lineHeight: 16},
  syllabusLabel: {fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, flex: 1, lineHeight: 18},
  syllabusLabelMuted: {color: COLORS.textMuted},

  instructionsCard: {
    backgroundColor: COLORS.infoSoft, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  instructionsHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8},
  instructionsHeaderIcon: {fontSize: 16},
  instructionsHeaderText: {fontSize: 14, fontWeight: '800', color: COLORS.info, letterSpacing: -0.2},
  instructionRow: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10},
  instructionBullet: {width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.info, marginTop: 6},
  instructionText: {fontSize: 13, color: '#1E40AF', fontWeight: '500', flex: 1, lineHeight: 19},

  ctaWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 16 : 28,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: COLORS.primary, shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  ctaBtnText: {fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.2},
  ctaBtnArrow: {fontSize: 18, color: '#FFFFFF', fontWeight: '700'},
});

export default MockDetailScreen;