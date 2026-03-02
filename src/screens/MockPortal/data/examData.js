// ─────────────────────────────────────────────────────────────────────────────
//  examData.js  —  Central data source for ALL CAT test types
//
//  HOW IT WORKS:
//  ┌─────────────────────────────────────────────────────────┐
//  │  MockListScreen  →  navigate('ExamScreen', { mockId })  │
//  │  ExamScreen      →  getExamData(route.params.mockId)    │
//  │  Returns         →  { testMeta, sections[] }            │
//  └─────────────────────────────────────────────────────────┘
//
//  QUESTION TYPES:
//   • mcq          → Single correct, 4 options  (+3 / -1)
//   • tita         → Type In The Answer, no options, no negative marking
//   • para_jumble  → Pick correct sequence of 5 sentences (MCQ)
//   • para_summary → Choose best summary of a paragraph (MCQ)
//   • odd_one_out  → 5 sentences — find odd one (MCQ showing A-E)
// ─────────────────────────────────────────────────────────────────────────────

// ─── PASSAGES ────────────────────────────────────────────────────────────────

const PASSAGES = {
  rc_p1: {
    id: 'rc_p1',
    label: 'PASSAGE 1 of 3',
    title: 'Cognitive Linguistics',
    content: [
      `The evolution of cognitive linguistics in the late 20th century challenged the modular view of the human mind. Instead of seeing language as a separate "organ" with its own internal rules, proponents argued that linguistic ability is deeply intertwined with our general perception and physical experience of the world.`,
      `Metaphor, once considered a mere literary flourish, was redefined as a fundamental cognitive process. We don't just speak in metaphors; we think through them. When we describe an argument as a "war" (e.g., "attacking a point", "defending a position"), we are mapping our physical understanding of conflict onto the abstract domain of intellectual debate.`,
      `This "embodied cognition" hypothesis has profound implications. It suggests that our conceptual systems are not arbitrary or purely logical, but are shaped by the bodies we inhabit and the physical world we navigate from birth.`,
    ],
  },

  rc_p2: {
    id: 'rc_p2',
    label: 'PASSAGE 2 of 3',
    title: 'The Attention Economy',
    content: [
      `The modern information environment has turned human attention into a commodity. Tech platforms, designed by teams of behavioural scientists and engineers, compete fiercely for the finite cognitive resources of billions of users. The result is an economy where the product being sold — to advertisers — is you.`,
      `This architecture of engagement exploits well-documented psychological vulnerabilities. Variable reward schedules, social validation loops, and the fear of missing out are not accidental byproducts; they are deliberate engineering choices. The infinite scroll was specifically designed to remove the natural stopping cues that books and newspapers provide.`,
      `Critics argue that this constitutes a form of cognitive pollution — a systematic degradation of the capacity for sustained, deep thought. When attention is perpetually fragmented, complex reasoning, empathy, and creativity all suffer.`,
    ],
  },

  rc_p3: {
    id: 'rc_p3',
    label: 'PASSAGE 3 of 3',
    title: 'Urban Biodiversity',
    content: [
      `Cities are often portrayed as antithetical to nature — concrete deserts hostile to wildlife. Yet a growing body of research suggests that urban environments can, under the right conditions, support remarkable biodiversity. Some species have not merely adapted to urban life but appear to thrive in it.`,
      `The peregrine falcon offers a striking example. Once nearly extinct due to DDT, it has staged a remarkable comeback, and cities have played an unexpected role. Skyscrapers mimic the cliff faces these birds historically nested on, while urban pigeon populations provide a reliable food source.`,
      `Ecologists use the term "urban adapter" to describe species that modify their behaviour in response to city living. Urban birds sing at higher pitches to be heard over traffic noise; urban foxes develop bolder temperaments than their rural counterparts. Evolution, it seems, is happening faster than we thought.`,
    ],
  },

  rc_inference_p1: {
    id: 'rc_inference_p1',
    label: 'PASSAGE 1 of 2',
    title: 'The Paradox of Choice',
    content: [
      `Psychologist Barry Schwartz proposed the "paradox of choice" — the counterintuitive idea that having more options can actually make us less happy. In an era celebrated for unprecedented consumer freedom, Schwartz argued that abundance is psychologically costly.`,
      `When choices are few, the alternative paths not taken are limited, and regret is bounded. But when hundreds of options exist, it becomes almost certain that we have not chosen optimally. The result is not liberation but paralysis, not satisfaction but perpetual dissatisfaction.`,
      `Schwartz distinguishes between "maximizers" — those who must find the single best option — and "satisficers," who settle for good enough. Maximizers achieve better objective outcomes but report significantly lower satisfaction. The person who tries hardest to choose well ends up feeling worst about what they chose.`,
    ],
  },

  rc_inference_p2: {
    id: 'rc_inference_p2',
    label: 'PASSAGE 2 of 2',
    title: 'Memory and Identity',
    content: [
      `Philosopher Derek Parfit argued that personal identity is not what matters in survival. What we call the "self" is less a continuous entity than a series of connected psychological states — memories, intentions, beliefs — that persist across time with varying degrees of continuity.`,
      `Consider severe amnesia. If a person wakes with no memory of their past, are they the same person? Legally and biologically, perhaps. But psychologically, much of what made them who they were has been erased. Parfit would suggest that person-stage has ended and a new one begun.`,
    ],
  },
};

// ─── QUESTIONS ───────────────────────────────────────────────────────────────

const QUESTIONS = {

  // ══════════════════════════════════════════════
  // RC — INFERENCE (Topic id: '5')
  // ══════════════════════════════════════════════
  rc_inference: [
    {
      id: 'rci_q1', number: 1, passageId: 'rc_inference_p1',
      text: 'Based on the passage, the primary reason more choices lead to dissatisfaction is:',
      type: 'mcq',
      options: [
        'People lack the cognitive ability to evaluate many options.',
        'Greater options make it near-certain we have not chosen the best.',
        'Freedom of choice is inherently stressful for human beings.',
        'Maximizers are inherently more neurotic than satisficers.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'rci_q2', number: 2, passageId: 'rc_inference_p1',
      text: 'Which of the following can be inferred about "satisficers" from the passage?',
      type: 'mcq',
      options: [
        'They achieve better objective outcomes than maximizers.',
        'They are incapable of identifying the best option.',
        'They experience higher subjective satisfaction despite potentially sub-optimal choices.',
        'They avoid making choices altogether to prevent regret.',
      ],
      correctOption: 2, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'rci_q3', number: 3, passageId: 'rc_inference_p1',
      text: '"Abundance is psychologically costly" most nearly means:',
      type: 'mcq',
      options: [
        'Wealthy people are less psychologically stable.',
        'Having too many options carries a mental and emotional price.',
        'Purchasing expensive goods reduces happiness.',
        'Cognitive resources are depleted by physical abundance.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'rci_q4', number: 4, passageId: 'rc_inference_p1',
      text: "Schwartz's finding 'inverts our ordinary assumptions' primarily because:",
      type: 'mcq',
      options: [
        'We normally assume effort leads to better results.',
        'We normally assume trying harder to choose should result in greater satisfaction.',
        'We normally assume maximizers are happier than satisficers.',
        'We normally assume choice and freedom are unrelated to happiness.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'rci_q5', number: 5, passageId: 'rc_inference_p2',
      text: "According to Parfit, what primarily constitutes a person's identity?",
      type: 'mcq',
      options: [
        'Biological continuity of the physical body.',
        'Legal recognition and social relationships.',
        'Connected psychological states including memories and beliefs.',
        'Moral consistency of actions across time.',
      ],
      correctOption: 2, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'rci_q6', number: 6, passageId: 'rc_inference_p2',
      text: 'Parfit uses the amnesia case primarily to:',
      type: 'mcq',
      options: [
        'Argue that memory loss is more damaging than physical injury.',
        'Illustrate the gap between biological identity and psychological continuity.',
        'Prove that personal identity is a legal construct.',
        'Suggest amnesia patients be treated as new individuals.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'rci_q7', number: 7, passageId: null,
      text: 'Five sentences are given. Four form a coherent paragraph. Identify the ODD sentence.\n\nA. Philosophers have long debated whether the self is fixed or fluid.\nB. Neuroscience suggests memory is reconstructive rather than reproductive.\nC. Legal systems require a stable notion of personal identity to function.\nD. The weather patterns of coastal cities change dramatically each season.\nE. Parfit challenges us to care less about our future selves and more about others.',
      type: 'odd_one_out',
      options: ['A', 'B', 'C', 'D', 'E'],
      correctOption: 3, // D
      marks: { correct: 3, incorrect: 0 },
    },
    {
      id: 'rci_q8', number: 8, passageId: null,
      text: 'Five sentences are given. Four form a coherent paragraph. Identify the ODD sentence.\n\nA. Science communicators face the twin challenges of accuracy and accessibility.\nB. Simplification, when taken too far, can cross into misrepresentation.\nC. The Eiffel Tower was constructed between 1887 and 1889.\nD. Analogies help make complex ideas relatable to non-expert audiences.\nE. Carl Sagan remains the gold standard for inspiring public scientific literacy.',
      type: 'odd_one_out',
      options: ['A', 'B', 'C', 'D', 'E'],
      correctOption: 2, // C
      marks: { correct: 3, incorrect: 0 },
    },
    {
      id: 'rci_q9', number: 9, passageId: null,
      text: 'Five sentences are given. Four form a coherent paragraph. Identify the ODD sentence.\n\nA. Machine learning models learn patterns from training data.\nB. The debate over AI consciousness is both philosophical and technical.\nC. Cricket was first played in England in the 16th century.\nD. Bias in AI systems often reflects biases present in training data.\nE. Regulation of AI technology varies significantly across countries.',
      type: 'odd_one_out',
      options: ['A', 'B', 'C', 'D', 'E'],
      correctOption: 2, // C
      marks: { correct: 3, incorrect: 0 },
    },
    {
      id: 'rci_q10', number: 10, passageId: null,
      text: 'Five sentences are given. Four form a coherent paragraph. Identify the ODD sentence.\n\nA. Economic inequality has widened in the post-globalisation era.\nB. The middle class in many developing nations expanded through the 1990s.\nC. The Amazon River flows eastward through South America.\nD. Automation threatens to hollow out routine white-collar jobs.\nE. Policy responses to inequality range from redistribution to skills development.',
      type: 'odd_one_out',
      options: ['A', 'B', 'C', 'D', 'E'],
      correctOption: 2, // C
      marks: { correct: 3, incorrect: 0 },
    },
  ],

  // ══════════════════════════════════════════════
  // PARA JUMBLES (Topic id: '6')
  // ══════════════════════════════════════════════
  para_jumbles: [
    {
      id: 'pj_q1', number: 1, passageId: null,
      text: 'Arrange the sentences to form a coherent paragraph.\n\nA. The poet composes; the poem speaks.\nB. Words live longer than the men who write them.\nC. Language is the house of Being.\nD. Yet we do not inhabit language — it inhabits us.\nE. Every sentence, in this sense, is an act of survival.',
      type: 'para_jumble',
      options: ['CABED', 'CBDAE', 'CABDE', 'CDBAE'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'pj_q2', number: 2, passageId: null,
      text: 'Arrange the sentences to form a coherent paragraph.\n\nA. This trust, once broken, is extraordinarily difficult to rebuild.\nB. Institutions derive authority not from force but from legitimacy.\nC. A democracy without functioning institutions is merely a name.\nD. Legitimacy rests on the public\'s trust in procedural fairness.\nE. Elections are the ceremony; institutions are the substance.',
      type: 'para_jumble',
      options: ['EBDAC', 'BDACE', 'BDAEC', 'EADBC'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'pj_q3', number: 3, passageId: null,
      text: 'Arrange the sentences to form a coherent paragraph.\n\nA. Maps are not neutral documents — they are arguments about the world.\nB. The choice of projection alone can make one continent appear larger than another.\nC. Cartography has always been entangled with power.\nD. Colonial-era maps systematically distorted African and Asian landmasses.\nE. To read a map critically is to ask: whose perspective does this represent?',
      type: 'para_jumble',
      options: ['CADBE', 'CBDAE', 'CABDE', 'ABEDC'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'pj_q4', number: 4, passageId: null,
      text: 'Arrange the sentences to form a coherent paragraph.\n\nA. But sustained attention is itself a skill — one that requires cultivation.\nB. The ability to focus deeply is increasingly rare in a distracted age.\nC. Most people can focus for short bursts, especially on pleasurable stimuli.\nD. What distinguishes great thinkers is often not intelligence but patience.\nE. Patience, in this view, is simply attention maintained over time.',
      type: 'para_jumble',
      options: ['BCADE', 'BCDAE', 'ABDCE', 'DCBAE'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'pj_q5', number: 5, passageId: null,
      text: 'Arrange the sentences to form a coherent paragraph.\n\nA. Science does not produce certainty; it produces the best available explanation.\nB. This provisional nature is often misunderstood as a weakness.\nC. A theory that can be overturned is more valuable than one that cannot.\nD. Falsifiability — the capacity to be proven wrong — is science\'s defining virtue.\nE. Dogma survives precisely because it admits no disproof.',
      type: 'para_jumble',
      options: ['ABCDE', 'ABDCE', 'DCEBA', 'ABEDC'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'pj_q6', number: 6, passageId: null,
      text: '[Opening sentence given] A. Grief, like all powerful emotions, follows no timetable.\n\nArrange B–E into the correct order:\nB. The expectation of recovery by a fixed date adds cruelty to loss.\nC. Social pressure to "move on" often compounds the pain of bereavement.\nD. Each person\'s relationship to their grief is as unique as the relationship mourned.\nE. What looks like failure to heal may simply be a different pace of healing.\n\nType the correct sequence of B, C, D, E:',
      type: 'tita',
      options: null,
      correctAnswer: 'CBDE',
      marks: { correct: 3, incorrect: 0 },
      hint: 'Type 4 letters, e.g., BCDE',
    },
    {
      id: 'pj_q7', number: 7, passageId: null,
      text: '[Opening sentence given] A. The greatest scientific revolutions are almost always resisted at first.\n\nArrange B–E:\nB. Entrenched paradigms protect the careers and identities of those who built them.\nC. Kuhn called these moments "paradigm shifts" — ruptures rather than evolutions.\nD. Over time, anomalies accumulate that the old framework cannot explain.\nE. The community\'s instinct is to defend the existing model, not to question it.\n\nType the correct sequence of B, C, D, E:',
      type: 'tita',
      options: null,
      correctAnswer: 'BEDC',
      marks: { correct: 3, incorrect: 0 },
      hint: 'Type 4 letters, e.g., BEDC',
    },
    {
      id: 'pj_q8', number: 8, passageId: null,
      text: 'Arrange the sentences to form a coherent paragraph.\n\nA. Privacy, once surrendered, is almost impossible to reclaim.\nB. Digital data, unlike spoken words, persists indefinitely.\nC. What seems harmless to share today may be weaponised by future technologies.\nD. This permanence is the central danger of the surveillance economy.\nE. The asymmetry between corporations and individuals grows more extreme each year.',
      type: 'para_jumble',
      options: ['BDCAE', 'ABCDE', 'BDACE', 'DACBE'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'pj_q9', number: 9, passageId: null,
      text: 'Arrange the sentences to form a coherent paragraph.\n\nA. Economic models are built on assumptions about human rationality.\nB. Behavioural economics emerged to correct this idealised picture.\nC. Real humans are not optimisers — we are satisficers, prone to bias and error.\nD. Yet these assumptions have been known to be unrealistic for decades.\nE. The persistence of flawed models in policy suggests institutional inertia.',
      type: 'para_jumble',
      options: ['ADCBE', 'ABCDE', 'ADBCE', 'ABDCE'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'pj_q10', number: 10, passageId: null,
      text: '[Opening sentence given] A. Urban planning shapes human behaviour in ways rarely acknowledged.\n\nArrange B–E:\nB. A city designed for cars produces a society that drives; one for walking produces walkers.\nC. The infrastructure we build embeds values into the landscape.\nD. This feedback loop between design and behaviour is powerful and largely invisible.\nE. Most residents experience their city as a given, not a choice once made.\n\nType the correct sequence of B, C, D, E:',
      type: 'tita',
      options: null,
      correctAnswer: 'CBDE',
      marks: { correct: 3, incorrect: 0 },
      hint: 'Type 4 letters, e.g., CBDE',
    },
  ],

  // ══════════════════════════════════════════════
  // PARA SUMMARY (Topic id: '7')
  // ══════════════════════════════════════════════
  para_summary: [
    {
      id: 'ps_q1', number: 1, passageId: null,
      text: 'Choose the best summary:\n\n"Technological determinism holds that technology is the primary driver of social change. Critics argue it strips human beings of agency. The truth is more complicated: technologies create new possibilities; societies choose which possibilities to realise."',
      type: 'para_summary',
      options: [
        'Technology is solely responsible for all major social transformations.',
        'Social changes are caused by human choices, not the technologies invented.',
        'While technology opens possibilities, societies retain agency in deciding how to use them.',
        'The printing press and internet are the two most transformative technologies.',
      ],
      correctOption: 2, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'ps_q2', number: 2, passageId: null,
      text: 'Choose the best summary:\n\n"Mindfulness, as practised in corporations, bears little resemblance to its Buddhist origins. Stripped of its ethical framework — compassion, non-attachment — what remains is a set of attention-regulation techniques for managing stress and improving productivity. Critics call this \'McMindfulness.\'"',
      type: 'para_summary',
      options: [
        'Mindfulness is incompatible with corporate culture.',
        'The popularised version of mindfulness has been stripped of its original spiritual dimensions.',
        'Corporations have corrupted every spiritual tradition they have adopted.',
        'Attention regulation is the most important benefit of mindfulness.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'ps_q3', number: 3, passageId: null,
      text: 'Choose the best summary:\n\n"The fable of the ant and the grasshopper has been used for millennia to moralise about prudence. Yet a purely economic reading misses the deeper point: the grasshopper chose beauty over security. To dismiss this as foolishness is to assume survival is always the highest value — a utilitarian bias the fable quietly questions."',
      type: 'para_summary',
      options: [
        'The grasshopper was irresponsible and the ant exemplifies correct conduct.',
        'Economic productivity is less important than artistic expression.',
        'A simplistic reading of the fable as endorsing prudence overlooks its implicit challenge to utilitarian values.',
        'Ancient fables are unreliable guides to modern economic decision-making.',
      ],
      correctOption: 2, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'ps_q4', number: 4, passageId: null,
      text: 'Choose the best summary:\n\n"Silence has become a scarce resource. In cities, in offices, in our own heads, noise is near-constant. We have built an environment that makes sustained quiet almost impossible, and in doing so may have damaged capacities — for reflection, creativity, genuine rest — that require it. The case for silence is not nostalgic; it is neurological."',
      type: 'para_summary',
      options: [
        'Urban noise pollution is primarily a physical health problem.',
        'The pervasive absence of silence in modern life threatens cognitive capacities that depend on quiet.',
        'We should return to simpler times when silence was more available.',
        'Creativity and rest are impossible in any modern urban environment.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'ps_q5', number: 5, passageId: null,
      text: 'Choose the best summary:\n\n"The concept of \'wilderness\' is, paradoxically, a cultural construct. The idea that certain landscapes are untouched ignores millennia of Indigenous management, burning, and cultivation. What Europeans perceived as pristine nature was in fact a managed landscape whose managers had been devastated by disease before colonists arrived to document it."',
      type: 'para_summary',
      options: [
        'Indigenous peoples managed American landscapes, so the "wilderness" Europeans encountered was culturally shaped.',
        'European colonists were primarily responsible for destroying natural ecosystems.',
        'The concept of nature is entirely a human invention.',
        'Wilderness preservation policies should consult historical Indigenous practices.',
      ],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'ps_q6', number: 6, passageId: null,
      text: 'Choose the best summary:\n\n"Empathy is celebrated as a moral virtue, but Paul Bloom argues it is a poor basis for ethical decision-making. Empathy is parochial — we feel it most for those who are near and similar. It is also innumerate: we respond more to a single identified victim than to statistics about millions. Impartial rationality, Bloom argues, produces better moral outcomes."',
      type: 'para_summary',
      options: [
        'Empathy should be cultivated as the foundation of all morality.',
        "Bloom argues that empathy's biases make impartial reason a better guide to ethics.",
        'Statistical thinking about suffering is inherently more emotional than empathy.',
        'Empathy is culturally determined and therefore unreliable.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'ps_q7', number: 7, passageId: null,
      text: 'Choose the best summary:\n\n"Historians of science note that major discoveries are rarely the product of lone geniuses. Newton had Hooke and Leibniz. Darwin corresponded prolifically with naturalists globally. Watson and Crick depended on Rosalind Franklin\'s X-ray data. The lone-genius mythology is not only inaccurate but harmful — it discourages the collaborative habits science requires."',
      type: 'para_summary',
      options: [
        'Scientific credit is often unfairly distributed.',
        'Major scientific breakthroughs are collaborative achievements, and the lone-genius myth is both false and harmful.',
        'Darwin was the greatest example of combining independent thought with collaboration.',
        'The history of science is primarily a history of intellectual theft.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'ps_q8', number: 8, passageId: null,
      text: 'Choose the best summary:\n\n"In most legal systems, intention is key to serious crime. We distinguish murder from manslaughter because intent changes our moral assessment. Yet with autonomous systems — self-driving cars, algorithmic trading, autonomous weapons — this framework strains. Who intended anything when an algorithm decides?"',
      type: 'para_summary',
      options: [
        'Autonomous systems should be banned because they cannot be held legally accountable.',
        "The law's dependence on intention as a moral category is challenged by autonomous systems that act without intending.",
        'Algorithmic trading is the most legally complex autonomous technology.',
        'Legal systems must be entirely rebuilt to accommodate AI.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
  ],

  // ══════════════════════════════════════════════
  // VOCABULARY (Topic id: '9')
  // ══════════════════════════════════════════════
  vocab: [
    {
      id: 'v_q1', number: 1, passageId: null,
      text: 'Choose the word closest in meaning to: EQUIVOCATE',
      type: 'mcq',
      options: ['Speak ambiguously to avoid commitment', 'Express strong disagreement', 'Calculate precisely', 'Distribute evenly'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q2', number: 2, passageId: null,
      text: 'Choose the word OPPOSITE in meaning to: LOQUACIOUS',
      type: 'mcq',
      options: ['Verbose', 'Taciturn', 'Gregarious', 'Garrulous'],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q3', number: 3, passageId: null,
      text: 'Choose the word closest in meaning to: OBFUSCATE',
      type: 'mcq',
      options: ['Clarify thoroughly', 'Make confusing or unclear', 'Obstruct physically', 'Describe in detail'],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q4', number: 4, passageId: null,
      text: 'Which sentence uses SANGUINE correctly?',
      type: 'mcq',
      options: [
        'She was sanguine about the diagnosis, expecting the worst.',
        'Despite the setback, he remained sanguine about the project\'s eventual success.',
        'The sanguine report contained only negative findings.',
        'His sanguine expression showed how deeply troubled he was.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q5', number: 5, passageId: null,
      text: 'Choose the word closest in meaning to: PELLUCID',
      type: 'mcq',
      options: ['Murky and unclear', 'Transparently clear', 'Pale in colour', 'Slightly distorted'],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q6', number: 6, passageId: null,
      text: 'Choose the word OPPOSITE in meaning to: PENURIOUS',
      type: 'mcq',
      options: ['Miserly', 'Affluent', 'Destitute', 'Frugal'],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q7', number: 7, passageId: null,
      text: 'Choose the word closest in meaning to: TENDENTIOUS',
      type: 'mcq',
      options: ['Neutral and unbiased', 'Biased toward a particular viewpoint', 'Overly sensitive', 'Relating to tendons'],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q8', number: 8, passageId: null,
      text: 'Choose the word closest in meaning to: ENERVATE',
      type: 'mcq',
      options: ['To energise completely', 'To weaken or drain of vitality', 'To stimulate nerve responses', 'To concentrate intensely'],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q9', number: 9, passageId: null,
      text: 'Choose the word OPPOSITE in meaning to: MERETRICIOUS',
      type: 'mcq',
      options: ['Genuinely valuable', 'Attractively flashy', 'Morally corrupt', 'Excessively decorated'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q10', number: 10, passageId: null,
      text: 'Which sentence uses LACONIC correctly?',
      type: 'mcq',
      options: [
        'Her laconic speech lasted nearly three hours.',
        "He gave a laconic reply: just the single word 'No.'",
        'The laconic novel ran to over eight hundred pages.',
        'She spoke laconically, using elaborate metaphors at every turn.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q11', number: 11, passageId: null,
      text: 'Choose the word closest in meaning to: VENAL',
      type: 'mcq',
      options: ['Morally pure', 'Open to bribery or corruption', 'Related to poison', 'Easily forgiven'],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q12', number: 12, passageId: null,
      text: 'Choose the word closest in meaning to: SOLIPSISTIC',
      type: 'mcq',
      options: [
        'Deeply empathetic to others',
        "Preoccupied only with one's own existence and perspective",
        'Relating to collective decision-making',
        'Marked by spiritual humility',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q13', number: 13, passageId: null,
      text: 'Choose the word OPPOSITE in meaning to: INTRANSIGENT',
      type: 'mcq',
      options: ['Stubborn', 'Uncompromising', 'Amenable', 'Belligerent'],
      correctOption: 2, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q14', number: 14, passageId: null,
      text: 'Choose the word closest in meaning to: IMPECUNIOUS',
      type: 'mcq',
      options: ['Having no money', 'Being extremely careful', 'Having no scruples', 'Being very precise'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'v_q15', number: 15, passageId: null,
      text: 'Choose the word closest in meaning to: ANODYNE',
      type: 'mcq',
      options: [
        'Causing great controversy',
        'Inoffensive and unlikely to cause disagreement',
        'Relating to anaesthesia',
        'Extremely painful',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
  ],

  // ══════════════════════════════════════════════
  // FULL MOCK — VARC SECTION
  // Real CAT pattern: 24 Qs
  //   • 3 RC passages × 5 Qs = 15 MCQ (+3/-1)
  //   • 9 VA Qs: PJ × 3, Summary × 3, Odd-One-Out × 3
  // ══════════════════════════════════════════════
  full_mock_varc: [
    // ── Passage 1 (Q1–Q5) ──
    {
      id: 'fm_q1', number: 1, passageId: 'rc_p1',
      text: 'Based on the passage, the "embodied cognition" hypothesis primarily claims that:',
      type: 'mcq',
      options: [
        'Human beings learn language entirely through physical experience.',
        'Our conceptual systems are shaped by the physical world and bodily experience.',
        'Language is an organ like the heart, with its own autonomous rules.',
        'Metaphors are the cause of the modular view of the mind.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q2', number: 2, passageId: 'rc_p1',
      text: 'According to the passage, what is the significance of metaphors in cognitive linguistics?',
      type: 'mcq',
      options: [
        'They demonstrate that language is purely a literary device.',
        'They show language is rooted in physical and perceptual experience.',
        'They prove the modular view of the mind is correct.',
        'They suggest abstract thought is independent of language.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q3', number: 3, passageId: 'rc_p1',
      text: 'The author uses "attacking a point" and "defending a position" to illustrate:',
      type: 'mcq',
      options: [
        'How combat vocabulary has entered academic language.',
        'How physical experience of conflict maps onto abstract intellectual debate.',
        'How language shapes the way we conduct arguments.',
        'How metaphors become clichés through overuse.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q4', number: 4, passageId: 'rc_p1',
      text: 'What does the passage imply by saying our conceptual systems are "shaped by the bodies we inhabit"?',
      type: 'mcq',
      options: [
        'Physical health directly determines intellectual capacity.',
        'Abstract reasoning would be identical across all sentient beings.',
        'A disembodied intelligence would conceptualise the world differently from humans.',
        'The mind cannot function without constant sensory input.',
      ],
      correctOption: 2, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q5', number: 5, passageId: 'rc_p1',
      text: "The author's tone in the passage can best be described as:",
      type: 'mcq',
      options: [
        'Polemical and confrontational',
        'Informative and measured',
        'Speculative and tentative',
        'Celebratory and enthusiastic',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    // ── Passage 2 (Q6–Q10) ──
    {
      id: 'fm_q6', number: 6, passageId: 'rc_p2',
      text: 'According to the passage, what is the primary "product" in the attention economy?',
      type: 'mcq',
      options: [
        'Digital content created by platform users',
        'Advertising space sold to companies',
        'The attention of users, sold to advertisers',
        'The data collected about user behaviour',
      ],
      correctOption: 2, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q7', number: 7, passageId: 'rc_p2',
      text: 'The passage implies that features like infinite scroll are:',
      type: 'mcq',
      options: [
        'Technical side-effects designers have not yet addressed.',
        'Deliberate design choices that exploit psychological vulnerabilities.',
        'Necessary for the user experience of social media.',
        'Primarily motivated by desire to display more advertising.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q8', number: 8, passageId: 'rc_p2',
      text: 'What does the author mean by "cognitive pollution"?',
      type: 'mcq',
      options: [
        'The accumulation of factually false information online',
        'Systematic degradation of mental capacities caused by constant distraction',
        'The environmental damage from data centre energy consumption',
        'The spread of conspiracy theories through social media algorithms',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q9', number: 9, passageId: 'rc_p2',
      text: "Which best summarises the passage's central argument?",
      type: 'mcq',
      options: [
        'Social media companies are breaking the law by exploiting users.',
        'The attention economy deliberately degrades human cognitive capacity for profit.',
        'Technology has always had unintended negative consequences.',
        'Advertising is fundamentally incompatible with healthy social media use.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q10', number: 10, passageId: 'rc_p2',
      text: 'The author suggests books and newspapers, unlike social media, provide:',
      type: 'mcq',
      options: [
        'More reliable and accurate information',
        'Natural stopping cues that help regulate engagement',
        'A less addictive form of information consumption',
        'Greater depth of content on complex topics',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    // ── Passage 3 (Q11–Q15) ──
    {
      id: 'fm_q11', number: 11, passageId: 'rc_p3',
      text: "The peregrine falcon's urban recovery is primarily due to:",
      type: 'mcq',
      options: [
        'Conservation programmes designed for urban environments.',
        'The banning of DDT and subsequent legislative protection.',
        'Skyscrapers providing nesting sites and pigeons providing food.',
        'Reduction in urban predators that compete with peregrines.',
      ],
      correctOption: 2, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q12', number: 12, passageId: 'rc_p3',
      text: '"Urban adapter" as used in the passage refers to:',
      type: 'mcq',
      options: [
        'Engineers who design wildlife-friendly urban infrastructure',
        'Species that modify behaviour in response to urban environments',
        'Animals native to cities rather than having migrated into them',
        'Invasive species that displace native wildlife in urban areas',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q13', number: 13, passageId: 'rc_p3',
      text: "Which best captures the author's purpose?",
      type: 'mcq',
      options: [
        'To argue urbanisation is less harmful to wildlife than believed',
        'To present evidence that certain species have adapted surprisingly well to cities',
        'To call for more wildlife corridors in urban planning',
        'To show peregrine falcons are the most successful urban adapters',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q14', number: 14, passageId: 'rc_p3',
      text: 'Urban birds singing at higher pitches illustrates:',
      type: 'mcq',
      options: [
        'A learned behaviour passed from parents to offspring',
        'Behavioural and potentially evolutionary adaptation to urban noise',
        'A distress response to the stress of urban environments',
        'The accidental impact of artificial light on bird communication',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q15', number: 15, passageId: 'rc_p3',
      text: '"Evolution, it seems, is happening faster than we thought" most likely implies:',
      type: 'mcq',
      options: [
        'Urban environments cause genetic mutations at unprecedented rates.',
        'Species are adapting behaviourally and evolutionarily within observable timescales.',
        "Darwin's theory needs to be revised for urban ecologies.",
        "Urban development's speed outpaces species' ability to adapt.",
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    // ── VA (Q16–Q24) — Mix of PJ, Summary, Odd-One-Out ──
    {
      id: 'fm_q16', number: 16, passageId: null,
      text: 'Arrange the sentences to form a coherent paragraph.\n\nA. Silence has become a scarce resource in modern life.\nB. The case for quiet is not nostalgic but neurological.\nC. We have built environments that make sustained quiet near-impossible.\nD. In doing so, we may have damaged capacities that depend on silence.',
      type: 'para_jumble',
      options: ['ACDB', 'ABDC', 'ABCD', 'ADCB'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q17', number: 17, passageId: null,
      text: 'Choose the best summary:\n\n"Maps are not neutral documents — they are arguments about the world. Colonial-era maps distorted African and Asian landmasses relative to Europe. To read a map critically is to ask: whose perspective does this represent?"',
      type: 'para_summary',
      options: [
        'All maps contain deliberate distortions introduced by European cartographers.',
        'Maps are political and perspectival documents, not neutral representations of reality.',
        'Cartographic projections are the primary source of geographical misunderstanding.',
        'Colonial maps were scientifically inferior to modern satellite-based mapping.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q18', number: 18, passageId: null,
      text: 'Five sentences are given. Four form a coherent paragraph. Identify the ODD sentence.\n\nA. Science communicators face the twin challenges of accuracy and accessibility.\nB. Simplification taken too far can cross into misrepresentation.\nC. The Eiffel Tower was constructed between 1887 and 1889.\nD. Analogies help make complex ideas relatable to non-experts.\nE. Carl Sagan remains the gold standard for inspiring public scientific literacy.',
      type: 'odd_one_out',
      options: ['A', 'B', 'C', 'D', 'E'],
      correctOption: 2, marks: { correct: 3, incorrect: 0 },
    },
    {
      id: 'fm_q19', number: 19, passageId: null,
      text: 'Arrange the sentences to form a coherent paragraph.\n\nA. Privacy, once surrendered, is almost impossible to reclaim.\nB. Digital data, unlike spoken words, persists indefinitely.\nC. What seems harmless to share today may be weaponised by future technologies.\nD. This permanence is the central danger of the surveillance economy.',
      type: 'para_jumble',
      options: ['BDCA', 'ABCD', 'BDAC', 'DACB'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q20', number: 20, passageId: null,
      text: 'Choose the best summary:\n\n"The paradox of choice: having more options can make us less happy. Maximizers achieve better objective outcomes but report significantly lower satisfaction. The person who tries hardest to choose well ends up feeling worst about what they chose."',
      type: 'para_summary',
      options: [
        'People should always choose the first available option to maximise happiness.',
        'Maximizers are happier than satisficers because they make better choices.',
        'The drive to choose optimally can paradoxically reduce satisfaction compared to settling for good enough.',
        'Happiness is unrelated to the number of options available.',
      ],
      correctOption: 2, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q21', number: 21, passageId: null,
      text: 'Five sentences are given. Four form a coherent paragraph. Identify the ODD sentence.\n\nA. Economic inequality has widened in the post-globalisation era.\nB. The middle class in developing nations expanded through the 1990s.\nC. The Amazon River flows eastward through South America.\nD. Automation threatens to hollow out routine white-collar jobs.\nE. Policy responses range from redistribution to skills development.',
      type: 'odd_one_out',
      options: ['A', 'B', 'C', 'D', 'E'],
      correctOption: 2, marks: { correct: 3, incorrect: 0 },
    },
    {
      id: 'fm_q22', number: 22, passageId: null,
      text: 'Arrange the sentences to form a coherent paragraph.\n\nA. Institutional trust is not given — it is earned through consistent procedural fairness.\nB. Once broken, this trust is extraordinarily difficult to rebuild.\nC. Democracies without functioning institutions are names without substance.\nD. Elections are the ceremony; functioning institutions are the substance.',
      type: 'para_jumble',
      options: ['DCAB', 'ABCD', 'ABDC', 'DABC'],
      correctOption: 0, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q23', number: 23, passageId: null,
      text: 'Choose the best summary:\n\n"Major scientific discoveries are rarely the product of lone geniuses. Newton had Hooke and Leibniz; Watson and Crick depended on Rosalind Franklin\'s data. The lone-genius mythology is both false and harmful — it discourages the collaborative habits science requires."',
      type: 'para_summary',
      options: [
        'Scientific credit is often unfairly distributed.',
        'Major breakthroughs are collaborative achievements, and the lone-genius myth is both false and harmful.',
        'Darwin was the greatest example of combining independence with collaboration.',
        'Science history is primarily a history of intellectual theft.',
      ],
      correctOption: 1, marks: { correct: 3, incorrect: -1 },
    },
    {
      id: 'fm_q24', number: 24, passageId: null,
      text: 'Five sentences are given. Four form a coherent paragraph. Identify the ODD sentence.\n\nA. Historians note major discoveries rarely come from lone geniuses.\nB. Newton had Hooke, Leibniz, and Halley to correspond with.\nC. The first motor car was invented in Germany in 1885.\nD. Watson and Crick depended critically on Rosalind Franklin\'s X-ray data.\nE. The lone-genius mythology actively discourages collaborative habits science requires.',
      type: 'odd_one_out',
      options: ['A', 'B', 'C', 'D', 'E'],
      correctOption: 2, marks: { correct: 3, incorrect: 0 },
    },
  ],
};

// ─── EXAM CONFIGS ─────────────────────────────────────────────────────────────
// Maps MOCK_DATA id → full exam configuration

const EXAM_CONFIGS = {
  '1': {
    testTitle: 'CAT Full Mock #1', sectionTitle: 'Section I', subject: 'VARC',
    totalSeconds: 40 * 60,
    sections: [
      { id: 'VARC', label: 'VARC', locked: false, questions: QUESTIONS.full_mock_varc, totalQuestions: 24 },
      { id: 'DILR', label: 'DILR', locked: true, questions: [], totalQuestions: 20 },
      { id: 'QA',   label: 'QA',   locked: true, questions: [], totalQuestions: 22 },
    ],
  },
  '2': {
    testTitle: 'CAT Full Mock #2', sectionTitle: 'Section I', subject: 'VARC',
    totalSeconds: 40 * 60,
    sections: [
      { id: 'VARC', label: 'VARC', locked: false, questions: QUESTIONS.full_mock_varc, totalQuestions: 24 },
      { id: 'DILR', label: 'DILR', locked: true, questions: [], totalQuestions: 20 },
      { id: 'QA',   label: 'QA',   locked: true, questions: [], totalQuestions: 22 },
    ],
  },
  '3': {
    testTitle: 'Half Length Mock #1', sectionTitle: 'VARC + DILR', subject: 'VARC',
    totalSeconds: 30 * 60,
    sections: [
      { id: 'VARC', label: 'VARC', locked: false, questions: QUESTIONS.full_mock_varc.slice(0, 16), totalQuestions: 16 },
      { id: 'DILR', label: 'DILR', locked: true, questions: [], totalQuestions: 12 },
    ],
  },
  '4': {
    testTitle: 'Half Length Mock #3', sectionTitle: 'VARC Focus', subject: 'VARC',
    totalSeconds: 30 * 60,
    sections: [
      {
        id: 'VARC', label: 'VARC', locked: false,
        questions: [
          ...QUESTIONS.para_jumbles.slice(0, 5),
          ...QUESTIONS.para_summary.slice(0, 5),
          ...QUESTIONS.rc_inference.slice(0, 6),
        ],
        totalQuestions: 16,
      },
      { id: 'DILR', label: 'DILR', locked: true, questions: [], totalQuestions: 12 },
    ],
  },
  '5': {
    testTitle: 'RC — Inference Questions', sectionTitle: 'Reading Comprehension', subject: 'VARC · RC',
    totalSeconds: 30 * 60,
    sections: [
      { id: 'VARC', label: 'RC', locked: false, questions: QUESTIONS.rc_inference, totalQuestions: QUESTIONS.rc_inference.length },
    ],
  },
  '6': {
    testTitle: 'Para Jumbles', sectionTitle: 'Verbal Ability', subject: 'VARC · VA',
    totalSeconds: 20 * 60,
    sections: [
      { id: 'VARC', label: 'VA', locked: false, questions: QUESTIONS.para_jumbles, totalQuestions: QUESTIONS.para_jumbles.length },
    ],
  },
  '7': {
    testTitle: 'Summary Questions', sectionTitle: 'Verbal Ability', subject: 'VARC · VA',
    totalSeconds: 20 * 60,
    sections: [
      { id: 'VARC', label: 'VA', locked: false, questions: QUESTIONS.para_summary, totalQuestions: QUESTIONS.para_summary.length },
    ],
  },
  '8': {
    testTitle: 'CAT Full Mock #3', sectionTitle: 'Section I', subject: 'VARC',
    totalSeconds: 40 * 60,
    sections: [
      { id: 'VARC', label: 'VARC', locked: false, questions: QUESTIONS.full_mock_varc, totalQuestions: 24 },
      { id: 'DILR', label: 'DILR', locked: true, questions: [], totalQuestions: 20 },
      { id: 'QA',   label: 'QA',   locked: true, questions: [], totalQuestions: 22 },
    ],
  },
  '9': {
    testTitle: 'Vocab', sectionTitle: 'Vocabulary', subject: 'VARC · Vocab',
    totalSeconds: 20 * 60,
    sections: [
      { id: 'VARC', label: 'VOCAB', locked: false, questions: QUESTIONS.vocab, totalQuestions: QUESTIONS.vocab.length },
    ],
  },
};

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

export const getExamData = (mockId) => {
  const config = EXAM_CONFIGS[String(mockId)];
  if (!config) {
    console.warn(`[examData] mockId "${mockId}" not found → falling back to Full Mock #1`);
    return EXAM_CONFIGS['1'];
  }
  return config;
};

export const getPassage = (passageId) => {
  if (!passageId) return null;
  return PASSAGES[passageId] ?? null;
};

export const getQuestionNumbers = (questions) =>
  questions.map((q) => q.number);

export default { getExamData, getPassage, getQuestionNumbers };