import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const scale = (s) => (width / 375) * s;

/* ================= QUESTIONS ================= */

const QUESTIONS = [
  {
    q: "According to the passage, what was the primary focus of the classical school of economic thought?",
    options: [
      "The necessity of government intervention during recessions.",
      "Free markets, division of labor, and the invisible hand.",
      "The management of money supply to control national output.",
      "The implementation of rational expectations in decision making.",
    ],
    correct: 1,
    analysis:
      "The passage clearly states that classical economists emphasized free markets, division of labor, and the invisible hand.",
  },
  {
    q: "Why did later schools of thought challenge classical economics?",
    options: [
      "Markets failed to generate employment.",
      "Government intervention proved ineffective.",
      "Economic downturns exposed limitations of free markets.",
      "Division of labor reduced productivity.",
    ],
    correct: 2,
    analysis:
      "Later schools believed that free markets alone could not handle economic downturns effectively.",
  },
];

const RCPracticeScreen = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(
    Array(QUESTIONS.length).fill(null)
  );
  const [showAnalysis, setShowAnalysis] = useState(false);

  const selectOption = (index) => {
    const updated = [...answers];
    updated[currentQ] = index;
    setAnswers(updated);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.back}>←</Text>
        <Text style={styles.headerTitle}>RC Practice Session</Text>
        <View style={styles.timer}>
          <Text style={styles.timerText}>⏱ 12:45</Text>
        </View>
      </View>

      {/* ================= PROGRESS ================= */}
      <View style={styles.progressWrap}>
        <Text style={styles.sectionLabel}>Reading Comprehension</Text>
        <Text style={styles.progressCount}>
          {currentQ + 1} / {QUESTIONS.length}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`,
            },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        {/* ================= PASSAGE ================= */}
        <View style={styles.passageWrap}>
          <Text style={styles.passageTitle}>
            The Evolution of Economic Thought
          </Text>

          <Text style={styles.passageText}>
            Classical economists believed that markets function best when left
            alone. They emphasized free markets and the invisible hand.{" "}
            <Text style={styles.highlight}>However</Text>, later schools
            questioned this assumption.
          </Text>
        </View>

        {/* ================= QUESTION ================= */}
        <Text style={styles.questionLabel}>
          QUESTION {currentQ + 1}
        </Text>

        <Text style={styles.questionText}>
          {QUESTIONS[currentQ].q}
        </Text>

        {/* ================= OPTIONS ================= */}
        {QUESTIONS[currentQ].options.map((opt, i) => {
          const isSelected = answers[currentQ] === i;
          const isCorrect = QUESTIONS[currentQ].correct === i;

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.option,
                showAnalysis &&
                  isCorrect && { borderColor: "#16A34A", borderWidth: 2 },
                showAnalysis &&
                  isSelected &&
                  !isCorrect && { borderColor: "#DC2626", borderWidth: 2 },
                isSelected && !showAnalysis && styles.optionSelected,
              ]}
              onPress={() => !showAnalysis && selectOption(i)}
            >
              <View
                style={[
                  styles.radio,
                  isSelected && styles.radioSelected,
                ]}
              />
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        {/* ================= ANALYSIS ================= */}
        {showAnalysis && (
          <View style={styles.analysisBox}>
            <Text style={styles.analysisTitle}>RC Analysis</Text>
            <Text style={styles.analysisText}>
              {QUESTIONS[currentQ].analysis}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ================= FOOTER ================= */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          disabled={currentQ === 0}
          onPress={() => {
            setShowAnalysis(false);
            setCurrentQ((q) => q - 1);
          }}
          style={[
            styles.reviewBtn,
            currentQ === 0 && { opacity: 0.4 },
          ]}
        >
          <Text style={styles.reviewText}>Previous</Text>
        </TouchableOpacity>

        {showAnalysis ? (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => {
              setShowAnalysis(false);
              setCurrentQ((q) => q + 1);
            }}
          >
            <Text style={styles.nextText}>Next Question</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => setShowAnalysis(true)}
          >
            <Text style={styles.nextText}>Submit RC</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default RCPracticeScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAF6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(16),
    marginTop: 20,
  },

  back: {
    fontSize: 18,
    color: "#1F3B1F",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F3B1F",
  },

  timer: {
    backgroundColor: "#E9F2EC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  timerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F3B1F",
  },

  progressWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    marginTop: 6,
  },

  sectionLabel: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },

  progressCount: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#DDE8E1",
    marginHorizontal: scale(16),
    borderRadius: 6,
    marginTop: 6,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#1F3B1F",
    borderRadius: 6,
  },

  passageWrap: {
    padding: scale(16),
  },

  passageTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111827",
  },

  passageText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#111827",
  },

  highlight: {
    backgroundColor: "#E9F2EC",
    fontWeight: "700",
  },

  questionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
    marginHorizontal: scale(16),
    marginTop: 10,
  },

  questionText: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: scale(16),
    marginTop: 8,
    color: "#111827",
    lineHeight: 24,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: scale(16),
    marginTop: 14,
    padding: 16,
    borderRadius: 18,
  },

  optionSelected: {
    borderWidth: 2,
    borderColor: "#1F3B1F",
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    marginRight: 12,
  },

  radioSelected: {
    borderColor: "#1F3B1F",
    backgroundColor: "#1F3B1F",
  },

  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: "#111827",
  },

  /* 🔥 RC ANALYSIS — SAME PALETTE */
  analysisBox: {
    backgroundColor: "#E9F2EC",
    marginHorizontal: scale(16),
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
  },

  analysisTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F3B1F",
  },

  analysisText: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
    color: "#111827",
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F9FAF6",
  },

  reviewBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },

  reviewText: {
    fontWeight: "700",
    color: "#1F3B1F",
  },

  nextBtn: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: "#1F3B1F",
  },

  nextText: {
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
