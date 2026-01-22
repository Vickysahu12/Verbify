import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const VocabScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 🔹 Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Vocabulary</Text>
        <Text style={styles.subtitle}>Today’s focused learning</Text>
      </View>

      {/* 🔹 Today Goal */}
      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>Today’s Goal</Text>

        <Text style={styles.goalItem}>• Learn: 5 new words</Text>
        <Text style={styles.goalItem}>• Revise: 3 old words</Text>
        <Text style={styles.goalItem}>• Usage: 2 questions</Text>
      </View>

      {/* 🔹 Word Card */}
      <View style={styles.wordCard}>
        <Text style={styles.word}>Pragmatic</Text>
        <Text style={styles.pronunciation}>/prægˈmætɪk/</Text>

        <Text style={styles.meaning}>
          Dealing with things sensibly and realistically.
        </Text>

        <Text style={styles.example}>
          “A pragmatic approach to CAT preparation focuses on accuracy.”
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Add to Revision</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Mark as Learned</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Next */}
      <TouchableOpacity style={styles.nextBtn}>
        <Text style={styles.nextText}>Next Word →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default VocabScreen;

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
    fontSize: 22,
    fontWeight: "700",
    color: "#1F3B1F",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  goalCard: {
    backgroundColor: "#E5EFE5",
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F3B1F",
    marginBottom: 8,
  },
  goalItem: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
  },

  wordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  word: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  pronunciation: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  meaning: {
    fontSize: 14,
    color: "#1F2937",
    marginTop: 12,
  },
  example: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 8,
    fontStyle: "italic",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  secondaryText: {
    fontSize: 13,
    color: "#1F3B1F",
    fontWeight: "600",
  },
  primaryBtn: {
    backgroundColor: "#1F3B1F",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  primaryText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  nextBtn: {
    alignItems: "center",
    marginBottom: 40,
  },
  nextText: {
    fontSize: 14,
    color: "#1F3B1F",
    fontWeight: "600",
  },
});
