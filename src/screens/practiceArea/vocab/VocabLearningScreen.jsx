import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;


/* =======================
   MOCK DATA (Backend Ready)
   ======================= */
const WORDS = [
  {
    id: 1,
    word: "Anachronism",
    phonetic: "/əˈnækrəˌnɪzəm/",
    tag: "HIGH FREQUENCY",
    definition:
      "A thing belonging or appropriate to a period other than that in which it exists, especially a thing that is conspicuously old-fashioned.",
    synonyms: ["Misplacement", "Solecism", "Prochronism"],
    antonyms: ["Contemporary", "Synchrony"],
    context:
      "In an era of instant global communication, the concept of a nation-state with strictly guarded physical borders might increasingly be viewed as a geopolitical anachronism, clinging to 19th-century ideals.",
    source: "THE ECONOMIST",
    tip:
      "Commonly used in RC passages discussing history, technology, or societal evolution. Watch for tone cues where the author describes something as outdated.",
  },
  {
    id: 2,
    word: "Bellicose",
    phonetic: "/ˈbɛlɪˌkoʊs/",
    tag: "HIGH FREQUENCY",
    definition: "Demonstrating aggression and willingness to fight; warlike.",
    synonyms: ["Aggressive", "Pugnacious"],
    antonyms: ["Peaceful", "Calm"],
    context:
      "The leader’s bellicose rhetoric heightened tensions between the two nations.",
    source: "THE HINDU",
    tip:
      "Often used to describe tone, attitude, or rhetoric in political passages.",
  },
];

const VocabLearningScreen = () => {
  const [index, setIndex] = useState(0);
  const word = WORDS[index];
  const navigation = useNavigation();


  const handleNext = useCallback(() => {
    if (index < WORDS.length - 1) {
      setIndex((prev) => prev + 1);
    }
  }, [index]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* STICKY HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerAction}>←</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>CAT VOCAB</Text>
          <Text style={styles.headerSub}>
            Word {index + 1} of {WORDS.length}
          </Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.headerAction}>☆</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* TAG */}
        <View style={styles.tag}>
          <Text style={styles.tagText}>{word.tag}</Text>
        </View>

        {/* WORD */}
        <Text style={styles.word}>{word.word}</Text>

        {/* PRONUNCIATION */}
        <View style={styles.pronounceBox}>
          <Text style={styles.phonetic}>{word.phonetic}</Text>
          <TouchableOpacity>
            <Text style={styles.pronounceText}>🔊 PRONOUNCE</Text>
          </TouchableOpacity>
        </View>

        {/* DEFINITION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📘 Definition</Text>
          <View style={styles.definitionCard}>
            <Text style={styles.definitionText}>{word.definition}</Text>
          </View>
        </View>

        {/* SYNONYMS & ANTONYMS */}
        <View style={styles.dualSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>↔️ Synonyms</Text>
            {word.synonyms.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>🚫 Antonyms</Text>
            {word.antonyms.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CONTEXT */}
        <View style={styles.section}>
          <View style={styles.contextHeader}>
            <Text style={styles.sectionTitle}>📰 Editorial Context</Text>
            <Text style={styles.source}>SOURCE: {word.source}</Text>
          </View>

          <View style={styles.contextCard}>
            <Text style={styles.contextText}>
              {word.context.replace(
                word.word.toLowerCase(),
                ""
              )}
              <Text style={styles.highlight}>
                {word.word.toLowerCase()}
              </Text>
            </Text>
            <Text style={styles.readMore}>Read Full Article ↗</Text>
          </View>
        </View>

        {/* TIP */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 CAT EXAM TIP</Text>
          <Text style={styles.tipText}>{word.tip}</Text>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.shareBtn,
            index === WORDS.length - 1 && { opacity: 0.4 },
          ]}
          onPress={handleNext}
          disabled={index === WORDS.length - 1}
        >
          <Text style={styles.shareText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.practiceBtn}
  onPress={() =>
    navigation.navigate("Vocab", {
      wordData: {
        word: word.word,
        pronunciation: word.phonetic,
        question: "Select the most accurate meaning:",
        options: [
          ...word.synonyms,
          ...word.antonyms,
        ].slice(0, 4), // temporary
        correct: 0, // backend se aayega later
        explanation: word.tip,
      },
    })
  }
>
  <Text style={styles.practiceText}>Practice this Word</Text>
</TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default VocabLearningScreen;

/* =======================
   STYLES (ORIGINAL RESTORED)
   ======================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FCFCF7",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(16),
    backgroundColor: "#FCFCF7",
    zIndex: 10,
    marginTop:30
  },

  container: {
    padding: scale(16),
    paddingBottom: scale(120),

  },

  headerTitle: {
    fontSize: scale(12),
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  headerSub: {
    fontSize: scale(11),
    color: "#10B981",
    textAlign: "center",
    marginTop: 2,
  },

  headerAction: {
    fontSize: scale(18),
    fontWeight: "700",
    color: "#0F172A",
  },

  tag: {
    alignSelf: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: scale(14),
    paddingVertical: scale(4),
    borderRadius: 20,
    marginBottom: scale(16),
  },

  tagText: {
    fontSize: scale(10),
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 1,
  },

  word: {
    fontSize: scale(32),
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: scale(14),
  },

  pronounceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: scale(14),
    padding: scale(12),
    marginBottom: scale(22),
  },

  phonetic: {
    fontSize: scale(14),
    color: "#374151",
  },

  pronounceText: {
    fontSize: scale(11),
    fontWeight: "700",
    color: "#10B981",
  },

  section: {
    marginBottom: scale(24),
  },

  sectionTitle: {
    fontSize: scale(14),
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: scale(10),
  },

  definitionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(14),
    padding: scale(14),
  },

  definitionText: {
    fontSize: scale(14),
    color: "#374151",
    lineHeight: 22,
    fontStyle: "italic",
  },

  dualSection: {
    flexDirection: "row",
    gap: scale(14),
    marginBottom: scale(24),
  },

  chip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
    borderRadius: 10,
    marginBottom: 8,
  },

  chipText: {
    fontSize: scale(12),
    color: "#0F172A",
  },

  contextHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  source: {
    fontSize: scale(10),
    fontWeight: "700",
    color: "#6B7280",
  },

  contextCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: scale(14),
    padding: scale(14),
  },

  contextText: {
    fontSize: scale(13),
    color: "#065F46",
    lineHeight: 20,
  },

  highlight: {
    backgroundColor: "#A7F3D0",
    fontWeight: "700",
  },

  readMore: {
    marginTop: 10,
    fontSize: scale(12),
    fontWeight: "700",
    color: "#10B981",
  },

  tipCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: scale(14),
    padding: scale(14),
  },

  tipTitle: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },

  tipText: {
    fontSize: scale(12),
    color: "#374151",
    lineHeight: 18,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: scale(12),
    padding: scale(16),
    backgroundColor: "#FCFCF7",
  },

  shareBtn: {
    width: 80,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },

  shareText: {
    fontWeight: "700",
    color: "#10B981",
  },

  practiceBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },

  practiceText: {
    fontSize: scale(14),
    fontWeight: "700",
    color: "#064E3B",
  },
});
