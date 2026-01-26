import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

/* 🔹 Dummy vocab data (will be replaced by backend later) */
const WORDS = [
  {
    word: "Pragmatic",
    pronunciation: "/prægˈmætɪk/",
    meaning:
      "Dealing with things sensibly and realistically rather than emotionally.",
    example:
      "A pragmatic CAT strategy focuses more on accuracy than attempts.",
  },
  {
    word: "Obstinate",
    pronunciation: "/ˈɒbstɪnət/",
    meaning: "Stubbornly refusing to change one's opinion or attitude.",
    example: "He remained obstinate despite repeated explanations.",
  },
  {
    word: "Candid",
    pronunciation: "/ˈkændɪd/",
    meaning: "Truthful and straightforward; frank.",
    example: "She gave a candid assessment of her mock performance.",
  },
  {
    word: "Mitigate",
    pronunciation: "/ˈmɪtɪɡeɪt/",
    meaning: "To make something less severe, serious, or painful.",
    example: "Practice helps mitigate exam anxiety.",
  },
  {
    word: "Elusive",
    pronunciation: "/ɪˈluːsɪv/",
    meaning: "Difficult to find, catch, or achieve.",
    example: "A 99 percentile can feel elusive without consistency.",
  },
];

const TOTAL_WORDS = WORDS.length;

const VocabScreen = () => {
  const [addedToRevision, setAddedToRevision] = useState(false);
  const [learned, setLearned] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const currentWord = WORDS[currentWordIndex];
  const progressPercent = ((currentWordIndex + 1) / TOTAL_WORDS) * 100;

  const handleNext = () => {
    if (currentWordIndex < TOTAL_WORDS - 1) {
      setAddedToRevision(false);
      setLearned(false);
      setCurrentWordIndex((prev) => prev + 1);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Vocabulary</Text>
        <Text style={styles.subtitle}>Today’s focused learning</Text>

        <Text style={styles.progressText}>
          Word {currentWordIndex + 1} of {TOTAL_WORDS}
        </Text>

        {/* 🔹 Progress Bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
      </View>

      {/* 🔹 Goal Card */}
      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>Today’s Goal</Text>
        <Text style={styles.goalItem}>• Learn 5 new words</Text>
        <Text style={styles.goalItem}>• Revise 3 old words</Text>
        <Text style={styles.goalItem}>• Solve 2 usage questions</Text>
      </View>

      {/* 🔹 Word Card */}
      <View style={styles.wordCard}>
        <Text style={styles.word}>{currentWord.word}</Text>
        <Text style={styles.pronunciation}>
          {currentWord.pronunciation}
        </Text>

        <Text style={styles.meaning}>{currentWord.meaning}</Text>

        <Text style={styles.example}>
          “{currentWord.example}”
        </Text>

        {/* 🔹 Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            disabled={addedToRevision}
            onPress={() => setAddedToRevision(true)}
          >
            <Text
              style={[
                styles.secondaryText,
                addedToRevision && styles.disabledText,
              ]}
            >
              {addedToRevision ? "✓ Added to Revision" : "+ Add to Revision"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              learned && styles.learnedBtn,
            ]}
            onPress={() => setLearned(true)}
          >
            <Text style={styles.primaryText}>
              {learned ? "✓ Learned" : "Mark as Learned"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Next Button */}
      <TouchableOpacity
        style={[
          styles.nextBtn,
          (!learned && !addedToRevision) && { opacity: 0.4 },
        ]}
        disabled={!learned && !addedToRevision}
        onPress={handleNext}
      >
        <Text style={styles.nextText}>
          {currentWordIndex === TOTAL_WORDS - 1
            ? "Finish ✓"
            : "Next Word →"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default VocabScreen;

/* 🔹 Styles remain unchanged */
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAF6",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F3B1F",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
  },

  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 6,
  },
  progressFill: {
    height: 4,
    backgroundColor: "#1F3B1F",
    borderRadius: 10,
  },

  goalCard: {
    backgroundColor: "#E6F2E6",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F3B1F",
    marginBottom: 6,
  },
  goalItem: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
  },

  wordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },

  word: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: 0.4,
  },
  pronunciation: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  meaning: {
    fontSize: 15,
    color: "#1F2937",
    marginTop: 14,
    lineHeight: 22,
  },
  example: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 10,
    fontStyle: "italic",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
  },

  secondaryText: {
    fontSize: 13,
    color: "#1F3B1F",
    fontWeight: "600",
  },
  disabledText: {
    opacity: 0.5,
  },

  primaryBtn: {
    backgroundColor: "#1F3B1F",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  learnedBtn: {
    backgroundColor: "#14532D",
  },
  primaryText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  nextBtn: {
    backgroundColor: "#ECFDF5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 40,
  },
  nextText: {
    fontSize: 14,
    color: "#1F3B1F",
    fontWeight: "600",
  },
});
