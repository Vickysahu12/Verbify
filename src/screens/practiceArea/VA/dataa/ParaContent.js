// ─── LEARN CONTENT ───────────────────────────────────────────────────────────

export const PJ_LEARN_CARDS = [
  {
    id: 1,
    icon: '🔢',
    badge: 'STRATEGY 01',
    title: 'Find the Opening Sentence',
    accentColor: '#1a3c8f',
    bgColor: '#EEF2FF',
    description:
      'Every Para Jumble has exactly ONE sentence that can only come first — it introduces a subject without referring to anything before it. No pronoun like "it", "they", "this" at the start. No linking word like "However", "Therefore". It stands alone.',
    steps: [
      'Scan all sentences for ones that begin with a proper noun, a general statement, or a new concept being introduced.',
      'Reject any sentence starting with a pronoun (it, they, he, she) — these always refer back to something.',
      'Reject sentences starting with linking words — they connect to a previous idea.',
      'The sentence that introduces a fresh topic with no dependency = Opening Sentence.',
    ],
    tip: '💡 Pro Tip: The opening sentence is often the most "independent" one. If you remove it, the paragraph would have no base to build on. Test this!',
    example: {
      sentences: [
        { label: 'P', text: 'It has transformed how millions communicate daily.', role: null, note: 'Starts with "It" — refers back to something. Cannot be first.' },
        { label: 'Q', text: 'The invention of the smartphone is one of the most significant technological events of the 21st century.', role: 'OPENER', note: 'Introduces smartphone as a new subject. No dependency. ✓ FIRST' },
        { label: 'R', text: 'Furthermore, it has disrupted entire industries from banking to retail.', role: null, note: '"Furthermore" adds to a previous idea. Cannot be first.' },
        { label: 'S', text: 'This device has also changed how people consume entertainment.', role: null, note: '"This device" refers back — cannot open.' },
      ],
      explanation: 'Q is the only sentence that introduces the topic fresh. P, R, S all depend on something that came before them.',
    },
  },
  {
    id: 2,
    icon: '🔗',
    badge: 'STRATEGY 02',
    title: 'Pronoun–Noun Linking',
    accentColor: '#7c3aed',
    bgColor: '#F5F3FF',
    description:
      'Pronouns (it, they, he, she, this, these, such) always refer back to a noun mentioned earlier. This creates a mandatory link — the noun sentence MUST come before the pronoun sentence. Use this to build chains.',
    steps: [
      'Highlight every pronoun at the start of a sentence.',
      'Find the sentence that introduces the noun the pronoun refers to.',
      'That noun sentence MUST immediately precede the pronoun sentence.',
      'This gives you a locked pair — use it to anchor your arrangement.',
    ],
    tip: '💡 "Such", "These", "This" are the strongest signals — they almost always follow the sentence that defined them. If you find a "such + noun" pattern, the defining sentence is right before.',
    example: {
      sentences: [
        { label: 'P', text: 'Scientists have discovered a new species of deep-sea fish near the Mariana Trench.', role: 'Defines: a new species', note: 'Introduces "a new species" — noun defined here.' },
        { label: 'Q', text: 'It glows in the dark using bioluminescent organs along its body.', role: 'Refers: It = the fish', note: '"It" = the fish from P. Q must follow P directly.' },
        { label: 'R', text: 'Such rare discoveries remind us how little we know about the ocean depths.', role: 'Refers: Such = this discovery', note: '"Such rare discoveries" = refers to the event in P+Q. R comes after.' },
      ],
      explanation: 'Locked chain: P → Q → R. "It" in Q locks Q after P. "Such discoveries" in R locks R at the end.',
    },
  },
  {
    id: 3,
    icon: '🧩',
    badge: 'STRATEGY 03',
    title: 'Logical Flow & Time Order',
    accentColor: '#0f766e',
    bgColor: '#F0FDFA',
    description:
      'Even after finding the opener and pronoun pairs, some sentences remain loose. Use logical flow — cause before effect, general before specific, problem before solution, past before present — to lock in the final order.',
    steps: [
      'Look for cause–effect pairs: the cause sentence must come before the effect sentence.',
      'Look for general → specific flow: a broad statement is always followed by its detail.',
      'Look for problem → solution structure: the problem is always introduced first.',
      'Time markers (initially, later, eventually, today) reveal the chronological order directly.',
    ],
    tip: '💡 Read your arranged paragraph aloud. If something feels abrupt or disconnected, swap two adjacent sentences. The right order will feel smooth and natural.',
    example: {
      sentences: [
        { label: 'P', text: 'Initially, the government ignored the pollution reports from local activists.', role: '1st — sets up the problem', note: '"Initially" = time marker. Start of the story.' },
        { label: 'Q', text: 'As protests grew, however, authorities were forced to acknowledge the crisis.', role: '2nd — turning point', note: '"As protests grew" = follows logically after ignoring.' },
        { label: 'R', text: 'Eventually, new emission regulations were passed after years of pressure.', role: '3rd — resolution', note: '"Eventually" = final outcome. Must come last.' },
      ],
      explanation: 'Time markers (Initially → As → Eventually) lock the order perfectly: P → Q → R. Problem → Conflict → Resolution.',
    },
  },
];

// ─── PRACTICE QUESTIONS ──────────────────────────────────────────────────────

export const PJ_QUESTIONS = [
  {
    id: 1,
    exerciseNo: 'EXERCISE 01',
    total: 3,
    strategy: { icon: '🔢', label: 'Find the Opening Sentence' },
    instruction: 'Choose the sentence that should come FIRST in the paragraph.',
    context: 'The sentences below, when arranged correctly, form a coherent paragraph about electric vehicles.',
    sentences: null,
    options: [
      {
        id: 'A',
        text: 'They are now being manufactured by over 300 companies worldwide.',
        highlight: 'They',
        reason: '"They" refers to something already introduced — cannot open.',
      },
      {
        id: 'B',
        text: 'Electric vehicles have rapidly moved from a niche curiosity to a mainstream transportation choice.',
        highlight: null,
        reason: 'Introduces "electric vehicles" fresh. No pronoun, no linking word. ✓',
      },
      {
        id: 'C',
        text: 'Furthermore, falling battery costs have made them more affordable than ever.',
        highlight: 'Furthermore',
        reason: '"Furthermore" adds to a previous point — cannot open.',
      },
      {
        id: 'D',
        text: 'This shift has also driven massive investment in charging infrastructure globally.',
        highlight: 'This shift',
        reason: '"This shift" refers back to a previously described change.',
      },
      {
        id: 'E',
        text: 'Such growth has prompted governments to phase out petrol car sales by 2035.',
        highlight: 'Such growth',
        reason: '"Such growth" clearly refers to something described before.',
      },
    ],
    explanation: {
      correct: 'B',
      why: 'B is the only sentence that introduces "electric vehicles" as a brand-new subject. Every other option starts with a pronoun (They), a linking word (Furthermore), or a reference phrase (This shift, Such growth) — all of which require a previous sentence to make sense.',
    },
  },
  {
    id: 2,
    exerciseNo: 'EXERCISE 02',
    total: 3,
    strategy: { icon: '🔗', label: 'Pronoun–Noun Linking' },
    instruction: 'Which sentence must come IMMEDIATELY AFTER sentence P?',
    context: 'P: Researchers at MIT have developed a new type of solar panel that can generate electricity even on cloudy days.',
    sentences: null,
    options: [
      {
        id: 'A',
        text: 'Solar energy has been used by humans for thousands of years.',
        highlight: null,
        reason: 'General history of solar energy — no direct link to the MIT panel.',
      },
      {
        id: 'B',
        text: 'It uses a special photovoltaic coating that captures diffused light particles.',
        highlight: 'It',
        reason: '"It" directly refers to "a new type of solar panel" in P. Must follow P. ✓',
      },
      {
        id: 'C',
        text: 'However, renewable energy still faces challenges of storage and grid integration.',
        highlight: 'However',
        reason: 'Contrasts with a broader argument — not a direct follow-up to P\'s invention.',
      },
      {
        id: 'D',
        text: 'Such breakthroughs are likely to accelerate the global energy transition.',
        highlight: 'Such breakthroughs',
        reason: '"Such breakthroughs" is a conclusion — comes after the invention is explained, not right after P.',
      },
    ],
    explanation: {
      correct: 'B',
      why: '"It" in option B is a pronoun that directly refers to "a new type of solar panel" in sentence P. This is a locked pronoun–noun pair. B must immediately follow P because it describes what the panel does. Option D could come later but not right after P — without B explaining the panel first.',
    },
  },
  {
    id: 3,
    exerciseNo: 'EXERCISE 03',
    total: 3,
    strategy: { icon: '🧩', label: 'Logical Flow & Time Order' },
    instruction: 'Arrange sentences P, Q, R, S in the correct logical order.',
    context: null,
    sentences: [
      { label: 'P', text: 'For decades, print newspapers were the primary source of news for millions of people.' },
      { label: 'Q', text: 'However, the rise of the internet in the 1990s began to erode their dominance.' },
      { label: 'R', text: 'As online news became free and instant, advertising revenue for print outlets collapsed.' },
      { label: 'S', text: 'Today, many once-iconic newspapers have either shut down or moved entirely to digital platforms.' },
    ],
    options: [
      { id: 'A', text: 'P → R → Q → S', highlight: null, reason: 'R cannot follow P directly — R says "As online news..." which requires Q (internet rise) to come first.' },
      { id: 'B', text: 'Q → P → S → R', highlight: null, reason: 'Q starts with "However" — it cannot open. It must follow P.' },
      { id: 'C', text: 'P → Q → R → S', highlight: null, reason: 'Perfect chronological and causal flow. ✓' },
      { id: 'D', text: 'R → P → Q → S', highlight: null, reason: 'R cannot open — "As online news..." has no context yet.' },
    ],
    explanation: {
      correct: 'C',
      why: 'P introduces print newspapers (opener — no dependency). Q uses "However" to mark the turning point — internet\'s rise (follows P). R explains the economic consequence: "As online news..." (cause → effect, follows Q). S uses "Today" as a time marker showing the present-day outcome (must come last). P → Q → R → S follows a perfect chronological and logical arc.',
    },
  },
];