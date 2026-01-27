import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from "react-native";

/* 🔹 Dummy CAT-level passage (~550 words) and 5 questions */
const PASSAGE = {
  text: `In contemporary discourse on education, the role of standardized testing often sparks fervent debate. Proponents argue that standardized examinations serve as objective benchmarks, enabling institutions to evaluate student performance across diverse socio-economic backgrounds with a uniform criterion. Critics, however, contend that such assessments may inadvertently marginalize students whose cognitive strengths do not align with conventional metrics of evaluation.  

The advent of technology in pedagogy has further complicated this discourse. While digital platforms promise personalized learning and immediate feedback, they also risk exacerbating educational inequities due to differential access to technological resources. Consequently, educators face the dual challenge of leveraging technological advantages while mitigating inherent disparities.  

An illustrative case emerges from comparative studies in literacy development. In regions where digital literacy interventions are implemented, students demonstrate accelerated comprehension and analytical skills. Yet, such benefits are contingent upon sustained access to devices and stable internet connectivity. This phenomenon underscores the broader implication that educational interventions, regardless of innovation, must account for systemic infrastructural limitations.  

Moreover, the psychological dimension of learning warrants attention. Students often exhibit heightened anxiety in high-stakes testing scenarios, which can detract from authentic engagement with material. Strategies such as formative assessments, reflective exercises, and low-stakes quizzes have been proposed to counterbalance the stress associated with summative evaluations.  

Finally, the interplay between educational policy and cultural context cannot be overlooked. Pedagogical approaches efficacious in one cultural milieu may falter when transposed to another. Policymakers and educators must, therefore, adopt context-sensitive frameworks that respect local educational norms while aspiring to global benchmarks of academic excellence.`,
  questions: [
    {
      question: "What is one argument in favor of standardized testing?",
      options: [
        "It measures all types of intelligence equally",
        "It provides an objective benchmark across diverse students",
        "It eliminates anxiety in students",
        "It personalizes learning for every student",
      ],
      answer: 1,
    },
    {
      question: "What is a potential disadvantage of digital pedagogy?",
      options: [
        "It reduces access to feedback",
        "It increases educational inequities",
        "It makes learning slower",
        "It eliminates standardized testing",
      ],
      answer: 1,
    },
    {
      question: "Which factor affects the success of digital literacy interventions?",
      options: [
        "Teacher’s experience only",
        "Access to devices and internet connectivity",
        "Student’s previous grades",
        "Number of standardized tests",
      ],
      answer: 1,
    },
    {
      question: "What strategy is suggested to reduce student anxiety?",
      options: [
        "High-stakes exams only",
        "Reflective exercises and low-stakes quizzes",
        "Eliminating all forms of assessment",
        "Focusing only on digital learning",
      ],
      answer: 1,
    },
    {
      question: "Why should educational policy consider cultural context?",
      options: [
        "Because all cultures have same pedagogy",
        "To ensure approaches work effectively in local contexts",
        "To standardize global curriculum",
        "To reduce technology usage",
      ],
      answer: 1,
    },
  ],
};

const RCScreen = () => {
  const [selectedOptions, setSelectedOptions] = useState(Array(PASSAGE.questions.length).fill(null));
  const [modalVisible, setModalVisible] = useState(false);

  const handleOptionSelect = (qIndex, optionIndex) => {
    const updated = [...selectedOptions];
    updated[qIndex] = optionIndex;
    setSelectedOptions(updated);
  };

  const handleNext = () => {
    setModalVisible(true);
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* 🔹 Header with static timer */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Daily RC Challenge</Text>
            <Text style={styles.subtitle}>Day 1 of 30</Text>
          </View>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>20:00</Text>
          </View>
        </View>
        

        {/* 🔹 Passage Card */}
        <View style={styles.passageCard}>
          <Text style={styles.passageText}>{PASSAGE.text}</Text>
        </View>

        {/* 🔹 Questions */}
        {PASSAGE.questions.map((q, idx) => (
          <View key={idx} style={styles.questionCard}>
            <Text style={styles.questionText}>{q.question}</Text>
            {q.options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.optionBtn, selectedOptions[idx] === i && styles.selectedOption]}
                onPress={() => handleOptionSelect(idx, i)}
              >
                <Text style={[styles.optionText, selectedOptions[idx] === i && { color: "#FFFFFF" }]}>
                  {opt}
                </Text>
                {selectedOptions[idx] === i && <Text style={styles.tickMark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* 🔹 Next Button */}
        <TouchableOpacity
          style={[styles.nextBtn, selectedOptions.includes(null) && { opacity: 0.5 }]}
          disabled={selectedOptions.includes(null)}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>Finish RC →</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🔹 Custom Modal for RC completion */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Day 1 RC Completed! ✅</Text>
            <Text style={styles.modalSubtitle}>Great! You completed RC and all questions for today.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Let's go to Article Page →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default RCScreen;

const styles = StyleSheet.create({
  container: 
  { backgroundColor: "#F9FAF6",
    paddingHorizontal: 20, 
    paddingTop: 40 
  },
  headerRow:
  { flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  timerContainer:
  { backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  timerText:
  { fontWeight: "700",
    color: "#1F3B1F",
    fontSize: 14
  },
  title:
  { fontSize: 24,
    fontWeight: "800",
    color: "#1F3B1F" 
  },
  subtitle:
  { fontSize: 13,
    color: "#6B7280",
    marginTop: 4
  },
  passageCard:
  { backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4 
  },
  passageText:
  { fontSize: 16, 
    lineHeight: 24,
    color: "#1F2937"
  },
  questionCard:
  { 
    marginBottom: 24 
  },
  questionText:
  { 
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 12
  },
  optionBtn:
  { 
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    marginBottom: 8,
    alignItems: "center"
  },
  selectedOption:
  {
    backgroundColor: "#1F3B1F"
  },
  optionText:
  { color: "#1F3B1F",
    fontWeight: "500",
    flexShrink: 1
  },
  tickMark:
  { color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 10 
  },
  nextBtn:
  { 
    backgroundColor: "#ECFDF5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 40
  },
  nextText:
  { fontSize: 14,
    fontWeight: "600",
    color: "#1F3B1F"
  },
  modalOverlay:
  {
   flex: 1,
   justifyContent: "center",
   alignItems: "center", 
   backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent:
  { backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    width: "80%",
    alignItems: "center"
  },
  modalTitle:
  { fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1F3B1F" 
  },
  modalSubtitle:
  { fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center"
  },
  modalButton:
  {
    backgroundColor: "#1F3B1F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14
  },
  modalButtonText:
  {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14
  },
});
