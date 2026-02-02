import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from "react-native";

/* 🔹 Dummy CAT-level RC */
const PASSAGE = {
  text: `In contemporary discourse on education, the role of standardized testing often sparks fervent debate. Proponents argue that standardized examinations serve as objective benchmarks, enabling institutions to evaluate student performance across diverse socio-economic backgrounds with a uniform criterion. Critics, however, contend that such assessments may inadvertently marginalize students whose cognitive strengths do not align with conventional metrics of evaluation.

The advent of technology in pedagogy has further complicated this discourse. While digital platforms promise personalized learning and immediate feedback, they also risk exacerbating educational inequities due to differential access to technological resources.

Moreover, students often exhibit heightened anxiety in high-stakes testing scenarios, which can detract from authentic engagement with material.`,
  questions: [
    {
      question: "What is one argument in favor of standardized testing?",
      options: [
        "It measures all types of intelligence equally",
        "It provides an objective benchmark across students",
        "It removes exam anxiety",
        "It personalizes learning fully",
      ],
    },
    {
      question: "What risk does digital pedagogy pose?",
      options: [
        "Lower comprehension",
        "Increased educational inequality",
        "Less feedback",
        "Removal of testing",
      ],
    },
  ],
};

const RCScreen = () => {
  const [answers, setAnswers] = useState(
    Array(PASSAGE.questions.length).fill(null)
  );
  const [fullScreen, setFullScreen] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const isAllAnswered = !answers.includes(null);



  const handleSelect = (qIndex, oIndex) => {
    const updated = [...answers];
    updated[qIndex] = oIndex;
    setAnswers(updated);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAF6" }}>
      {/* 🔹 Compact Header */}
      {!fullScreen && (
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>RC Practice</Text>
            <Text style={styles.subTitle}>Day 1 · CAT Level</Text>
          </View>

          <View style={styles.rightHeader}>
            <Text style={styles.timer}>20:00</Text>
            <TouchableOpacity onPress={() => setFullScreen(true)}>
              <Text style={styles.fullIcon}>⛶</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 🔹 Main Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Passage */}
        <View style={styles.card}>
          <Text style={styles.passageText}>{PASSAGE.text}</Text>
        </View>

        {/* Questions */}
        {PASSAGE.questions.map((q, qi) => (
          <View key={qi} style={styles.questionBlock}>
            <Text style={styles.question}>{q.question}</Text>

            {q.options.map((opt, oi) => (
              <TouchableOpacity
                key={oi}
                style={[
                  styles.option,
                  answers[qi] === oi && styles.optionSelected,
                ]}
                onPress={() => handleSelect(qi, oi)}
              >
                <Text
                  style={[
                    styles.optionText,
                    answers[qi] === oi && { color: "#fff" },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Finish */}
        <TouchableOpacity
         style={[
         styles.finishBtn,
         !isAllAnswered && { opacity: 0.4 },
       ]}
        disabled={!isAllAnswered}
        onPress={() => setShowFinishModal(true)}
          >
        <Text style={styles.finishText}>Finish RC</Text>
       </TouchableOpacity>

      </ScrollView>

      {/* 🔹 Full Screen Mode */}
      <Modal visible={fullScreen} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAF6" }}>
          <View style={styles.fullHeader}>
            <Text style={styles.timer}>20:00</Text>
            <TouchableOpacity onPress={() => setFullScreen(false)}>
              <Text style={styles.fullIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Text style={styles.passageText}>{PASSAGE.text}</Text>
            </View>

            {PASSAGE.questions.map((q, qi) => (
              <View key={qi} style={styles.questionBlock}>
                <Text style={styles.question}>{q.question}</Text>

                {q.options.map((opt, oi) => (
                  <TouchableOpacity
                    key={oi}
                    style={[
                      styles.option,
                      answers[qi] === oi && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(qi, oi)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        answers[qi] === oi && { color: "#fff" },
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
      <Modal transparent visible={showFinishModal} animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>RC Completed ✅</Text>
      <Text style={styles.modalDesc}>
        Good job. You can move to the Article section now.
      </Text>

      <TouchableOpacity
        style={styles.modalBtn}
        onPress={() => setShowFinishModal(false)}
      >
        <Text style={styles.modalBtnText}>Go to Article →</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
};

export default RCScreen;

/* 🔹 Styles */
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F3B1F",
  },
  subTitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  timer: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F3B1F",
  },
  fullIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F3B1F",
  },
  container: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 3,
  },
  passageText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#1F2937",
  },
  questionBlock: {
    marginBottom: 24,
  },
  question: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    color: "#0F172A",
  },
  option: {
    backgroundColor: "#ECFDF5",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: "#1F3B1F",
  },
  optionText: {
    color: "#1F3B1F",
    fontSize: 14,
  },
  finishBtn: {
    backgroundColor: "#1F3B1F",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  finishText: {
    color: "#fff",
    fontWeight: "600",
  },
  fullHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},
modalBox: {
  width: "80%",
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 24,
  alignItems: "center",
},
modalTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#1F3B1F",
  marginBottom: 8,
},
modalDesc: {
  fontSize: 14,
  color: "#6B7280",
  textAlign: "center",
  marginBottom: 20,
},
modalBtn: {
  backgroundColor: "#1F3B1F",
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 14,
},
modalBtnText: {
  color: "#fff",
  fontWeight: "600",
},

});
