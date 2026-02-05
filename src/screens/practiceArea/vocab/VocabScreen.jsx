import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const VocabScreen = () => {
  const route = useRoute();
  const { wordData } = route.params; // 👈 VocabLearningScreen se aaya data

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const word = wordData;
  const progress = 100;

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 🔹 FIXED HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vocab Builder</Text>
        <Text style={styles.day}>🔥 Practice</Text>

        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
      </View>

      {/* 🔹 SCROLL CONTENT */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔹 WORD OF THE DAY CARD */}
        <View style={styles.wotdCard}>
          <Text style={styles.wotdTitle}>✨ Practice Word</Text>
          <Text style={styles.wotdSub}>
            Apply what you just learned
          </Text>
        </View>

        {/* 🔹 WORD CARD */}
        <View style={styles.wordCard}>
          <Text style={styles.word}>{word.word}</Text>
          <Text style={styles.pronunciation}>
            {word.pronunciation}
          </Text>

          <TouchableOpacity style={styles.hintBtn}>
            <Text style={styles.hintText}>💡 Hint</Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 QUESTION */}
        <Text style={styles.question}>{word.question}</Text>

        {/* 🔹 OPTIONS */}
        {word.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = submitted && i === word.correct;
          const isWrong = submitted && isSelected && i !== word.correct;

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
                isCorrect && styles.correct,
                isWrong && styles.wrong,
              ]}
              onPress={() => setSelected(i)}
              disabled={submitted}
            >
              <View style={styles.radio} />
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        {/* 🔹 EXPLANATION */}
        {submitted && (
          <View style={styles.explainCard}>
            <Text style={styles.explainTitle}>Explanation</Text>
            <Text style={styles.explainText}>
              {word.explanation}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 🔹 FIXED BOTTOM CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            selected === null && { opacity: 0.4 },
          ]}
          onPress={handleSubmit}
          disabled={selected === null}
        >
          <Text style={styles.submitText}>
            {submitted ? "Reviewed ✓" : "Submit Answer"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VocabScreen;

/* =======================
   STYLES (UNCHANGED)
   ======================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAF6" },

  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F3B1F",
    marginTop: 30,
  },
  day: {
    position: "absolute",
    right: 16,
    top: 18,
    fontSize: 13,
    fontWeight: "600",
  },

  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 10,
  },
  progressFill: {
    height: 4,
    backgroundColor: "#1F3B1F",
    borderRadius: 10,
  },

  content: { paddingHorizontal: 16 },

  wotdCard: {
    backgroundColor: "#ECFDF5",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  wotdTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#065F46",
  },
  wotdSub: { fontSize: 13, color: "#047857", marginTop: 4 },

  wordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    alignItems: "center",
    elevation: 4,
  },
  word: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
  pronunciation: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  hintBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  hintText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F3B1F",
  },

  question: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
  },
  optionSelected: {
    borderColor: "#34D399",
    backgroundColor: "#ECFDF5",
  },
  correct: {
    backgroundColor: "#DCFCE7",
  },
  wrong: {
    borderColor: "#DC2626",
    backgroundColor: "#FEE2E2",
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    color: "#111827",
  },

  explainCard: {
    backgroundColor: "#ECFDF5",
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  explainTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 6,
  },
  explainText: {
    fontSize: 13,
    color: "#065F46",
    fontStyle: "italic",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  submitBtn: {
    backgroundColor: "#1F3B1F",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
