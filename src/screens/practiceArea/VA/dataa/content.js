// ─── LEARN CONTENT ───────────────────────────────────────────────────────────

export const LEARN_CARDS = [
  {
    id: 1,
    icon: '🎯',
    badge: 'STRATEGY 01',
    title: 'Common Theme Strategy',
    color: '#1a3c8f',
    bgColor: '#EEF2FF',
    accentColor: '#3B5FDB',
    description:
      'Every question contains 4–5 sentences. Four of them share a single **central topic** — the fifth secretly belongs to a different world. Your job is to sniff out the imposter.',
    steps: [
      'Read all sentences once at normal speed — don\'t analyze yet.',
      'Ask yourself: "What is the majority talking about?"',
      'Mark the common topic (e.g. climate change, AI, health).',
      'The sentence that talks about something *else* is your answer.',
    ],
    tip: '💡 Pro Tip: The odd sentence is often very well-written and sounds smart — don\'t be fooled by quality. Focus on topic, not tone.',
    example: {
      label: 'QUICK EXAMPLE',
      sentences: [
        { text: 'Solar energy is becoming more affordable each year.', isOdd: false },
        { text: 'Wind turbines are reshaping coastal landscapes.', isOdd: false },
        { text: 'The stock market saw a 3% correction last Tuesday.', isOdd: true },
        { text: 'Hydropower harnesses river flows for electricity.', isOdd: false },
      ],
      explanation: 'Sentence C is the odd one — it talks about stock markets while the rest discuss renewable energy.',
    },
  },
  {
    id: 2,
    icon: '🔗',
    badge: 'STRATEGY 02',
    title: 'Linking Words Strategy',
    color: '#7c3aed',
    bgColor: '#F5F3FF',
    accentColor: '#7c3aed',
    description:
      'Sentences in a paragraph are connected by **linking words** — words like *Furthermore, However, Therefore, This transition, In contrast*. These words stitch sentences together like a thread.',
    steps: [
      'Identify sentences that start with linking words (highlighted in the question).',
      'Trace what each linking word refers back to.',
      'The sentence that doesn\'t logically connect to any other = odd one out.',
      'If a sentence\'s linking word points to a different topic, it\'s the intruder.',
    ],
    tip: '💡 Pro Tip: "Furthermore" and "Moreover" add to the same idea. "However" and "In contrast" oppose it. "Therefore" concludes it. Use this to map the flow.',
    example: {
      label: 'LINKING WORD MAP',
      sentences: [
        { text: 'Exercise improves cardiovascular health significantly.', isOdd: false },
        { text: 'Furthermore, it boosts mental well-being and reduces anxiety.', isOdd: false },
        { text: 'Electric vehicles are replacing petrol cars in urban areas.', isOdd: true },
        { text: 'Therefore, doctors recommend at least 30 minutes daily.', isOdd: false },
      ],
      explanation: '"Furthermore" and "Therefore" both connect to exercise. Sentence C breaks the chain — it\'s the odd one.',
    },
  },
  {
    id: 3,
    icon: '⚡',
    badge: 'STRATEGY 03',
    title: 'Tone & Scope Mismatch',
    color: '#0f766e',
    bgColor: '#F0FDFA',
    accentColor: '#0f766e',
    description:
      'Sometimes all sentences share the same topic, but ONE sentence is **too specific**, **too broad**, or has a **different tone** (positive vs negative, formal vs casual, global vs local). That\'s your odd one out.',
    steps: [
      'Check if all sentences operate at the same "zoom level" — global, national, or individual.',
      'Check tone — are most sentences positive/negative/neutral?',
      'A sentence that suddenly zooms in too much OR becomes personal = suspect.',
      'A sudden shift in formality (e.g., casual slang in a formal paragraph) = red flag.',
    ],
    tip: '💡 Pro Tip: Scope mismatch questions are harder. The intruder sentence IS about the right topic, but it feels out of place. Trust your instinct after analysis.',
    example: {
      label: 'SCOPE EXAMPLE',
      sentences: [
        { text: 'Climate negotiations are stalling at the international level.', isOdd: false },
        { text: 'My neighbour just bought a new car last weekend.', isOdd: true },
        { text: 'Carbon emissions targets are being revised downward.', isOdd: false },
        { text: 'Nations are struggling to meet the Paris Agreement goals.', isOdd: false },
      ],
      explanation: 'All sentences except B discuss global climate policy. B suddenly shifts to a personal/local scope — it\'s the intruder.',
    },
  },
];

// ─── PRACTICE QUESTIONS ───────────────────────────────────────────────────────

export const QUESTIONS = [
  {
    id: 1,
    exerciseNo: 'EXERCISE 01',
    title: 'Identify the Intruder',
    total: 3,
    instruction: 'Tap the sentence that does NOT fit the context of the others.',
    strategy: {
      icon: '🎯',
      label: 'Common Theme Strategy',
      hint: 'Find the central topic shared by most sentences, then spot the one that breaks away.',
    },
    options: [
      {
        id: 'A',
        text: 'Artificial intelligence is revolutionising the way doctors diagnose rare diseases.',
        highlight: null,
        isOdd: false,
      },
      {
        id: 'B',
        text: 'Machine learning models can now predict patient deterioration hours before it happens.',
        highlight: null,
        isOdd: false,
      },
      {
        id: 'C',
        text: 'The real estate market in metropolitan cities has seen a sharp 18% price correction.',
        highlight: null,
        isOdd: true,
      },
      {
        id: 'D',
        text: 'Furthermore, robotic surgery systems are reducing human error in complex procedures.',
        highlight: 'Furthermore',
        isOdd: false,
      },
      {
        id: 'E',
        text: 'This convergence of technology and medicine is ushering in the era of precision healthcare.',
        highlight: 'This convergence',
        isOdd: false,
      },
    ],
    explanation: {
      correct: 'C',
      title: 'Why C is the Odd One Out',
      body: 'Sentences A, B, D, and E all revolve around a single theme: **AI and technology transforming healthcare**. Notice how "Furthermore" in D adds to the same topic, and "This convergence" in E concludes it. Sentence C — about real estate prices — belongs to a completely different domain (finance/property) and has no logical connection to the healthcare thread. Classic Common Theme mismatch!',
      wrongGuessMsg: 'Not quite! Look at the overall theme — healthcare and AI technology. Which sentence breaks away from this world entirely?',
    },
  },
  {
    id: 2,
    exerciseNo: 'EXERCISE 02',
    title: 'Identify the Intruder',
    total: 3,
    instruction: 'Tap the sentence that does NOT fit the context of the others.',
    strategy: {
      icon: '🔗',
      label: 'Linking Words Strategy',
      hint: 'Trace the linking words — they stitch sentences together. The broken link is your answer.',
    },
    options: [
      {
        id: 'A',
        text: 'The shift towards renewable energy sources is no longer a matter of choice but a global necessity for survival.',
        highlight: null,
        isOdd: false,
      },
      {
        id: 'B',
        text: 'Technological advancements in smartphone displays have plateaued, leading to longer replacement cycles for consumers.',
        highlight: null,
        isOdd: true,
      },
      {
        id: 'C',
        text: 'Furthermore, international policy frameworks are beginning to align with these environmental imperatives through carbon taxing.',
        highlight: 'Furthermore',
        isOdd: false,
      },
      {
        id: 'D',
        text: 'This transition is heavily reliant on the rapid scaling of battery storage technology and smart grid integration.',
        highlight: 'This transition',
        isOdd: false,
      },
      {
        id: 'E',
        text: 'In contrast to fossil fuels, these green alternatives offer a path to decentralised energy production and security.',
        highlight: 'In contrast',
        isOdd: false,
      },
    ],
    explanation: {
      correct: 'B',
      title: 'Why B is the Odd One Out',
      body: '"Furthermore" in C continues the renewable energy argument from A. "This transition" in D refers directly to the energy shift in A. "In contrast" in E compares green energy against fossil fuels. All four sentences are tightly stitched together. Sentence B — about smartphone display technology — completely severs this chain. It has no linking word and introduces an unrelated consumer-electronics topic.',
      wrongGuessMsg: 'Almost! Focus on the linking words: "Furthermore", "This transition", "In contrast" — what do they all connect back to?',
    },
  },
  {
    id: 3,
    exerciseNo: 'EXERCISE 03',
    title: 'Identify the Intruder',
    total: 3,
    instruction: 'Tap the sentence that does NOT fit the context of the others.',
    strategy: {
      icon: '⚡',
      label: 'Tone & Scope Mismatch',
      hint: 'All sentences may share the topic — but one operates at a different zoom level or tone.',
    },
    options: [
      {
        id: 'A',
        text: 'World leaders at the G20 summit reached a landmark consensus on reducing carbon emissions by 45% before 2035.',
        highlight: null,
        isOdd: false,
      },
      {
        id: 'B',
        text: 'Developing nations have raised concerns about the economic burden of rapid decarbonisation on their fragile industries.',
        highlight: null,
        isOdd: false,
      },
      {
        id: 'C',
        text: 'I personally switched to an electric scooter last month and honestly it saves me a lot on petrol.',
        highlight: null,
        isOdd: true,
      },
      {
        id: 'D',
        text: 'The IPCC report underscores that without systemic global action, temperature rise will exceed 1.5°C by 2040.',
        highlight: null,
        isOdd: false,
      },
      {
        id: 'E',
        text: 'Nevertheless, geopolitical rivalries continue to undermine unified climate commitments at the multilateral level.',
        highlight: 'Nevertheless',
        isOdd: false,
      },
    ],
    explanation: {
      correct: 'C',
      title: 'Why C is the Odd One Out',
      body: 'Sentences A, B, D, and E all operate at the **global/policy level** — G20 summits, IPCC reports, geopolitical rivalries, developing nations. The tone is formal and analytical. Sentence C suddenly **zooms into personal experience** ("I personally switched", "saves me a lot on petrol") — it\'s informal, first-person, and hyper-local. Even though it\'s vaguely about the same "climate" topic, the scope and tone are completely mismatched. Classic Tone & Scope trap!',
      wrongGuessMsg: 'Good try! Notice the zoom level — most sentences talk about global summits and policy. One feels personal and informal. That\'s your clue!',
    },
  },
];