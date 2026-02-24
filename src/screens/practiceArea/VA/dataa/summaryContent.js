// ─── LEARN CONTENT ───────────────────────────────────────────────────────────

export const PS_LEARN_CARDS = [
  {
    id: 1,
    icon: '🎯',
    badge: 'STRATEGY 01',
    title: 'Find the Central Idea',
    accentColor: '#0f4c75',
    bgColor: '#EBF5FF',
    description:
      'Every passage has ONE central idea — the single statement that the entire paragraph is built around. The correct summary will always capture this central idea. Trap options sound correct but focus on supporting details, examples, or peripheral points instead of the core message.',
    steps: [
      'Read the passage fully once without stopping. Don\'t try to summarise yet.',
      'Ask yourself: "What is the author\'s MAIN point?" — not what they said, but WHY they said it.',
      'Check if the summary covers the WHOLE passage or just one part of it.',
      'Reject options that are too broad (covering things the passage didn\'t say) or too narrow (covering only one example).',
    ],
    tip: '💡 Pro Tip: The central idea is almost always stated either in the first or last sentence. If you find a sentence that can logically "contain" all other sentences, that\'s your central idea.',
    example: {
      passage: 'The rapid urbanisation of developing countries has created a paradox. While cities attract migrants with promises of economic opportunity, they simultaneously struggle with infrastructure deficits — inadequate housing, overburdened transport, and failing sanitation systems. The result is a growing population of urban poor who live in informal settlements, cut off from the very prosperity that drew them there.',
      options: [
        {
          label: 'A',
          text: 'Cities in developing countries have poor sanitation and transport systems.',
          role: null,
          note: 'Too narrow — this is just one supporting detail, not the central idea.',
        },
        {
          label: 'B',
          text: 'Urbanisation in developing countries creates a paradox where economic promise coexists with infrastructure failure, trapping migrants in poverty.',
          role: 'CORRECT',
          note: 'Captures the central paradox and its consequence — the full arc of the passage. ✓',
        },
        {
          label: 'C',
          text: 'Developing countries should invest more in rural areas to prevent urban migration.',
          role: null,
          note: 'Not stated in the passage — this introduces a solution that the author never mentioned.',
        },
        {
          label: 'D',
          text: 'Urbanisation is the biggest challenge facing developing nations today.',
          role: null,
          note: 'Too broad and uses an absolute ("biggest") that the passage never claims.',
        },
      ],
      explanation: 'B is correct because it captures the paradox (promise vs. reality) and the outcome (urban poor in informal settlements). A focuses only on one detail. C introduces unsaid solutions. D overclaims scope.',
    },
  },
  {
    id: 2,
    icon: '🚫',
    badge: 'STRATEGY 02',
    title: 'Eliminate the Traps',
    accentColor: '#7c2d12',
    bgColor: '#FFF5F0',
    description:
      'CAT Para Summary traps are carefully crafted to mislead. Knowing the trap types saves you from 90% of wrong choices. Every wrong option falls into one of four trap categories: Too Narrow, Too Broad, Introduced (not in passage), and Distorted (misrepresents the tone or conclusion).',
    steps: [
      'Trap 1 — Too Narrow: Option covers only one example or one part of the passage. Eliminate it.',
      'Trap 2 — Too Broad: Option makes a sweeping claim the passage never makes. Look for absolute words: "always", "never", "most important". Eliminate if found.',
      'Trap 3 — Introduced: Option adds information, solutions, or opinions NOT present in the passage. Anything the author didn\'t say is a trap. Eliminate it.',
      'Trap 4 — Distorted: Option reverses the author\'s tone, turns a criticism into praise, or twists the conclusion. Eliminate if the tone doesn\'t match.',
    ],
    tip: '💡 Use elimination actively. On a 4-option question, if you can confidently eliminate 3 traps, the remaining option is correct — even if it seems imperfect.',
    example: {
      passage: 'Despite widespread belief that multitasking boosts productivity, research consistently shows the opposite. The human brain cannot genuinely process two cognitively demanding tasks simultaneously. What we call "multitasking" is rapid task-switching, which increases cognitive load, raises error rates, and ultimately slows overall performance.',
      options: [
        {
          label: 'A',
          text: 'Multitasking is harmful and should be banned in all workplaces.',
          role: 'TRAP: Introduced',
          note: '"Banned in workplaces" — the passage never recommends this. Pure invention.',
        },
        {
          label: 'B',
          text: 'The human brain cannot handle two tasks at the same time.',
          role: 'TRAP: Too Narrow',
          note: 'This is just one supporting point — the passage\'s main point is about productivity, not just brain limits.',
        },
        {
          label: 'C',
          text: 'Multitasking, contrary to popular belief, actually reduces productivity because the brain switches tasks rapidly rather than processing them in parallel.',
          role: 'CORRECT',
          note: 'Captures the popular belief, the contradiction, the mechanism, and the conclusion. ✓',
        },
        {
          label: 'D',
          text: 'People who multitask are less intelligent than those who focus on one task.',
          role: 'TRAP: Distorted',
          note: 'The passage never makes a claim about intelligence — this distorts the author\'s point entirely.',
        },
      ],
      explanation: 'A introduces a solution not mentioned. B captures only one supporting detail. D distorts the passage into an unrelated claim. C alone covers the belief, the contradiction, the mechanism, and the outcome.',
    },
  },
  {
    id: 3,
    icon: '⚖️',
    badge: 'STRATEGY 03',
    title: 'Match Tone & Scope',
    accentColor: '#134e4a',
    bgColor: '#F0FDFA',
    description:
      'The correct summary must match both the TONE (critical, neutral, optimistic, cautionary) and SCOPE (what the passage actually covers — not more, not less) of the original passage. A factual passage should have a factual summary. A critical passage should have a critical summary.',
    steps: [
      'Identify the author\'s tone: Is the author criticising? Analysing neutrally? Arguing for something? Expressing concern?',
      'Now check each option: does it match this tone? If the passage is cautionary and the option is celebratory — eliminate.',
      'Check scope: does the option cover all key parts of the passage? If it only covers the first half — eliminate.',
      'The correct option is the one that could serve as a one-sentence abstract for the entire passage.',
    ],
    tip: '💡 A good summary "rhymes" with the passage in tone. If the passage ends on a warning, the correct summary should carry that warning — not end on a hopeful note.',
    example: {
      passage: 'Artificial intelligence, often celebrated as the pinnacle of human ingenuity, carries within it a troubling dependency on vast datasets that may encode historical biases. When these systems are deployed in high-stakes domains such as hiring, lending, or criminal justice, they risk institutionalising discrimination at scale — efficiently and invisibly. The celebration of AI\'s efficiency must therefore be tempered with scrutiny of what it is efficiently doing.',
      options: [
        {
          label: 'A',
          text: 'AI has transformed industries and will continue to improve human life across various domains.',
          role: 'TRAP: Wrong Tone',
          note: 'Celebratory tone — the passage is cautionary and critical. Complete mismatch.',
        },
        {
          label: 'B',
          text: 'AI hiring tools have been shown to discriminate against women and minorities.',
          role: 'TRAP: Too Narrow + Wrong Scope',
          note: 'Focuses on one application (hiring) — passage discusses a broader systemic risk.',
        },
        {
          label: 'C',
          text: 'While AI is impressive, its use of biased datasets risks institutionalising discrimination in high-stakes domains, warranting critical scrutiny alongside its celebration.',
          role: 'CORRECT',
          note: 'Matches the cautionary-yet-balanced tone and covers the full scope: ingenuity, bias risk, high-stakes impact, and the call for scrutiny. ✓',
        },
        {
          label: 'D',
          text: 'AI should be completely banned from use in criminal justice and lending.',
          role: 'TRAP: Introduced',
          note: '"Banned completely" — author calls for scrutiny, not prohibition. This distorts and introduces.',
        },
      ],
      explanation: 'A has completely wrong tone (celebratory vs. cautionary). B is too narrow in scope. D introduces a solution the author never suggested. C alone matches the author\'s nuanced, cautionary stance across the full passage.',
    },
  },
];

// ─── PRACTICE QUESTIONS ──────────────────────────────────────────────────────

export const PS_QUESTIONS = [
  {
    id: 1,
    exerciseNo: 'EXERCISE 01',
    total: 4,
    strategy: { icon: '🎯', label: 'Find the Central Idea' },
    instruction: 'Choose the option that BEST summarises the passage below.',
    passage: 'For centuries, sleep was regarded as a passive state — a biological necessity with little consequence for waking life. Modern neuroscience has shattered this view. During sleep, the brain performs critical maintenance: consolidating memories, clearing metabolic waste through the glymphatic system, and regulating emotional responses. Chronic sleep deprivation, far from being a badge of productivity, is now linked to cognitive decline, mood disorders, and increased risk of cardiovascular disease.',
    options: [
      {
        id: 'A',
        text: 'Sleep is no longer considered passive; it is now known to involve essential brain functions whose disruption leads to serious health consequences.',
        highlight: null,
        reason: null,
        trapType: null,
      },
      {
        id: 'B',
        text: 'The glymphatic system is a recently discovered mechanism by which the brain clears metabolic waste during sleep.',
        highlight: 'glymphatic system',
        reason: 'Too Narrow — this is one supporting detail, not the passage\'s central idea.',
        trapType: 'TOO NARROW',
      },
      {
        id: 'C',
        text: 'People should sleep at least 8 hours every night to avoid cardiovascular disease and memory loss.',
        highlight: null,
        reason: 'Introduced — the passage never prescribes a sleep duration. This adds unsaid advice.',
        trapType: 'INTRODUCED',
      },
      {
        id: 'D',
        text: 'Modern science has proven that sleep deprivation is the leading cause of cognitive decline in adults.',
        highlight: 'leading cause',
        reason: 'Distorted — "linked to" in the passage becomes "leading cause" here, which is an overclaim.',
        trapType: 'DISTORTED',
      },
    ],
    explanation: {
      correct: 'A',
      why: 'A captures both the shift in understanding (passive → active) and the consequence of disruption (health impact). B is a single supporting detail. C introduces unprescribed advice. D distorts "linked to" into "leading cause," changing the author\'s actual claim.',
    },
  },
  {
    id: 2,
    exerciseNo: 'EXERCISE 02',
    total: 4,
    strategy: { icon: '🚫', label: 'Eliminate the Traps' },
    instruction: 'Identify and eliminate traps. Choose the BEST summary.',
    passage: 'The green revolution of the 1960s and 70s dramatically increased agricultural yields through high-yield seed varieties, chemical fertilisers, and expanded irrigation. While it averted famine for hundreds of millions, its long-term legacy is contested. Critics point to the ecological costs: soil degradation, aquifer depletion, and chemical runoff that devastated local ecosystems. Proponents argue that without it, far greater human suffering would have occurred. The debate reflects a wider tension in development policy between immediate humanitarian need and long-term environmental sustainability.',
    options: [
      {
        id: 'A',
        text: 'The green revolution saved millions from starvation but also caused lasting environmental damage, illustrating the broader tension between short-term humanitarian goals and long-term sustainability.',
        highlight: null,
        reason: null,
        trapType: null,
      },
      {
        id: 'B',
        text: 'Chemical fertilisers and irrigation techniques used in the green revolution depleted aquifers and caused soil degradation.',
        highlight: null,
        reason: 'Too Narrow — focuses only on the ecological costs, ignoring the humanitarian success and the broader policy debate.',
        trapType: 'TOO NARROW',
      },
      {
        id: 'C',
        text: 'The green revolution was ultimately a failure because it prioritised short-term gains over ecological health.',
        highlight: 'ultimately a failure',
        reason: 'Distorted — the passage presents a debate; it never concludes the revolution was a failure.',
        trapType: 'DISTORTED',
      },
      {
        id: 'D',
        text: 'Future agricultural policies must find a balance between yield maximisation and environmental conservation to avoid repeating past mistakes.',
        highlight: null,
        reason: 'Introduced — the passage analyses a past debate; it does not prescribe future policy recommendations.',
        trapType: 'INTRODUCED',
      },
    ],
    explanation: {
      correct: 'A',
      why: 'A covers all three elements: the humanitarian success, the ecological costs, and the broader policy tension the passage culminates in. B focuses only on the costs. C distorts the balanced debate into a definitive verdict. D introduces future-policy prescriptions the author never made.',
    },
  },
  {
    id: 3,
    exerciseNo: 'EXERCISE 03',
    total: 4,
    strategy: { icon: '⚖️', label: 'Match Tone & Scope' },
    instruction: 'The passage has a specific tone. Choose the summary that matches it.',
    passage: 'The monetisation of personal data has created an economy in which users are simultaneously the product and the consumer. Social media platforms offer free services as a guise for the continuous harvesting of behavioural data — browsing habits, emotional states, purchase intent — which is then sold to advertisers. This extraction happens largely invisibly, and most users, dazzled by convenience, remain unaware of the transaction they are participating in.',
    options: [
      {
        id: 'A',
        text: 'Social media platforms provide free services to billions of users worldwide, enabling global communication and commerce.',
        highlight: null,
        reason: 'Wrong Tone — celebratory and uncritical; the passage is clearly critical and cautionary.',
        trapType: 'WRONG TONE',
      },
      {
        id: 'B',
        text: 'Social media companies should be required by law to disclose how they use user data.',
        highlight: null,
        reason: 'Introduced — the author never recommends legal intervention; this adds unsaid prescription.',
        trapType: 'INTRODUCED',
      },
      {
        id: 'C',
        text: 'Free social media platforms extract and monetise users\' behavioural data largely without their awareness, making users both the product and an unwitting participant in a data economy.',
        highlight: null,
        reason: null,
        trapType: null,
      },
      {
        id: 'D',
        text: 'Users who are addicted to social media are responsible for the erosion of their own privacy.',
        highlight: null,
        reason: 'Distorted — the passage blames invisible extraction and corporate design, not user addiction or personal responsibility.',
        trapType: 'DISTORTED',
      },
    ],
    explanation: {
      correct: 'C',
      why: 'C matches the passage\'s critical tone and covers its full scope: the free-service guise, the data extraction, the invisibility, and the user\'s unwitting role. A celebrates what the passage critiques. B prescribes solutions not mentioned. D shifts blame onto users, distorting the passage\'s structural critique.',
    },
  },
  {
    id: 4,
    exerciseNo: 'EXERCISE 04',
    total: 4,
    strategy: { icon: '🎯', label: 'Central Idea + Tone' },
    instruction: 'This passage combines multiple elements. Find the summary that captures all of them.',
    passage: 'Microplastics have permeated virtually every ecosystem on Earth — from Arctic ice cores to the deepest ocean trenches, from mountain rainwater to human bloodstreams. What began as a convenience revolution in packaging has become a planetary contamination crisis. Unlike organic pollutants that degrade over time, plastics persist for centuries, accumulating in food chains and disrupting endocrine systems in animals. The full consequences for human health remain incompletely understood, but the trajectory is deeply concerning.',
    options: [
      {
        id: 'A',
        text: 'Scientists have found microplastics in Arctic ice and ocean trenches, showing how widespread plastic pollution has become.',
        highlight: null,
        reason: 'Too Narrow — covers only the ubiquity finding, missing the health implications, persistence, and the cautionary conclusion.',
        trapType: 'TOO NARROW',
      },
      {
        id: 'B',
        text: 'Microplastics, originating from mass plastic use, have contaminated global ecosystems and increasingly threaten biological systems, including human health, with consequences still being understood.',
        highlight: null,
        reason: null,
        trapType: null,
      },
      {
        id: 'C',
        text: 'Plastic packaging must be banned globally to stop the spread of microplastics into human bloodstreams.',
        highlight: 'must be banned',
        reason: 'Introduced — the author describes a crisis but never calls for a ban. This invents a policy prescription.',
        trapType: 'INTRODUCED',
      },
      {
        id: 'D',
        text: 'Microplastics are now the most dangerous environmental pollutant and will cause a global health emergency within decades.',
        highlight: 'most dangerous',
        reason: 'Distorted + Too Broad — "most dangerous" and "will cause... within decades" are absolute claims the passage never makes.',
        trapType: 'DISTORTED',
      },
    ],
    explanation: {
      correct: 'B',
      why: 'B covers the full arc: origin (mass plastic use), ubiquity (global ecosystem contamination), mechanism (biological disruption), and the cautionary conclusion (consequences still being understood). A is too narrow. C introduces an unmentioned ban. D makes absolute claims the author carefully avoids with phrases like "deeply concerning" and "incompletely understood."',
    },
  },
];